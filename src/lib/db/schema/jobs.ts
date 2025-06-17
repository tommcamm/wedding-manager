import { pgTable, timestamp, text, integer, jsonb, uuid } from 'drizzle-orm/pg-core';

// Jobs table - stores background jobs for BullMQ
export const jobs = pgTable('jobs', {
  // Unique job ID
  id: uuid('id').primaryKey().defaultRandom(),
  
  // Job queue name
  queue: text('queue').notNull(),
  
  // Job name/type
  name: text('name').notNull(),
  
  // Job data (payload)
  data: jsonb('data'),
  
  // Job status
  status: text('status').notNull().default('pending'),
  
  // Number of attempts made
  attempts: integer('attempts').notNull().default(0),
  
  // Maximum number of attempts
  maxAttempts: integer('max_attempts').notNull().default(3),
  
  // Processing priority (lower is higher priority)
  priority: integer('priority').notNull().default(0),
  
  // When to process the job (for delayed jobs)
  processAt: timestamp('process_at').notNull().defaultNow(),
  
  // When the job started processing
  startedAt: timestamp('started_at'),
  
  // When the job finished processing
  finishedAt: timestamp('finished_at'),
  
  // Error information if the job failed
  error: text('error'),
  
  // Timestamps
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow()
});

// Type definitions for TypeScript
export type Job = typeof jobs.$inferSelect;
export type NewJob = typeof jobs.$inferInsert;
