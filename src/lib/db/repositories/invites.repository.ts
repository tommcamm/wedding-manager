import { db } from '$lib/db';
import { invites, guests, type Invite, type NewInvite, type Guest, type NewGuest } from '$lib/db/schema';
import { eq, and, asc } from 'drizzle-orm';

/**
 * Repository for invite-related database operations
 */
export const invitesRepository = {
  /**
   * Create a new invite
   */
  create: async (data: NewInvite) => {
    const [invite] = await db.insert(invites).values(data).returning();
    return invite;
  },

  /**
   * Get an invite by its unique code
   */
  getByCode: async (code: string) => {
    const [invite] = await db
      .select()
      .from(invites)
      .where(eq(invites.code, code));
      
    return invite || null;
  },

  /**
   * Get an invite with all its guests
   */
  getByCodeWithGuests: async (code: string) => {
    const [invite] = await db
      .select()
      .from(invites)
      .where(eq(invites.code, code));
    
    if (!invite) return null;
    
    const inviteGuests = await db
      .select()
      .from(guests)
      .where(eq(guests.inviteCode, code))
      .orderBy(asc(guests.createdAt));
    
    return {
      invite,
      guests: inviteGuests
    };
  },

  /**
   * Update an invite
   */
  update: async (code: string, data: Partial<Invite>) => {
    const [updated] = await db
      .update(invites)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(invites.code, code))
      .returning();
      
    return updated;
  },

  /**
   * Delete an invite and all associated guests (cascading)
   */
  delete: async (code: string) => {
    await db.delete(invites).where(eq(invites.code, code));
  },

  /**
   * Lock an invite (e.g., after RSVP deadline)
   */
  lock: async (code: string) => {
    const [updated] = await db
      .update(invites)
      .set({ locked: true, updatedAt: new Date() })
      .where(eq(invites.code, code))
      .returning();
      
    return updated;
  },

  /**
   * Get all invites with optional filtering and pagination
   */
  getAll: async ({ offset = 0, limit = 50, language = null }: { 
    offset?: number; 
    limit?: number; 
    language?: string | null; 
  } = {}) => {
    let whereClause = undefined;
    
    if (language) {
      whereClause = eq(invites.language, language);
    }
    
    return db
      .select()
      .from(invites)
      .where(whereClause)
      .limit(limit)
      .offset(offset)
      .orderBy(asc(invites.createdAt));
  },

  /**
   * Add a guest to an invite
   */
  addGuest: async (inviteCode: string, guestData: Omit<NewGuest, 'inviteCode'>) => {
    const [guest] = await db
      .insert(guests)
      .values({ ...guestData, inviteCode })
      .returning();
      
    return guest;
  },

  /**
   * Remove a guest from an invite
   */
  removeGuest: async (guestId: string) => {
    await db.delete(guests).where(eq(guests.id, guestId));
  },

  /**
   * Update a guest's information
   */
  updateGuest: async (guestId: string, data: Partial<Guest>) => {
    const [updated] = await db
      .update(guests)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(guests.id, guestId))
      .returning();
      
    return updated;
  }
};
