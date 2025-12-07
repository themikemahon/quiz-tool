-- Migration 002: Add translation support

-- Add language and parent_quiz_id columns to quizzes table
ALTER TABLE quizzes 
ADD COLUMN language VARCHAR(5) DEFAULT 'en' CHECK (language IN ('en', 'fr', 'de')),
ADD COLUMN parent_quiz_id INTEGER REFERENCES quizzes(id) ON DELETE CASCADE;

-- Create index for faster lookups
CREATE INDEX idx_quizzes_parent_quiz_id ON quizzes(parent_quiz_id);
CREATE INDEX idx_quizzes_language ON quizzes(language);

-- Add comment for clarity
COMMENT ON COLUMN quizzes.language IS 'Language code: en (English), fr (French), de (German)';
COMMENT ON COLUMN quizzes.parent_quiz_id IS 'Reference to the parent quiz (English version). NULL for parent quizzes.';
