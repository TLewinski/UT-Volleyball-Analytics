-- ============================================
-- schema.sql
-- Creates the volleyball_analytics database and its tables.
-- Run this first, then run seed.sql.
-- WARNING: this deletes the existing tables and their data.
-- ============================================

-- Make the database (if it doesn't exist yet) and switch to it
CREATE DATABASE IF NOT EXISTS volleyball_analytics;
USE volleyball_analytics;

-- Drop old tables so this file can be re-run cleanly.
-- player_stats goes first because it points at the other two.
DROP TABLE IF EXISTS player_stats;
DROP TABLE IF EXISTS matches;
DROP TABLE IF EXISTS players;

-- One row per player on the team
CREATE TABLE players (
  player_id  INT AUTO_INCREMENT PRIMARY KEY,
  first_name VARCHAR(50) NOT NULL,
  last_name  VARCHAR(50) NOT NULL,
  position   VARCHAR(50)            -- e.g. 'Outside Hitter', 'Libero'
);

-- One row per match we played
CREATE TABLE matches (
  match_id        INT AUTO_INCREMENT PRIMARY KEY,
  opponent        VARCHAR(100) NOT NULL,
  tournament_name VARCHAR(100),
  match_date      DATE NOT NULL,

  -- Final result: 'W' for a win, 'L' for a loss
  result          ENUM('W', 'L') NOT NULL,

  -- Sets won by us and by the other team (example: 3-1)
  our_sets        INT NOT NULL DEFAULT 0,
  opponent_sets   INT NOT NULL DEFAULT 0
);

-- One row per player per match (their stat line for that match)
CREATE TABLE player_stats (
  stat_id       INT AUTO_INCREMENT PRIMARY KEY,
  player_id     INT NOT NULL,
  match_id      INT NOT NULL,
  kills         INT NOT NULL DEFAULT 0,
  attempts      INT NOT NULL DEFAULT 0,  -- total attack swings (needed for hitting %)
  digs          INT NOT NULL DEFAULT 0,
  aces          INT NOT NULL DEFAULT 0,
  blocks        INT NOT NULL DEFAULT 0,
  errors        INT NOT NULL DEFAULT 0,  -- attack errors
  missed_serves INT NOT NULL DEFAULT 0,
  sets_played   INT NOT NULL DEFAULT 2,  -- how many sets this player played

  -- Link each stat line to a real player and a real match
  FOREIGN KEY (player_id) REFERENCES players(player_id),
  FOREIGN KEY (match_id)  REFERENCES matches(match_id),

  -- A player can only have one stat line per match
  UNIQUE (player_id, match_id)
);
