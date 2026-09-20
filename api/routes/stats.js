const express = require("express");
const router = express.Router();
const db = require("../db");

// Get all stat lines, with player and match info attached
router.get("/", (req, res) => {
  const sql = `
    SELECT
      p.first_name,
      p.last_name,
      m.opponent,
      m.tournament_name,
      DATE_FORMAT(m.match_date, '%Y-%m-%d') AS match_date,
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
    ORDER BY m.match_date ASC
  `;

  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: "Could not load stats" });
    res.json(results);
  });
});

// Team totals for the dashboard cards, including team hitting %
// Add ?team=1 to limit it to one team
router.get("/summary", (req, res) => {
  // Joining players lets us filter these totals by team
  const sql = `
    SELECT
      SUM(ps.kills) AS total_kills,
      SUM(ps.aces) AS total_aces,
      SUM(ps.blocks) AS total_blocks,
      ROUND((SUM(ps.kills) - SUM(ps.errors)) / NULLIF(SUM(ps.attempts), 0), 3) AS hitting_pct
    FROM player_stats ps
    JOIN players p ON ps.player_id = p.player_id
    WHERE (? IS NULL OR p.team_id = ?)
  `;
  const team = req.query.team || null;

  db.query(sql, [team, team], (err, results) => {
    if (err) return res.status(500).json({ error: "Could not load summary" });
    res.json(results[0]);
  });
});

// Add one player's stat line for one match
// Expects JSON like:
// { "player_id": 1, "match_id": 2, "kills": 10, "attempts": 25, "digs": 4,
//   "aces": 1, "blocks": 2, "errors": 3, "missed_serves": 1 }
router.post("/", (req, res) => {
  const s = req.body;

  // Player and match are required; every number defaults to 0
  if (!s.player_id || !s.match_id) {
    return res.status(400).json({ error: "Player and match are required" });
  }

  // A player can't have more kills + errors than swings
  if (Number(s.kills) + Number(s.errors) > Number(s.attempts)) {
    return res.status(400).json({ error: "Kills + errors can't be more than attempts" });
  }

  const sql = `
    INSERT INTO player_stats
      (player_id, match_id, kills, attempts, digs, aces, blocks, errors, missed_serves)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;
  const values = [
    s.player_id,
    s.match_id,
    s.kills || 0,
    s.attempts || 0,
    s.digs || 0,
    s.aces || 0,
    s.blocks || 0,
    s.errors || 0,
    s.missed_serves || 0,
  ];

  db.query(sql, values, (err) => {
    // ER_DUP_ENTRY means this player already has stats for this match
    if (err && err.code === "ER_DUP_ENTRY") {
      return res.status(400).json({ error: "This player already has stats for that match" });
    }
    if (err) return res.status(500).json({ error: "Could not save stats" });

    res.status(201).json({ message: "Stats saved" });
  });
});

module.exports = router;
