import express from "express";

// 1. Import your new User route
import userRoutes from "./routes/user.routes.js";

// 2. Import the existing skeleton routes (Do not remove these, they are needed for DevOps tests)
import versionRoute from "./routes/auto/version.route.js";
import infoRoute from "./routes/auto/info.route.js";
import boomRoute from "./routes/auto/boom.route.js";

const app = express();

// 3. Middleware: This allows the app to understand JSON data sent in the request body
// Without this, req.body will be undefined in your controller!
app.use(express.json());

// 4. Register the Routes
app.use("/api/users", userRoutes); // This activates your new feature

// Register the skeleton routes (Keep these)
app.use("/version", versionRoute);
app.use("/info", infoRoute);
app.use("/boom", boomRoute);

// 5. Global Error Handler (Good practice)
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: "Internal Server Error" });
});

export default app;