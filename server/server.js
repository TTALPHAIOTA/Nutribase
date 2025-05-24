import express from "express";
import cors from "cors";
import records from "./routes/record.js";
import accountRoutes from "./routes/account.js";
// import { User } from "./routes/account.js"; // No longer needed here if POST / is removed
import "./db/connection.js";

const PORT = process.env.PORT || 5050;
const app = express();

app.use(cors());
app.use(express.json());
app.use("/record", records); // Keep if used, otherwise can be removed
app.use("/account", accountRoutes);

app.get('/', (req, res)=> {
  res.send('hello from Smart Food Tracker API');
});

// REMOVE THIS GENERIC POST / ROUTE or adapt it to use the new system
/*
app.post('/', async (req, res) => {
  const { weight } = req.body;

  if (typeof weight !== "number") {
    return res.status(400).json({ message: "Missing or invalid weight" });
  }

  // This logic is flawed for multi-user or specific item targeting.
  // It should be replaced by the new /account/submit-scale-weight
  // and the frontend "Get Weight" flow.
  
  // Example of how it *could* work if ESP32 sends a user identifier
  // const { weight, userIdForScale } = req.body;
  // if (!userIdForScale) return res.status(400).json({ message: "userIdForScale is required"});
  // const user = await User.findById(userIdForScale); // Or findOne({ some_esp_identifier_field: espId })
  // ... then find the food item marked with isAwaitingScaleInput = true ...

  try {
    // This old logic is problematic:
    // const user = await User.findOne().sort({ createdAt: -1 });
    // if (!user || !user.foods || user.foods.length === 0) {
    //   return res.status(404).json({ message: "No user or food found for legacy update" });
    // }
    // let food = user.foods[user.foods.length - 1];
    // if (typeof food === "string") {
    //   food = { name: food };
    //   user.foods[user.foods.length - 1] = food;
    // }
    // food.weight = weight;
    // await user.save();
    // res.json({ message: "Legacy weight update (NEEDS REFACTOR)", food });

    res.status(410).json({ message: "This generic weight submission endpoint is deprecated. Please use /account/submit-scale-weight after preparing an item." });

  } catch (err) {
    console.error("Error updating weight (legacy endpoint):", err);
    res.status(500).json({ message: "Error updating weight (legacy endpoint)" });
  }
});
*/

// start the Express server
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});