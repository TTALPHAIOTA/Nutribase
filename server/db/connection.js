// Updated db/connection.js
import dotenv from "dotenv"
import { MongoClient, ServerApiVersion } from "mongodb";

dotenv.config()

const uri = process.env.ATLAS_URI || "";
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

// Create a variable to track connection status
let connected = false;
let db;

async function connectToDatabase() {
  if (!connected) {
    try {
      // Connect the client to the server
      await client.connect();
      // Send a ping to confirm a successful connection
      await client.db("admin").command({ ping: 1 });
      console.log("Pinged your deployment. You successfully connected to MongoDB!");
      
      // Set the database for our application
      db = client.db("foodTracker"); // Change to your actual database name
      connected = true;
    } catch(err) {
      console.error("Database connection error:", err);
      throw err; // Rethrow to be handled by the caller
    }
  }
  return db;
}

// Initial connection attempt
connectToDatabase().catch(console.error);

export default {
  getDb: () => {
    if (!connected) {
      throw new Error("Database not connected");
    }
    return db;
  },
  collection: (name) => {
    if (!connected) {
      throw new Error("Database not connected");
    }
    return db.collection(name);
  },
  close: async () => {
    if (connected) {
      await client.close();
      connected = false;
    }
  }
};