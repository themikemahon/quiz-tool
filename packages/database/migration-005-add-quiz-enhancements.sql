-- Migration 005: Add brand theme and CTA fields to quizzes table

-- Add brand_theme_id column
ALTER TABLE quizzes 
ADD COLUMN IF NOT EXISTS brand_theme_id INTEGER REFERENCES brand_themes(id);

-- Add CTA (Call-to-Action) columns
ALTER TABLE quizzes
ADD COLUMN IF NOT EXISTS cta_enabled BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS cta_text VARCHAR(255),
ADD COLUMN IF NOT EXISTS cta_text_fr VARCHAR(255),
ADD COLUMN IF NOT EXISTS cta_text_de VARCHAR(255),
ADD COLUMN IF NOT EXISTS cta_url TEXT,
ADD COLUMN IF NOT EXISTS cta_mobile_url TEXT;

-- Create index for faster lookups by brand_theme_id
CREATE INDEX IF NOT EXISTS idx_quizzes_brand_theme_id ON quizzes(brand_theme_id);

-- Add comments for clarity
COMMENT ON COLUMN quizzes.brand_theme_id IS 'Reference to brand theme for quiz customization. NULL uses default theme.';
COMMENT ON COLUMN quizzes.cta_enabled IS 'Whether to display CTA button on results screen';
COMMENT ON COLUMN quizzes.cta_text IS 'English text for CTA button';
COMMENT ON COLUMN quizzes.cta_text_fr IS 'French translation of CTA button text';
COMMENT ON COLUMN quizzes.cta_text_de IS 'German translation of CTA button text';
COMMENT ON COLUMN quizzes.cta_url IS 'Desktop URL for CTA button';
COMMENT ON COLUMN quizzes.cta_mobile_url IS 'Mobile URL for CTA button (optional, falls back to cta_url)';

