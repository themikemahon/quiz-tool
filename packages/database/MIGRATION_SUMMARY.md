# Quiz Enhancements - Migration Summary

## Overview

Three new migration files have been created to support the quiz enhancements feature. These migrations add brand theming, multiple question types, and call-to-action functionality.

## Migration Files Created

### 1. migration-004-add-brand-themes.sql

**Purpose**: Create the brand themes system

**Changes**:
- Creates `brand_themes` table with columns:
  - `id` (primary key)
  - `name` (unique identifier)
  - `primary_color`, `secondary_color`, `accent_color`
  - `text_color`, `background_color`
  - `font_family`, `font_url`
- Seeds 5 initial themes:
  - **Default**: Blue theme with Inter font
  - **Avast**: Orange and black with Arial
  - **Norton**: Yellow and black with Arial
  - **LifeLock**: Blue theme with Arial
  - **Gen**: Blue/indigo theme with system fonts
- Creates index on `name` column

**Requirements Addressed**: 1.2, 1.4, 7.1

---

### 2. migration-005-add-quiz-enhancements.sql

**Purpose**: Add brand theme and CTA support to quizzes

**Changes**:
- Adds to `quizzes` table:
  - `brand_theme_id` (foreign key to brand_themes)
  - `cta_enabled` (boolean, default false)
  - `cta_text`, `cta_text_fr`, `cta_text_de` (multi-language CTA text)
  - `cta_url` (desktop URL)
  - `cta_mobile_url` (mobile URL, optional)
- Creates index on `brand_theme_id`

**Requirements Addressed**: 1.2, 5.1, 7.1, 7.4

---

### 3. migration-006-add-question-types.sql

**Purpose**: Add support for multiple question types

**Changes**:
- Adds to `questions` table:
  - `question_type` (enum: scam-detector, multiple-choice, comparison, true-false)
  - `image_url_2` (for comparison questions)
- Adds to `answer_options` table:
  - `option_text_fr`, `option_text_de` (translations)
- Updates existing questions to `question_type = 'scam-detector'`
- Creates index on `question_type`

**Requirements Addressed**: 2.1, 3.1, 4.1, 7.2, 7.3, 7.5

---

## Database Schema Changes Summary

### New Tables
- `brand_themes` (5 rows seeded)

### Modified Tables

#### quizzes
- Added: `brand_theme_id`, `cta_enabled`, `cta_text`, `cta_text_fr`, `cta_text_de`, `cta_url`, `cta_mobile_url`

#### questions
- Added: `question_type`, `image_url_2`

#### answer_options
- Added: `option_text_fr`, `option_text_de`

### New Indexes
- `idx_brand_themes_name`
- `idx_quizzes_brand_theme_id`
- `idx_questions_question_type`

---

## Running the Migrations

### Option 1: Run all new migrations
```bash
cd packages/database
node run-migrations.js migration-004-add-brand-themes.sql migration-005-add-quiz-enhancements.sql migration-006-add-question-types.sql
```

### Option 2: Run individually
```bash
cd packages/database
node run-migrations.js migration-004-add-brand-themes.sql
node run-migrations.js migration-005-add-quiz-enhancements.sql
node run-migrations.js migration-006-add-question-types.sql
```

---

## Backward Compatibility

All migrations are designed to be backward compatible:

- New columns use `ADD COLUMN IF NOT EXISTS`
- Default values provided for all new columns
- Existing questions automatically set to `question_type = 'scam-detector'`
- Quizzes without `brand_theme_id` will use default theme
- Quizzes have `cta_enabled = false` by default

---

## Verification

After running migrations, verify with these SQL queries:

```sql
-- Check brand themes were seeded
SELECT * FROM brand_themes;

-- Check new quiz columns exist
SELECT column_name FROM information_schema.columns 
WHERE table_name = 'quizzes' 
AND column_name IN ('brand_theme_id', 'cta_enabled', 'cta_text', 'cta_url', 'cta_mobile_url');

-- Check new question columns exist
SELECT column_name FROM information_schema.columns 
WHERE table_name = 'questions' 
AND column_name IN ('question_type', 'image_url_2');

-- Check existing questions have question_type set
SELECT COUNT(*), question_type FROM questions GROUP BY question_type;
```

---

## Next Steps

After running these migrations:

1. Update TypeScript types in `packages/shared/types.ts`
2. Update API endpoints to handle new fields
3. Update admin interface to support new features
4. Update quiz player to render new question types
5. Implement theme application logic

