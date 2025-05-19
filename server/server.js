// Updated server/server.js
import express from "express";
import cors from "cors";
import records from "./routes/record.js";
import accountRoutes from "./routes/account.js"; // Import the account routes

const PORT = process.env.PORT || 5050;
const app = express();

app.use(cors());
app.use(express.json());
app.use("/record", records);
app.use("/account", accountRoutes); // Register the account routes

// start the Express server
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});