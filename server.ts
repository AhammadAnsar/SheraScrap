import express from "express";
import path from "path";
import fs from "fs";
import dotenv from "dotenv";
import { GoogleGenAI, Type } from "@google/genai";
import { createServer as createViteServer } from "vite";

// Load environment variables
dotenv.config();

// Initialize Express
const app = express();
const PORT = 3000;

// Increase payload limit to support base64 image uploads
app.use(express.json({ limit: "25mb" }));
app.use(express.urlencoded({ limit: "25mb", extended: true }));

// Ensure upload directories exist
const publicUploadsDir = path.join(process.cwd(), "public", "uploads");
const rootUploadsDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(publicUploadsDir)) {
  fs.mkdirSync(publicUploadsDir, { recursive: true });
}
if (!fs.existsSync(rootUploadsDir)) {
  fs.mkdirSync(rootUploadsDir, { recursive: true });
}

// Serve uploaded image assets statically
app.use("/uploads", express.static(publicUploadsDir));
app.use("/uploads", express.static(rootUploadsDir));

// Initialize GoogleGenAI lazy loader
let aiClient: GoogleGenAI | null = null;

function getAiClient(): GoogleGenAI | null {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.warn("⚠️ WARNING: GEMINI_API_KEY environment variable is not set. AI scrap estimation will operate in simulation mode.");
      return null;
    }
    aiClient = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

// -----------------------------------------------------------------------------
// 1. API ROUTES (Must be registered before Vite middleware!)
// -----------------------------------------------------------------------------

// Dynamic Sitemap XML Endpoint
app.get("/sitemap.xml", (req, res) => {
  try {
    const cmsDataFile = path.join(process.cwd(), "public", "api", "cms_data.json");
    let cmsData: any = null;

    if (fs.existsSync(cmsDataFile)) {
      const content = fs.readFileSync(cmsDataFile, "utf-8");
      cmsData = JSON.parse(content);
    }

    const baseUrl = cmsData?.settings?.siteUrl ? cmsData.settings.siteUrl.replace(/\/$/, '') : "https://shera-scrap-haraj.com";
    const today = new Date().toISOString().split("T")[0];

    const xmlLines = [
      '<?xml version="1.0" encoding="UTF-8"?>',
      '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
      '  <url>',
      `    <loc>${baseUrl}/</loc>`,
      `    <lastmod>${today}</lastmod>`,
      '    <changefreq>daily</changefreq>',
      '    <priority>1.0</priority>',
      '  </url>',
      '  <url>',
      `    <loc>${baseUrl}/#services</loc>`,
      `    <lastmod>${today}</lastmod>`,
      '    <changefreq>daily</changefreq>',
      '    <priority>0.9</priority>',
      '  </url>',
      '  <url>',
      `    <loc>${baseUrl}/#estimator</loc>`,
      `    <lastmod>${today}</lastmod>`,
      '    <changefreq>daily</changefreq>',
      '    <priority>0.9</priority>',
      '  </url>',
      '  <url>',
      `    <loc>${baseUrl}/#faq</loc>`,
      `    <lastmod>${today}</lastmod>`,
      '    <changefreq>weekly</changefreq>',
      '    <priority>0.8</priority>',
      '  </url>',
      '  <url>',
      `    <loc>${baseUrl}/#contact</loc>`,
      `    <lastmod>${today}</lastmod>`,
      '    <changefreq>daily</changefreq>',
      '    <priority>0.9</priority>',
      '  </url>'
    ];

    // Append Categories
    if (cmsData?.categories && Array.isArray(cmsData.categories)) {
      cmsData.categories.forEach((cat: any) => {
        const slug = cat.slug || cat.id || 'scrap';
        xmlLines.push('  <url>');
        xmlLines.push(`    <loc>${baseUrl}/#service-${slug}</loc>`);
        xmlLines.push(`    <lastmod>${today}</lastmod>`);
        xmlLines.push('    <changefreq>weekly</changefreq>');
        xmlLines.push('    <priority>0.9</priority>');
        xmlLines.push('  </url>');
      });
    }

    // Append Blog Posts
    if (cmsData?.posts && Array.isArray(cmsData.posts)) {
      cmsData.posts
        .filter((p: any) => p.status === 'published')
        .forEach((post: any) => {
          const slug = post.slug || `post-${post.id}`;
          const modDate = post.date || today;
          xmlLines.push('  <url>');
          xmlLines.push(`    <loc>${baseUrl}/#post-${slug}</loc>`);
          xmlLines.push(`    <lastmod>${modDate}</lastmod>`);
          xmlLines.push('    <changefreq>monthly</changefreq>');
          xmlLines.push('    <priority>0.8</priority>');
          xmlLines.push('  </url>');
        });
    }

    // Append Custom Pages
    if (cmsData?.pages && Array.isArray(cmsData.pages)) {
      cmsData.pages
        .filter((pg: any) => pg.isPublished)
        .forEach((page: any) => {
          const slug = page.slug || `page-${page.id}`;
          xmlLines.push('  <url>');
          xmlLines.push(`    <loc>${baseUrl}/#page-${slug}</loc>`);
          xmlLines.push(`    <lastmod>${today}</lastmod>`);
          xmlLines.push('    <changefreq>monthly</changefreq>');
          xmlLines.push('    <priority>0.7</priority>');
          xmlLines.push('  </url>');
        });
    }

    xmlLines.push('</urlset>');

    const xmlOutput = xmlLines.join('\n');
    res.header("Content-Type", "application/xml; charset=utf-8");
    return res.send(xmlOutput);

  } catch (err: any) {
    console.error("Error generating dynamic sitemap:", err);
    res.status(500).send("Error generating dynamic sitemap.xml");
  }
});

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    location: "Dammam, Saudi Arabia",
    database: "local-persistent-cache",
  });
});

