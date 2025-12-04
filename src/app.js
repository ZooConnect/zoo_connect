import express from "express";
import userRoutes from "./routes/user.routes.js";
// Import the "Skeleton" routes (Don't delete these!)
import versionRoute from "./routes/auto/version.route.js";
import infoRoute from "./routes/auto/info.route.js";
import boomRoute from "./routes/auto/boom.route.js";

const app = express();

app.use(express.json());

// Your Feature
app.use("/api/users", userRoutes);

// The Skeleton Features (Needed for CI to pass)
app.use("/version", versionRoute);
app.use("/info", infoRoute);
app.use("/boom", boomRoute);

app.use((err, req, res, next) => {
  res.status(500).json({ error: "Internal Server Error" });
});

export default app;