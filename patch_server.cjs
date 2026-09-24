const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

const newRoutes = `
// Get media files
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
        url: \`/uploads/\${file}\`,
        title: file,
        date: stats.mtime,
        size: (stats.size / 1024).toFixed(2) + " KB"
      };
    }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    res.json({ media });
  } catch (err) {
    console.error("Error reading media files:", err);
    res.status(500).json({ error: "Failed to read media files" });
  }
});

// Delete media file
app.delete("/api/media/:fileName", (req, res) => {
  try {
    const fileName = req.params.fileName;
    if (fileName.includes("..") || fileName.includes("/")) {
      return res.status(400).json({ error: "Invalid filename" });
    }
    const publicPath = path.join(publicUploadsDir, fileName);
    const rootPath = path.join(rootUploadsDir, fileName);
    
    if (fs.existsSync(publicPath)) fs.unlinkSync(publicPath);
    if (fs.existsSync(rootPath)) fs.unlinkSync(rootPath);
    
    const distPath = path.join(process.cwd(), "dist", "uploads", fileName);
    if (fs.existsSync(distPath)) fs.unlinkSync(distPath);

    res.json({ success: true });
  } catch (err) {
    console.error("Error deleting file:", err);
    res.status(500).json({ error: "Failed to delete file" });
  }
});
`;

code = code.replace('app.post("/api/upload", (req, res) => {', newRoutes + '\napp.post("/api/upload", (req, res) => {');

fs.writeFileSync('server.ts', code);
console.log("Patched server.ts successfully");
