import dotenv from 'dotenv';
dotenv.config();

import app from './app.js';
import { connectToDb } from './db/mongo.js';

const PORT = process.env.PORT || 3000;

async function start() {
  await connectToDb();
  app.listen(PORT, () => {
    console.log(`Server listening on http://localhost:${PORT}`);
  });
}

start();