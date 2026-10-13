import { mkdirSync } from "node:fs";
import { dirname } from "node:path";
import { DatabaseSync } from "node:sqlite";

const DB_PATH = process.env.DB_PATH ?? "./data/whitelist.db";

mkdirSync(dirname(DB_PATH), { recursive: true });

const db = new DatabaseSync(DB_PATH);

db.exec(`
  CREATE TABLE IF NOT EXISTS whitelist (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id TEXT NOT NULL,
    name TEXT NOT NULL,
    username TEXT NOT NULL COLLATE NOCASE UNIQUE,
    student_number TEXT NOT NULL UNIQUE,
    pvp INTEGER NOT NULL,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );
`);

export interface WhitelistEntry {
  id: number;
  userId: string;
  name: string;
  username: string;
  studentNumber: string;
  pvp: boolean;
  createdAt: string;
}

export function usernameWhitelisted(username: string): boolean {
  return db.prepare("SELECT 1 FROM whitelist WHERE username = ? LIMIT 1").get(username) !== undefined;
}

export function studentNumberWhitelisted(studentNumber: string): boolean {
  return db.prepare("SELECT 1 FROM whitelist WHERE student_number = ? LIMIT 1").get(studentNumber) !== undefined;
}

export function addWhitelistEntry(entry: Omit<WhitelistEntry, "id" | "createdAt">): void {
  db.prepare(
    "INSERT INTO whitelist (user_id, name, username, student_number, pvp) VALUES (?, ?, ?, ?, ?)",
  ).run(entry.userId, entry.name, entry.username, entry.studentNumber, entry.pvp ? 1 : 0);
}

export function getWhitelistedUsernames(): string[] {
  const rows = db.prepare("SELECT username FROM whitelist ORDER BY created_at ASC").all() as { username: string }[];
  return rows.map((row) => row.username);
}
