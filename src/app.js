import express from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath, pathToFileURL } from "url";
import { errorHandler } from "./utils/errorHandler.js";
import cookieParser from 'cookie-parser';
import mongoose from 'mongoose';

mongoose.connect('mongodb://127.0.0.1:27017/zoo_connect')
  .then(() => console.log('[MongoDB] Connected successfully'))
  .catch(err => console.error('[MongoDB] Connection error:', err));


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Middlewares
app.use(express.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '..', 'public')));

// Auto-mount routers
const autoDir = path.join(__dirname, "routes", "auto");
if (fs.existsSync(autoDir)) {
  const files = fs.readdirSync(autoDir).filter(f => f.endsWith(".route.js"));
  for (const f of files) {
    const full = path.join(autoDir, f);
    const mod = await import(pathToFileURL(full).href);
    if (mod.default) app.use("/", mod.default);
  }
}

// Login/Register pages
app.get('/login', (_req, res) => res.sendFile(path.join(__dirname, '..', 'public/login.html')));
app.get('/register', (_req, res) => res.sendFile(path.join(__dirname, '..', 'public/register.html')));

// Global error handler
app.use(errorHandler);

export default app;
