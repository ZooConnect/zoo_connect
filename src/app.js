import express from "express";
import fs from "fs";

// 1. Feature Imports
import userRoutes from "./routes/user.routes.js";
// import animalRoutes from "./routes/animal.routes.js";   // <--- COMMENTED OUT (Missing in this branch)
import bookingRoutes from "./routes/booking.routes.js"; 

// Skeleton Imports
import versionRoute from "./routes/auto/version.route.js";
import infoRoute from "./routes/auto/info.route.js";

const app = express();
const packageJson = JSON.parse(fs.readFileSync("./package.json", "utf-8"));

app.use(express.json());

// ---------------------------------------------------
// 1. REAL FEATURES
// ---------------------------------------------------

// Users
app.use("/api/users", userRoutes);

// Animals (Temporarily disabled until merged)
// app.use("/api/animals", animalRoutes); // <--- COMMENTED OUT

// Bookings (SCRUM-28)
app.use("/api/bookings", bookingRoutes);


// ---------------------------------------------------
// 2. MOCKS & UTILS
// ---------------------------------------------------

app.get("/version", (req, res) => {
  res.status(200).json({ version: packageJson.version });
});

app.get("/info", (req, res) => {
  res.status(200).json({
    name: packageJson.name,
    version: packageJson.version,
    uptime: process.uptime(),
    node: process.version
  });
});

app.get("/boom", (req, res, next) => {
  next(new Error("Simulated Crash for Testing"));
});

app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

app.use((err, req, res, next) => {
  console.error("Error caught:", err.message);
  if (res.headersSent) {
    return next(err);
  }
  res.status(500).json({ error: "Internal Server Error", message: err.message });
});

export default app;