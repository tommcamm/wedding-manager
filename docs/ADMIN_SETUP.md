# Admin User Setup Guide

This guide explains how to set up and manage admin users in the Wedding Manager application.

## Overview

The Wedding Manager uses Better Auth with a unified user system that supports both admin users and guest users. Admin users have access to the administrative interface for managing invites, guests, communications, and settings.

## Default Admin User

### Automatic Creation

The application automatically creates a default admin user during the database migration process if no admin users exist. This ensures you always have access to the admin interface.

### Configuration

The default admin user is configured through environment variables in your `.env` file:

```env
# Default Admin User (only used if no admin exists)
DEFAULT_ADMIN_EMAIL=admin@example.com
DEFAULT_ADMIN_PASSWORD=change-me-on-first-login
DEFAULT_ADMIN_NAME=Wedding Administrator
DEFAULT_ADMIN_USERNAME=admin
```

**Important Security Notes:**
- Change the default password immediately after first login
- Use a strong, unique password for production environments
- Consider using a real email address for password recovery

## Setup Methods

### Method 1: Automatic (Recommended)

The default admin is automatically created when you run database migrations:

```bash
pnpm db:migrate
```

This method:
- Runs all database migrations
- Automatically creates the default admin if no admin users exist
- Is safe to run multiple times (idempotent)
- Works in both development and production environments

### Method 2: Manual Seeding

You can manually create the default admin user:

```bash
pnpm db:seed-admin
```

This method:
- Only creates the admin user (doesn't run migrations)
- Uses the same environment variable configuration
- Checks for existing admins before creating
- Useful for testing or specific deployment scenarios

### Method 3: Custom Script

For advanced use cases, you can import and use the `seedAdmin` function directly:

```typescript
import { seedAdmin } from './src/scripts/seed-admin.js';

await seedAdmin();
```

## Admin User Schema

Admin users in the database have the following key properties:

```typescript
{
  id: string;              // Unique identifier
  name: string;            // Display name
  email: string;           // Login email (unique)
  username: string;        // Admin username (unique)
  userType: 'ADMIN';       // User type (ADMIN vs GUEST)
  adminRole: 'ADMIN' | 'COORDINATOR' | 'OBSERVER'; // Admin permission level
  emailVerified: boolean;  // Email verification status
  createdAt: Date;         // Creation timestamp
  updatedAt: Date;         // Last update timestamp
}
```

## Admin Roles

The system supports three admin roles with different permission levels:

- **ADMIN**: Full administrative access
- **COORDINATOR**: Limited administrative access (future feature)
- **OBSERVER**: Read-only access (future feature)

Currently, the default admin is created with the `ADMIN` role for full access.

## Security Considerations

### Password Security
- Passwords are hashed using bcrypt with a cost factor of 12
- Never store plain text passwords
- Encourage strong passwords for all admin users

### Environment Variables
- Keep `.env` files secure and never commit them to version control
- Use different credentials for development, staging, and production
- Consider using secrets management in production environments

### Access Control
- Admin routes are protected by Better Auth middleware
- Sessions expire after 7 days by default
- Consider implementing additional security measures like 2FA for production

## Troubleshooting

### Admin Creation Fails
If admin creation fails, check:
1. Database connection is working
2. Environment variables are properly set
3. Database schema is up to date (run migrations)
4. No conflicting email/username exists

### Cannot Login
If you cannot login with the default admin:
1. Verify the credentials match your environment variables
2. Check that the admin user exists in the database
3. Ensure Better Auth is properly configured
4. Check browser console for authentication errors

### Reset Admin Password
To reset an admin password:
1. Update the `DEFAULT_ADMIN_PASSWORD` environment variable
2. Delete the existing admin user from the database
3. Run `pnpm db:seed-admin` to recreate with new password

## Production Deployment

For production deployments:

1. **Set secure environment variables:**
   ```env
   DEFAULT_ADMIN_EMAIL=your-admin@yourdomain.com
   DEFAULT_ADMIN_PASSWORD=your-secure-password
   DEFAULT_ADMIN_NAME=Your Name
   DEFAULT_ADMIN_USERNAME=yourusername
   ```

2. **Run migrations during deployment:**
   ```bash
   pnpm db:migrate
   ```

3. **Change the default password immediately after first login**

4. **Consider removing or changing the default admin environment variables after initial setup**

## Development Workflow

For local development:

1. Copy `.env.example` to `.env`
2. Update the admin credentials if desired
3. Run `pnpm db:migrate` to set up the database and create the admin
4. Access the admin interface at `/admin/login`
5. Login with your configured credentials

## Related Files

- `src/scripts/seed-admin.ts` - Admin seeding script
- `src/lib/db/migrate.ts` - Migration script with admin seeding
- `src/lib/auth.ts` - Better Auth configuration
- `src/lib/db/schema/auth-schema.ts` - Database schema definitions
- `.env.example` - Environment variable template
