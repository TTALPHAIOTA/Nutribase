import express from "express";
import bcrypt from "bcrypt";
import db from "../db/connection.js";

// This help convert the id from string to ObjectId for the _id.
import { ObjectId } from "mongodb";

// router is an instance of the express router.
const router = express.Router();

// This section will help you register a new user
router.post("/register", async (req, res) => {
  try {
    // Validate request body
    if (!req.body.username || !req.body.password) {
      return res.status(400).send("Username and password are required");
    }

    // Check if username already exists
    let collection = await db.collection("accounts");
    const existingUser = await collection.findOne({ username: req.body.username });
    if (existingUser) {
      return res.status(409).send("Username already exists");
    }

    // Hash the password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);

    // Create new user document
    const newUser = {
      username: req.body.username,
      password: hashedPassword,
      createdAt: new Date()
    };

    // Insert new user
    const result = await collection.insertOne(newUser);
    
    // Return success without sending back the password
    res.status(201).json({
      id: result.insertedId,
      username: newUser.username,
      createdAt: newUser.createdAt
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error creating account");
  }
});

// This section will help you login
router.post("/login", async (req, res) => {
  try {
    // Validate request body
    if (!req.body.username || !req.body.password) {
      return res.status(400).send("Username and password are required");
    }

    // Find user by username
    let collection = await db.collection("accounts");
    const user = await collection.findOne({ username: req.body.username });
    
    // Check if user exists
    if (!user) {
      return res.status(401).send("Invalid username or password");
    }

    // Compare passwords
    const isPasswordValid = await bcrypt.compare(req.body.password, user.password);
    if (!isPasswordValid) {
      return res.status(401).send("Invalid username or password");
    }

    // Return success without sending back the password
    res.status(200).json({
      id: user._id,
      username: user.username
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error during login");
  }
});

// Get user by ID
router.get("/:id", async (req, res) => {
  try {
    let collection = await db.collection("accounts");
    let query = { _id: new ObjectId(req.params.id) };
    let user = await collection.findOne(query, { projection: { password: 0 } });  // Exclude password

    if (!user) {
      return res.status(404).send("User not found");
    }
    
    res.status(200).json(user);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching user");
  }
});

// Get all users (excluding passwords)
router.get("/", async (req, res) => {
  try {
    let collection = await db.collection("accounts");
    let users = await collection.find({}, { projection: { password: 0 } }).toArray();  // Exclude passwords
    res.status(200).json(users);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching users");
  }
});

// Delete user account
router.delete("/:id", async (req, res) => {
  try {
    const query = { _id: new ObjectId(req.params.id) };
    const collection = db.collection("accounts");
    const result = await collection.deleteOne(query);

    if (result.deletedCount === 0) {
      return res.status(404).send("User not found");
    }

    res.status(200).json({ message: "User successfully deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error deleting user");
  }
});

// Update user (excluding password updates)
router.patch("/:id", async (req, res) => {
  try {
    const query = { _id: new ObjectId(req.params.id) };
    
    // Don't allow password updates through this endpoint for security
    const { password, ...updates } = req.body;
    
    if (Object.keys(updates).length === 0) {
      return res.status(400).send("No valid fields to update");
    }

    const collection = db.collection("accounts");
    const result = await collection.updateOne(query, { $set: updates });

    if (result.matchedCount === 0) {
      return res.status(404).send("User not found");
    }

    res.status(200).json({ message: "User updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error updating user");
  }
});

// Change password endpoint (requires old password verification)
router.post("/change-password/:id", async (req, res) => {
  try {
    if (!req.body.oldPassword || !req.body.newPassword) {
      return res.status(400).send("Old password and new password are required");
    }

    const collection = db.collection("accounts");
    const user = await collection.findOne({ _id: new ObjectId(req.params.id) });

    if (!user) {
      return res.status(404).send("User not found");
    }

    // Verify old password
    const isPasswordValid = await bcrypt.compare(req.body.oldPassword, user.password);
    if (!isPasswordValid) {
      return res.status(401).send("Incorrect old password");
    }

    // Hash the new password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(req.body.newPassword, saltRounds);

    // Update the password
    const result = await collection.updateOne(
      { _id: new ObjectId(req.params.id) },
      { $set: { password: hashedPassword } }
    );

    res.status(200).json({ message: "Password changed successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error changing password");
  }
});

export default router;