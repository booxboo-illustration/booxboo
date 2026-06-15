import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
import sharp from "sharp";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Ensure public directory exists
  const publicDir = path.join(process.cwd(), "public");
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir);
  }

  const distPath = path.resolve(process.cwd(), "dist");

  // Dynamic Image Optimization API
  app.get("/api/image", async (req, res) => {
    const srcParam = req.query.src as string;
    const widthParam = req.query.w as string;
    const qualityParam = req.query.q as string;

    if (!srcParam) {
      return res.status(400).send("src parameter is required");
    }

    // Prevent directory traversal and normalize path
    const filename = path.basename(srcParam);
    
    // Find the image file in public or dist directory
    let imagePath = path.join(publicDir, filename);
    if (!fs.existsSync(imagePath)) {
      imagePath = path.join(distPath, filename);
    }

    if (!fs.existsSync(imagePath) || fs.statSync(imagePath).isDirectory()) {
      return res.status(404).send("Image not found");
    }

    const ext = path.extname(filename).toLowerCase();
    
    // Skip resizing for videos or non-image assets
    if (ext === ".mp4" || ext === ".mov" || ext === ".webm") {
      return res.redirect(srcParam);
    }

    try {
      let width = widthParam ? parseInt(widthParam, 10) : null;
      let quality = qualityParam ? parseInt(qualityParam, 10) : 80;

      if (width && (isNaN(width) || width <= 0 || width > 3000)) {
        width = null;
      }
      if (isNaN(quality) || quality <= 0 || quality > 100) {
        quality = 80;
      }

      let pipeline = sharp(imagePath);
      const metadata = await pipeline.metadata();

      if (width && metadata.width && metadata.width > width) {
        pipeline = pipeline.resize(width, null, {
          withoutEnlargement: true,
          fit: "cover"
        });
      }

      // Convert to WebP format for optimal lightweight modern load with strong caching headers
      res.setHeader("Content-Type", "image/webp");
      res.setHeader("Cache-Control", "public, max-age=31536000, immutable");

      const buffer = await pipeline.webp({ quality }).toBuffer();
      return res.send(buffer);
    } catch (error) {
      console.error("Image optimization error:", error);
      // Fallback to sending the original file as-is
      return res.sendFile(imagePath);
    }
  });

  // Email Transporter
  const getTransporter = () => {
    const host = process.env.SMTP_HOST;
    const port = parseInt(process.env.SMTP_PORT || "587");
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;

    if (!host || !user || !pass) {
      return null;
    }

    return nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: { user, pass },
    });
  };

  // API for contact form
  app.post("/api/contact", async (req, res) => {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const transporter = getTransporter();
    
    // Fallback: Save to a local file so the user can see submissions in the file explorer
    const submissionsDir = path.join(process.cwd(), "submissions");
    if (!fs.existsSync(submissionsDir)) {
      fs.mkdirSync(submissionsDir);
    }
    const filename = `contact_${Date.now()}.json`;
    fs.writeFileSync(
      path.join(submissionsDir, filename),
      JSON.stringify({ name, email, message, timestamp: new Date().toISOString() }, null, 2)
    );
    
    if (!transporter) {
      console.warn("SMTP not configured. Email not sent, submission saved to /submissions folder.");
      return res.json({ 
        success: true, 
        message: "Message received! (Saved to server due to missing SMTP configuration)" 
      });
    }

    try {
      await transporter.sendMail({
        from: `"${name}" <${process.env.SMTP_USER}>`,
        to: process.env.CONTACT_EMAIL || "boox2boox2boo@gmail.com",
        replyTo: email,
        subject: `[Portfolio Contact] Message from ${name}`,
        text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
        html: `
          <h3>New Contact Form Submission</h3>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Message:</strong></p>
          <p>${message.replace(/\n/g, '<br>')}</p>
        `,
      });
      res.json({ success: true });
    } catch (error) {
      console.error("Failed to send email:", error);
      res.status(500).json({ error: "Failed to send email. Please try again later." });
    }
  });

  // Configure multer for file uploads
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, publicDir);
    },
    filename: (req, file, cb) => {
      // Keep the original filename or use a predictable one
      cb(null, file.originalname);
    },
  });

  const upload = multer({ 
    storage,
    limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
  });

  // API to upload files
  app.post("/api/upload", upload.array("files"), (req, res) => {
    const files = req.files as Express.Multer.File[];
    const fileUrls = files.map((file) => `/${file.filename}`);
    res.json({ success: true, fileUrls });
  });

  // API to list uploaded images in public folder
  app.get("/api/images", (req, res) => {
    try {
      const files = fs.readdirSync(publicDir);
      const images = files.filter((file) =>
        /\.(jpg|jpeg|png|gif|webp)$/i.test(file)
      );
      res.json({ images: images.map((img) => `/${img}`) });
    } catch (error) {
      res.status(500).json({ error: "Failed to list images" });
    }
  });

  // Serve public directory as static files
  app.use(express.static(publicDir));

  // Vite middleware for development
  const isProduction = process.env.NODE_ENV === "production";
  const indexPath = path.join(distPath, "index.html");

  if (!isProduction && !fs.existsSync(distPath)) {
    console.log("[Server] Running in Development mode with Vite...");
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    console.log(`[Server] Production mode detected.`);
    console.log(`[Server] Content Root: ${distPath}`);
    
    if (!fs.existsSync(indexPath)) {
      console.error(`[CRITICAL] Build output NOT FOUND at ${indexPath}. Frontend will not load.`);
    }

    // 1. Serve static files with standard MIME types (handled by express.static)
    // We serve this BEFORE the SPA fallback
    app.use(express.static(distPath, {
      maxAge: '1d',
      setHeaders: (res, filePath) => {
        // Ensure JS files have correct MIME type even if the OS misreports
        if (filePath.endsWith('.js') || filePath.endsWith('.mjs')) {
          res.setHeader('Content-Type', 'application/javascript; charset=UTF-8');
        }
      }
    }));

    // 2. SPA Fallback: ALL other requests return index.html
    app.get("*", (req, res) => {
      // If it looks like a file request (has an extension) and reached here, it's a 404
      if (path.extname(req.url)) {
        return res.status(404).send("File not found");
      }

      if (fs.existsSync(indexPath)) {
        res.sendFile(indexPath);
      } else {
        res.status(404).send("Application front-end not found. Please verify build.");
      }
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
