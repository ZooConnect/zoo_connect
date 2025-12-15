// src/app.js

import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import { readdirSync } from "fs";

// Manually import routes
import eventRoutes from "./routes/event.routes.js"; 
import bookingRoutes from "./routes/booking.routes.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());

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

  app.get("/bookings", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "bookings.html"));
  });

  app.use("/api/events", eventRoutes);

  app.use("/api/bookings", bookingRoutes);

  app.get("/boom", () => {
    throw new Error("Boom");
  });

// Error Handler Middleware (Crucial for Lab 6)
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: true, message: "Internal server error" }); 
});

export default app;