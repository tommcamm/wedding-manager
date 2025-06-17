# Database Layer with Drizzle ORM

This directory contains the database layer implementation for the Wedding Manager using Drizzle ORM.

## Directory Structure

- `index.ts` - Database connection setup
- `migrate.ts` - Database migration script
- `schema/` - Database schema definitions
  - `invites.ts` - Invites table schema
  - `guests.ts` - Guests table schema
  - `admins.ts` - Admins table schema
  - `sessions.ts` - Sessions table schema
  - `jobs.ts` - Background jobs table schema
  - `index.ts` - Schema and relations exports
- `repositories/` - Repository pattern implementations
  - `invites.repository.ts` - Invites CRUD operations

## Getting Started

1. Create an `.env` file based on `.env.example`:
   ```bash
   cp .env.example .env
   ```

2. Start the PostgreSQL database (and other services):
   ```bash
   docker compose -f docker-compose.dev.yml up -d
   ```

3. Generate database migrations:
   ```bash
   pnpm db:generate
   ```

4. Apply migrations to the database:
   ```bash
   pnpm db:migrate
   ```

## Database Schema

The database schema includes the following tables:

- **invites**: Stores invitation data with 5-character shortcodes as primary keys
- **guests**: Stores individual guest information with references to invites
- **admins**: Stores admin user accounts for authentication
- **sessions**: Stores authentication sessions
- **jobs**: Stores background jobs for BullMQ

## Usage Example

```typescript
import { db } from '$lib/db';
import { invites, guests } from '$lib/db/schema';
import { eq } from 'drizzle-orm';

// Query example
const result = await db.select()
  .from(invites)
  .where(eq(invites.code, 'ABC12'));

// Insert example
const [newInvite] = await db.insert(invites)
  .values({
    code: 'XYZ45',
    deadline: new Date('2026-05-01'),
    language: 'en'
  })
  .returning();

// Use repository pattern (recommended)
import { invitesRepository } from '$lib/db/repositories';

const invite = await invitesRepository.getByCode('ABC12');
```

## Repository Pattern

The repository pattern is used to abstract database operations and provide a clean API for data access. Each repository encapsulates CRUD operations for a specific entity.

## Further Development

To add more repositories or schema tables, follow the existing patterns in the respective directories.
