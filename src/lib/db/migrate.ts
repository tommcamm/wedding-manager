import { drizzle } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import postgres from 'postgres';
import { env } from '$env/dynamic/private';

/**
 * This script runs database migrations to ensure the database schema is up-to-date.
 * It is designed to be run:
 * 1. Manually via `pnpm db:migrate`
 * 2. Automatically on application container start (as mentioned in architecture doc)
 */
async function main() {
  // Get database URL from environment variable or use default for local development
  const databaseUrl = env.DATABASE_URL || 'postgres://postgres:postgres@localhost:5432/wedding';

  // For migrations, we need a different client configuration (with max 1 connection)
  const migrationClient = postgres(databaseUrl, { max: 1 });
  
  console.log('🔄 Running database migrations...');
  
  try {
    // Create a separate drizzle instance for running migrations
    const db = drizzle(migrationClient);
    
    // Run migrations from the drizzle/migrations folder
    await migrate(db, { migrationsFolder: 'drizzle/migrations' });
    
    console.log('✅ Database migrations completed successfully');
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  } finally {
    // Close the migration client connection
    await migrationClient.end();
  }
}

// Run the migration function
main();
