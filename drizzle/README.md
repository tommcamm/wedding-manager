# Drizzle ORM - Database Management

This directory contains database migrations for the Wedding Manager project using [Drizzle ORM](https://orm.drizzle.team/).

## Database Structure

The application uses PostgreSQL with the following tables:

- **invites**: Stores invitation data with 5-character shortcodes as primary keys
- **guests**: Stores individual guest information with references to invites
- **admins**: Stores admin user accounts for authentication
- **sessions**: Stores authentication sessions
- **jobs**: Stores background jobs for BullMQ

## Working with Migrations

### Generate Migrations

To generate a new migration based on schema changes:

```bash
pnpm db:generate
```

This will compare your schema definitions in `src/lib/db/schema` with the current database state and create migration files in `drizzle/migrations`.

### Run Migrations

To apply pending migrations to the database:

```bash
pnpm db:migrate
```

This script will run all pending migrations. It is safe to run multiple times - only unapplied migrations will be executed.

### Database Studio

To visually explore your database:

```bash
pnpm db:studio
```

This opens a web interface where you can browse and manage your database content.

## Development Workflow

1. Make changes to schema files in `src/lib/db/schema/`
2. Generate a migration using `pnpm db:generate`
3. Review the generated SQL in `drizzle/migrations/`
4. Apply the migration with `pnpm db:migrate`
5. Use the repositories in `src/lib/db/repositories/` to interact with the database

## Connection Management

Database connections are automatically managed:

- The main connection is initialized in `src/lib/db/index.ts`
- Connections are properly closed on server shutdown via `handleServerShutdown` in `src/hooks.server.ts`
