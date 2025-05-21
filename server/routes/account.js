// server/routes/account.js
import express from "express";
import bcrypt from "bcryptjs";
import db from "../db/connection.js";
import multer from "multer";
import mongoose from "mongoose";

const router = express.Router();
const upload = multer();

// --- Mongoose Models ---
const FoodSchema = new mongoose.Schema({
  name: String,
  dateAdded: String,
  photo: Buffer,
  photoType: String,
});
const UserSchema = new mongoose.Schema({
  username: String,
  foods: [FoodSchema],
});
const User = mongoose.model("User", UserSchema);

// Register a new user
router.post("/register", async (req, res) => {
  try {
    // Use the exported collection function
    const collection = db.collection("users");
    
    // Check if username already exists
    const existingUser = await collection.findOne({ username: req.body.username });
    if (existingUser) {
      return res.status(400).send("Username already exists");
    }
    
    // Hash the password before storing
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);
    
    // Create new user document
    const newUser = {
      username: req.body.username,
      password: hashedPassword,
      createdAt: new Date(),
      foods: [],
      group: []
    };
    
    // Insert the user into database
    const result = await collection.insertOne(newUser);
    
    // Return success without including password
    res.status(201).send({
      message: "User registered successfully",
      userId: result.insertedId
    });
  } catch (err) {
    console.error("Error registering user:", err);
    res.status(500).send("Error creating account");
  }
});

// Login route
router.post("/login", async (req, res) => {
  try {
    const collection = db.collection("users");
    const user = await collection.findOne({ username: req.body.username });
    if (!user) {
      return res.status(401).json({ message: "Invalid username or password" });
    }
    const passwordMatch = await bcrypt.compare(req.body.password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ message: "Invalid username or password" });
    }
    res.status(200).json({
      message: "Login successful",
      userId: user._id
    });
  } catch (err) {
    console.error("Error during login:", err);
    res.status(500).json({ message: "Error during login" });
  }
});

// --- Add food (without photo) ---
router.post("/add-food", async (req, res) => {
  const { username, food } = req.body;
  let user = await User.findOne({ username });
  if (!user) user = await User.create({ username, foods: [] });
  user.foods.push(food);
  await user.save();
  res.json({ message: "Food added" });
});

// --- Upload food photo ---
router.post("/upload-food-photo", upload.single("photo"), async (req, res) => {
  const { username, foodName } = req.body;
  const user = await User.findOne({ username });
  if (!user) return res.status(404).json({ message: "User not found" });
  const food = user.foods.find(f => f.name === foodName);
  if (!food) return res.status(404).json({ message: "Food not found" });
  food.photo = req.file.buffer;
  food.photoType = req.file.mimetype;
  await user.save();
  res.json({ message: "Photo uploaded" });
});

// --- Serve food photo ---
router.get("/food-photo/:username/:foodName", async (req, res) => {
  const { username, foodName } = req.params;
  const user = await User.findOne({ username });
  if (!user) return res.status(404).end();
  const food = user.foods.find(f => f.name === foodName);
  if (!food || !food.photo) return res.status(404).end();
  res.set("Content-Type", food.photoType || "image/jpeg");
  res.send(food.photo);
});

// Delete food from user's list
router.post("/delete-food", async (req, res) => {
  const { username, foodName, dateAdded } = req.body;
  if (!username || !foodName || !dateAdded) {
    return res.status(400).json({ message: "Missing username, foodName, or dateAdded" });
  }
  const collection = db.collection("users");
  const result = await collection.updateOne(
    { username },
    { $pull: { foods: { name: foodName, dateAdded: dateAdded } } }
  );
  if (result.modifiedCount === 1) {
    res.status(200).json({ message: "Food deleted" });
  } else {
    res.status(404).json({ message: "Food not found" });
  }
});

export default router;