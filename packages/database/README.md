# Database Package

This package contains the database schema and migration files for the Quiz Tool.

## Database Structure

The quiz tool uses Vercel Postgres as its database. The schema includes:

- **quizzes**: Quiz metadata, settings, and configuration
- **questions**: Quiz questions with various types
- **answer_options**: Answer choices for multiple-choice questions
- **result_tiers**: Score-based result messages
- **brand_themes**: Brand customization themes

## Migrations

Migration files are numbered sequentially and should be run in order:

1. `migration-001.sql` - Add result_tiers table
2. `migration-002-add-translations.sql` - Add translation support
3. `migration-003-simplify-translations.sql` - Simplify translation columns
4. `migration-004-add-brand-themes.sql` - Add brand themes table and seed data
5. `migration-005-add-quiz-enhancements.sql` - Add brand theme and CTA fields to quizzes
6. `migration-006-add-question-types.sql` - Add question type support

## Running Migrations

### Prerequisites

Ensure you have the required environment variables set in your `.env.local` file:

```bash
POSTGRES_URL=your-postgres-connection-string
```

### Run All Migrations

From the project root:

```bash
cd packages/database
node run-migrations.js
```

### Run Specific Migration

```bash
cd packages/database
node run-migrations.js migration-004-add-brand-themes.sql
```

### Run New Migrations Only

To run only the new quiz enhancement migrations:

```bash
cd packages/database
node run-migrations.js migration-004-add-brand-themes.sql migration-005-add-quiz-enhancements.sql migration-006-add-question-types.sql
```

## Schema Updates

The quiz enhancements add the following features:

### Brand Themes
- 5 pre-configured themes: Default, Avast, Norton, LifeLock, Gen
- Customizable colors and fonts per theme
- Quizzes can reference a brand theme via `brand_theme_id`

### Question Types
- `scam-detector`: Original image-based scam detection (default)
- `multiple-choice`: 4 answer options with one correct
- `comparison`: Compare two images, select one
- `true-false`: Binary true/false questions

### Call-to-Action (CTA)
- Optional CTA button on quiz results
- Separate URLs for mobile and desktop
- Multi-language support for CTA text

## Development

When adding new migrations:

1. Create a new file: `migration-XXX-description.sql`
2. Use sequential numbering (XXX)
3. Include comments explaining the changes
4. Test locally before deploying
5. Update this README with the new migration

## Notes

- All migrations use `IF NOT EXISTS` or `ADD COLUMN IF NOT EXISTS` to be idempotent
- Existing data is preserved during migrations
- Default values are provided for new columns
- Foreign key constraints maintain referential integrity

