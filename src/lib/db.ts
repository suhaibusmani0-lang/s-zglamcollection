import { MongoClient, Db } from 'mongodb';
import { LiveShow, PaymentEntry, PastWinner, PaymentAccountSettings } from './types';

const DEFAULT_PRIZE = {
  title: '24K Gold Plated Royal Kundan & Pearl Bridal Choker Set',
  retailValue: 245,
  imageUrl: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=1200&auto=format&fit=crop',
  description: 'Exquisite handcrafted bridal choker necklace adorned with uncut polki kundan stones, green tourmaline drop beads, and matching chandelier jhumkas + maang tikka. Hypoallergenic & nickel-free.'
};

const DEFAULT_SETTINGS: PaymentAccountSettings = {
  zelle: {
    enabled: true,
    recipientName: 'S&Z Glam Collection LLC',
    email: 'pay@szglamcollection.com',
    phone: '(929) 600-1937',
    notes: 'Free instant transfer from any US bank app (Chase, BoA, Wells Fargo, Citi, Capital One). Please put your TikTok username in the memo.'
  },
  venmo: {
    enabled: true,
    handle: '@snzglam',
    displayName: 'S&Z Glam Collection',
    link: 'https://venmo.com/u/snzglam',
    notes: 'Please add your TikTok username in the "What is this for?" note. Turn OFF goods/services toggle if paying directly.'
  },
  cashApp: {
    enabled: true,
    cashtag: '$SZGlamLive',
    link: 'https://cash.app/$SZGlamLive',
    notes: 'Include your TikTok handle in the notes field.'
  },
  paypal: {
    enabled: true,
    paypalMe: 'snzglam',
    link: 'https://paypal.me/snzglam',
    notes: 'Select "Friends & Family" to avoid delays. Mention your TikTok handle.'
  },
  tiktok: {
    username: '@snzglam',
    liveUrl: 'https://www.tiktok.com/@snzglam/live'
  },
  supportPhone: '+1 (929) 600-1937',
  supportEmail: 'orders@szglamcollection.com'
};

const initialEndTime = new Date(Date.now() + 28 * 60 * 1000).toISOString();

let mockShow: LiveShow = {
  id: 'show-live-current',
  title: 'Friday Luxury Kundan & Bridal Drop #42',
  status: 'PAYMENT_WINDOW',
  tiktokLiveUrl: 'https://www.tiktok.com/@szglamcollection/live',
  timerEndTime: initialEndTime,
  timerDurationMinutes: 30,
  featuredPrize: DEFAULT_PRIZE,
  startedAt: new Date(Date.now() - 35 * 60 * 1000).toISOString(),
  endedAt: null,
  winner: null
};

let mockEntries: PaymentEntry[] = [
  {
    id: 'entry-1',
    ticketNumber: 'SZ-9041',
    showId: 'show-live-current',
    tiktokHandle: '@priya_nyc',
    fullName: 'Priya Patel',
    phone: '(201) 555-0193',
    email: 'priya.patel@gmail.com',
    amountPaid: 120.00,
    paymentMethod: 'ZELLE',
    transactionReference: 'Zelle Ref #89301294',
    receiptUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?q=80&w=800&auto=format&fit=crop',
    shippingAddress: {
      street: '142 Forest Ave',
      aptSuite: 'Apt 4B',
      city: 'Jersey City',
      state: 'NJ',
      zip: '07302'
    },
    status: 'APPROVED',
    isEligibleForGiveaway: true,
    isWinner: false,
    createdAt: new Date(Date.now() - 14 * 60 * 1000).toISOString()
  },
  {
    id: 'entry-2',
    ticketNumber: 'SZ-9042',
    showId: 'show-live-current',
    tiktokHandle: '@amrit_dhillon',
    fullName: 'Amrit Dhillon',
    phone: '(516) 555-8421',
    email: 'amrit.d@outlook.com',
    amountPaid: 85.00,
    paymentMethod: 'VENMO',
    transactionReference: 'Venmo to @szglamcollection',
    receiptUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?q=80&w=800&auto=format&fit=crop',
    shippingAddress: {
      street: '782 Hillside Blvd',
      city: 'New Hyde Park',
      state: 'NY',
      zip: '11040'
    },
    status: 'APPROVED',
    isEligibleForGiveaway: true,
    isWinner: false,
    createdAt: new Date(Date.now() - 11 * 60 * 1000).toISOString()
  },
  {
    id: 'entry-3',
    ticketNumber: 'SZ-9043',
    showId: 'show-live-current',
    tiktokHandle: '@jasleen.brampton',
    fullName: 'Jasleen Kaur',
    phone: '(917) 555-4491',
    email: 'jasleenk@gmail.com',
    amountPaid: 165.00,
    paymentMethod: 'ZELLE',
    transactionReference: 'Chase QuickPay #04921',
    receiptUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?q=80&w=800&auto=format&fit=crop',
    shippingAddress: {
      street: '350 5th Ave',
      aptSuite: 'Suite 2200',
      city: 'New York',
      state: 'NY',
      zip: '10118'
    },
    status: 'APPROVED',
    isEligibleForGiveaway: true,
    isWinner: false,
    createdAt: new Date(Date.now() - 8 * 60 * 1000).toISOString()
  },
  {
    id: 'entry-4',
    ticketNumber: 'SZ-9044',
    showId: 'show-live-current',
    tiktokHandle: '@simran_sandhu_ca',
    fullName: 'Simran Sandhu',
    phone: '(408) 555-7729',
    email: 'simran.sandhu@yahoo.com',
    amountPaid: 95.00,
    paymentMethod: 'CASH_APP',
    transactionReference: 'CashApp $SZGlamLive',
    receiptUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?q=80&w=800&auto=format&fit=crop',
    shippingAddress: {
      street: '921 Silicon Valley Way',
      city: 'Fremont',
      state: 'CA',
      zip: '94538'
    },
    status: 'APPROVED',
    isEligibleForGiveaway: true,
    isWinner: false,
    createdAt: new Date(Date.now() - 4 * 60 * 1000).toISOString()
  }
];

