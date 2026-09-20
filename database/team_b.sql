-- ============================================
-- team_b.sql
-- Adds the Toledo B roster, matches and stats.
-- Run this once on a database that already has your Toledo A data.
-- (The same rows are also in seed.sql, so a fresh schema.sql + seed.sql includes them.)
-- ============================================

USE volleyball_analytics;

-- Toledo B players
INSERT INTO players (team_id, first_name, last_name, position) VALUES
  (2, 'Mateo', 'Roth', 'Outside Hitter'),
  (2, 'Bobby', 'Asendorf', 'Opposite Hitter'),
  (2, 'Carter', 'Huynh', 'Libero'),
  (2, 'Devin', 'Dreher', 'Middle Blocker'),
  (2, 'Hayden', 'Winslow', 'Setter'),
  (2, 'Jerry', 'Blackman', 'Outside Hitter'),
  (2, 'Luke', 'Jurrus', 'Middle Blocker'),
  (2, 'Sam', 'Drees', 'Defensive Specialist'),
  (2, 'Tyson', 'Baptista', 'Setter');

-- Remember the first new player id, so the stats below line up
SET @p = LAST_INSERT_ID();

-- Toledo B matches
INSERT INTO matches (team_id, opponent, tournament_name, match_date, result, our_sets, opponent_sets) VALUES
  (2, 'Bowling Green', 'GLMVB', '2026-02-07', 'W', 3, 1),
  (2, 'Ferris State', 'GLMVB', '2026-02-07', 'L', 1, 3),
  (2, 'Oakland', 'GLMVB', '2026-02-07', 'W', 3, 2),
  (2, 'Michigan State', 'GLMVB', '2026-02-08', 'L', 0, 3),
  (2, 'Hope', 'GLMVB', '2026-02-08', 'W', 3, 0),
  (2, 'Central Michigan', 'GLMVB', '2026-02-08', 'W', 3, 1),
  (2, 'Wayne State', 'BG Tournament', '2026-02-28', 'L', 2, 3),
  (2, 'Eastern Michigan', 'BG Tournament', '2026-02-28', 'W', 3, 1);

SET @m = LAST_INSERT_ID();

-- Toledo B stat lines
-- Columns: player, match, kills, attempts, errors, digs, aces, blocks, missed serves
INSERT INTO player_stats
  (player_id, match_id, kills, attempts, errors, digs, aces, blocks, missed_serves)
