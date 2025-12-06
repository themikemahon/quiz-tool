-- Migration: Add result_tiers table and remove old summary/tips fields

-- Remove old columns from quizzes table
ALTER TABLE quizzes DROP COLUMN IF EXISTS summary_text;
ALTER TABLE quizzes DROP COLUMN IF EXISTS tips_text;

-- Create result_tiers table
CREATE TABLE IF NOT EXISTS result_tiers (
  id SERIAL PRIMARY KEY,
  quiz_id INTEGER REFERENCES quizzes(id) ON DELETE CASCADE,
  tier_name VARCHAR(50) NOT NULL,
  min_percentage INTEGER NOT NULL,
  max_percentage INTEGER NOT NULL,
  message TEXT NOT NULL,
  order_index INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_result_tiers_quiz_id ON result_tiers(quiz_id);
