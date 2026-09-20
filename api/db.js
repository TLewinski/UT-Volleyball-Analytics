// Loads the values from the .env file into process.env
require("dotenv").config();

const mysql = require("mysql2");

// A pool keeps a few connections open and reconnects if one drops.
// It works with db.query(...) exactly like a single connection did.
const db = mysql.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,

  // Online databases (like Aiven) need an encrypted connection.
  // Set DB_SSL=true there; leave it out on your own computer.
  ssl: process.env.DB_SSL === "true" ? { rejectUnauthorized: false } : undefined,
});

// Quick test on startup so you can see if the database is reachable
db.query("SELECT 1", (err) => {
  if (err) {
    console.log("DB connection failed:", err.message);
  } else {
    console.log("Connected to MySQL");
  }
});

module.exports = db;