let mockWinners: PastWinner[] = [
  {
    id: 'win-1',
    ticketNumber: 'SZ-8831',
    tiktokHandle: '@harpreet_seattle',
    fullName: 'Harpreet Gill',
    prizeTitle: 'Emerald Green Mughal Kundan Choker & Matha Patti Set',
    prizeValue: 220,
    prizeImageUrl: 'https://images.unsplash.com/photo-1611591475870-1798365d9560?q=80&w=800&auto=format&fit=crop',
    date: 'Sep 22, 2026',
    showTitle: 'Fall Wedding Drop Live #41'
  },
  {
    id: 'win-2',
    ticketNumber: 'SZ-8729',
    tiktokHandle: '@shreya_chicago',
    fullName: 'Shreya Varma',
    prizeTitle: 'American Diamond Solitaire Halo Bridal Set (Silver Finish)',
    prizeValue: 195,
    prizeImageUrl: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=800&auto=format&fit=crop',
    date: 'Sep 19, 2026',
    showTitle: 'AD Glam Special Live #40'
  }
];

let mockSettings: PaymentAccountSettings = { ...DEFAULT_SETTINGS };

const uri = process.env.MONGODB_URI;
let client: MongoClient | null = null;
let clientPromise: Promise<MongoClient> | null = null;