// Image Upload Endpoint (Saves files directly into server uploads folder)
app.post("/api/upload", (req, res) => {
  try {
    const { image, name } = req.body;
    if (!image) {
      return res.status(400).json({ error: "No image payload provided" });
    }

    let base64Data = image;
    let ext = "jpg";

    if (image.includes("base64,")) {
      const parts = image.split("base64,");
      const mimeMatch = parts[0].match(/:(.*?);/);
      if (mimeMatch && mimeMatch[1]) {
        const mime = mimeMatch[1];
        if (mime.includes("png")) ext = "png";
        else if (mime.includes("webp")) ext = "webp";
        else if (mime.includes("gif")) ext = "gif";
        else if (mime.includes("svg")) ext = "svg";
      }
      base64Data = parts[1];
    }

    const buffer = Buffer.from(base64Data, "base64");
    const sanitizedName = name ? name.replace(/[^a-zA-Z0-9_-]/g, "") : "img";
    const fileName = `${sanitizedName}_${Date.now()}_${Math.random().toString(36).substring(2, 7)}.${ext}`;

    const publicPath = path.join(publicUploadsDir, fileName);
    const rootPath = path.join(rootUploadsDir, fileName);

    // Save image to disk
    fs.writeFileSync(publicPath, buffer);
    fs.writeFileSync(rootPath, buffer);

    const fileUrl = `/uploads/${fileName}`;
    console.log(`📸 Image successfully uploaded and saved to: ${fileUrl}`);

    return res.json({
      success: true,
      url: fileUrl,
      fileName: fileName
    });
  } catch (err: any) {
    console.error("❌ Error uploading image:", err);
    return res.status(500).json({ error: "Failed to save image file on server.", details: err.message });
  }
});

