import express from "express";
import fs from "fs";
import path from "path";
import cookieParser from 'cookie-parser';
import { fileURLToPath, pathToFileURL } from "url";
import dotenv from 'dotenv';

import { connectDB } from "./db/mongoDB.js";
import { errorHandler } from "./middlewares/errorHandler.js";

dotenv.config();

const app = express();

// --- 1. Middlewares de base ---
app.use(express.json());
app.use(cookieParser());

// --- 2. Connexion Base de données ---
connectDB();
console.log("Base de données bien chargée");

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// --- 3. Chargement AUTOMATIQUE des Routes ---
const autoDir = path.join(__dirname, "routes");

const loadRoutes = async (dir) => {
    if (!fs.existsSync(dir)) return;
    const entries = fs.readdirSync(dir, { withFileTypes: true });

    for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) {
            await loadRoutes(fullPath); // Explore les sous-dossiers (admin, etc.)
        } else if (entry.name.endsWith(".route.js")) {
            const mod = await import(pathToFileURL(fullPath).href);
            if (mod.default?.router && mod.default?.prefix) {
                app.use(mod.default.prefix, mod.default.router);
                console.log(`Route chargée : ${mod.default.prefix}`);
            }
        }
    }
};

// Exécution du chargement des routes
await loadRoutes(autoDir);

// --- 4. Fichiers Statiques (Frontend) ---
app.use(express.static(path.join(process.cwd(), '../frontend/src')));

// --- 5. Catch-all (SPA Routing) ---
// Cette règle envoie index.html pour toutes les routes SAUF celles commençant par /api
app.get(/^(?!\/api).+/, (req, res) => {
    res.sendFile(path.join(process.cwd(), '../frontend/src/index.html'));
});

// --- 6. Gestionnaire d'erreurs ---
app.use(errorHandler);

export default app;