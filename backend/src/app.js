import express from "express";
import fs from "fs";
import path from "path";
import cookieParser from 'cookie-parser';
import { fileURLToPath, pathToFileURL } from "url";
import dotenv from 'dotenv';

import { errorHandler } from "./middlewares/errorHandler.js";

dotenv.config();

const app = express();

// Middlewares
app.use(express.json());
app.use(cookieParser());


// Routes
/*
const packageJsonPath = path.join(__dirname, '..', 'package.json');
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));*/
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
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

// Servir frontend
app.use(express.static(path.join(process.cwd(), '../frontend/src')));
app.get('*', (req, res) => {
  res.sendFile(path.join(process.cwd(), '../frontend/src/index.html'));
});

app.use(errorHandler);
export default app;

