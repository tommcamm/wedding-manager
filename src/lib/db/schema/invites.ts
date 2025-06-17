import { pgTable, text, timestamp, boolean, varchar } from 'drizzle-orm/pg-core';

// Invites table - stores invite code and associated metadata
export const invites = pgTable('invites', {
  // 5-character shortcode as primary key (unique identifier for each invitation)
  code: varchar('code', { length: 5 }).primaryKey(),
  
  // Deadline after which RSVP becomes locked
  deadline: timestamp('deadline').notNull(),
  
  // Whether this invite is locked (after deadline passes)
  locked: boolean('locked').notNull().default(false),
  
  // Preferred language for this invite
  language: varchar('language', { length: 2 }).notNull().default('en'),
  
  // Notes from couple to this specific invitee/family
  notes: text('notes'),
  
  // Number of +1s allowed for this invite
  plusOneAllowance: varchar('plus_one_allowance', { length: 2 }).notNull().default('0'),
  
  // Timestamps
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow()
});

// Type definitions for TypeScript
export type Invite = typeof invites.$inferSelect;
export type NewInvite = typeof invites.$inferInsert;
