import express from 'express';
import userRoutes from './routes/user.routes.js';
import animalRoutes from './routes/animal.routes.js'; // <--- NEW: Import Animal Routes
import fs from 'fs';

const app = express();

// Read package.json to get version (keeping existing logic)
const packageJson = JSON.parse(fs.readFileSync("./package.json", "utf-8"));

app.use(express.json());

// ---------------------------------------------------
// 1. REAL FEATURES
// ---------------------------------------------------

// Users (SCRUM-23, SCRUM-24)
app.use('/api/users', userRoutes);

// Animals (SCRUM-30) <--- NEW: Add the route here
app.use('/api/animals', animalRoutes);


// ---------------------------------------------------
// 2. MOCKS & UTILS (Keeping these for your tests)
// ---------------------------------------------------

// Version check
app.get('/version', (req, res) => {
    res.status(200).json({ version: packageJson.version });
});

// Info check
app.get('/info', (req, res) => {
    res.status(200).json({
        name: packageJson.name,
        version: packageJson.version,
        uptime: process.uptime(),
        node: process.version
    });
});

// Boom (Force error for testing)
app.get('/boom', (req, res, next) => {
    next(new Error("Simulated Crash for Testing"));
});

// Health Check
app.get('/health', (req, res) => {
    res.status(200).json({ status: "ok" });
});

// ---------------------------------------------------
// 3. GLOBAL ERROR HANDLER
// ---------------------------------------------------
app.use((err, req, res, next) => {
    console.error("Error caught:", err.message);
    // If headers sent, delegate to default handler
    if (res.headersSent) {
        return next(err);
    }
    res.status(500).json({ error: "Internal Server Error", message: err.message });
});

export default app;