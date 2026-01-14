# How to Run Migrations on Neon

Your database is hosted on Neon, and the migrations are ready to run. Here are your options:

## ✅ Recommended: Use the Migration Script

This is the easiest way since you already have `@vercel/postgres` installed (which works with Neon):

```bash
# From the project root
cd packages/database
node run-migrations.js
```

This will automatically:
- Load your connection string from `apps/admin/.env.local`
- Run the 3 new migration files in order
- Show you success/failure for each migration

### Run Specific Migrations

```bash
# Run just one migration
node run-migrations.js migration-004-add-brand-themes.sql

# Run multiple specific migrations
node run-migrations.js migration-004-add-brand-themes.sql migration-005-add-quiz-enhancements.sql
```

---

## Alternative: Use Neon SQL Editor (No Code)

If you prefer a GUI:

1. Go to https://console.neon.tech
2. Select your project: `ep-lucky-sunset-a4yt0nor`
3. Click on "SQL Editor" in the left sidebar
4. Copy and paste each migration file content:
   - First: `migration-004-add-brand-themes.sql`
   - Second: `migration-005-add-quiz-enhancements.sql`
   - Third: `migration-006-add-question-types.sql`
5. Click "Run" for each one

---

## Alternative: Use psql Command Line

If you have `psql` installed:

```bash
cd packages/database

# Run all three migrations
psql "postgresql://neondb_owner:npg_H1vlrbzNjEf5@ep-lucky-sunset-a4yt0nor-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require" \
  -f migration-004-add-brand-themes.sql \
  -f migration-005-add-quiz-enhancements.sql \
  -f migration-006-add-question-types.sql
```

---

## Verify Migrations Worked

After running migrations, you can verify with:

```bash
node -e "
const { sql } = require('@vercel/postgres');
require('fs').readFileSync('../../apps/admin/.env.local', 'utf8').split('\n').forEach(line => {
  const match = line.match(/^([^=:#]+)=(.*)$/);
  if (match) process.env[match[1].trim()] = match[2].trim();
});
sql\`SELECT * FROM brand_themes\`.then(r => console.log('Brand themes:', r.rows));
"
```

Or check in Neon SQL Editor:

```sql
-- Should return 5 themes
SELECT * FROM brand_themes;

-- Should show new columns
SELECT column_name FROM information_schema.columns 
WHERE table_name = 'quizzes' 
AND column_name IN ('brand_theme_id', 'cta_enabled');

-- Should show question_type column
SELECT column_name FROM information_schema.columns 
WHERE table_name = 'questions' 
AND column_name = 'question_type';
```

---

## Troubleshooting

### "Cannot find module '@vercel/postgres'"

The package is already in your admin app. Run from project root:

```bash
cd packages/database
node -r ../../apps/admin/node_modules/@vercel/postgres run-migrations.js
```

Or install it globally:

```bash
npm install -g @vercel/postgres
```

### "POSTGRES_URL not set"

Make sure `apps/admin/.env.local` exists and contains your Neon connection string.

### Migration fails with "already exists"

That's okay! The migrations use `IF NOT EXISTS` so they're safe to re-run.

