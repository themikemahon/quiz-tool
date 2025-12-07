-- Migration 003: Simplify translations with language columns

-- Add translation columns for quizzes (only if they don't exist)
ALTER TABLE quizzes
ADD COLUMN IF NOT EXISTS title_fr VARCHAR(255),
ADD COLUMN IF NOT EXISTS title_de VARCHAR(255),
ADD COLUMN IF NOT EXISTS description_fr TEXT,
ADD COLUMN IF NOT EXISTS description_de TEXT,
ADD COLUMN IF NOT EXISTS intro_text_fr TEXT,
ADD COLUMN IF NOT EXISTS intro_text_de TEXT;

-- Add translation columns for questions
ALTER TABLE questions
ADD COLUMN IF NOT EXISTS question_text_fr TEXT,
ADD COLUMN IF NOT EXISTS question_text_de TEXT,
ADD COLUMN IF NOT EXISTS explanation_fr TEXT,
ADD COLUMN IF NOT EXISTS explanation_de TEXT;

-- Add translation columns for result tiers
ALTER TABLE result_tiers
ADD COLUMN IF NOT EXISTS tier_name_fr VARCHAR(50),
ADD COLUMN IF NOT EXISTS tier_name_de VARCHAR(50),
ADD COLUMN IF NOT EXISTS message_fr TEXT,
ADD COLUMN IF NOT EXISTS message_de TEXT;

-- Add comments
COMMENT ON COLUMN quizzes.title_fr IS 'French translation of title';
COMMENT ON COLUMN quizzes.title_de IS 'German translation of title';
COMMENT ON COLUMN questions.question_text_fr IS 'French translation of question text';
COMMENT ON COLUMN questions.question_text_de IS 'German translation of question text';
