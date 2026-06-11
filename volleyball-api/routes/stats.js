const express = require("express");
const router = express.Router();
const db = require("../db");

// Get all stats
router.get("/", (req, res) => {
  const sql = `
    SELECT 
      p.first_name,
      p.last_name,
      m.opponent,
      m.tournament_name,
      m.match_date,
      ps.kills,
      ps.digs,
      ps.aces,
      ps.blocks,
      ps.errors,
      ps.missed_serves
    FROM player_stats ps
    JOIN players p ON ps.player_id = p.player_id
    JOIN matches m ON ps.match_id = m.match_id
    ORDER BY m.match_date ASC
  `;

  db.query(sql, (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
});

// Dashboard summary
router.get("/summary", (req, res) => {
  const sql = `
    SELECT
      SUM(kills) AS total_kills,
      SUM(aces) AS total_aces,
      SUM(blocks) AS total_blocks
    FROM player_stats
  `;

  db.query(sql, (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results[0]);
  });
});

module.exports = router;