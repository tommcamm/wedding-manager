import { writable } from 'svelte/store';

export type Invite = {
  id: string;
  code: string;
  familyName: string;
  email: string;
  phone?: string;
  address?: string;
  maxPlusOnes: number;
  locked: boolean;
  language: 'en' | 'it' | 'zh';
  createdAt: Date;
  notes?: string;
  rsvpDeadline: Date;
};

// Create some sample invites
const initialInvites: Invite[] = [
  {
    id: '1',
    code: 'SMITH',
    familyName: 'Smith Family',
    email: 'smith@example.com',
    phone: '+1 555-123-4567',
    address: '123 Main St, Anytown, USA',
    maxPlusOnes: 2,
    locked: false,
    language: 'en',
    createdAt: new Date('2025-01-15'),
    rsvpDeadline: new Date('2026-04-30')
  },
  {
    id: '2',
    code: 'ROSSI',
    familyName: 'Famiglia Rossi',
    email: 'rossi@example.com',
    phone: '+39 02 1234567',
    address: 'Via Roma 42, Milano, Italia',
    maxPlusOnes: 0,
    locked: false,
    language: 'it',
    createdAt: new Date('2025-01-16'),
    notes: 'Close friends from Italy',
    rsvpDeadline: new Date('2026-04-30')
  },
  {
    id: '3',
    code: 'CHANG',
    familyName: '张家',
    email: 'chang@example.com',
    maxPlusOnes: 1,
    locked: false,
    language: 'zh',
    createdAt: new Date('2025-01-17'),
    rsvpDeadline: new Date('2026-04-30')
  },
  {
    id: '4',
    code: 'JOHNS',
    familyName: 'Johnson Family',
    email: 'johnson@example.com',
    maxPlusOnes: 0,
    locked: true, // This invite is locked (past deadline)
    language: 'en',
    createdAt: new Date('2025-01-18'),
    rsvpDeadline: new Date('2026-03-15') // Past deadline
  }
];

// Create the writable store
const { subscribe, set, update } = writable<Invite[]>(initialInvites);

// Define store actions
const invitesStore = {
  subscribe,
  add: (invite: Omit<Invite, 'id' | 'createdAt'>) => {
    update(invites => [
      ...invites,
      { 
        ...invite, 
        id: (Math.max(...invites.map(i => parseInt(i.id))) + 1).toString(),
        createdAt: new Date()
      }
    ]);
  },
  update: (id: string, data: Partial<Invite>) => {
    update(invites => 
      invites.map(invite => 
        invite.id === id ? { ...invite, ...data } : invite
      )
    );
  },
  remove: (id: string) => {
    update(invites => invites.filter(invite => invite.id !== id));
  },
  getByCode: (code: string) => {
    let result: Invite | undefined;
    
    // Use the subscribe method to get the current value
    subscribe(invites => {
      result = invites.find(invite => invite.code === code);
    })();
    
    return result;
  },
  reset: () => set(initialInvites)
};

export default invitesStore;
