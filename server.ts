import express from "express";
import path from "path";
import fs from "fs";
import dotenv from "dotenv";
import { GoogleGenAI, Type } from "@google/genai";
import { createServer as createViteServer } from "vite";
import {
  getAllPosts,
  savePost,
  deletePost,
  trashPost,
  restorePost,
  deletePostPermanently,
  getPostRevisions,
  restorePostRevision,
  getAllPages,
  savePage,
  deletePage,
  trashPage,
  restorePage,
  deletePagePermanently,
  getPageRevisions,
  restorePageRevision,
  getAllServices,
  saveService,
  deleteService,
  getAllLocations,
  saveLocation,
  deleteLocation,
  getAllCategories,
  saveCategory,
  deleteCategory,
  getSiteSettings,
  updateSiteSettings,
  getAllInquiries,
  createInquiry,
  updateInquiryStatus,
  getAllAuditLogs,
  getAllMenus,
  getAllRedirects,
  saveRedirect,
  deleteRedirect,
  getAllUsers,
  saveUser,
  deleteUser,
  getAllRoles,
  getCachedCMSData,
  setCachedCMSData,
} from "./src/data/repository";
import { generatePreviewToken } from "./src/server/previewService";
import {
  authenticate,
  requireAuth,
  requirePermission,
  requireRole,
  verifyIdToken,
  hasPermission,
  AuthenticatedRequest,
} from "./src/server/auth";
import { runMigration } from "./src/data/migration";
import { generateSitemapXml } from "./src/utils/sitemapGenerator";
import { renderSsrPage } from "./src/server/ssrRenderer";
import { SITE_CONFIG } from "./src/config/site";

// Load environment variables
dotenv.config();

// Initialize Express
const app = express();
const PORT = 3000;

// Set payload limits (15MB max)
app.use(express.json({ limit: "15mb" }));
app.use(express.urlencoded({ limit: "15mb", extended: true }));
app.use(authenticate as any);

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
      console.warn("⚠️ WARNING: GEMINI_API_KEY is not set. AI scrap estimation will operate in simulation mode.");
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
// 1. SYSTEM & SEO ENDPOINTS (Registered before Vite middleware)
// -----------------------------------------------------------------------------

// Architectural Dynamic Sitemap XML Endpoint
app.get("/sitemap.xml", (req, res) => {
  try {
    const cmsData = getCachedCMSData();
    const xml = generateSitemapXml(cmsData);
    res.header("Content-Type", "application/xml; charset=utf-8");
    return res.status(200).send(xml);
  } catch (err: any) {
    console.error("Error generating dynamic sitemap:", err);
    return res.status(500).send("Error generating dynamic sitemap.xml");
  }
});

// Centralized robots.txt
app.get("/robots.txt", (req, res) => {
  const robots = [
    "User-agent: *",
    "Allow: /",
    "Disallow: /admin",
    "Disallow: /api/",
    "",
    `Sitemap: ${SITE_CONFIG.canonicalDomain}/sitemap.xml`
  ].join("\n");

  res.header("Content-Type", "text/plain; charset=utf-8");
  return res.status(200).send(robots);
});

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    service: "Shera Scrap Multi-Page CMS Engine",
    domain: SITE_CONFIG.canonicalDomain,
  });
});

// -----------------------------------------------------------------------------
// AUTHENTICATION & AUTHORITATIVE RBAC VERIFICATION
// -----------------------------------------------------------------------------

// Server session verification (ID Token -> Google Identity Toolkit -> Server Store -> Role)
app.post("/api/auth/verify-session", async (req: AuthenticatedRequest, res) => {
  try {
    const token = req.body?.idToken || (typeof req.headers.authorization === "string" && req.headers.authorization.startsWith("Bearer ") ? req.headers.authorization.slice(7) : null);
    if (!token) {
      return res.status(400).json({ error: "Missing ID token", code: "TOKEN_MISSING" });
    }

    const user = await verifyIdToken(token);
    if (!user) {
      return res.status(403).json({
        error: "Access denied: Account is not authorized to access Shera Scrap CMS",
        code: "UNAUTHORIZED_CMS_USER"
      });
    }

    return res.json({ success: true, user });
  } catch (err: any) {
    console.error("Auth verification error:", err);
    return res.status(500).json({ error: "Authentication check failed", details: err.message });
  }
});

