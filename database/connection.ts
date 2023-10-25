import { DB } from "https://deno.land/x/sqlite@v3.7.3/mod.ts";

const database = new DB("./database/main.db");

database.query(
  `CREATE TABLE IF NOT EXISTS users 
  (id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT NOT NULL UNIQUE,
  email TEXT NOT NULL UNIQUE,
  role TEXT CHECK(role IN ('user', 'admin')) DEFAULT 'user' NOT NULL,
  password TEXT NOT NULL,
  createdAt TEXT, updatedAt TEXT)`
);

database.query(
  `CREATE TABLE IF NOT EXISTS writeups
  (id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL UNIQUE,
  content TEXT NOT NULL,
  userId INTEGER NOT NULL,
  description TEXT,
  createdAt TEXT, updatedAt TEXT)`
);

database.query(
  `UPDATE users SET role = 'admin' WHERE username = 'admin'
  `
);

export default database;
