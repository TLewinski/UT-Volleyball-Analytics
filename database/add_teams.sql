-- ============================================
-- add_teams.sql
-- Adds team support to a database that already has data.
-- Run this once on each database (your computer's and Aiven's).
-- Everyone already in the database is put on Toledo A.
-- ============================================

USE volleyball_analytics;

-- 1. The teams table
CREATE TABLE IF NOT EXISTS teams (
  team_id INT AUTO_INCREMENT PRIMARY KEY,
  name    VARCHAR(50) NOT NULL
);

INSERT INTO teams (name) VALUES ('Toledo A'), ('Toledo B');

-- 2. Put every existing player and match on team 1 (Toledo A)
ALTER TABLE players
  ADD COLUMN team_id INT NOT NULL DEFAULT 1 AFTER player_id,
  ADD FOREIGN KEY (team_id) REFERENCES teams(team_id);

ALTER TABLE matches
  ADD COLUMN team_id INT NOT NULL DEFAULT 1 AFTER match_id,
  ADD FOREIGN KEY (team_id) REFERENCES teams(team_id);
