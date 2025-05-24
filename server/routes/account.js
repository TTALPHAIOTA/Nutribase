// server/routes/account.js
import express from "express";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import multer from "multer"; // Make sure multer is installed

const router = express.Router();
const upload = multer({
    limits: { fileSize: 5 * 1024 * 1024 } // Limit profile pic size to 5MB
});


// --- Mongoose Models ---
const FoodSchema = new mongoose.Schema({
  name: { type: String, required: true },
  dateAdded: { type: String, required: true },
  weight: { type: Number, default: null },
  brand: String,
  price: String,
  expiration_date: String,
  isAwaitingScaleInput: { type: Boolean, default: false }
});

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  foods: [FoodSchema],
  group: [{ type: String }], // Array of usernames
  // invitations: [String], // You can expand on this later if needed
  activeFoodItemIdForWeighing: { type: mongoose.Schema.Types.ObjectId, ref: 'User.foods', default: null },
  // --- New fields for profile picture ---
  profilePicture: { type: Buffer, default: null },
  profilePictureType: { type: String, default: null } // e.g., 'image/jpeg'
});
const User = mongoose.model("User", UserSchema);

// ... (register, login, food routes remain largely the same as previous version) ...
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
      group: [] // Initialize group as an empty array
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
      username: user.username
    });
  } catch (err) {
    console.error("Error during login:", err);
    res.status(500).json({ message: "Error during login" });
  }
});

