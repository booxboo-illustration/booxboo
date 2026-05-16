import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import mime from "mime";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

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

  // Ensure public directory exists
  const publicDir = path.join(process.cwd(), "public");
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir);
  }

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
  const isProduction = process.env.NODE_ENV === "production" || fs.existsSync(path.join(process.cwd(), "dist"));

  if (!isProduction) {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    console.log(`[Server] Production mode detected.`);
    
    // In production, server.cjs is in 'dist/'
    // Fallback logic for reliable directory matching
    const currentDir = typeof __dirname !== 'undefined' ? __dirname : path.dirname(fileURLToPath(import.meta.url));
    const distPath = currentDir.endsWith("dist") ? currentDir : path.join(process.cwd(), "dist");
    const indexPath = path.join(distPath, "index.html");

    console.log(`[Server] Serving static files from: ${distPath}`);

    // Serve static files with explicit MIME type handling to fix MIME errors on some platforms
    const mimeTypes: Record<string, string> = {
      ".js": "application/javascript",
      ".mjs": "application/javascript",
      ".css": "text/css",
      ".html": "text/html",
      ".json": "application/json",
      ".png": "image/png",
      ".jpg": "image/jpeg",
      ".jpeg": "image/jpeg",
      ".svg": "image/svg+xml",
      ".webp": "image/webp",
    };

    app.use(express.static(distPath, {
      setHeaders: (res, filePath) => {
        const ext = path.extname(filePath).toLowerCase();
        const type = mimeTypes[ext] || mime.getType(filePath);
        if (type) {
          res.setHeader("Content-Type", type);
        }
      }
    }));

    app.get("*", (req, res) => {
      if (fs.existsSync(indexPath)) {
        res.sendFile(indexPath);
      } else {
        console.error(`[Error] 404: Index file not found at ${indexPath}`);
        res.status(404).send(`Application front-end not found. (Path: ${indexPath})`);
      }
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
