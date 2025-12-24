
// src/db.js
import { MongoClient } from 'mongodb';

let client;
let db;

export async function connectDB() {
  if (db) return db;
  const uri = process.env.MONGO_URI;
  if (!uri) throw new Error('MONGO_URI is missing. Create a .env file and add MONGO_URI=');

  client = new MongoClient(uri);
  await client.connect();
  db = client.db(); // uses the db name from your URI (/zoo_connect_test)
  return db;
}

export async function getDB() {
  if (!db) await connectDB();
  return db;
}
