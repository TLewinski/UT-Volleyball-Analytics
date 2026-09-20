const express = require("express");
const router = express.Router();
const db = require("../db");

// Get every player
router.get("/", (req, res) => {
  db.query("SELECT * FROM players ORDER BY last_name", (err, results) => {
    if (err) return res.status(500).json({ error: "Could not load players" });
    res.json(results);
  });
});

// Season totals for each player, plus hitting percentage
// Hitting % = (kills - errors) / attempts
// NULLIF(..., 0) turns 0 attempts into NULL so we never divide by zero
router.get("/totals", (req, res) => {
  const sql = `
    SELECT
      p.player_id,
      p.first_name,
      p.last_name,
      SUM(ps.kills) AS kills,
      SUM(ps.attempts) AS attempts,
      SUM(ps.digs) AS digs,
      SUM(ps.aces) AS aces,
      SUM(ps.blocks) AS blocks,
      ROUND((SUM(ps.kills) - SUM(ps.errors)) / NULLIF(SUM(ps.attempts), 0), 3) AS hitting_pct
    FROM players p
    JOIN player_stats ps ON p.player_id = ps.player_id
    GROUP BY p.player_id
    ORDER BY kills DESC
  `;

  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: "Could not load totals" });
    res.json(results);
  });
});

// Get one player's stats for every match they played
// Example: GET /players/3
// NOTE: this must stay below "/totals", or Express would treat "totals" as an id
router.get("/:id", (req, res) => {
  const sql = `
    SELECT
      p.first_name,
      p.last_name,
      p.position,
      m.match_id,
      m.opponent,
      m.tournament_name,
      DATE_FORMAT(m.match_date, '%Y-%m-%d') AS match_date,
      m.result,
      ps.kills,
      ps.attempts,
      ps.digs,
      ps.aces,
      ps.blocks,
      ps.errors,
      ps.missed_serves
    FROM player_stats ps
    JOIN players p ON ps.player_id = p.player_id
    JOIN matches m ON ps.match_id = m.match_id
    WHERE p.player_id = ?
    ORDER BY m.match_date ASC
  `;

  // The ? above gets replaced by req.params.id safely (prevents SQL injection)
  db.query(sql, [req.params.id], (err, results) => {
    if (err) return res.status(500).json({ error: "Could not load player" });
    res.json(results);
  });
});

module.exports = router;
