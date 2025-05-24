// server/routes/account.js
import express from "express";
import bcrypt from "bcryptjs";
// import multer from "multer"; // REMOVE if not used elsewhere
import mongoose from "mongoose";

const router = express.Router();
// const upload = multer(); // REMOVE

// --- Mongoose Models ---
const FoodSchema = new mongoose.Schema({
  name: { type: String, required: true },
  dateAdded: { type: String, required: true }, // Consider using Date type: default: Date.now
  // photo: Buffer, // REMOVE
  // photoType: String, // REMOVE
  weight: { type: Number, default: null }, // Allow null for initial state before weighing
  // Optional textual fields from Food_Item.jsx
  brand: String,
  price: String, // Consider Number if it's a numerical price
  expiration_date: String, // Consider Date type
  // --- New field for on-demand weight capture ---
  isAwaitingScaleInput: { type: Boolean, default: false }
});

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  foods: [FoodSchema],
  group: [String], // Assuming group members are stored as strings (usernames or IDs)
  invitations: [String],
  // --- New field for on-demand weight capture ---
  activeFoodItemIdForWeighing: { type: mongoose.Schema.Types.ObjectId, ref: 'User.foods', default: null }
});
const User = mongoose.model("User", UserSchema);

// In-memory store for the ESP32 POST target.
// For a multi-user/concurrent system, this needs a more robust solution (e.g., Redis, or a DB collection).
// This simple approach assumes one "Get Weight" request is active globally or per user if ESP32 can identify user.
// For simplicity here, we'll target a specific food item marked by the user.

// Register a new user
router.post("/register", async (req, res) => {
  try {
    const existingUser = await User.findOne({ username: req.body.username });
    if (existingUser) {
      return res.status(400).json({ message: "Username already exists" });
    }
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);

    const newUserDoc = await User.create({
      username: req.body.username,
      password: hashedPassword,
      // foods, group, invitations will default to empty arrays
    });

    res.status(201).json({
      message: "User registered successfully",
      userId: newUserDoc._id
    });
  } catch (err) {
    console.error("Error registering user:", err);
    res.status(500).json({ message: "Error creating account" });
  }
});

// Login route
router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ username: req.body.username });
    if (!user) {
      return res.status(401).json({ message: "Invalid username or password" });
    }
    const passwordMatch = await bcrypt.compare(req.body.password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ message: "Invalid username or password" });
    }
    res.status(200).json({
      message: "Login successful",
      userId: user._id,
      username: user.username // Send username back for localStorage
    });
  } catch (err) {
    console.error("Error during login:", err);
    res.status(500).json({ message: "Error during login" });
  }
});

// Get user data (including food items)
router.get("/user/:username", async (req, res) => {
    try {
        const user = await User.findOne({ username: req.params.username });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json(user);
    } catch (err) {
        console.error("Error fetching user data:", err);
        res.status(500).json({ message: "Error fetching user data" });
    }
});


// Add food item
router.post("/add-food", async (req, res) => {
  const { username, foodData } = req.body; // foodData should include name, dateAdded, and optionally brand, price, expiration_date
  if (!username || !foodData || !foodData.name || !foodData.dateAdded) {
    return res.status(400).json({ message: "Missing username or essential food data (name, dateAdded)" });
  }

  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    const newFood = {
      name: foodData.name,
      dateAdded: foodData.dateAdded,
      weight: foodData.weight ? parseFloat(foodData.weight) : null, // Weight can be set now or later
      brand: foodData.brand,
      price: foodData.price,
      expiration_date: foodData.expiration_date,
      isAwaitingScaleInput: false // Default
    };

    user.foods.push(newFood);
    await user.save();
    // Return the newly added food item, including its generated _id
    const addedFoodItem = user.foods[user.foods.length - 1];
    res.status(201).json({ message: "Food added successfully", foodItem: addedFoodItem });
  } catch (err) {
    console.error("Error adding food:", err);
    res.status(500).json({ message: "Error adding food" });
  }
});

// Prepare for scale input: Mark a food item as awaiting weight from scale
router.post("/food-item/:foodId/prepare-for-weighing", async (req, res) => {
    const { username } = req.body; // Assuming username is sent, or get from session/auth
    const { foodId } = req.params;

    if (!username) return res.status(400).json({ message: "Username required" });

    try {
        const user = await User.findOne({ username });
        if (!user) return res.status(404).json({ message: "User not found" });

        const foodItem = user.foods.id(foodId);
        if (!foodItem) return res.status(404).json({ message: "Food item not found" });
        
        // Clear any previous item that might have been awaiting weight for this user
        if(user.activeFoodItemIdForWeighing) {
          const prevFood = user.foods.id(user.activeFoodItemIdForWeighing);
          if(prevFood) prevFood.isAwaitingScaleInput = false;
        }

        foodItem.isAwaitingScaleInput = true;
        user.activeFoodItemIdForWeighing = foodItem._id;
        await user.save();
        
        res.status(200).json({ message: `Food item '${foodItem.name}' is now awaiting weight from scale.`});
    } catch (err) {
        console.error("Error preparing for weighing:", err);
        res.status(500).json({ message: "Error preparing for weighing" });
    }
});

