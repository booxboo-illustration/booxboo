import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
import { fileURLToPath } from "url";

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
    // In production, we assume the server.cjs is in 'dist' or we are in the root.
    // We try to find 'dist' directory reliably.
    let distPath = path.resolve(process.cwd(), "dist");
    
    // If the current script is inside 'dist', then __dirname is 'dist'
    if (__dirname.endsWith("dist") || __dirname.includes("/dist/")) {
      distPath = __dirname;
    } else if (fs.existsSync(path.join(__dirname, "dist"))) {
      distPath = path.join(__dirname, "dist");
    }

    const indexPath = path.join(distPath, "index.html");

    console.log(`[Server] Production mode detected.`);
    console.log(`[Server] Serving static files from: ${distPath}`);
    console.log(`[Server] Base path (__dirname): ${__dirname}`);
    console.log(`[Server] Current working directory: ${process.cwd()}`);

    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      if (fs.existsSync(indexPath)) {
        res.sendFile(indexPath);
      } else {
        console.error(`[Error] 404: Index file not found at ${indexPath}`);
        res.status(404).send(`Application front-end not found. Please verify the build. (Looking at: ${indexPath})`);
      }
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
