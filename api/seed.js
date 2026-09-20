// ============================================
// seed.js
// Loads database/schema.sql and database/seed.sql into whatever
// database the .env settings point at (used to set up Aiven).
//
// Run it with:  npm run seed
// WARNING: schema.sql deletes the existing tables first.
// ============================================

require("dotenv").config();

const fs = require("fs");
const path = require("path");
const mysql = require("mysql2");

// Read both SQL files from the database folder next to this one
const folder = path.join(__dirname, "..", "database");
const schema = fs.readFileSync(path.join(folder, "schema.sql"), "utf8");
const seed = fs.readFileSync(path.join(folder, "seed.sql"), "utf8");

// Connect WITHOUT picking a database, because schema.sql creates it.
// multipleStatements lets us send a whole file in one go.
const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  multipleStatements: true,
  ssl: process.env.DB_SSL === "true" ? { rejectUnauthorized: false } : undefined,
});

console.log("Creating tables...");

connection.query(schema, (err) => {
  if (err) {
    console.log("schema.sql failed:", err.message);
    process.exit(1);
  }

  console.log("Loading data...");

  connection.query(seed, (err2) => {
    if (err2) {
      console.log("seed.sql failed:", err2.message);
      process.exit(1);
    }

    console.log("Done — database is loaded.");
    connection.end();
  });
});
