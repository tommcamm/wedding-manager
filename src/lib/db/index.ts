import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { env } from '$env/dynamic/private';

// Get database URL from environment variable
const DATABASE_URL = env.DATABASE_URL || 'postgres://postgres:postgres@localhost:5432/wedding';

// Create PostgreSQL connection
const client = postgres(DATABASE_URL);

// Create Drizzle instance
export const db = drizzle(client);

// Export for use in server endpoints and hooks
export { client };
