import { pgTable, text, timestamp, boolean, varchar, integer, uuid } from 'drizzle-orm/pg-core';
import { invites } from './invites';

// Guests table - stores individual guest information with foreign key to invites
export const guests = pgTable('guests', {
  // Unique identifier for each guest
  id: uuid('id').primaryKey().defaultRandom(),
  
  // Foreign key to invites table - which invite this guest belongs to
  inviteCode: varchar('invite_code', { length: 5 })
    .notNull()
    .references(() => invites.code, { onDelete: 'cascade' }),
  
  // Guest's full name
  name: varchar('name', { length: 100 }).notNull(),
  
  // Whether guest has confirmed attendance
  attending: boolean('attending'),
  
  // Whether this is a +1 (added by the invitee) or named on the original invite
  isPlusOne: boolean('is_plus_one').notNull().default(false),
  
  // Dietary requirements/preferences
  dietaryRequirements: text('dietary_requirements'),
  
  // Is this guest a child (for meal planning)
  isChild: boolean('is_child').notNull().default(false),
  
  // Age of child, if applicable
  childAge: integer('child_age'),
  
  // Timestamps
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow()
});

// Type definitions for TypeScript
export type Guest = typeof guests.$inferSelect;
export type NewGuest = typeof guests.$inferInsert;
