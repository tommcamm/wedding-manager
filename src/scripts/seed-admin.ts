import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { user, account } from '../lib/db/schema/auth-schema.js';
import { eq } from 'drizzle-orm';
import { randomBytes } from 'crypto';
import bcrypt from 'bcrypt';
import 'dotenv/config';

// Create database connection
const databaseUrl =
	process.env.DATABASE_URL ?? 'postgres://postgres:postgres@localhost:5432/wedding';
const client = postgres(databaseUrl);
const db = drizzle(client);

/**
 * Script to create an initial admin user if none exists
 * Uses Better Auth compatible methods and environment configuration
 * Run with: pnpm tsx src/scripts/seed-admin.ts
 */
async function seedAdmin() {
	console.log('🔍 Checking for existing admin users...');

	try {
		// Check if any admin users already exist
		const existingAdmins = await db.select().from(user).where(eq(user.userType, 'ADMIN')).limit(1);

		if (existingAdmins.length > 0) {
			console.log('✅ Admin user already exists. Skipping admin creation.');
			return;
		}

		// Get admin configuration from environment variables
		const adminEmail = process.env.DEFAULT_ADMIN_EMAIL || 'admin@example.com';
		const adminPassword = process.env.DEFAULT_ADMIN_PASSWORD || 'change-me-on-first-login';
		const adminName = process.env.DEFAULT_ADMIN_NAME || 'Wedding Administrator';
		const adminUsername = process.env.DEFAULT_ADMIN_USERNAME || 'admin';

		console.log('👤 Creating default admin user...');

		// Generate secure IDs
		const userId = randomBytes(16).toString('hex');
		const accountId = randomBytes(16).toString('hex');

		// Hash password using bcrypt
		const passwordHash = await bcrypt.hash(adminPassword, 12);

		// Insert user record
		await db
			.insert(user)
			.values({
				id: userId,
				name: adminName,
				email: adminEmail,
				emailVerified: true,
				userType: 'ADMIN',
				adminRole: 'ADMIN',
				username: adminUsername,
				createdAt: new Date(),
				updatedAt: new Date()
			})
			.returning();

		// Insert account record for password authentication
		await db.insert(account).values({
			id: accountId,
			accountId: userId,
			providerId: 'credential', // Better Auth uses 'credential' for email/password
			userId: userId,
			password: passwordHash,
			createdAt: new Date(),
			updatedAt: new Date()
		});

		console.log('✅ Default admin user created successfully:');
		console.log(`   Username: ${adminUsername}`);
		console.log(`   Email: ${adminEmail}`);
		console.log(`   Password: ${adminPassword}`);
		console.log('');
		console.log('🔒 IMPORTANT: Please change this password after first login!');
		console.log('   You can do this through the admin interface after logging in.');
	} catch (error) {
		console.error('❌ Error creating admin user:', error);
		throw error;
	} finally {
		// Close database connection
		await client.end();
	}
}

// Run the function if this script is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
	seedAdmin()
		.catch((error) => {
			console.error('Failed to seed admin:', error);
			process.exit(1);
		})
		.finally(() => {
			process.exit(0);
		});
}

// Export for use in other scripts
export { seedAdmin };