// Scrap analysis endpoint (multimodal AI analysis)
app.post("/api/analyze-scrap", async (req, res) => {
  try {
    const { materialType, approxQuantity, image, language = "ar" } = req.body;
    
    const ai = getAiClient();

    // Log incoming request metadata (no sensitive logs)
    console.log(`Received scrap analysis request. Type: ${materialType}, Qty: ${approxQuantity}, Image: ${image ? "Yes" : "No"}, Lang: ${language}`);

    // If Gemini API is not configured, send a highly realistic and helpful mock response
    if (!ai) {
      const isArabic = language === "ar";
      return res.json({
        detectedMaterials: isArabic ? ["مكيف هواء قديم", "نحاس", "حديد"] : ["Old AC Unit", "Copper", "Iron"],
        estimatedWeightKg: "120 - 150 kg",
        condition: isArabic ? "مستعمل - يحتاج لتفكيك" : "Used - Requires dismantling",
        confidence: 85,
        estimatedValueRangeSar: "250 - 450 SAR",
        professionalAdvice: isArabic 
          ? "ننصح بعدم محاولة فك المكيف بنفسك لتجنب تلف الكابلات النحاسية الداخلية. خدماتنا تشمل التفكيك المجاني بالكامل من موقعك لضمان حصولك على أعلى قيمة ممكنة تزيد عن الأسعار المعتادة بنسبة ١٠٪."
          : "We recommend not attempting to dismantle the AC yourself to prevent damaging internal copper coils. Our service includes 100% free dismantling at your Dammam location to guarantee you receive maximum cash value (typically 10% higher than baseline scrap prices).",
        nextSteps: isArabic 
          ? "اضغط على زر الواتساب لإرسال الصور والترتيب للاستلام الفوري والنقدي من منزلك أو منشأتك بالدمام."
          : "Click the WhatsApp button below to send these details directly and arrange instant cash payment with free pickup at your location in Dammam.",
        isSimulated: true
      });
    }

    // Build the contents parts for Gemini
    const contents: any[] = [];
    
    // Add text prompt specifying role and Dammam market knowledge
    const systemPrompt = `You are a professional industrial scrap evaluation AI for "Shera Scrap Haraj" (حراج أفضل سكراب) based in Dammam, Eastern Province, Saudi Arabia.
Your job is to analyze scrap metal, used air conditioners, cables, copper wires, and electronics, and estimate their scrap metal composition, estimated weight, grade, and local cash value in Dammam.

Local Dammam scrap average rates (reference only):
- Used Split/Window AC: 100 - 300 SAR per unit depending on size and compressor state.
- Copper wires/cables: 15 - 25 SAR per kg depending on purity.
- Clean Aluminum: 4 - 8 SAR per kg.
- Scrap Iron/Steel: 0.5 - 1.2 SAR per kg.
- Used large electronic appliances (refrigerators, washing machines): 50 - 150 SAR per unit.

Analyze the user's provided information:
- Category Selected by User: ${materialType}
- Quantity Specified by User: ${approxQuantity}

If an image is attached, analyze the image to identify the exact items, their quantity, quality, rust level, material purity, and estimate weight.
Provide your response strictly in the language requested: "${language === "ar" ? "Arabic" : "English"}".
Ensure you output a valid JSON object matching the requested schema.`;

    contents.push({ text: systemPrompt });

    // If base64 image is provided, parse and append as an inlineData part
    if (image && image.includes("base64,")) {
      const parts = image.split("base64,");
      const mimeType = parts[0].split(":")[1].split(";")[0];
      const base64Data = parts[1];

      contents.push({
        inlineData: {
          mimeType: mimeType,
          data: base64Data
        }
      });
    } else {
      contents.push({ text: "Please evaluate the scrap description without an image. Focus on providing helpful estimated metrics." });
    }

    // Define response schema
    const responseSchema = {
      type: Type.OBJECT,
      properties: {
        detectedMaterials: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
          description: "List of detected metals or scrap item categories in the requested language."
        },
        estimatedWeightKg: {
          type: Type.STRING,
          description: "Estimated weight with units (e.g. '50-80 kg' or '2 tons') in the requested language."
        },
        condition: {
          type: Type.STRING,
          description: "A summary of the condition (e.g., commercial-grade, rusty, dismantled, dirty, good copper content) in the requested language."
        },
        confidence: {
          type: Type.INTEGER,
          description: "Percentage score of evaluation confidence (0 to 100)."
        },
        estimatedValueRangeSar: {
          type: Type.STRING,
          description: "Estimated cash value range in Dammam Saudi Riyals (SAR) (e.g., '350 - 500 SAR') based on current rates."
        },
        professionalAdvice: {
          type: Type.STRING,
          description: "Pro tip to help the customer get more money, highlighting our free dismantling or sorting benefit in the requested language."
        },
        nextSteps: {
          type: Type.STRING,
          description: "Friendly call to action inviting them to WhatsApp to confirm and coordinate free truck pickup in Dammam in the requested language."
        }
      },
      required: ["detectedMaterials", "estimatedWeightKg", "condition", "confidence", "estimatedValueRangeSar", "professionalAdvice", "nextSteps"]
    };

    // Query Gemini 3.6-flash
    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: contents,
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
        temperature: 0.4
      }
    });

    const textOutput = response.text;
    if (!textOutput) {
      throw new Error("No response from Gemini API");
    }

    const resultJson = JSON.parse(textOutput.trim());
    return res.json(resultJson);

  } catch (error: any) {
    console.error("❌ Error in scrap analysis API:", error);
    res.status(500).json({
      error: "Failed to analyze scrap. Please try again or contact us directly on WhatsApp.",
      details: error.message
    });
  }
});

// -----------------------------------------------------------------------------
// 2. VITE MIDDLEWARE & STATIC SERVING
// -----------------------------------------------------------------------------

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    console.log("🚀 Starting Express in DEVELOPMENT mode...");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    console.log("📦 Starting Express in PRODUCTION mode...");
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`✅ Server is running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
