# Quiz Tool

A flexible web-based quiz builder with CMS and embeddable quiz player.

Database and blob storage connected!

## Project Structure

- `/apps/admin` - CMS interface for creating and managing quizzes
- `/apps/quiz` - Embeddable quiz player
- `/packages/database` - Database schema and utilities
- `/packages/shared` - Shared types and utilities

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables (see `.env.example` in each app)

3. Run development servers:
```bash
npm run dev
```

4. Deploy to Vercel:
```bash
vercel
```

## Tech Stack

- Next.js 14+
- TypeScript
- Tailwind CSS
- Vercel Postgres
- Vercel Blob Storage
