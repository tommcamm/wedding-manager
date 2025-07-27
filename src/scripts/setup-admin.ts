import { db } from '$lib/db';
import { user, account } from '$lib/db/schema';
import { randomBytes } from 'crypto';
import bcrypt from 'bcrypt';

/**
 * Script to create an initial admin user
 * Run with: pnpm tsx src/scripts/setup-admin.ts
 */
async function createAdmin() {
	const userId = randomBytes(16).toString('hex');
	const accountId = randomBytes(16).toString('hex');

	// Generate a secure password hash
	const passwordHash = await bcrypt.hash('adminpassword', 10);

	try {
		// Insert user record
		const [adminUser] = await db
			.insert(user)
			.values({
				id: userId,
				name: 'Wedding Admin',
				email: 'admin@example.com',
				emailVerified: true,
				userType: 'ADMIN',
				adminRole: 'ADMIN',
				username: 'admin',
				createdAt: new Date(),
				updatedAt: new Date()
			})
			.returning();

		// Insert account record for password authentication
		await db.insert(account).values({
			id: accountId,
			accountId: userId,
			providerId: 'credentials',
			userId: userId,
			password: passwordHash,
			createdAt: new Date(),
			updatedAt: new Date()
		});

		console.log('✅ Admin user created successfully:');
		console.log(`   Username: admin`);
		console.log(`   Email: ${adminUser.email}`);
		console.log('   Password: adminpassword');
		console.log('   Please change this password after first login!');
	} catch (error) {
		console.error('❌ Error creating admin user:', error);
	}
}

// Run the function
createAdmin()
	.catch(console.error)
	.finally(() => {
		process.exit(0);
	});
