// db/connection.js
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const uri =
  process.env.MONGODB_URI ||
  "mongodb+srv://ThiccmanEmanuel:AlphaIota@alphaiota.7s3swar.mongodb.net/foodTracker?retryWrites=true&w=majority&appName=ALPHAIOTA";

// Connect to MongoDB with Mongoose
mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

db.on("connected", () => {
  console.log("Connected to MongoDB (via Mongoose)!");
});
db.on("error", (err) => {
  console.error("MongoDB connection error:", err);
});

export default mongoose;
