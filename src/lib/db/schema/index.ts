// Export all schema definitions

// Auth schema (better-auth tables)
export * from './auth-schema';

// Application tables
export * from './invites';
export * from './guests';
export * from './jobs';

// Relations
import { relations } from 'drizzle-orm';
import { user, session } from './auth-schema';
import { invites } from './invites';
import { guests } from './guests';

// Define relationships between tables
export const userRelations = relations(user, ({ many, one }) => ({
	sessions: many(session),
	invite: one(invites, {
		fields: [user.inviteCode],
		references: [invites.code]
	})
}));

export const sessionRelations = relations(session, ({ one }) => ({
	user: one(user, {
		fields: [session.userId],
		references: [user.id]
	})
}));

export const invitesRelations = relations(invites, ({ many, one }) => ({
	guests: many(guests),
	user: one(user, {
		fields: [invites.userId],
		references: [user.id]
	})
}));

export const guestsRelations = relations(guests, ({ one }) => ({
	invite: one(invites, {
		fields: [guests.inviteCode],
		references: [invites.code]
	})
}));
