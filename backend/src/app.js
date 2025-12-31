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

// --- 1. Middlewares ---
app.use(express.json());
app.use(cookieParser());

// --- 2. Connexion DB ---
connectDB();
console.log("Base de données bien chargée");

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// --- 3. Routes (Chargement AUTOMATIQUE) ---
// Note: On place les routes AVANT le serveur statique pour éviter les conflits
const autoDir = path.join(__dirname, "routes");

// Fonction pour charger les routes même dans les sous-dossiers (ex: routes/admin/)
const loadRoutes = async (dir) => {
    if (!fs.existsSync(dir)) return;
    const entries = fs.readdirSync(dir, { withFileTypes: true });

    for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) {
            await loadRoutes(fullPath); // Explore les sous-dossiers
        } else if (entry.name.endsWith(".route.js")) {
            const mod = await import(pathToFileURL(fullPath).href);
            if (mod.default?.router && mod.default?.prefix) {
                app.use(mod.default.prefix, mod.default.router);
            }
        }
    }
};

await loadRoutes(autoDir);

// --- 4. Servir frontend (Fichiers statiques) ---
app.use(express.static(path.join(process.cwd(), '../frontend/src')));
<<<<<<< HEAD

// --- 5. Catch-all (POUR LE FRONTEND UNIQUEMENT) ---
// Changement crucial : on exclut les chemins commençant par /api
app.get(/^(?!\/api).+/, (req, res) => {
    res.sendFile(path.join(process.cwd(), '../frontend/src/index.html'));
});

// --- 6. Error Handler (DOIT ÊTRE EN DERNIER) ---
app.use(errorHandler);

export default app;
=======
app.get('*', (req, res) => {
  res.sendFile(path.join(process.cwd(), '../frontend/src/index.html'));
});
<<<<<<< HEAD
export default app;
=======

app.use(errorHandler);
export default app;

>>>>>>> 553d819c20bf6e85e4719b572d17c46dc69fae04
>>>>>>> d4059f5331c357aae44f5f72a7d7fa299d13b663
