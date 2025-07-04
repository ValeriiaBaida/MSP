import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

// create data directory if it doesn't exist
const dataDir = path.join(__dirname, '../../data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir);
}

// Create / open sqlite database inside /data/users.db
const db = new Database(path.join(__dirname, '../../data/users.db'));

// Initialization of tables (if they don't exist)
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL
  );
`);

db.exec(`
    CREATE TABLE IF NOT EXISTS user_preferences (
      email TEXT NOT NULL,
      setting TEXT NOT NULL,
      value TEXT NOT NULL,
      PRIMARY KEY (email, setting)
    );
  `);

db.exec(`
    CREATE TABLE IF NOT EXISTS bookmarks (
      email TEXT NOT NULL,
      bookmark_name TEXT NOT NULL,
      bookmark_value TEXT NOT NULL,
      PRIMARY KEY (email, bookmark_name)
    );
  `);

  db.exec(`
    CREATE TABLE IF NOT EXISTS recent_destinations (
      email TEXT NOT NULL,
      destination_name TEXT NOT NULL,
      destination_value TEXT NOT NULL,
      created_at INTEGER NOT NULL,
      PRIMARY KEY (email, destination_name)
    );
  `);

db.exec(`
  CREATE TABLE IF NOT EXISTS user_statistics (
    email TEXT PRIMARY KEY,
    avg_speed REAL DEFAULT 47,
    active_days INTEGER DEFAULT 1,
    last_active_date TEXT NOT NULL DEFAULT (date('now'))
  );
`);

export default db;