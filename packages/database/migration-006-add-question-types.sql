-- Migration 006: Add question type support to questions table

-- Add question_type column with constraint
ALTER TABLE questions
ADD COLUMN IF NOT EXISTS question_type VARCHAR(50) DEFAULT 'scam-detector' 
  CHECK (question_type IN ('scam-detector', 'multiple-choice', 'comparison', 'true-false'));

-- Add second image URL for comparison questions
ALTER TABLE questions
ADD COLUMN IF NOT EXISTS image_url_2 TEXT;

-- Add translation columns for answer_options
ALTER TABLE answer_options
ADD COLUMN IF NOT EXISTS option_text_fr VARCHAR(255),
ADD COLUMN IF NOT EXISTS option_text_de VARCHAR(255);

-- Create index for faster lookups by question_type
CREATE INDEX IF NOT EXISTS idx_questions_question_type ON questions(question_type);

-- Update existing questions to have question_type = 'scam-detector'
UPDATE questions 
SET question_type = 'scam-detector' 
WHERE question_type IS NULL;

-- Add comments for clarity
COMMENT ON COLUMN questions.question_type IS 'Type of question: scam-detector, multiple-choice, comparison, or true-false';
COMMENT ON COLUMN questions.image_url_2 IS 'Second image URL for comparison questions';
COMMENT ON COLUMN answer_options.option_text_fr IS 'French translation of answer option text';
COMMENT ON COLUMN answer_options.option_text_de IS 'German translation of answer option text';

