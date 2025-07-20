import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { DATABASE_URL } from '$env/static/private';

// Create PostgreSQL connection
const client = postgres(DATABASE_URL);

// Create Drizzle instance
export const db = drizzle(client);

// Export for use in server endpoints and hooks
export { client };
