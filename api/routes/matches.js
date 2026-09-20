const express = require("express");
const router = express.Router();
const db = require("../db");

// Get every match, oldest first
// DATE_FORMAT keeps the date as plain "2025-09-13" text (avoids time zone shifts)
router.get("/", (req, res) => {
  const sql = `
    SELECT
      match_id,
      opponent,
      tournament_name,
      DATE_FORMAT(match_date, '%Y-%m-%d') AS match_date,
      result,
      our_sets,
      opponent_sets
    FROM matches
    ORDER BY match_date ASC
  `;

  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: "Could not load matches" });
    res.json(results);
  });
});

// Get the team's win/loss record
// Example response: { "wins": 2, "losses": 2 }
router.get("/record", (req, res) => {
  const sql = `
    SELECT
      SUM(result = 'W') AS wins,
      SUM(result = 'L') AS losses
    FROM matches
  `;

  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: "Could not load record" });

    // SUM gives back null when there are no matches, so default to 0
    res.json({
      wins: Number(results[0].wins) || 0,
      losses: Number(results[0].losses) || 0,
    });
  });
});

// Add a new match
// Expects JSON like:
// { "opponent": "Ohio State", "tournament_name": "MAC Classic",
//   "match_date": "2025-10-05", "result": "W", "our_sets": 3, "opponent_sets": 1 }
router.post("/", (req, res) => {
  const { opponent, tournament_name, match_date, result, our_sets, opponent_sets } = req.body;

  // Basic checks so we don't save a broken match
  if (!opponent || !match_date) {
    return res.status(400).json({ error: "Opponent and date are required" });
  }
  if (result !== "W" && result !== "L") {
    return res.status(400).json({ error: "Result must be W or L" });
  }

  const sql = `
    INSERT INTO matches (opponent, tournament_name, match_date, result, our_sets, opponent_sets)
    VALUES (?, ?, ?, ?, ?, ?)
  `;
  const values = [opponent, tournament_name, match_date, result, our_sets || 0, opponent_sets || 0];

  db.query(sql, values, (err, results) => {
    if (err) return res.status(500).json({ error: "Could not save match" });

    // insertId is the new match's id, handy for the frontend
    res.status(201).json({ match_id: results.insertId });
  });
});

module.exports = router;
