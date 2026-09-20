-- ============================================
-- migrate.sql
-- Use this ONLY if you already have a volleyball_analytics database
-- with real data and don't want to wipe it with schema.sql.
-- It adds the new columns without deleting anything.
-- Run it one time.
-- ============================================

USE volleyball_analytics;

-- Attack attempts (needed for hitting percentage)
ALTER TABLE player_stats
  ADD COLUMN attempts INT NOT NULL DEFAULT 0 AFTER kills;

-- Match result and set score
ALTER TABLE matches
  ADD COLUMN result        ENUM('W', 'L') NOT NULL DEFAULT 'W',
  ADD COLUMN our_sets      INT NOT NULL DEFAULT 0,
  ADD COLUMN opponent_sets INT NOT NULL DEFAULT 0;

-- After running this, old rows will have attempts = 0 and result = 'W'.
-- Fix them with UPDATE statements, for example:
--   UPDATE player_stats SET attempts = 30 WHERE player_id = 1 AND match_id = 1;
--   UPDATE matches SET result = 'L', our_sets = 1, opponent_sets = 3 WHERE match_id = 2;
