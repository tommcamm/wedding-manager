import { pgTable, varchar, timestamp, text, uuid, pgEnum } from 'drizzle-orm/pg-core';

// Enum for admin roles with wedding-specific terminology
export const adminRoleEnum = pgEnum('admin_role', ['ADMIN', 'COORDINATOR', 'OBSERVER']);

// Admins table - stores admin user data for authentication
export const admins = pgTable('admins', {
  // Unique identifier for each admin
  id: uuid('id').primaryKey().defaultRandom(),
  
  // Admin's email (used for login)
  email: varchar('email', { length: 255 }).notNull().unique(),
  
  // Hashed password
  passwordHash: text('password_hash').notNull(),
  
  // Admin's full name
  name: varchar('name', { length: 100 }).notNull(),
  
  // Admin's role/permission level
  // ADMIN - Full system access
  // COORDINATOR - Can modify guest/invite information
  // OBSERVER - Can only view information
  role: adminRoleEnum('role').notNull().default('ADMIN'),
  
  // Timestamps
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
  
  // Optional email verification timestamp
  emailVerified: timestamp('email_verified')
});

// Type definitions for TypeScript
export type Admin = typeof admins.$inferSelect;
export type NewAdmin = typeof admins.$inferInsert;
