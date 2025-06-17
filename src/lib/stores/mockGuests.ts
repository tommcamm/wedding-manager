import { writable } from 'svelte/store';

export type DietaryRestriction = 
  | 'vegetarian'
  | 'vegan'
  | 'gluten-free'
  | 'dairy-free'
  | 'nut-allergy'
  | 'shellfish-allergy'
  | 'other';

export type Guest = {
  id: string;
  inviteId: string;
  name: string;
  email?: string;
  phone?: string;
  attending: boolean | null; // null means not responded yet
  isPlusOne: boolean;
  dietaryRestrictions: DietaryRestriction[];
  otherDietaryNotes?: string;
  createdAt: Date;
};

// Sample guest data
const initialGuests: Guest[] = [
  // Smith Family (Invite #1)
  {
    id: '1',
    inviteId: '1',
    name: 'John Smith',
    email: 'john.smith@example.com',
    attending: true,
    isPlusOne: false,
    dietaryRestrictions: [],
    createdAt: new Date('2025-01-15')
  },
  {
    id: '2',
    inviteId: '1',
    name: 'Jane Smith',
    attending: true,
    isPlusOne: false,
    dietaryRestrictions: ['vegetarian'],
    createdAt: new Date('2025-01-15')
  },
  // Plus one for Smith family
  {
    id: '3',
    inviteId: '1',
    name: 'Samantha Jones',
    attending: true,
    isPlusOne: true,
    dietaryRestrictions: ['gluten-free', 'dairy-free'],
    otherDietaryNotes: 'Severe celiac disease',
    createdAt: new Date('2025-02-10')
  },
  
  // Rossi Family (Invite #2)
  {
    id: '4',
    inviteId: '2',
    name: 'Marco Rossi',
    attending: true,
    isPlusOne: false,
    dietaryRestrictions: [],
    createdAt: new Date('2025-01-16')
  },
  {
    id: '5',
    inviteId: '2',
    name: 'Giulia Rossi',
    attending: false, // Not attending
    isPlusOne: false,
    dietaryRestrictions: [],
    createdAt: new Date('2025-01-16')
  },
  
  // Chang Family (Invite #3)
  {
    id: '6',
    inviteId: '3',
    name: 'Li Chang',
    attending: null, // Not responded yet
    isPlusOne: false,
    dietaryRestrictions: [],
    createdAt: new Date('2025-01-17')
  },
  {
    id: '7',
    inviteId: '3',
    name: 'Wei Chang',
    attending: null, // Not responded yet
    isPlusOne: false,
    dietaryRestrictions: [],
    createdAt: new Date('2025-01-17')
  },
  
  // Johnson Family (Invite #4, locked)
  {
    id: '8',
    inviteId: '4',
    name: 'Robert Johnson',
    attending: true,
    isPlusOne: false,
    dietaryRestrictions: ['nut-allergy'],
    createdAt: new Date('2025-01-18')
  },
  {
    id: '9',
    inviteId: '4',
    name: 'Mary Johnson',
    attending: true,
    isPlusOne: false,
    dietaryRestrictions: [],
    createdAt: new Date('2025-01-18')
  }
];

// Create writable store
const { subscribe, set, update } = writable<Guest[]>(initialGuests);

// Store actions
const guestsStore = {
  subscribe,
  add: (guest: Omit<Guest, 'id' | 'createdAt'>) => {
    update(guests => [
      ...guests,
      {
        ...guest,
        id: (Math.max(...guests.map(g => parseInt(g.id))) + 1).toString(),
        createdAt: new Date()
      }
    ]);
  },
  update: (id: string, data: Partial<Guest>) => {
    update(guests =>
      guests.map(guest =>
        guest.id === id ? { ...guest, ...data } : guest
      )
    );
  },
  remove: (id: string) => {
    update(guests => guests.filter(guest => guest.id !== id));
  },
  getByInviteId: (inviteId: string) => {
    let result: Guest[] = [];
    
    subscribe(guests => {
      result = guests.filter(guest => guest.inviteId === inviteId);
    })();
    
    return result;
  },
  reset: () => set(initialGuests)
};

export default guestsStore;