// Current user profile query
app.get("/api/auth/me", requireAuth as any, (req: AuthenticatedRequest, res) => {
  return res.json({ user: req.user });
});

// -----------------------------------------------------------------------------
// AUTHORITATIVE CMS DATA REPOSITORY API (RBAC PROTECTED)
// -----------------------------------------------------------------------------

// Fetch entities: Public caller gets strictly public content (NO users, NO inquiries, NO audit logs)
// Authenticated staff caller receives full dataset according to role
app.get("/api/cms/entities", (req: AuthenticatedRequest, res) => {
  try {
    const isStaff = !!req.user && ['super_admin', 'administrator', 'editor', 'author'].includes(req.user.role);

    // Public caller: ONLY published posts and published pages
    const posts = isStaff ? getAllPosts() : getAllPosts().filter(p => p.status === 'published');
    const pages = isStaff ? getAllPages() : getAllPages().filter(p => p.isPublished);

    const publicResponse: any = {
      posts,
      pages,
      services: getAllServices(),
      locations: getAllLocations(),
      categories: getAllCategories(),
      menus: getAllMenus(),
      redirects: getAllRedirects(),
      settings: getSiteSettings(),
    };

    // Private admin entities are ONLY attached if staff is verified
    if (isStaff) {
      if (hasPermission(req.user!, 'inquiries:view')) {
        publicResponse.inquiries = getAllInquiries();
      }
      if (hasPermission(req.user!, 'audit:view')) {
        publicResponse.auditLogs = getAllAuditLogs();
      }
      if (req.user!.role === 'super_admin') {
        publicResponse.users = getAllUsers();
      }
    }

    return res.json(publicResponse);
  } catch (err: any) {
    console.error("Error retrieving CMS entities:", err);
    return res.status(500).json({ error: "Failed to load CMS entities", details: err.message });
  }
});

