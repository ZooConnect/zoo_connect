import { MongoClient } from 'mongodb';

let client;
let db;

export default async function () {
  if (db) return db;
  const uri = process.env.MONGO_URI;
  if (!uri) throw new Error('MONGO_URI is missing. Create a .env file and add MONGO_URI=');

  client = new MongoClient(uri);
  await client.connect();
  db = client.db();
  return db;
}
