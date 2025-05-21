// server/routes/account.js
import express from "express";
import bcrypt from "bcrypt"; // You'll need to install this package
import db from "../db/connection.js";
import multer from "multer";
import { Binary } from "mongodb";

const router = express.Router();
const upload = multer();

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

// Add food to user's list
router.post("/add-food", async (req, res) => {
  try {
    const { username, food } = req.body;
    const collection = db.collection("users");
    const result = await collection.updateOne(
      { username },
      { $push: { foods: food } }
    );
    if (result.modifiedCount === 1) {
      res.status(200).json({ message: "Food added" });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (err) {
    res.status(500).json({ message: "Error adding food" });
  }
});

// DEPRECATED: Add user to group (old structure, not used with new roles)
// router.post("/add-to-group", ... );

// Get user data (foods and group, with member roles)
router.get("/user/:username", async (req, res) => {
  try {
    const collection = db.collection("users");
    const user = await collection.findOne(
      { username: req.params.username },
      { projection: { password: 0 } }
    );
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    // If group exists, enrich members with their roles
    if (user.group && user.group.members) {
      user.group.members = user.group.members.map(m => ({ username: m.username, role: m.role }));
    }
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Error fetching user data" });
  }
});

// Create a group
router.post("/group/create", async (req, res) => {
  const { username, groupName } = req.body;
  const collection = db.collection("users");
  // Set group for user
  await collection.updateOne(
    { username },
    {
      $set: {
        group: {
          name: groupName,
          leader: username,
          members: [{ username, role: "owner" }]
        }
      }
    }
  );
  res.json({ message: "Group created" });
});

// Invite member (owner only)
router.post("/group/invite", async (req, res) => {
  const { username, member } = req.body;
  const collection = db.collection("users");
  const leaderUser = await collection.findOne({ username });
  if (!leaderUser?.group || leaderUser.group.leader !== username)
    return res.status(403).json({ message: "Only owner can invite" });

  // Add member as role 'member'
  const groupName = leaderUser.group.name;
  const groupMembers = leaderUser.group.members;
  // Prevent duplicates
  if (groupMembers.some(m => m.username === member)) {
    return res.status(400).json({ message: "User already in group" });
  }
  const newMembers = [...groupMembers, { username: member, role: "member" }];

  // Update group for all current members and new member
  const usernames = newMembers.map(m => m.username);
  await collection.updateMany(
    { username: { $in: usernames } },
    {
      $set: {
        "group.name": groupName,
        "group.leader": username,
        "group.members": newMembers
      }
    }
  );
  res.json({ message: "Member invited" });
});

// Kick member (owner only)
router.post("/group/kick", async (req, res) => {
  const { username, member } = req.body;
  const collection = db.collection("users");
  const leaderUser = await collection.findOne({ username });
  if (!leaderUser?.group || leaderUser.group.leader !== username)
    return res.status(403).json({ message: "Only owner can kick" });

  const groupName = leaderUser.group.name;
  // Remove member object by username
  const newMembers = leaderUser.group.members.filter(m => m.username !== member);

  // Remove group from kicked member
  await collection.updateOne({ username: member }, { $unset: { group: "" } });

  // Update group for remaining members
  const usernames = newMembers.map(m => m.username);
  await collection.updateMany(
    { username: { $in: usernames } },
    {
      $set: {
        "group.name": groupName,
        "group.leader": username,
        "group.members": newMembers
      }
    }
  );
  res.json({ message: "Member kicked" });
});

// Leave group (any member)
router.post("/group/leave", async (req, res) => {
  const { username } = req.body;
  const collection = db.collection("users");
  const user = await collection.findOne({ username });
  if (!user?.group) return res.status(400).json({ message: "Not in group" });

  const groupName = user.group.name;
  const leader = user.group.leader;
  // Remove member object by username
  const members = user.group.members.filter(m => m.username !== username);

  // Remove group from leaving member
  await collection.updateOne({ username }, { $unset: { group: "" } });

  if (username === leader) {
    // If owner leaves, delete group for all
    const usernames = members.map(m => m.username);
    await collection.updateMany(
      { username: { $in: usernames } },
      { $unset: { group: "" } }
    );
    return res.json({ message: "Group deleted (owner left)" });
  } else {
    // Update group for remaining members
    const usernames = members.map(m => m.username);
    await collection.updateMany(
      { username: { $in: usernames } },
      {
        $set: {
          "group.name": groupName,
          "group.leader": leader,
          "group.members": members
        }
      }
    );
    return res.json({ message: "Left group" });
  }
});

// Rename group (owner only)
router.post("/group/rename", async (req, res) => {
  const { username, newName } = req.body;
  const collection = db.collection("users");
  const user = await collection.findOne({ username });
  if (!user?.group || user.group.leader !== username)
    return res.status(403).json({ message: "Only owner can rename" });

  const usernames = user.group.members.map(m => m.username);
  await collection.updateMany(
    { username: { $in: usernames } },
    { $set: { "group.name": newName } }
  );
  res.json({ message: "Group renamed" });
});

// Invite user to group (with existence check)
router.post("/invite-to-group", async (req, res) => {
  const { username, member } = req.body;
  const collection = db.collection("users");

  // Check if invited user exists
  const invitedUser = await collection.findOne({ username: member });
  if (!invitedUser) {
    return res.status(404).json({ message: "User doesn't exist" });
  }

  // Optionally: Add a pending invitation to the invited user's document
  await collection.updateOne(
    { username: member },
    { $addToSet: { invitations: { from: username, date: new Date() } } }
  );

  // You can also notify the inviter that the invite was sent
  res.json({ message: "Invitation sent" });
});

// Upload food photo (store in MongoDB as Buffer)
router.post("/upload-food-photo", upload.single("photo"), async (req, res) => {
  const { username, foodName } = req.body
  const photoBuffer = req.file?.buffer
  if (!username || !foodName || !photoBuffer) {
    return res.status(400).json({ message: "Missing data" })
  }
  const collection = db.collection("users")
  // Store as MongoDB Binary
  await collection.updateOne(
    { username, "foods.name": foodName },
    {
      $set: {
        "foods.$.photo": new Binary(photoBuffer),
        "foods.$.photoUrl": `/account/food-photo/${username}/${encodeURIComponent(foodName)}`
      }
    }
  )
  res.json({ message: "Photo uploaded" })
})

// Serve food photo from MongoDB
router.get("/food-photo/:username/:foodName", async (req, res) => {
  const { username, foodName } = req.params
  const collection = db.collection("users")
  const user = await collection.findOne({ username })
  if (!user || !user.foods) return res.status(404).send("Not found")
  const food = user.foods.find(f => f.name === foodName)
  if (!food || !food.photo) return res.status(404).send("No photo")
  res.set("Content-Type", "image/jpeg")
  // Support both Binary and Buffer
  res.send(food.photo.buffer ? food.photo.buffer : food.photo)
})

export default router;