// Endpoint for ESP32 to POST weight
// This is a simplified version. In a real app, you'd need to identify which user/food this weight belongs to.
// Option 1: ESP32 sends a user token/ID (more complex for ESP32).
// Option 2: Backend assumes it's for the user/food item that most recently "prepared for weighing".
router.post("/submit-scale-weight", async (req, res) => {
    const { weight, espId } = req.body; // espId could be used if you have multiple scales/users
    // For now, assume we update the globally last item marked for weighing by *any* user,
    // or more specifically, an item belonging to a user who has an activeFoodItemIdForWeighing.
    // This example finds any user with an activeFoodItemIdForWeighing.
    // A more robust solution would be needed for high concurrency.

    if (typeof weight !== 'number') {
        return res.status(400).json({ message: "Invalid or missing weight" });
    }

    try {
        // Find a user who has an item actively waiting for weight.
        // This is a simplification; a better system would involve specific targeting.
        const user = await User.findOne({ activeFoodItemIdForWeighing: { $ne: null } });

        if (!user || !user.activeFoodItemIdForWeighing) {
            return res.status(404).json({ message: "No food item is currently awaiting weight input." });
        }

        const foodItem = user.foods.id(user.activeFoodItemIdForWeighing);
        if (!foodItem) {
             user.activeFoodItemIdForWeighing = null; // Clean up stale ID
             await user.save();
             return res.status(404).json({ message: "Target food item not found, cleared active flag." });
        }

        foodItem.weight = parseFloat(weight);
        foodItem.isAwaitingScaleInput = false; // Mark as no longer awaiting
        user.activeFoodItemIdForWeighing = null; // Clear the active flag for the user
        
        await user.save();
        res.status(200).json({ message: `Weight ${weight}g submitted for food item '${foodItem.name}'.` });
    } catch (err) {
        console.error("Error submitting scale weight:", err);
        res.status(500).json({ message: "Error processing scale weight" });
    }
});

// Get a specific food item's details (can be used for polling by frontend)
router.get("/food-item/:username/:foodId", async (req, res) => {
    const { username, foodId } = req.params;
    try {
        const user = await User.findOne({ username });
        if (!user) return res.status(404).json({ message: "User not found" });

        const foodItem = user.foods.id(foodId);
        if (!foodItem) return res.status(404).json({ message: "Food item not found" });
        
        res.status(200).json(foodItem);
    } catch (err) {
        console.error("Error fetching food item:", err);
        res.status(500).json({ message: "Error fetching food item" });
    }
});


// Manually update food item (including weight or any other field)
router.patch("/food-item/:username/:foodId", async (req, res) => {
    const { username, foodId } = req.params;
    const updates = req.body; // e.g., { weight: 150, name: "New Name" }

    try {
        const user = await User.findOne({ username });
        if (!user) return res.status(404).json({ message: "User not found" });

        const foodItem = user.foods.id(foodId);
        if (!foodItem) return res.status(404).json({ message: "Food item not found" });

        // Apply updates
        Object.keys(updates).forEach(key => {
            if (key === 'weight' && updates.weight !== null && updates.weight !== undefined) {
                foodItem.weight = parseFloat(updates.weight);
            } else if (key in foodItem && key !== '_id') {
                foodItem[key] = updates[key];
            }
        });

        await user.save();
        res.status(200).json({ message: "Food item updated successfully", foodItem });
    } catch (err) {
        console.error("Error updating food item:", err);
        res.status(500).json({ message: "Error updating food item" });
    }
});


// Delete food from user's list
router.post("/delete-food", async (req, res) => {
  const { username, foodId } = req.body; // Use foodId for more reliable deletion
  if (!username || !foodId) {
    return res.status(400).json({ message: "Missing username or foodId" });
  }
  try {
    const user = await User.findOne({ username });
    if (!user) return res.status(404).json({ message: "User not found" });
    
    const foodItem = user.foods.id(foodId);
    if (!foodItem) return res.status(404).json({ message: "Food item not found to delete" });

    foodItem.deleteOne(); // Mongoose subdocument remove
    await user.save();
    
    res.status(200).json({ message: "Food deleted" });
  } catch (err) {
    console.error("Error deleting food:", err);
    res.status(500).json({ message: "Error deleting food" });
  }
});

export { User }; // Keep User export if server.js needs it directly (it does for the root POST currently)
export default router;