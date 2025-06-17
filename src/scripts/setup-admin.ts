import { db } from '$lib/db';
import { admins } from '$lib/db/schema';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcrypt';

/**
 * Script to create an initial admin user
 * Run with: pnpm tsx src/scripts/setup-admin.ts
 */
async function createAdmin() {
  // Generate a secure password hash
  const passwordHash = await bcrypt.hash('adminpassword', 10);
  
  try {
    // Insert admin record
    const [admin] = await db.insert(admins).values({
      id: uuidv4(),
      email: 'admin@example.com',
      passwordHash,
      name: 'Wedding Admin',
      role: 'admin',
      emailVerified: new Date()
    }).returning();
    
    console.log('✅ Admin user created successfully:');
    console.log(`   Email: ${admin.email}`);
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
