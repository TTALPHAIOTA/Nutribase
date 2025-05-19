import dotenv from "dotenv";
import { MongoClient, ServerApiVersion } from "mongodb";

dotenv.config();

const uri = process.env.ATLAS_URI;
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

let db;

async function connectDB() {
  if (db) return db; // already connected

  try {
    await client.connect();
    console.log("✅ Connected to MongoDB!");

    db = client.db("employees");

    const collections = await db.listCollections({ name: "accounts" }).toArray();
    if (collections.length === 0) {
      await db.createCollection("accounts");
      await db.collection("accounts").createIndex({ username: 1 }, { unique: true });
    }

    return db;
  } catch (err) {
    console.error("❌ MongoDB connection error:", err);
    throw err;
  }
}

export default connectDB;
