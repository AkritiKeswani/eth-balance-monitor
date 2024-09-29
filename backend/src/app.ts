import express, { Express, Request, Response } from "express";
import axios, { AxiosResponse } from "axios";
import { ethers } from "ethers";
import sqlite3 from "sqlite3";
import { open } from "sqlite";
import path from "path";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app: Express = express();
app.use(cors());

const port: number = parseInt(process.env.PORT || "3000", 10);

const BASE_RPC_URL: string =
  process.env.BASE_RPC_URL || "https://mainnet.base.org";
const MONITOR_ADDRESS: string =
  process.env.MONITOR_ADDRESS || "0x49048044D57e1C92A77f79988d21Fa8fAF74E97e";
const CHECK_INTERVAL: number = parseInt(
  process.env.CHECK_INTERVAL || "10000",
  10
);
const DB_PATH: string = path.join(__dirname, "balance_history.db");

interface RPCResponse {
  jsonrpc: string;
  id: number;
  result: string;
}

interface BalanceRecord {
  id: number;
  address: string;
  balance: number;
  timestamp: string;
}

async function initializeDatabase() {
  const db = await open({
    filename: DB_PATH,
    driver: sqlite3.Database,
  });

  await db.exec(`
    CREATE TABLE IF NOT EXISTS balance_history (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      address TEXT,
      balance REAL,
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  return db;
}

async function getEthBalance(address: string): Promise<number | null> {
  try {
    const response: AxiosResponse<RPCResponse> = await axios.post(
      BASE_RPC_URL,
      {
        jsonrpc: "2.0",
        method: "eth_getBalance",
        params: [address, "latest"],
        id: 1,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const balanceWei = BigInt(response.data.result);
    const balanceEth = Number(ethers.formatEther(balanceWei));
    return balanceEth;
  } catch (error) {
    console.error("Error fetching ETH balance:", error);
    return null;
  }
}

async function storeBalanceInDB(db: any, address: string, balance: number) {
  await db.run("INSERT INTO balance_history (address, balance) VALUES (?, ?)", [
    address,
    balance,
  ]);
}

async function getBalanceHistory(
  db: any,
  hours: number
): Promise<BalanceRecord[]> {
  const query = `
    SELECT *
    FROM balance_history
    WHERE address = ? AND timestamp >= datetime('now', '-' || ? || ' hours')
    ORDER BY timestamp DESC
  `;
  const results = await db.all(query, [MONITOR_ADDRESS, hours]);
  return results as BalanceRecord[];
}

async function startBalanceCheck(db: any): Promise<void> {
  setInterval(async () => {
    const balance = await getEthBalance(MONITOR_ADDRESS);
    if (balance !== null) {
      const timestamp = new Date().toISOString();
      console.log(
        `[${timestamp}] Current ETH Balance for ${MONITOR_ADDRESS}: ${balance}`
      );
      await storeBalanceInDB(db, MONITOR_ADDRESS, balance);
    }
  }, CHECK_INTERVAL);
}

async function main() {
  try {
    const db = await initializeDatabase();
    console.log("Database initialized successfully");

    app.get("/", (req: Request, res: Response) => {
      res.send("ETH Balance Monitor API");
    });

    app.get("/balance", async (req: Request, res: Response) => {
      const balance = await getEthBalance(MONITOR_ADDRESS);
      if (balance !== null) {
        res.json({
          address: MONITOR_ADDRESS,
          balance: balance,
          timestamp: new Date().toISOString(),
        });
      } else {
        res.status(500).json({ error: "Failed to fetch balance" });
      }
    });

    app.get("/history", async (req: Request, res: Response) => {
      try {
        const hours = parseInt(req.query.hours as string, 10) || 24;
        const history = await getBalanceHistory(db, hours);
        res.json(history);
      } catch (error) {
        console.error("Error fetching balance history:", error);
        res.status(500).json({ error: "Failed to fetch balance history" });
      }
    });

    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
      console.log(`Monitoring address: ${MONITOR_ADDRESS}`);
      console.log(`Check interval: ${CHECK_INTERVAL}ms`);
      startBalanceCheck(db);
    });
  } catch (error) {
    console.error("Failed to initialize the application:", error);
  }
}

main().catch(console.error);
