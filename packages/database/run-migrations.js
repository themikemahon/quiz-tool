#!/usr/bin/env node

/**
 * Database Migration Runner for Neon/Vercel Postgres
 * 
 * This script runs SQL migration files against your Neon database.
 * It uses @vercel/postgres which works with Neon connection strings.
 * 
 * Usage:
 *   node run-migrations.js [migration-file]
 * 
 * Examples:
 *   node run-migrations.js migration-004-add-brand-themes.sql
 *   node run-migrations.js  # runs all new migrations
 * 
 * Environment:
 *   Requires POSTGRES_URL environment variable from apps/admin/.env.local
 */

const fs = require('fs');
const path = require('path');

// Load environment variables from .env.local
const envPath = path.join(__dirname, '../../apps/admin/.env.local');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  envContent.split('\n').forEach(line => {
    const match = line.match(/^([^=:#]+)=(.*)$/);
    if (match) {
      const key = match[1].trim();
      const value = match[2].trim();
      if (!process.env[key]) {
        process.env[key] = value;
      }
    }
  });
}

// Check if @vercel/postgres is available
let sql;
try {
  sql = require('@vercel/postgres').sql;
} catch (error) {
  console.error('Error: @vercel/postgres is not installed.');
  console.error('Please run: npm install @vercel/postgres');
  process.exit(1);
}

// Check for database connection string
if (!process.env.POSTGRES_URL) {
  console.error('Error: POSTGRES_URL environment variable is not set.');
  console.error('Please set it in apps/admin/.env.local');
  process.exit(1);
}

async function runMigration(filePath) {
  const fileName = path.basename(filePath);
  console.log(`\n📄 Running migration: ${fileName}`);
  
  try {
    const migrationSQL = fs.readFileSync(filePath, 'utf8');
    
    // Execute the migration
    // Note: @vercel/postgres handles the connection automatically
    await sql.query(migrationSQL);
    
    console.log(`✅ Successfully applied: ${fileName}`);
    return true;
  } catch (error) {
    console.error(`❌ Error applying ${fileName}:`);
    console.error(error.message);
    if (error.detail) {
      console.error('Detail:', error.detail);
    }
    return false;
  }
}

async function main() {
  const args = process.argv.slice(2);
  const migrationsDir = __dirname;
  
  let migrationFiles;
  
  if (args.length > 0) {
    // Run specific migration file(s)
    migrationFiles = args.map(arg => {
      // If it's just a filename, prepend the migrations directory
      if (!path.isAbsolute(arg) && !arg.includes('/')) {
        return path.join(migrationsDir, arg);
      }
      return arg;
    });
  } else {
    // Run only the new quiz enhancement migrations by default
    migrationFiles = [
      'migration-004-add-brand-themes.sql',
      'migration-005-add-quiz-enhancements.sql',
      'migration-006-add-question-types.sql'
    ].map(f => path.join(migrationsDir, f));
  }
  
  console.log('🚀 Starting database migrations...');
  console.log(`📁 Migrations directory: ${migrationsDir}`);
  console.log(`🔗 Database: ${process.env.POSTGRES_URL.split('@')[1]?.split('?')[0] || 'connected'}`);
  console.log(`📋 Found ${migrationFiles.length} migration(s) to run\n`);
  
  let successCount = 0;
  let failCount = 0;
  
  for (const filePath of migrationFiles) {
    if (!fs.existsSync(filePath)) {
      console.error(`❌ Migration file not found: ${filePath}`);
      failCount++;
      continue;
    }
    
    const success = await runMigration(filePath);
    if (success) {
      successCount++;
    } else {
      failCount++;
      // Stop on first failure
      console.log('\n⚠️  Stopping due to migration failure');
      break;
    }
  }
  
  console.log('\n' + '='.repeat(50));
  console.log(`✅ Successful: ${successCount}`);
  console.log(`❌ Failed: ${failCount}`);
  console.log('='.repeat(50));
  
  if (failCount > 0) {
    console.log('\n💡 Tip: Check the error messages above for details');
    process.exit(1);
  } else {
    console.log('\n🎉 All migrations completed successfully!');
  }
}

main().catch(error => {
  console.error('\n💥 Fatal error:', error);
  process.exit(1);
});

