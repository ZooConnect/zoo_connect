import express from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath, pathToFileURL } from "url";
import { errorHandler } from "./utils/errorHandler.js";
import cookieParser from 'cookie-parser';
import mongoose from 'mongoose';
import userRoutes from "./routes/user.routes.js";
import animalRoutes from './routes/animal.routes.js';


mongoose.connect('mongodb://127.0.0.1:27017/zoo_connect')
  .then(() => console.log('[MongoDB] Connected successfully'))
  .catch(err => console.error('[MongoDB] Connection error:', err));


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

const packageJsonPath = path.join(__dirname, '..', 'package.json');
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));


// Middlewares
app.use(express.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '..', 'public')));
app.use('/api/users', userRoutes);
app.use('/api/animals', animalRoutes);

// Auto-mount routes from src/routes/auto/*.route.js  
// We manually import them here to ensure they're loaded before the app is used
import infoRoute from "./routes/auto/info.route.js";
import versionRoute from "./routes/auto/version.route.js";
import boomRoute from "./routes/auto/boom.route.js";
app.use(infoRoute);
app.use(versionRoute);
app.use(boomRoute);

// Standard Express Middleware and Routes
app.use(express.static(path.join(__dirname, "public")));

app.get("/health", (req, res) => {
  res.status(200).json({ ok: true, ts: new Date().toISOString() });
});

app.get("/events", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "events.html"));
});

// Health check
app.get('/health', (_req, res) => {
  res.status(200).json({ status: 'ok' });
});


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

