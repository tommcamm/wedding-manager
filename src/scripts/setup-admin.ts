/**
 * @deprecated This script is deprecated. Use the new admin seeding system instead.
 *
 * RECOMMENDED APPROACH:
 * 1. Configure admin credentials in your .env file:
 *    DEFAULT_ADMIN_EMAIL=admin@example.com
 *    DEFAULT_ADMIN_PASSWORD=your-secure-password
 *    DEFAULT_ADMIN_NAME=Wedding Administrator
 *    DEFAULT_ADMIN_USERNAME=admin
 *
 * 2. Run database migrations (which automatically creates the admin):
 *    pnpm db:migrate
 *
 * OR manually seed the admin:
 *    pnpm db:seed-admin
 *
 * See docs/ADMIN_SETUP.md for complete documentation.
 */

console.log('⚠️  This script is deprecated!');
console.log('');
console.log('Please use the new admin seeding system instead:');
console.log('');
console.log('1. Configure admin credentials in your .env file:');
console.log('   DEFAULT_ADMIN_EMAIL=admin@example.com');
console.log('   DEFAULT_ADMIN_PASSWORD=your-secure-password');
console.log('   DEFAULT_ADMIN_NAME=Wedding Administrator');
console.log('   DEFAULT_ADMIN_USERNAME=admin');
console.log('');
console.log('2. Run database migrations (automatically creates admin):');
console.log('   pnpm db:migrate');
console.log('');
console.log('OR manually seed the admin:');
console.log('   pnpm db:seed-admin');
console.log('');
console.log('📖 See docs/ADMIN_SETUP.md for complete documentation.');

process.exit(1);
