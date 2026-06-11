const express = require("express");
const router = express.Router();
const db = require("../db");

router.get("/", (req, res) => {
  db.query("SELECT * FROM players", (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
});

router.get("/totals", (req, res) => {
  const sql = `
    SELECT
      p.player_id,
      p.first_name,
      p.last_name,
      SUM(ps.kills) AS kills,
      SUM(ps.digs) AS digs,
      SUM(ps.aces) AS aces,
      SUM(ps.blocks) AS blocks
    FROM players p
    JOIN player_stats ps ON p.player_id = ps.player_id
    GROUP BY p.player_id
    ORDER BY kills DESC
  `;

  db.query(sql, (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
});

module.exports = router;