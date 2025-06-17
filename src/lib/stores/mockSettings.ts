import { writable } from 'svelte/store';

export type GiftRegistryItem = {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl?: string;
  isReserved: boolean;
  reservedBy?: string; // Guest ID
};

export type SystemSettings = {
  wedding: {
    date: Date;
    venue: string;
    address: string;
    timeStart: string;
    timeEnd: string;
  };
  rsvp: {
    deadline: Date;
    defaultMaxPlusOnes: number;
    allowDietaryRestrictions: boolean;
    allowGiftRegistry: boolean;
    allowNotes: boolean;
  };
  giftRegistry: {
    enabled: boolean;
    items: GiftRegistryItem[];
    cashGiftOptions: {
      enabled: boolean;
      paymentLinks: {
        name: string;
        url: string;
      }[];
      message: string;
    };
  };
  email: {
    fromName: string;
    fromEmail: string;
    replyTo: string;
    templates: {
      invitation: string;
      reminder: string;
      confirmation: string;
      thankyou: string;
    };
  };
};

// Default settings
const defaultSettings: SystemSettings = {
  wedding: {
    date: new Date('2026-06-15T16:00:00'),
    venue: 'Grand Palace Hotel',
    address: '1234 Wedding Lane, Celebration City',
    timeStart: '16:00',
    timeEnd: '23:00'
  },
  rsvp: {
    deadline: new Date('2026-04-30'),
    defaultMaxPlusOnes: 1,
    allowDietaryRestrictions: true,
    allowGiftRegistry: true,
    allowNotes: true
  },
  giftRegistry: {
    enabled: true,
    items: [
      {
        id: '1',
        name: 'Kitchen Mixer',
        description: 'Professional stand mixer for the new kitchen',
        price: 350,
        imageUrl: 'https://example.com/images/mixer.jpg',
        isReserved: false
      },
      {
        id: '2',
        name: 'Weekend Getaway',
        description: 'Contribute to our honeymoon fund',
        price: 250,
        imageUrl: 'https://example.com/images/getaway.jpg',
        isReserved: true,
        reservedBy: '1' // John Smith
      },
      {
        id: '3',
        name: 'Dining Set',
        description: 'Beautiful 6-person dining set for our new home',
        price: 800,
        imageUrl: 'https://example.com/images/dining.jpg',
        isReserved: false
      }
    ],
    cashGiftOptions: {
      enabled: true,
      paymentLinks: [
        {
          name: 'PayPal',
          url: 'https://paypal.me/tommyandsam'
        },
        {
          name: 'Venmo',
          url: 'https://venmo.me/tommyandsam'
        }
      ],
      message: 'A contribution to our future together is greatly appreciated.'
    }
  },
  email: {
    fromName: 'Tommy & Sammy',
    fromEmail: 'wedding@example.com',
    replyTo: 'tommy@example.com',
    templates: {
      invitation: 'We are delighted to invite you to our wedding celebration...',
      reminder: 'Just a friendly reminder to RSVP for our wedding...',
      confirmation: 'Thank you for your RSVP. We look forward to celebrating with you!',
      thankyou: 'Thank you for your lovely gift and for sharing our special day with us.'
    }
  }
};

// Create writable store
const { subscribe, set, update } = writable<SystemSettings>(defaultSettings);

// Define store actions
const settingsStore = {
  subscribe,
  update: (newSettings: Partial<SystemSettings>) => {
    update(settings => ({ ...settings, ...newSettings }));
  },
  updateSection: <K extends keyof SystemSettings>(
    section: K,
    data: Partial<SystemSettings[K]>
  ) => {
    update(settings => ({
      ...settings,
      [section]: {
        ...settings[section],
        ...data
      }
    }));
  },
  reset: () => set(defaultSettings),
  addGiftItem: (item: Omit<GiftRegistryItem, 'id' | 'isReserved'>) => {
    update(settings => {
      const items = settings.giftRegistry.items;
      const newId = (Math.max(...items.map(i => parseInt(i.id))) + 1).toString();
      
      return {
        ...settings,
        giftRegistry: {
          ...settings.giftRegistry,
          items: [
            ...items,
            {
              ...item,
              id: newId,
              isReserved: false
            }
          ]
        }
      };
    });
  },
  reserveGiftItem: (itemId: string, guestId: string) => {
    update(settings => {
      const updatedItems = settings.giftRegistry.items.map(item => 
        item.id === itemId 
          ? { ...item, isReserved: true, reservedBy: guestId }
          : item
      );
      
      return {
        ...settings,
        giftRegistry: {
          ...settings.giftRegistry,
          items: updatedItems
        }
      };
    });
  }
};

export default settingsStore;
