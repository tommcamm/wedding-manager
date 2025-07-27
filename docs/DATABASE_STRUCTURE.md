# Wedding Manager Database Structure

This document describes the unified database structure that integrates better-auth with the wedding manager application, supporting both admin and guest users.

## Overview

The database has been redesigned to use a unified authentication system powered by better-auth, supporting two types of users:
- **Administrators**: Login with username/password, have role-based permissions
- **Guests**: Access via 6-character invite codes, get persistent sessions

## Core Tables

### 1. User Table (auth-schema.ts)

The central user table that handles both admin and guest users:

```sql
user {
  id: text (primary key)
  name: text (required)
  email: text (nullable, unique) -- Optional for guests
  emailVerified: boolean (default false)
  image: text (nullable)
  userType: enum ('ADMIN', 'GUEST') -- Distinguishes user types
  adminRole: enum ('ADMIN', 'COORDINATOR', 'OBSERVER') -- Only for admins
  inviteCode: varchar(6) -- Only for guests, links to invites
  username: text (nullable, unique) -- Only for admins
  createdAt: timestamp
  updatedAt: timestamp
}
```

### 2. Session Table (better-auth)

Manages sessions for both user types:

```sql
session {
  id: text (primary key)
  expiresAt: timestamp
  token: text (unique)
  createdAt: timestamp
  updatedAt: timestamp
  ipAddress: text
  userAgent: text
  userId: text (FK to user.id)
}
```

### 3. Account Table (better-auth)

Handles authentication credentials:

```sql
account {
  id: text (primary key)
  accountId: text
  providerId: text -- 'credentials' for admins, 'invite-code' for guests
  userId: text (FK to user.id)
  password: text -- Hashed password for admins
  -- ... other better-auth fields
}
```

### 4. Invites Table

Updated to support 6-character codes and link to users:

```sql
invites {
  code: varchar(6) (primary key) -- Updated from 5 to 6 characters
  deadline: timestamp
  locked: boolean
  language: varchar(2)
  notes: text
  plusOneAllowance: varchar(2)
  userId: text (FK to user.id) -- Links to guest user when they first access
  createdAt: timestamp
  updatedAt: timestamp
}
```

### 5. Guests Table

Individual guest records linked to invites:

```sql
guests {
  id: uuid (primary key)
  inviteCode: varchar(6) (FK to invites.code) -- Updated to 6 characters
  name: varchar(100)
  attending: boolean
  isPlusOne: boolean
  dietaryRequirements: text
  isChild: boolean
  childAge: integer
  createdAt: timestamp
  updatedAt: timestamp
}
```

## User Types and Authentication Flow

### Admin Users

**Creation:**
1. Use the setup script: `pnpm tsx src/scripts/setup-admin.ts`
2. Creates user record with `userType: 'ADMIN'`
3. Creates account record with `providerId: 'credentials'`

**Authentication:**
1. Login with username/password via better-auth
2. Session created and managed by better-auth
3. Role-based access control via `adminRole` field

**Roles:**
- `ADMIN`: Full system access
- `COORDINATOR`: Can modify guest/invite information
- `OBSERVER`: Read-only access

### Guest Users

**Creation:**
1. Guest enters 6-character invite code
2. System creates user record with `userType: 'GUEST'`
3. Links user to invite via `inviteCode` field
4. Creates persistent session

**Authentication:**
1. First visit: Enter invite code
2. System creates user and session
3. Subsequent visits: Automatic login via session
4. No need to re-enter invite code

## Database Relations

```
user (1) ←→ (many) session
user (1) ←→ (many) account
user (1) ←→ (1) invites [via inviteCode for guests]
invites (1) ←→ (many) guests
```

## Migration from Old Structure

The migration (`0001_charming_mauler.sql`) will:

1. ✅ Create new enums (`user_type`, `admin_role`)
2. ✅ Create better-auth tables (`user`, `session`, `account`, `verification`)
3. ✅ Drop old `admins` and `sessions` tables
4. ✅ Update invite codes from 5 to 6 characters
5. ✅ Add `userId` foreign key to invites table

## Setup Instructions

### 1. Run Migration

```bash
npx drizzle-kit push
```

### 2. Create Initial Admin

```bash
pnpm tsx src/scripts/setup-admin.ts
```

This creates:
- Username: `admin`
- Email: `admin@example.com`
- Password: `adminpassword`

**⚠️ Change the password after first login!**

### 3. Update Application Code

The following areas need updates to work with the new structure:

- **Authentication middleware**: Update to use better-auth sessions
- **Admin login**: Use better-auth credentials provider
- **Guest access**: Implement invite-code authentication
- **Authorization**: Check `userType` and `adminRole` fields
- **Database queries**: Update references from `admins` to `user` table

## Benefits of Unified Structure

✅ **Single Authentication System**: Both user types use better-auth
✅ **Persistent Guest Sessions**: No re-entering invite codes
✅ **Better Security**: Leverages better-auth's security features
✅ **Scalable**: Easy to add new user types or auth methods
✅ **Type Safety**: Full TypeScript support
✅ **Session Management**: Unified session handling

## Environment Variables

Ensure your `.env` file includes:

```env
# Database
DATABASE_URL="postgresql://..."

# Better Auth
BETTER_AUTH_SECRET="your-secret-key"
BETTER_AUTH_URL="http://localhost:3000" # or your domain
```

## TypeScript Types

All tables export TypeScript types:

```typescript
import type { User, NewUser, Session, Account } from '$lib/db/schema/auth-schema';
import type { Invite, NewInvite } from '$lib/db/schema/invites';
import type { Guest, NewGuest } from '$lib/db/schema/guests';
```

## Next Steps

1. Run the migration to update your database
2. Create an initial admin user
3. Update your application code to use the new unified structure
4. Test both admin and guest authentication flows
5. Update any existing references to the old `admins` table
