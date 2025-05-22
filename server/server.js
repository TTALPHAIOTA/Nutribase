import express from "express";
import cors from "cors";
import records from "./routes/record.js";
import accountRoutes from "./routes/account.js"; // Import the account routes
import { User } from "./routes/account.js";
import "./db/connection.js"; // just import it (side effect: runs the connection code)


const PORT = process.env.PORT || 5050;
const app = express();

app.use(cors());
app.use(express.json());
app.use("/record", records);
app.use("/account", accountRoutes); // Register the account routes

app.get('/', (req, res)=> {
  res.send('hello')
})

app.post('/', async (req, res) => {
  const { weight } = req.body;

  if (typeof weight !== "number") {
    return res.status(400).json({ message: "Missing or invalid weight" });
  }

  try {
    // Find the most recently created user (sort by createdAt DESC)
    const user = await User.findOne().sort({ createdAt: -1 });

    if (!user || !user.foods || user.foods.length === 0) {
      return res.status(404).json({ message: "No user or food found" });
    }

    // Get the most recently added food (last item in foods array)
    let food = user.foods[user.foods.length - 1];

    // If the food is a string, convert it to an object
    if (typeof food === "string") {
      food = { name: food };
      // Replace the last item in foods array with the object
      user.foods[user.foods.length - 1] = food;
    }

    // Set the weight
    food.weight = weight;
    await user.save();

    res.json({ message: "Weight updated for the most recent food!", food });
  } catch (err) {
    console.error("Error updating weight:", err);
    res.status(500).json({ message: "Error updating weight" });
  }
});

// start the Express server
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});