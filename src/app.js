import express from "express";
import fs from "fs";

// 1. Feature Imports
import userRoutes from "./routes/user.routes.js";
import animalRoutes from "./routes/animal.routes.js";   // 🦁 Animals (Restored)
import bookingRoutes from "./routes/booking.routes.js"; // 🎟️ Bookings (New)

// Skeleton Imports
import versionRoute from "./routes/auto/version.route.js";
import infoRoute from "./routes/auto/info.route.js";

const app = express();
const packageJson = JSON.parse(fs.readFileSync("./package.json", "utf-8"));

app.use(express.json());

// ---------------------------------------------------
// 1. REAL FEATURES
// ---------------------------------------------------

// Users (SCRUM-23, SCRUM-24)
app.use("/api/users", userRoutes);

// Animals (SCRUM-30) - Active now!
app.use("/api/animals", animalRoutes);

// Bookings (SCRUM-26)
app.use("/api/bookings", bookingRoutes);


// ---------------------------------------------------
// 2. MOCKS & UTILS
// ---------------------------------------------------

// Version
app.get("/version", (req, res) => {
  res.status(200).json({ version: packageJson.version });
});

// Info
app.get("/info", (req, res) => {
  res.status(200).json({
    name: packageJson.name,
    version: packageJson.version,
    uptime: process.uptime(),
    node: process.version
  });
});

// Boom (Simulated Crash)
app.get("/boom", (req, res, next) => {
  next(new Error("Simulated Crash for Testing"));
});

// Health Check
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

// ---------------------------------------------------
// 3. GLOBAL ERROR HANDLER
// ---------------------------------------------------
app.use((err, req, res, next) => {
  console.error("Error caught:", err.message);
  if (res.headersSent) {
    return next(err);
  }
  res.status(500).json({ error: "Internal Server Error", message: err.message });
});

export default app;