declare global {
  // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

if (uri) {
  if (process.env.NODE_ENV === 'development') {
    if (!global._mongoClientPromise) {
      client = new MongoClient(uri);
      global._mongoClientPromise = client.connect();
    }
    clientPromise = global._mongoClientPromise;
  } else {
    client = new MongoClient(uri);
    clientPromise = client.connect();
  }
}

export async function getDatabase(): Promise<Db | null> {
  if (!clientPromise) return null;
  try {
    const connectedClient = await clientPromise;
    return connectedClient.db();
  } catch (error) {
    console.warn('MongoDB connection failed, using in-memory store:', error);
    return null;
  }
}

export const dbService = {
  async getCurrentShow(): Promise<LiveShow> {
    const db = await getDatabase();
    if (db) {
      const show = await db.collection<LiveShow>('shows').findOne({ id: 'show-live-current' });
      if (show) return show;
      await db.collection('shows').insertOne(mockShow as any);
      return mockShow;
    }
    return mockShow;
  },

  async updateShow(updates: Partial<LiveShow>): Promise<LiveShow> {
    const db = await getDatabase();
    mockShow = { ...mockShow, ...updates };
    if (db) {
      await db.collection('shows').updateOne(
        { id: 'show-live-current' },
        { $set: updates },
        { upsert: true }
      );
    }
    return mockShow;
  },

  async startPaymentWindow(durationMinutes = 30): Promise<LiveShow> {
    const endTime = new Date(Date.now() + durationMinutes * 60 * 1000).toISOString();
    return this.updateShow({
      status: 'PAYMENT_WINDOW',
      timerEndTime: endTime,
      timerDurationMinutes: durationMinutes
    });
  },

  async extendTimer(additionalMinutes = 5): Promise<LiveShow> {
    const current = await this.getCurrentShow();
    let baseTime = current.timerEndTime ? new Date(current.timerEndTime).getTime() : Date.now();
    if (baseTime < Date.now()) baseTime = Date.now();
    const newEndTime = new Date(baseTime + additionalMinutes * 60 * 1000).toISOString();
    return this.updateShow({
      status: 'PAYMENT_WINDOW',
      timerEndTime: newEndTime
    });
  },

  async resetTimer(): Promise<LiveShow> {
    return this.updateShow({
      timerEndTime: null,
      status: 'OFFLINE'
    });
  },

  async getEntries(showId?: string): Promise<PaymentEntry[]> {
    const db = await getDatabase();
    if (db) {
      const query = showId ? { showId } : {};
      return await db.collection<PaymentEntry>('entries').find(query).sort({ createdAt: -1 }).toArray();
    }
    if (showId) {
      return mockEntries.filter(e => e.showId === showId);
    }
    return [...mockEntries].reverse();
  },

  async getPublicEntrants(): Promise<{ ticketNumber: string; tiktokHandle: string; createdAt: string }[]> {
    const entries = await this.getEntries();
    return entries
      .filter(e => e.status === 'APPROVED' || e.isEligibleForGiveaway)
      .map(e => ({
        ticketNumber: e.ticketNumber,
        tiktokHandle: e.tiktokHandle.startsWith('@') ? e.tiktokHandle : `@${e.tiktokHandle}`,
        createdAt: e.createdAt
      }));
  },

  async addEntry(data: Omit<PaymentEntry, 'id' | 'ticketNumber' | 'status' | 'isEligibleForGiveaway' | 'isWinner' | 'createdAt'>): Promise<PaymentEntry> {
    const db = await getDatabase();
    const randomTicketSuffix = Math.floor(1000 + Math.random() * 9000);
    const ticketNumber = `SZ-${randomTicketSuffix}`;

    const newEntry: PaymentEntry = {
      ...data,
      id: `entry-${Date.now()}-${randomTicketSuffix}`,
      ticketNumber,
      status: 'APPROVED',
      isEligibleForGiveaway: true,
      isWinner: false,
      createdAt: new Date().toISOString()
    };

    if (db) {
      await db.collection('entries').insertOne(newEntry as any);
    }
    mockEntries.unshift(newEntry);
    return newEntry;
  },

  async updateEntryStatus(id: string, status: 'APPROVED' | 'REJECTED'): Promise<PaymentEntry | null> {
    const db = await getDatabase();
    const isEligible = status === 'APPROVED';
    if (db) {
      await db.collection('entries').updateOne(
        { id },
        { $set: { status, isEligibleForGiveaway: isEligible } }
      );
      return await db.collection<PaymentEntry>('entries').findOne({ id });
    }
    const idx = mockEntries.findIndex(e => e.id === id);
    if (idx !== -1) {
      mockEntries[idx].status = status;
      mockEntries[idx].isEligibleForGiveaway = isEligible;
      return mockEntries[idx];
    }
    return null;
  },

  async deleteEntry(id: string): Promise<boolean> {
    const db = await getDatabase();
    if (db) {
      const res = await db.collection('entries').deleteOne({ id });
      return res.deletedCount > 0;
    }
    const lenBefore = mockEntries.length;
    mockEntries = mockEntries.filter(e => e.id !== id);
    return mockEntries.length < lenBefore;
  },

  async pickRandomWinner(): Promise<PaymentEntry | null> {
    const show = await this.getCurrentShow();
    const eligibleEntries = mockEntries.filter(
      e => e.isEligibleForGiveaway && e.status === 'APPROVED'
    );

    if (eligibleEntries.length === 0) return null;

    const winnerIndex = Math.floor(Math.random() * eligibleEntries.length);
    const winner = eligibleEntries[winnerIndex];
    winner.isWinner = true;

    await this.updateShow({
      status: 'ENDED',
      winner: {
        ticketNumber: winner.ticketNumber,
        tiktokHandle: winner.tiktokHandle,
        fullName: winner.fullName,
        announcedAt: new Date().toISOString()
      }
    });

    const pastWinner: PastWinner = {
      id: `win-${Date.now()}`,
      ticketNumber: winner.ticketNumber,
      tiktokHandle: winner.tiktokHandle,
      fullName: winner.fullName,
      prizeTitle: show.featuredPrize.title,
      prizeValue: show.featuredPrize.retailValue,
      prizeImageUrl: show.featuredPrize.imageUrl,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      showTitle: show.title
    };

    mockWinners.unshift(pastWinner);

    const db = await getDatabase();
    if (db) {
      await db.collection('entries').updateOne({ id: winner.id }, { $set: { isWinner: true } });
      await db.collection('winners').insertOne(pastWinner as any);
    }

    return winner;
  },

  async getWinners(): Promise<PastWinner[]> {
    const db = await getDatabase();
    if (db) {
      return await db.collection<PastWinner>('winners').find().sort({ date: -1 }).toArray();
    }
    return mockWinners;
  },

  async getSettings(): Promise<PaymentAccountSettings> {
    const db = await getDatabase();
    if (db) {
      const settings = await db.collection<PaymentAccountSettings>('settings').findOne({ id: 'global-settings' });
      if (settings) return settings;
      await db.collection('settings').insertOne({ id: 'global-settings', ...mockSettings } as any);
      return mockSettings;
    }
    return mockSettings;
  },

  async updateSettings(updates: Partial<PaymentAccountSettings>): Promise<PaymentAccountSettings> {
    const db = await getDatabase();
    mockSettings = { ...mockSettings, ...updates };
    if (db) {
      await db.collection('settings').updateOne(
        { id: 'global-settings' },
        { $set: updates },
        { upsert: true }
      );
    }
    return mockSettings;
  }
};
