-- Migration 004: Add brand themes table

-- Create brand_themes table
CREATE TABLE IF NOT EXISTS brand_themes (
  id SERIAL PRIMARY KEY,
  name VARCHAR(50) UNIQUE NOT NULL,
  primary_color VARCHAR(7) NOT NULL,
  secondary_color VARCHAR(7) NOT NULL,
  accent_color VARCHAR(7) NOT NULL,
  text_color VARCHAR(7) NOT NULL,
  background_color VARCHAR(7) NOT NULL,
  font_family VARCHAR(100) NOT NULL,
  font_url TEXT
);

-- Create index for faster lookups by name
CREATE INDEX IF NOT EXISTS idx_brand_themes_name ON brand_themes(name);

-- Seed brand_themes table with initial theme data
INSERT INTO brand_themes (name, primary_color, secondary_color, accent_color, text_color, background_color, font_family, font_url)
VALUES
  ('default', '#3B82F6', '#6366F1', '#3B82F6', '#111827', '#F3F4F6', 'Inter, system-ui, sans-serif', 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap'),
  ('avast', '#FF7F00', '#000000', '#FF7F00', '#000000', '#FFFFFF', 'Arial, Helvetica, sans-serif', NULL),
  ('norton', '#FDB511', '#000000', '#FDB511', '#000000', '#FFFFFF', 'Arial, Helvetica, sans-serif', NULL),
  ('lifelock', '#0066CC', '#003366', '#0066CC', '#333333', '#F5F5F5', 'Arial, Helvetica, sans-serif', NULL),
  ('gen', '#1E40AF', '#6366F1', '#3B82F6', '#111827', '#F9FAFB', 'system-ui, -apple-system, sans-serif', NULL)
ON CONFLICT (name) DO NOTHING;

-- Add comments for clarity
COMMENT ON TABLE brand_themes IS 'Brand theme configurations for quiz customization';
COMMENT ON COLUMN brand_themes.name IS 'Unique theme identifier (default, avast, norton, lifelock, gen)';
COMMENT ON COLUMN brand_themes.font_url IS 'Optional Google Fonts or CDN URL for custom fonts';

