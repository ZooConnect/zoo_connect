import express from "express";
import fs from "fs";
import path from "path";
import cookieParser from 'cookie-parser';
import { fileURLToPath, pathToFileURL } from "url";

import connectToDB from "./db/mongoDB.js";
import { errorHandler } from "./errorHandler.js";

connectToDB();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const packageJsonPath = path.join(__dirname, '..', 'package.json');
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));

const app = express();

// Middlewares
app.use(express.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '..', 'public')));
app.use((req, res, next) => { // authorise le cross-plateform
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});
app.use(errorHandler);

/*app.get("/events", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "events.html"));
});*/

// Routes
const autoDir = path.join(__dirname, "routes");
if (fs.existsSync(autoDir)) {
  const files = fs.readdirSync(autoDir).filter(f => f.endsWith(".route.js"));
  for (const f of files) {
    const full = path.join(autoDir, f);
    const mod = await import(pathToFileURL(full).href);
    if (mod.default?.router && mod.default?.prefix) {
      app.use(mod.default.prefix, mod.default.router);
    }
  }
}

app.get('/login', (_req, res) => res.sendFile(path.join(__dirname, '..', 'public/login.html')));
app.get('/register', (_req, res) => res.sendFile(path.join(__dirname, '..', 'public/register.html')));

export default app;