// Get user data (including food items and group)
router.get("/user/:username", async (req, res) => {
    try {
        const user = await User.findOne({ username: req.params.username }).select('-password'); // Exclude password
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
  const { username, foodData } = req.body;
  if (!username || !foodData || !foodData.name || !foodData.dateAdded) {
    return res.status(400).json({ message: "Missing username or essential food data (name, dateAdded)" });
  }
  try {
    const user = await User.findOne({ username });
    if (!user) return res.status(404).json({ message: "User not found" });
    const newFood = { ...foodData, isAwaitingScaleInput: false };
    user.foods.push(newFood);
    await user.save();
    const addedFoodItem = user.foods[user.foods.length - 1];
    res.status(201).json({ message: "Food added successfully", foodItem: addedFoodItem });
  } catch (err) {
    console.error("Error adding food:", err);
    res.status(500).json({ message: "Error adding food" });
  }
});

// Prepare for scale input
router.post("/food-item/:foodId/prepare-for-weighing", async (req, res) => {
  const { username } = req.body;
  const { foodId } = req.params;
  if (!username) return res.status(400).json({ message: "Username required" });
  try {
    const user = await User.findOne({ username });
    if (!user) return res.status(404).json({ message: "User not found" });
    const foodItem = user.foods.id(foodId);
    if (!foodItem) return res.status(404).json({ message: "Food item not found" });
    if (user.activeFoodItemIdForWeighing) {
      const prevFood = user.foods.id(user.activeFoodItemIdForWeighing);
      if (prevFood) prevFood.isAwaitingScaleInput = false;
    }
    foodItem.isAwaitingScaleInput = true;
    user.activeFoodItemIdForWeighing = foodItem._id;
    await user.save();
    res.status(200).json({ message: `Food item '${foodItem.name}' is now awaiting weight from scale.` });
  } catch (err) {
    console.error("Error preparing for weighing:", err);
    res.status(500).json({ message: "Error preparing for weighing" });
  }
});

// Submit scale weight
router.post("/submit-scale-weight", async (req, res) => {
  const { weight } = req.body;
  if (typeof weight !== 'number') {
    return res.status(400).json({ message: "Invalid or missing weight" });
  }
  try {
    const user = await User.findOne({ activeFoodItemIdForWeighing: { $ne: null } });
    if (!user || !user.activeFoodItemIdForWeighing) {
      return res.status(404).json({ message: "No food item is currently awaiting weight input." });
    }
    const foodItem = user.foods.id(user.activeFoodItemIdForWeighing);
    if (!foodItem) {
      user.activeFoodItemIdForWeighing = null;
      await user.save();
      return res.status(404).json({ message: "Target food item not found, cleared active flag." });
    }
    foodItem.weight = parseFloat(weight);
    foodItem.isAwaitingScaleInput = false;
    user.activeFoodItemIdForWeighing = null;
    await user.save();
    res.status(200).json({ message: `Weight ${weight}g submitted for food item '${foodItem.name}'.` });
  } catch (err) {
    console.error("Error submitting scale weight:", err);
    res.status(500).json({ message: "Error processing scale weight" });
  }
});

// Get a specific food item's details
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

// Manually update food item
router.patch("/food-item/:username/:foodId", async (req, res) => {
  const { username, foodId } = req.params;
  const updates = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user) return res.status(404).json({ message: "User not found" });
    const foodItem = user.foods.id(foodId);
    if (!foodItem) return res.status(404).json({ message: "Food item not found" });
    Object.keys(updates).forEach(key => {
      if (key === 'weight' && (updates.weight !== null && updates.weight !== undefined)) {
        foodItem.weight = parseFloat(updates.weight);
      } else if (foodItem[key] !== undefined && key !== '_id') {
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
  const { username, foodId } = req.body;
  if (!username || !foodId) {
    return res.status(400).json({ message: "Missing username or foodId" });
  }
  try {
    const user = await User.findOne({ username });
    if (!user) return res.status(404).json({ message: "User not found" });
    const foodItem = user.foods.id(foodId);
    if (!foodItem) return res.status(404).json({ message: "Food item not found to delete" });
    
    // Mongoose way to remove subdocument
    user.foods.pull(foodId); // or foodItem.remove() then user.save() if pull isn't working as expected.
                              // For pull to work correctly with _id, it's often direct.
                              // If `foodItem.deleteOne()` was used, ensure it's compatible with your Mongoose version.
                              // `user.foods.pull({ _id: foodId })` is another common way.

    await user.save();
    res.status(200).json({ message: "Food deleted" });
  } catch (err) {
    console.error("Error deleting food:", err);
    res.status(500).json({ message: "Error deleting food" });
  }
});


// --- Group Management Routes ---
router.post("/group/add", async (req, res) => {
  const { currentUsername, memberUsernameToAdd } = req.body;

  if (!currentUsername || !memberUsernameToAdd) {
    return res.status(400).json({ message: "Both current user and member to add are required." });
  }
  if (currentUsername === memberUsernameToAdd) {
    return res.status(400).json({ message: "Cannot add yourself to your group." });
  }

  try {
    const currentUser = await User.findOne({ username: currentUsername });
    if (!currentUser) {
      return res.status(404).json({ message: "Current user not found." });
    }

    const memberToAdd = await User.findOne({ username: memberUsernameToAdd });
    if (!memberToAdd) {
      return res.status(404).json({ message: `User '${memberUsernameToAdd}' not found.` });
    }

    if (currentUser.group.includes(memberUsernameToAdd)) {
      return res.status(400).json({ message: `${memberUsernameToAdd} is already in your group.` });
    }

    currentUser.group.push(memberUsernameToAdd);
    // Also add current user to the other person's group (two-way relationship for simplicity)
    if (!memberToAdd.group.includes(currentUsername)) {
        memberToAdd.group.push(currentUsername);
        await memberToAdd.save();
    }
    await currentUser.save();

    res.status(200).json({ message: `${memberUsernameToAdd} added to group.`, group: currentUser.group });
  } catch (err) {
    console.error("Error adding to group:", err);
    res.status(500).json({ message: "Error adding member to group." });
  }
});

router.post("/group/remove", async (req, res) => {
  const { currentUsername, memberUsernameToRemove } = req.body;

  if (!currentUsername || !memberUsernameToRemove) {
    return res.status(400).json({ message: "Both current user and member to remove are required." });
  }

  try {
    const currentUser = await User.findOne({ username: currentUsername });
    if (!currentUser) {
      return res.status(404).json({ message: "Current user not found." });
    }

    const initialGroupSize = currentUser.group.length;
    currentUser.group = currentUser.group.filter(member => member !== memberUsernameToRemove);

    if (currentUser.group.length === initialGroupSize) {
        return res.status(404).json({ message: `${memberUsernameToRemove} not found in your group.` });
    }
    
    // Also remove current user from the other person's group
    const memberToRemove = await User.findOne({ username: memberUsernameToRemove });
    if (memberToRemove) {
        memberToRemove.group = memberToRemove.group.filter(member => member !== currentUsername);
        await memberToRemove.save();
    }

    await currentUser.save();
    res.status(200).json({ message: `${memberUsernameToRemove} removed from group.`, group: currentUser.group });
  } catch (err) {
    console.error("Error removing from group:", err);
    res.status(500).json({ message: "Error removing member from group." });
  }
});


// --- Profile Picture Routes ---
router.post("/user/:username/profile-picture", upload.single("profilePic"), async (req, res) => {
    const { username } = req.params;
    if (!req.file) {
        return res.status(400).json({ message: "No profile picture file uploaded." });
    }

    try {
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        user.profilePicture = req.file.buffer;
        user.profilePictureType = req.file.mimetype;
        await user.save();

        res.status(200).json({ message: "Profile picture updated successfully." });
    } catch (err) {
        console.error("Error uploading profile picture:", err);
        res.status(500).json({ message: "Error uploading profile picture." });
    }
});

router.get("/user/:username/profile-picture", async (req, res) => {
    const { username } = req.params;
    try {
        const user = await User.findOne({ username });
        if (!user || !user.profilePicture || !user.profilePictureType) {
            // return res.status(404).json({ message: "Profile picture not found." });
            // Instead of 404, you might want to send a default image or let frontend handle it
            return res.status(404).send(); // Send empty 404
        }
        res.set("Content-Type", user.profilePictureType);
        res.send(user.profilePicture);
    } catch (err) {
        console.error("Error fetching profile picture:", err);
        res.status(500).json({ message: "Error fetching profile picture." });
    }
});

router.post("/group/add", async (req, res) => {
  const { currentUsername, memberUsernameToAdd } = req.body;

  if (!currentUsername || !memberUsernameToAdd) {
    return res.status(400).json({ message: "Both current user and member to add are required." });
  }
  if (currentUsername === memberUsernameToAdd) {
    return res.status(400).json({ message: "Cannot add yourself to your group." });
  }

  try {
    const currentUser = await User.findOne({ username: currentUsername });
    if (!currentUser) {
      return res.status(404).json({ message: `User '${currentUsername}' not found.` });
    }

    const memberToAdd = await User.findOne({ username: memberUsernameToAdd });
    if (!memberToAdd) {
      return res.status(404).json({ message: `User '${memberUsernameToAdd}' not found and cannot be added.` });
    }

    // Add memberUsernameToAdd to currentUsername's group if not already present
    if (!currentUser.group.includes(memberUsernameToAdd)) {
      currentUser.group.push(memberUsernameToAdd);
    } else {
      return res.status(400).json({ message: `${memberUsernameToAdd} is already in your group.` });
    }
    
    // Add currentUsername to memberUsernameToAdd's group if not already present (for mutual sharing)
    if (!memberToAdd.group.includes(currentUsername)) {
      memberToAdd.group.push(currentUsername);
      await memberToAdd.save(); // Save the other user's document
    }

    await currentUser.save(); // Save the current user's document

    res.status(200).json({ 
        message: `${memberUsernameToAdd} added to your group. You are also added to their group.`, 
        group: currentUser.group 
    });
  } catch (err) {
    console.error("Error adding to group:", err);
    res.status(500).json({ message: "Server error while adding member to group." });
  }
});

router.post("/group/remove", async (req, res) => {
  const { currentUsername, memberUsernameToRemove } = req.body;

  if (!currentUsername || !memberUsernameToRemove) {
    return res.status(400).json({ message: "Both current user and member to remove are required." });
  }

  try {
    const currentUser = await User.findOne({ username: currentUsername });
    if (!currentUser) {
      return res.status(404).json({ message: `User '${currentUsername}' not found.` });
    }

    const initialGroupSizeCurrentUser = currentUser.group.length;
    currentUser.group = currentUser.group.filter(member => member !== memberUsernameToRemove);

    if (currentUser.group.length === initialGroupSizeCurrentUser) {
        // This means the member wasn't in the current user's group to begin with.
        // Still proceed to remove currentUsername from the other user's group for consistency,
        // or return an error if strict two-way sync is expected.
        // For simplicity, we'll just proceed.
    }
    
    // Also remove currentUsername from memberUsernameToRemove's group
    const memberToRemove = await User.findOne({ username: memberUsernameToRemove });
    if (memberToRemove) {
        const initialGroupSizeMemberToRemove = memberToRemove.group.length;
        memberToRemove.group = memberToRemove.group.filter(member => member !== currentUsername);
        if (memberToRemove.group.length < initialGroupSizeMemberToRemove) {
            await memberToRemove.save();
        }
    }

    await currentUser.save();
    res.status(200).json({ 
        message: `${memberUsernameToRemove} removed from your group. You have also been removed from their group.`, 
        group: currentUser.group 
    });
  } catch (err) {
    console.error("Error removing from group:", err);
    res.status(500).json({ message: "Server error while removing member from group." });
  }
});

export { User };
export default router;