VALUES
  -- Match 1 vs Bowling Green
  (@p + 0, @m + 0, 13, 29, 3,  8, 0, 0, 2),
  (@p + 1, @m + 0,  8, 20, 2,  2, 2, 2, 0),
  (@p + 2, @m + 0,  0,  1, 0, 14, 0, 0, 0),
  (@p + 3, @m + 0,  8, 19, 0,  1, 0, 6, 0),
  (@p + 4, @m + 0,  3,  8, 0,  3, 1, 1, 1),
  (@p + 5, @m + 0, 10, 26, 0,  7, 2, 1, 0),
  (@p + 6, @m + 0,  8, 20, 2,  2, 1, 2, 2),
  (@p + 7, @m + 0,  2,  6, 0,  8, 1, 1, 1),
  (@p + 8, @m + 0,  3, 12, 1,  5, 2, 0, 0),

  -- Match 2 vs Ferris State
  (@p + 0, @m + 1, 11, 24, 2,  7, 3, 2, 2),
  (@p + 1, @m + 1, 14, 33, 4,  2, 0, 4, 0),
  (@p + 2, @m + 1,  0,  0, 0, 15, 1, 0, 2),
  (@p + 3, @m + 1,  4, 12, 1,  3, 2, 4, 2),
  (@p + 4, @m + 1,  3, 12, 1,  3, 0, 1, 1),
  (@p + 5, @m + 1,  9, 19, 2,  8, 3, 2, 2),
  (@p + 6, @m + 1,  7, 19, 1,  1, 1, 4, 0),
  (@p + 7, @m + 1,  2,  6, 1,  5, 0, 1, 0),
  (@p + 8, @m + 1,  1,  6, 1,  6, 0, 0, 1),

  -- Match 3 vs Oakland
  (@p + 0, @m + 2, 14, 34, 2,  4, 3, 2, 2),
  (@p + 1, @m + 2, 13, 31, 3,  3, 0, 1, 0),
  (@p + 2, @m + 2,  0,  0, 0, 18, 0, 0, 1),
  (@p + 3, @m + 2, 10, 24, 1,  3, 1, 2, 0),
  (@p + 4, @m + 2,  3, 12, 1,  7, 2, 0, 2),
  (@p + 5, @m + 2,  8, 20, 2,  7, 3, 3, 1),
  (@p + 6, @m + 2,  7, 14, 1,  4, 0, 3, 0),
  (@p + 7, @m + 2,  0,  1, 0,  7, 0, 1, 2),
  (@p + 8, @m + 2,  0,  0, 0,  3, 1, 2, 0),

  -- Match 4 vs Michigan State
  (@p + 0, @m + 3, 13, 32, 0,  3, 1, 3, 0),
  (@p + 1, @m + 3, 11, 27, 2,  5, 0, 1, 1),
  (@p + 2, @m + 3,  0,  1, 0, 15, 1, 0, 0),
  (@p + 3, @m + 3,  4, 13, 1,  3, 1, 3, 2),
  (@p + 4, @m + 3,  0,  0, 0,  7, 2, 0, 2),
  (@p + 5, @m + 3,  8, 21, 1,  8, 0, 2, 2),
  (@p + 6, @m + 3,  6, 13, 1,  2, 2, 6, 2),
  (@p + 7, @m + 3,  1,  8, 0,  8, 0, 1, 2),
  (@p + 8, @m + 3,  1,  4, 1,  5, 0, 0, 1),

  -- Match 5 vs Hope
  (@p + 0, @m + 4, 15, 34, 1,  8, 2, 3, 2),
  (@p + 1, @m + 4, 12, 29, 0,  3, 0, 2, 1),
  (@p + 2, @m + 4,  0,  1, 0, 11, 1, 0, 1),
  (@p + 3, @m + 4,  9, 20, 0,  1, 1, 3, 1),
  (@p + 4, @m + 4,  1,  6, 1,  3, 3, 1, 1),
  (@p + 5, @m + 4,  9, 24, 1,  4, 1, 0, 0),
  (@p + 6, @m + 4,  8, 19, 2,  2, 2, 6, 1),
  (@p + 7, @m + 4,  2,  8, 0,  7, 0, 0, 2),
  (@p + 8, @m + 4,  0,  2, 0,  4, 3, 0, 0),

  -- Match 6 vs Central Michigan
  (@p + 0, @m + 5,  8, 19, 0,  5, 1, 2, 1),
  (@p + 1, @m + 5, 13, 30, 0,  4, 1, 4, 2),
  (@p + 2, @m + 5,  0,  2, 0, 10, 2, 0, 1),
  (@p + 3, @m + 5, 10, 21, 0,  2, 0, 3, 1),
  (@p + 4, @m + 5,  0,  2, 0,  3, 2, 2, 2),
  (@p + 5, @m + 5, 15, 32, 4,  3, 1, 1, 1),
  (@p + 6, @m + 5,  4,  8, 1,  1, 0, 5, 1),
  (@p + 7, @m + 5,  2, 10, 0,  9, 1, 1, 2),
  (@p + 8, @m + 5,  1,  8, 1,  7, 1, 1, 0),

  -- Match 7 vs Wayne State
  (@p + 0, @m + 6, 14, 30, 3,  6, 2, 0, 2),
  (@p + 1, @m + 6, 10, 26, 0,  3, 2, 3, 0),
  (@p + 2, @m + 6,  0,  2, 0, 18, 2, 0, 0),
  (@p + 3, @m + 6,  6, 13, 1,  2, 2, 2, 1),
  (@p + 4, @m + 6,  3,  9, 0,  4, 3, 2, 1),
  (@p + 5, @m + 6, 13, 31, 1,  5, 2, 0, 2),
  (@p + 6, @m + 6,  6, 12, 1,  4, 1, 2, 1),
  (@p + 7, @m + 6,  1,  7, 1,  6, 0, 0, 0),
  (@p + 8, @m + 6,  0,  1, 0,  5, 0, 0, 1),

  -- Match 8 vs Eastern Michigan
  (@p + 0, @m + 7, 10, 25, 2,  6, 1, 3, 2),
  (@p + 1, @m + 7, 12, 27, 2,  2, 2, 2, 1),
  (@p + 2, @m + 7,  0,  1, 0,  8, 2, 0, 1),
  (@p + 3, @m + 7,  4, 12, 0,  1, 1, 2, 1),
  (@p + 4, @m + 7,  0,  1, 0,  7, 3, 1, 2),
  (@p + 5, @m + 7, 10, 22, 1,  3, 1, 2, 0),
  (@p + 6, @m + 7,  5, 11, 1,  3, 2, 3, 1),
  (@p + 7, @m + 7,  1,  7, 0,  9, 1, 0, 1),
  (@p + 8, @m + 7,  0,  0, 0,  3, 1, 2, 1);
