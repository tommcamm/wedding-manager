import { drizzle } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import postgres from 'postgres';
import 'dotenv/config';
import { seedAdmin } from '../../scripts/seed-admin';

async function main() {
	const databaseUrl =
		process.env.DATABASE_URL ?? 'postgres://postgres:postgres@localhost:5432/wedding';

	const migrationClient = postgres(databaseUrl, { max: 1 });

	console.log('🔄 Running database migrations...');

	try {
		// Create a separate drizzle instance for running migrations
		const db = drizzle(migrationClient);

		// Run migrations from the drizzle/migrations folder
		await migrate(db, { migrationsFolder: 'drizzle/migrations' });

		console.log('✅ Database migrations completed successfully');

		// Close the migration client connection
		await migrationClient.end();

		// Seed default admin user if none exists
		console.log('🌱 Seeding default admin user...');
		await seedAdmin();
	} catch (error) {
		console.error('❌ Migration failed:', error);
		process.exit(1);
	}
}

// Run the migration function
main();