// Dedicated staff admin entities endpoint (Strictly protected)
app.get("/api/admin/entities", requireAuth as any, (req: AuthenticatedRequest, res) => {
  try {
    const user = req.user!;
    const response: any = {
      posts: getAllPosts(),
      pages: getAllPages(),
      services: getAllServices(),
      locations: getAllLocations(),
      categories: getAllCategories(),
      menus: getAllMenus(),
      redirects: getAllRedirects(),
      settings: getSiteSettings(),
      roles: getAllRoles(),
    };

    if (hasPermission(user, 'inquiries:view')) {
      response.inquiries = getAllInquiries();
    }
    if (hasPermission(user, 'audit:view')) {
      response.auditLogs = getAllAuditLogs();
    }
    if (user.role === 'super_admin') {
      response.users = getAllUsers();
    }

    return res.json(response);
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

// Authoritative full state synchronization (Super Admin & Administrator only)
app.post("/api/cms/sync", (requireRole(['super_admin', 'administrator']) as any), (req: AuthenticatedRequest, res) => {
  try {
    const data = req.body;
    if (!data) return res.status(400).json({ error: "No data payload" });
    setCachedCMSData(data);
    return res.json({ success: true, timestamp: new Date().toISOString() });
  } catch (err: any) {
    console.error("Error syncing CMS data:", err);
    return res.status(500).json({ error: "Failed to sync CMS data", details: err.message });
  }
});

// Deterministic database migration endpoint (Super Admin ONLY)
app.post("/api/cms/migrate", (requireRole(['super_admin']) as any), async (req: AuthenticatedRequest, res) => {
  try {
    const report = await runMigration();
    return res.json({ success: true, report });
  } catch (err: any) {
    console.error("Error running database migration:", err);
    return res.status(500).json({ error: "Migration failed", details: err.message });
  }
});

// Normalized Posts Endpoints
// Authors can only create drafts; Editors and Admins can publish
app.post("/api/cms/posts", (requireAuth as any), (req: AuthenticatedRequest, res) => {
  try {
    const user = req.user!;
    const postData = req.body;

    // Enforce author restrictions: authors cannot publish directly
    if (user.role === 'author') {
      if (postData.status === 'published' || postData.isPublished === true) {
        return res.status(403).json({
          error: "Forbidden: Authors cannot publish posts directly. Posts must remain in draft for review.",
          code: "AUTHOR_CANNOT_PUBLISH"
        });
      }
      postData.status = 'draft';
      postData.isPublished = false;
      postData.author = user.name;
    } else if (!hasPermission(user, 'posts:create') && !hasPermission(user, 'posts:edit')) {
      return res.status(403).json({ error: "Forbidden: Insufficient permissions to save posts" });
    }

    const saved = savePost(postData);
    return res.json({ success: true, post: saved });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

app.delete("/api/cms/posts/:id", (requirePermission('posts:delete') as any), (req: AuthenticatedRequest, res) => {
  try {
    const ok = deletePost(req.params.id);
    return res.json({ success: ok });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

// Normalized Pages Endpoints (Super Admin & Administrator only)
app.post("/api/cms/pages", (requirePermission('pages:*') as any), (req: AuthenticatedRequest, res) => {
  try {
    const saved = savePage(req.body);
    return res.json({ success: true, page: saved });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

app.delete("/api/cms/pages/:id", (requirePermission('pages:*') as any), (req: AuthenticatedRequest, res) => {
  try {
    const ok = deletePage(req.params.id);
    return res.json({ success: ok });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

// Normalized Services Endpoints
app.post("/api/cms/services", (requirePermission('services:*') as any), (req: AuthenticatedRequest, res) => {
  try {
    const saved = saveService(req.body);
    return res.json({ success: true, service: saved });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

app.delete("/api/cms/services/:id", (requirePermission('services:*') as any), (req: AuthenticatedRequest, res) => {
  try {
    const ok = deleteService(req.params.id);
    return res.json({ success: ok });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

// Normalized Locations Endpoints
app.post("/api/cms/locations", (requirePermission('locations:*') as any), (req: AuthenticatedRequest, res) => {
  try {
    const saved = saveLocation(req.body);
    return res.json({ success: true, location: saved });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

app.delete("/api/cms/locations/:id", (requirePermission('locations:*') as any), (req: AuthenticatedRequest, res) => {
  try {
    const ok = deleteLocation(req.params.id);
    return res.json({ success: ok });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

// Normalized Categories Endpoints
app.post("/api/cms/categories", (requirePermission('categories:*') as any), (req: AuthenticatedRequest, res) => {
  try {
    const saved = saveCategory(req.body);
    return res.json({ success: true, category: saved });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

app.delete("/api/cms/categories/:id", (requirePermission('categories:*') as any), (req: AuthenticatedRequest, res) => {
  try {
    const ok = deleteCategory(req.params.id);
    return res.json({ success: ok });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

// Normalized Settings Endpoint (Super Admin & Administrator only)
app.post("/api/cms/settings", (requirePermission('settings:*') as any), (req: AuthenticatedRequest, res) => {
  try {
    const saved = updateSiteSettings(req.body);
    return res.json({ success: true, settings: saved });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

// Normalized Redirects Endpoints (Super Admin & Administrator only)
app.post("/api/cms/redirects", (requirePermission('redirects:*') as any), (req: AuthenticatedRequest, res) => {
  try {
    const saved = saveRedirect(req.body);
    return res.json({ success: true, redirect: saved });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

app.delete("/api/cms/redirects/:id", (requirePermission('redirects:*') as any), (req: AuthenticatedRequest, res) => {
  try {
    const ok = deleteRedirect(req.params.id);
    return res.json({ success: ok });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

// User Management Endpoints (Super Admin ONLY)
app.get("/api/admin/users", (requireRole(['super_admin']) as any), (req: AuthenticatedRequest, res) => {
  try {
    return res.json({ users: getAllUsers() });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

app.post("/api/admin/users", (requireRole(['super_admin']) as any), (req: AuthenticatedRequest, res) => {
  try {
    const saved = saveUser(req.body);
    return res.json({ success: true, user: saved });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

app.delete("/api/admin/users/:id", (requireRole(['super_admin']) as any), (req: AuthenticatedRequest, res) => {
  try {
    const ok = deleteUser(req.params.id);
    return res.json({ success: ok });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

// Roles Endpoint
app.get("/api/admin/roles", (requireAuth as any), (req: AuthenticatedRequest, res) => {
  try {
    return res.json({ roles: getAllRoles() });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

// Customer Inquiries: Public create with strict input validation
app.post("/api/inquiries", (req, res) => {
  try {
    const { name, phone, location, materialType } = req.body;
    if (!name || typeof name !== 'string' || name.trim().length === 0 || name.length > 200) {
      return res.status(400).json({ error: "A valid name up to 200 characters is required." });
    }
    if (!phone || typeof phone !== 'string' || phone.trim().length === 0 || phone.length > 50) {
      return res.status(400).json({ error: "A valid phone number up to 50 characters is required." });
    }
    const created = createInquiry({
      name: name.trim(),
      phone: phone.trim(),
      location: typeof location === 'string' ? location.slice(0, 200) : undefined,
      materialType: typeof materialType === 'string' ? materialType.slice(0, 100) : undefined,
      status: 'new'
    });
    return res.json({ success: true, inquiry: created });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

// Inquiries Query & Management (Editor & Administrator only)
app.get("/api/inquiries", (requirePermission('inquiries:view') as any), (req: AuthenticatedRequest, res) => {
  try {
    return res.json({ inquiries: getAllInquiries() });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

app.patch("/api/inquiries/:id/status", (requirePermission('inquiries:manage') as any), (req: AuthenticatedRequest, res) => {
  try {
    const { status } = req.body;
    const ok = updateInquiryStatus(req.params.id, status);
    return res.json({ success: ok });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

// Audit Trail Endpoint (Super Admin & Administrator only)
app.get("/api/cms/audit-logs", (requirePermission('audit:view') as any), (req: AuthenticatedRequest, res) => {
  try {
    return res.json({ logs: getAllAuditLogs() });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

// -----------------------------------------------------------------------------
// 2. MEDIA MANAGEMENT & SECURE UPLOAD (RBAC PROTECTED)
// -----------------------------------------------------------------------------

// List media files
app.get("/api/media", (req, res) => {
  try {
    if (!fs.existsSync(publicUploadsDir)) {
      return res.json({ media: [] });
    }
    const files = fs.readdirSync(publicUploadsDir);
    const media = files.map(file => {
      const stats = fs.statSync(path.join(publicUploadsDir, file));
      return {
        id: file,
        url: `/uploads/${file}`,
        title: file,
        date: stats.mtime,
        size: (stats.size / 1024).toFixed(2) + " KB"
      };
    }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    return res.json({ media });
  } catch (err) {
    console.error("Error reading media files:", err);
    return res.status(500).json({ error: "Failed to read media files" });
  }
});

// Delete media file safely (Editor or Admin only)
app.delete("/api/media/:fileName", (requirePermission('media:delete') as any), (req: AuthenticatedRequest, res) => {
  try {
    const fileName = req.params.fileName;
    // Prevent directory traversal attacks
    if (!fileName || fileName.includes("..") || fileName.includes("/") || fileName.includes("\\")) {
      return res.status(400).json({ error: "Invalid filename" });
    }
    const publicPath = path.join(publicUploadsDir, fileName);
    const rootPath = path.join(rootUploadsDir, fileName);
    
    if (fs.existsSync(publicPath)) fs.unlinkSync(publicPath);
    if (fs.existsSync(rootPath)) fs.unlinkSync(rootPath);
    
    const distPath = path.join(process.cwd(), "dist", "uploads", fileName);
    if (fs.existsSync(distPath)) fs.unlinkSync(distPath);

    return res.json({ success: true });
  } catch (err) {
    console.error("Error deleting file:", err);
    return res.status(500).json({ error: "Failed to delete file" });
  }
});

// Secure image upload with signature validation (Author, Editor, Admin)
app.post(["/api/upload", "/api/upload.php"], (requirePermission('media:upload') as any), (req: AuthenticatedRequest, res) => {
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
        const mime = mimeMatch[1].toLowerCase();
        if (mime === "image/png") ext = "png";
        else if (mime === "image/webp") ext = "webp";
        else if (mime === "image/jpeg" || mime === "image/jpg") ext = "jpg";
        else {
          // Reject SVG, HTML, scripts, or executables
          return res.status(400).json({ error: "Unsupported media type. Only JPG, PNG, and WebP images are allowed." });
        }
      }
      base64Data = parts[1];
    }

    const buffer = Buffer.from(base64Data, "base64");

    // Enforce 10MB limit per image
    if (buffer.length > 10 * 1024 * 1024) {
      return res.status(400).json({ error: "Image file exceeds maximum allowable size (10MB)." });
    }

    // Validate binary magic bytes signature
    const headerHex = buffer.slice(0, 4).toString("hex");
    const isJpeg = headerHex.startsWith("ffd8ff");
    const isPng = headerHex === "89504e47";
    const isRiff = headerHex === "52494646"; // RIFF header for WebP

    if (!isJpeg && !isPng && !isRiff) {
      return res.status(400).json({ error: "File signature verification failed. Only authentic image files are allowed." });
    }

    // Generate safe alphanumeric filename
    const sanitizedName = name ? name.replace(/[^a-zA-Z0-9_-]/g, "").substring(0, 40) : "scrap";
    const fileName = `${sanitizedName}_${Date.now()}_${Math.random().toString(36).substring(2, 7)}.${ext}`;

    const publicPath = path.join(publicUploadsDir, fileName);
    const rootPath = path.join(rootUploadsDir, fileName);

    fs.writeFileSync(publicPath, buffer);
    fs.writeFileSync(rootPath, buffer);

    const fileUrl = `/uploads/${fileName}`;

    return res.json({
      success: true,
      url: fileUrl,
      fileName: fileName,
      fileSize: (buffer.length / 1024).toFixed(1) + " KB",
      mimeType: `image/${ext === 'jpg' ? 'jpeg' : ext}`,
    });
  } catch (err: any) {
    console.error("Error uploading image:", err);
    return res.status(500).json({ error: "Failed to save image file on server.", details: err.message });
  }
});

// -----------------------------------------------------------------------------
// 3. AI SCRAP VALUATION (Multimodal Gemini API)
// -----------------------------------------------------------------------------
app.post("/api/analyze-scrap", async (req, res) => {
  try {
    const { materialType, approxQuantity, image, language = "ar" } = req.body;
    const ai = getAiClient();

    // Fallback simulation when API key is not present
    if (!ai) {
      const isArabic = language === "ar";
      return res.json({
        detectedMaterials: isArabic ? ["مكيف هواء قديم", "نحاس", "حديد"] : ["Old AC Unit", "Copper", "Iron"],
        estimatedWeightKg: "120 - 150 kg",
        condition: isArabic ? "مستعمل - يحتاج لتفكيك" : "Used - Requires dismantling",
        confidence: 88,
        estimatedValueRangeSar: "250 - 450 SAR",
        professionalAdvice: isArabic 
          ? "ننصح بعدم محاولة فك المكيف بنفسك لتجنب تلف الكابلات النحاسية الداخلية. خدماتنا تشمل التفكيك المجاني بالكامل من موقعك بالدمام."
          : "We recommend leaving the AC intact. Our team provides 100% free on-site dismantling in Dammam to protect internal copper purity.",
        nextSteps: isArabic 
          ? "اضغط على زر الواتساب لإرسال الصور وترتيب الاستلام الفوري والنقدي من موقعك."
          : "Click WhatsApp to coordinate same-day truck dispatch and instant cash payment.",
        isSimulated: true
      });
    }

    const contents: any[] = [];
    const systemPrompt = `You are a professional industrial scrap evaluation AI for "Shera Scrap" based in Dammam, Eastern Province, Saudi Arabia.
Your job is to analyze scrap metal, air conditioners, cables, and equipment, and estimate scrap composition, weight, and local cash value in Dammam.
Local Dammam scrap average rates:
- Used AC: 100 - 300 SAR per unit.
- Copper wires/cables: 15 - 25 SAR per kg.
- Clean Aluminum: 4 - 8 SAR per kg.
- Scrap Iron/Steel: 0.5 - 1.2 SAR per kg.
Analyze:
- Category: ${materialType}
- Quantity: ${approxQuantity}
Provide response in "${language === "ar" ? "Arabic" : "English"}".`;

    contents.push({ text: systemPrompt });

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
      contents.push({ text: "Evaluate the scrap description without an image." });
    }

    const responseSchema = {
      type: Type.OBJECT,
      properties: {
        detectedMaterials: { type: Type.ARRAY, items: { type: Type.STRING } },
        estimatedWeightKg: { type: Type.STRING },
        condition: { type: Type.STRING },
        confidence: { type: Type.INTEGER },
        estimatedValueRangeSar: { type: Type.STRING },
        professionalAdvice: { type: Type.STRING },
        nextSteps: { type: Type.STRING }
      },
      required: ["detectedMaterials", "estimatedWeightKg", "condition", "confidence", "estimatedValueRangeSar", "professionalAdvice", "nextSteps"]
    };

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
    if (!textOutput) throw new Error("No response from Gemini API");

    const resultJson = JSON.parse(textOutput.trim());
    return res.json(resultJson);

  } catch (error: any) {
    console.error("Error in scrap analysis API:", error);
    res.status(500).json({
      error: "Failed to analyze scrap. Please try again or contact us on WhatsApp.",
      details: error.message
    });
  }
});

// -----------------------------------------------------------------------------
// 4. SERVER-SIDE RENDERING (SSR) & MULTI-PAGE DELIVERY
// -----------------------------------------------------------------------------

async function startServer() {
  const isProduction = process.env.NODE_ENV === "production";

  if (!isProduction) {
    console.log("🚀 Starting Vite dev server in middleware mode with SSR...");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "custom",
    });

    // Mount Vite middlewares first for client JS / HMR assets
    app.use(vite.middlewares);

    // SSR Handler for all HTML / page requests
    app.use("*", async (req, res, next) => {
      const url = req.originalUrl;

      // Skip non-page requests (assets, api, uploads)
      if (
        url.startsWith("/api") || 
        url.startsWith("/uploads") || 
        url.startsWith("/@") || 
        url.includes(".")
      ) {
        return next();
      }

      try {
        const rawTemplate = fs.readFileSync(path.resolve(process.cwd(), "index.html"), "utf-8");
        const transformedTemplate = await vite.transformIndexHtml(url, rawTemplate);

        const result = await renderSsrPage(url, transformedTemplate);

        if (result.redirectUrl) {
          return res.redirect(result.statusCode, result.redirectUrl);
        }

        return res.status(result.statusCode).header("Content-Type", "text/html; charset=utf-8").send(result.html);
      } catch (err: any) {
        vite.ssrFixStacktrace(err);
        console.error("SSR dev error:", err);
        return res.status(500).end(err.stack);
      }
    });

  } else {
    console.log("📦 Starting Production Express server with SSR...");
    const distPath = path.join(process.cwd(), "dist");
    
    // Serve static client assets (JS, CSS, images)
    app.use(express.static(distPath, { index: false }));

    // SSR Handler for all production page requests
    app.use("*", async (req, res, next) => {
      const url = req.originalUrl;

      if (url.startsWith("/api") || url.startsWith("/uploads") || url.includes(".")) {
        return next();
      }

      try {
        const templatePath = path.join(distPath, "index.html");
        const template = fs.existsSync(templatePath) 
          ? fs.readFileSync(templatePath, "utf-8") 
          : fs.readFileSync(path.resolve(process.cwd(), "index.html"), "utf-8");

        const result = await renderSsrPage(url, template);

        if (result.redirectUrl) {
          return res.redirect(result.statusCode, result.redirectUrl);
        }

        return res.status(result.statusCode).header("Content-Type", "text/html; charset=utf-8").send(result.html);
      } catch (err: any) {
        console.error("SSR production error:", err);
        return res.status(500).send("Internal Server Error");
      }
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`✅ Shera Scrap Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
