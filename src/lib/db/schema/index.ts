// Export all schema definitions

// Tables
export * from './invites';
export * from './guests';
export * from './admins';
export * from './sessions';
export * from './jobs';

// Relations
import { relations } from 'drizzle-orm';
import { invites } from './invites';
import { guests } from './guests';
import { admins } from './admins';
import { sessions } from './sessions';

// Define relationships between tables
export const invitesRelations = relations(invites, ({ many }) => ({
  guests: many(guests)
}));

export const guestsRelations = relations(guests, ({ one }) => ({
  invite: one(invites, {
    fields: [guests.inviteCode],
    references: [invites.code]
  })
}));

export const adminsRelations = relations(admins, ({ many }) => ({
  sessions: many(sessions)
}));

export const sessionsRelations = relations(sessions, ({ one }) => ({
  admin: one(admins, {
    fields: [sessions.userId],
    references: [admins.id]
  })
}));
