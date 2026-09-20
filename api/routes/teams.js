const express = require("express");
const router = express.Router();
const db = require("../db");

// Get our teams (used by the team switcher on the site)
router.get("/", (req, res) => {
  db.query("SELECT * FROM teams ORDER BY team_id", (err, results) => {
    if (err) return res.status(500).json({ error: "Could not load teams" });
    res.json(results);
  });
});

module.exports = router;
