import { pgTable, timestamp, varchar, text, uuid } from 'drizzle-orm/pg-core';
import { admins } from './admins';

// Sessions table - stores authentication sessions for Better Auth
export const sessions = pgTable('sessions', {
  // Unique session ID
  id: uuid('id').primaryKey().defaultRandom(),
  
  // User ID (admin) the session belongs to
  userId: uuid('user_id')
    .notNull()
    .references(() => admins.id, { onDelete: 'cascade' }),
  
  // Session data (serialized)
  data: text('data'),
  
  // IP address where the session was created
  ipAddress: varchar('ip_address', { length: 45 }),
  
  // User agent that created the session
  userAgent: text('user_agent'),
  
  // Session expiry timestamp
  expiresAt: timestamp('expires_at').notNull(),
  
  // Timestamps
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow()
});

// Type definitions for TypeScript
export type Session = typeof sessions.$inferSelect;
export type NewSession = typeof sessions.$inferInsert;
