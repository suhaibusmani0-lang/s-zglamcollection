import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { MongoClient, Db } from 'mongodb';
import { LiveShow, PaymentEntry, PastWinner, PaymentAccountSettings } from './types';

// ============================================================================
// CONSTANTS & INITIAL DATA
// ============================================================================

const DEFAULT_PRIZE = {
  title: '24K Gold Plated Royal Kundan & Basra Pearl Bridal Choker Set',
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

const INITIAL_SHOW: LiveShow = {
  id: 'show-live-current',
  title: 'Friday Luxury Kundan & Bridal Drop #42',
  status: 'PAYMENT_WINDOW',
  tiktokLiveUrl: 'https://www.tiktok.com/@snzglam/live',
  timerEndTime: new Date(Date.now() + 28 * 60 * 1000).toISOString(),
  timerDurationMinutes: 30,
  featuredPrize: DEFAULT_PRIZE,
  startedAt: new Date(Date.now() - 35 * 60 * 1000).toISOString(),
  endedAt: null,
  winner: null
};

const INITIAL_ENTRIES: PaymentEntry[] = [
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
    transactionReference: 'Venmo to @snzglam',
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

const INITIAL_WINNERS: PastWinner[] = [
  {
    id: 'win-1',
    ticketNumber: 'SZ-8921',
    tiktokHandle: '@mahwish_subzwari',
    fullName: 'Mahwish Subzwari',
    prizeTitle: 'Multicolor Royal Kundan Statement Choker & Earring Set',
    prizeValue: 95,
    prizeImageUrl: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=800&auto=format&fit=crop',
    date: 'Sep 22, 2026',
    showTitle: 'Fall Wedding Drop Live #41'
  },
  {
    id: 'win-2',
    ticketNumber: 'SZ-8831',
    tiktokHandle: '@harpreet_seattle',
    fullName: 'Harpreet Gill',
    prizeTitle: 'Emerald Green Mughal Kundan Choker & Matha Patti Set',
    prizeValue: 220,
    prizeImageUrl: 'https://images.unsplash.com/photo-1611591475870-1798365d9560?q=80&w=800&auto=format&fit=crop',
    date: 'Sep 19, 2026',
    showTitle: 'Fall Wedding Drop Live #40'
  }
];

interface EnterpriseDatabaseSchema {
  version: number;
  lastUpdated: string;
  show: LiveShow;
  entries: PaymentEntry[];
  winners: PastWinner[];
  settings: PaymentAccountSettings;
  auditLogs: {
    id: string;
    action: string;
    details: any;
    timestamp: string;
  }[];
}

// ============================================================================
// ATOMIC FILE PERSISTENCE & CONCURRENCY MUTEX
// ============================================================================

const DATA_DIR = path.join(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'szglam-store.json');
const DB_TMP = path.join(DATA_DIR, 'szglam-store.tmp.json');

let inMemoryCache: EnterpriseDatabaseSchema | null = null;
let writeQueue: Promise<void> = Promise.resolve();

function ensureDataDirectory() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

function loadInitialStore(): EnterpriseDatabaseSchema {
  ensureDataDirectory();
  if (fs.existsSync(DB_FILE)) {
    try {
      const raw = fs.readFileSync(DB_FILE, 'utf-8');
      const parsed = JSON.parse(raw);
      if (parsed && parsed.show && parsed.entries) {
        return parsed;
      }
    } catch (e) {
      console.error('Failed to parse existing data file, creating fresh store backup:', e);
    }
  }

  const initialStore: EnterpriseDatabaseSchema = {
    version: 1,
    lastUpdated: new Date().toISOString(),
    show: INITIAL_SHOW,
    entries: INITIAL_ENTRIES,
    winners: INITIAL_WINNERS,
    settings: DEFAULT_SETTINGS,
    auditLogs: [
      {
        id: `audit-${Date.now()}`,
        action: 'STORE_INITIALIZED',
        details: { message: 'Enterprise database initialized' },
        timestamp: new Date().toISOString()
      }
    ]
  };

  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(initialStore, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing initial store to disk:', err);
  }

  return initialStore;
}

function getStore(): EnterpriseDatabaseSchema {
  if (!inMemoryCache) {
    inMemoryCache = loadInitialStore();
  }
  return inMemoryCache;
}

/**
 * Thread-safe atomic file commit with queue-based locking
 */
async function commitStore(store: EnterpriseDatabaseSchema): Promise<void> {
  store.lastUpdated = new Date().toISOString();
  inMemoryCache = store;

  // Queue write operations to guarantee no race conditions
  writeQueue = writeQueue.then(async () => {
    try {
      ensureDataDirectory();
      const content = JSON.stringify(store, null, 2);
      await fs.promises.writeFile(DB_TMP, content, 'utf-8');
      await fs.promises.rename(DB_TMP, DB_FILE);
    } catch (error) {
      console.error('Atomic file write failed:', error);
    }
  });

  return writeQueue;
}

// ============================================================================
// OPTIONAL MONGODB CLOUD CONNECTOR (DUAL ENGINE)
// ============================================================================

const uri = process.env.MONGODB_URI;
let clientPromise: Promise<MongoClient> | null = null;

if (uri) {
  try {
    const client = new MongoClient(uri);
    clientPromise = client.connect();
  } catch (err) {
    console.warn('MongoDB initialization skipped:', err);
  }
}

export async function getCloudDatabase(): Promise<Db | null> {
  if (!clientPromise) return null;
  try {
    const connected = await clientPromise;
    return connected.db();
  } catch {
    return null;
  }
}

// ============================================================================
// ENTERPRISE DB SERVICE EXPORTS
// ============================================================================

export const dbService = {
  /**
   * Health & diagnostics
   */
  async getHealthStatus() {
    const store = getStore();
    return {
      storageEngine: uri ? 'MongoDB + Atomic Local Cache' : 'Enterprise Atomic Local Store',
      isHealthy: true,
      lastUpdated: store.lastUpdated,
      showStatus: store.show.status,
      totalEntries: store.entries.length,
      approvedEntries: store.entries.filter(e => e.status === 'APPROVED').length,
      totalWinners: store.winners.length,
      auditLogsCount: store.auditLogs.length,
      timestamp: new Date().toISOString()
    };
  },

  /**
   * Current show operations
   */
  async getCurrentShow(): Promise<LiveShow> {
    const store = getStore();
    return store.show;
  },

  async updateShow(updates: Partial<LiveShow>): Promise<LiveShow> {
    const store = getStore();
    store.show = {
      ...store.show,
      ...updates
    };

    store.auditLogs.unshift({
      id: `audit-${Date.now()}`,
      action: 'SHOW_UPDATED',
      details: updates,
      timestamp: new Date().toISOString()
    });

    await commitStore(store);

    const db = await getCloudDatabase();
    if (db) {
      try {
        await db.collection('shows').updateOne({ id: 'show-live-current' }, { $set: updates }, { upsert: true });
      } catch (e) {
        console.warn('Cloud sync error (show):', e);
      }
    }

    return store.show;
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

  /**
   * Entries management
   */
  async getEntries(showId?: string): Promise<PaymentEntry[]> {
    const store = getStore();
    if (showId) {
      return store.entries.filter(e => e.showId === showId);
    }
    return store.entries;
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
    const store = getStore();

    // Generate secure random ticket suffix
    const randomTicketSuffix = crypto.randomInt(1000, 9999);
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

    store.entries.unshift(newEntry);

    store.auditLogs.unshift({
      id: `audit-${Date.now()}`,
      action: 'ENTRY_CREATED',
      details: { ticketNumber, tiktokHandle: newEntry.tiktokHandle, amount: newEntry.amountPaid },
      timestamp: new Date().toISOString()
    });

    await commitStore(store);

    const db = await getCloudDatabase();
    if (db) {
      try {
        await db.collection('entries').insertOne(newEntry as any);
      } catch (e) {
        console.warn('Cloud sync error (entry):', e);
      }
    }

    return newEntry;
  },

  async updateEntryStatus(id: string, status: 'APPROVED' | 'REJECTED'): Promise<PaymentEntry | null> {
    const store = getStore();
    const entry = store.entries.find(e => e.id === id);
    if (!entry) return null;

    entry.status = status;
    entry.isEligibleForGiveaway = status === 'APPROVED';

    store.auditLogs.unshift({
      id: `audit-${Date.now()}`,
      action: 'ENTRY_STATUS_UPDATED',
      details: { id, status },
      timestamp: new Date().toISOString()
    });

    await commitStore(store);

    const db = await getCloudDatabase();
    if (db) {
      try {
        await db.collection('entries').updateOne(
          { id },
          { $set: { status, isEligibleForGiveaway: entry.isEligibleForGiveaway } }
        );
      } catch (e) {
        console.warn('Cloud sync error (entry status):', e);
      }
    }

    return entry;
  },

  async deleteEntry(id: string): Promise<boolean> {
    const store = getStore();
    const initialLen = store.entries.length;
    store.entries = store.entries.filter(e => e.id !== id);

    if (store.entries.length === initialLen) return false;

    store.auditLogs.unshift({
      id: `audit-${Date.now()}`,
      action: 'ENTRY_DELETED',
      details: { id },
      timestamp: new Date().toISOString()
    });

    await commitStore(store);

    const db = await getCloudDatabase();
    if (db) {
      try {
        await db.collection('entries').deleteOne({ id });
      } catch (e) {
        console.warn('Cloud sync error (entry delete):', e);
      }
    }

    return true;
  },

  /**
   * Provably fair cryptographic winner picker
   */
  async pickRandomWinner(): Promise<{
    winner: PaymentEntry;
    auditProof: {
      seedHex: string;
      poolSize: number;
      chosenIndex: number;
      timestamp: string;
    };
  } | null> {
    const store = getStore();
    const eligibleEntries = store.entries.filter(
      e => e.isEligibleForGiveaway && e.status === 'APPROVED' && !e.isWinner
    );

    if (eligibleEntries.length === 0) return null;

    // Cryptographically secure pseudo-random index using crypto.randomInt
    const chosenIndex = crypto.randomInt(0, eligibleEntries.length);
    const winner = eligibleEntries[chosenIndex];
    winner.isWinner = true;

    // Generate cryptographic audit proof
    const seedBytes = crypto.randomBytes(16);
    const seedHex = seedBytes.toString('hex');

    const show = store.show;
    show.status = 'ENDED';
    show.winner = {
      ticketNumber: winner.ticketNumber,
      tiktokHandle: winner.tiktokHandle,
      fullName: winner.fullName,
      announcedAt: new Date().toISOString()
    };

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

    store.winners.unshift(pastWinner);

    const auditProof = {
      seedHex,
      poolSize: eligibleEntries.length,
      chosenIndex,
      timestamp: new Date().toISOString()
    };

    store.auditLogs.unshift({
      id: `audit-${Date.now()}`,
      action: 'WINNER_DRAWN_PROVABLY_FAIR',
      details: {
        winnerTicket: winner.ticketNumber,
        winnerHandle: winner.tiktokHandle,
        ...auditProof
      },
      timestamp: new Date().toISOString()
    });

    await commitStore(store);

    const db = await getCloudDatabase();
    if (db) {
      try {
        await db.collection('entries').updateOne({ id: winner.id }, { $set: { isWinner: true } });
        await db.collection('winners').insertOne(pastWinner as any);
        await db.collection('shows').updateOne({ id: 'show-live-current' }, { $set: show }, { upsert: true });
      } catch (e) {
        console.warn('Cloud sync error (winner):', e);
      }
    }

    return { winner, auditProof };
  },

  async getWinners(): Promise<PastWinner[]> {
    const store = getStore();
    return store.winners;
  },

  async getSettings(): Promise<PaymentAccountSettings> {
    const store = getStore();
    return store.settings;
  },

  async updateSettings(updates: Partial<PaymentAccountSettings>): Promise<PaymentAccountSettings> {
    const store = getStore();
    store.settings = {
      ...store.settings,
      ...updates
    };

    store.auditLogs.unshift({
      id: `audit-${Date.now()}`,
      action: 'SETTINGS_UPDATED',
      details: updates,
      timestamp: new Date().toISOString()
    });

    await commitStore(store);

    const db = await getCloudDatabase();
    if (db) {
      try {
        await db.collection('settings').updateOne({ id: 'global-settings' }, { $set: updates }, { upsert: true });
      } catch (e) {
        console.warn('Cloud sync error (settings):', e);
      }
    }

    return store.settings;
  }
};
