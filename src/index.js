// src/index.js
import app from "./app.js";
import { connectToDb } from "./db/mongo.js"; // Import the function

const port = process.env.PORT || 3000;

async function start() {
  // 1. Connect to DB first
  await connectToDb();

  // 2. Then start the server
  app.listen(port, () => {
    console.log(`API running at http://localhost:${port}`);
  });
}

start();