// server/routes/account.js
import express from "express";
import bcrypt from "bcrypt"; // You'll need to install this package
import db from "../db/connection.js";

const router = express.Router();

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
      createdAt: new Date()
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

export default router;