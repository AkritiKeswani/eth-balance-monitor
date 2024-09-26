import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cron from "node-cron";
import { getEthBalance } from "./services/ethService";
import {
  initializeDatabase,
  insertBalance,
  getBalances,
} from "./services/dbService";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Initialize database
initializeDatabase()
  .then(() => {
    console.log("Database initialized");
  })
  .catch(console.error);

// Root route
app.get("/", (req, res) => {
  res.send("ETH Balance Monitor API is running");
});

// API endpoint to get balance history
app.get("/api/balances/:address", async (req, res) => {
  const { address } = req.params;
  const { start, end } = req.query;

  try {
    const startDate = new Date(start as string);
    const endDate = new Date(end as string);
    const balances = await getBalances(address, startDate, endDate);
    res.json(balances);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch balances" });
  }
});

// Scheduled job to fetch and store balances
const WALLET_ADDRESS = process.env.WALLET_ADDRESS;

if (!WALLET_ADDRESS) {
  console.error("WALLET_ADDRESS is not set in environment variables");
  process.exit(1);
}

cron.schedule("*/5 * * * *", async () => {
  try {
    const balance = await getEthBalance(WALLET_ADDRESS);
    await insertBalance(WALLET_ADDRESS, balance);
    console.log(`Updated balance for ${WALLET_ADDRESS}: ${balance} ETH`);
  } catch (error) {
    console.error("Failed to update balance:", error);
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
