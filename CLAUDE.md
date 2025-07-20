# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Tommy's Wedding Manager is a multilingual SvelteKit application for managing wedding invitations, RSVPs, and guest management. The application uses a unique 5-character shortcode system for invites and supports English, Italian, and Chinese localization.

## Development Commands

### Primary Commands
- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm preview` - Preview production build
- `pnpm check` - Type check with svelte-check
- `pnpm lint` - Run linter (prettier + eslint)
- `pnpm format` - Format code with prettier
- `pnpm test` - Run unit tests
- `pnpm test:unit` - Run unit tests in watch mode

### Database Commands
- `pnpm db:generate` - Generate new database migrations
- `pnpm db:migrate` - Apply migrations to database
- `pnpm db:studio` - Open Drizzle Studio for database management

### Docker Development Setup
- `docker compose -f docker-compose.dev.yml up -d` - Start development services (PostgreSQL, Redis, MinIO, MailHog)
- `docker compose -f docker-compose.dev.yml down` - Stop development services
- Access MailHog at http://localhost:8025 for email testing
- Access MinIO Console at http://localhost:9001

## Architecture

### Core Technologies
- **Frontend**: SvelteKit 5 with TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: Better-Auth with bcrypt
- **Styling**: TailwindCSS 4
- **Internationalization**: Paraglide JS
- **Package Manager**: pnpm

### Key Database Tables
- `invites` - Invitation data with 5-character shortcodes as primary keys
- `guests` - Individual guest information linked to invites
- `admins` - Admin user accounts for authentication
- `sessions` - Authentication sessions
- `jobs` - Background jobs for BullMQ

### Route Structure
- `/` - Main landing page
- `/admin/*` - Admin dashboard (protected)
- `/invite/[code]` - Guest invitation pages with unique shortcodes
- `/invite/[code]/rsvp` - RSVP form
- `/invite/[code]/dietary` - Dietary preferences
- `/invite/[code]/gifts` - Gift registry
- `/invite/[code]/notes` - Notes to couple

### Database Schema Location
Database schemas are in `src/lib/db/schema/` with relations defined in `src/lib/db/schema/index.ts`. Use the repository pattern from `src/lib/db/repositories/` for data access.

### Environment Setup
Create `.env` file from `.env.example` before starting development. The application expects PostgreSQL, Redis, and MinIO to be running (provided by docker-compose.dev.yml).

### Internationalization
- Translation files in `messages/` directory (en.json, it.json)
- Paraglide JS generates type-safe translations in `src/lib/paraglide/`
- Language selection via URL parameter or invite configuration

### Testing
- Unit tests use Vitest with Testing Library
- Tests located alongside source files (*.test.ts, *.spec.ts)
- Mock data available in `src/lib/stores/mock*`