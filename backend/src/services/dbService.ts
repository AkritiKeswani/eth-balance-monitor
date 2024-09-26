import { Database } from "sqlite3";

const db = new Database("wallets.sqlite");

export function initializeDatabase(): Promise<void> {
  return new Promise((resolve, reject) => {
    db.run(
      `CREATE TABLE IF NOT EXISTS wallet_balances (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      wallet_address TEXT,
      balance TEXT,
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
    )`,
      (err) => {
        if (err) reject(err);
        else resolve();
      }
    );
  });
}

export function insertBalance(address: string, balance: string): Promise<void> {
  return new Promise((resolve, reject) => {
    db.run(
      "INSERT INTO wallet_balances (wallet_address, balance) VALUES (?, ?)",
      [address, balance],
      (err) => {
        if (err) reject(err);
        else resolve();
      }
    );
  });
}

export function getBalances(
  address: string,
  startTime: Date,
  endTime: Date
): Promise<any[]> {
  return new Promise((resolve, reject) => {
    db.all(
      "SELECT * FROM wallet_balances WHERE wallet_address = ? AND timestamp BETWEEN ? AND ?",
      [address, startTime.toISOString(), endTime.toISOString()],
      (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      }
    );
  });
}
