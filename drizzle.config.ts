import type { Config } from 'drizzle-kit';

// Database URL from environment or fallback
const databaseUrl = process.env.DATABASE_URL || 'postgres://postgres:postgres@localhost:5432/wedding';

export default {
  schema: './src/lib/db/schema/*',
  out: './drizzle/migrations',
  dialect: 'postgresql',
  dbCredentials: {
    url: databaseUrl,
  },
  // Print all statements that are executed
  verbose: true,
  // Enable strict mode - ensures no data loss migrations
  strict: true,
} satisfies Config;
