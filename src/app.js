import express from "express";
import userRoutes from "./routes/user.routes.js";
import fs from "fs";

// Skeleton Imports
import versionRoute from "./routes/auto/version.route.js";
import infoRoute from "./routes/auto/info.route.js";
// We don't need the file import for boom if we define it manually below

const app = express();
const packageJson = JSON.parse(fs.readFileSync("./package.json", "utf-8"));

app.use(express.json());

// 1. Your Feature
app.use("/api/users", userRoutes);

// 2. MOCK: Version
app.get("/version", (req, res) => {
  res.status(200).json({ version: packageJson.version });
});

// 3. MOCK: Info
app.get("/info", (req, res) => {
  res.status(200).json({
    name: packageJson.name,
    version: packageJson.version,
    uptime: process.uptime(),
    node: process.version
  });
});

// 4. MOCK: Boom (Force an error for testing)
app.get("/boom", (req, res, next) => {
  // Pass a fake error to the global handler
  next(new Error("Simulated Crash for Testing"));
});

// 5. Health Check
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

// 6. Global Error Handler
app.use((err, req, res, next) => {
  console.error("Error caught:", err.message);
  res.status(500).json({ error: "Internal Server Error", message: err.message });
});

export default app;