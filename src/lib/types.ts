export type ShowStatus = 'OFFLINE' | 'LIVE_NOW' | 'PAYMENT_WINDOW' | 'ENDED';
export type PaymentMethod = 'ZELLE' | 'VENMO' | 'CASH_APP' | 'CASHAPP' | 'PAYPAL';

export interface FeaturedPrize {
  title: string;
  retailValue: number;
  imageUrl: string;
  description: string;
}

export interface LiveShow {
  id: string;
  title: string;
  status: ShowStatus;
  tiktokLiveUrl: string;
  timerEndTime: string | null;
  timerDurationMinutes: number;
  featuredPrize: FeaturedPrize;
  startedAt: string;
  endedAt: string | null;
  winner: {
    ticketNumber: string;
    tiktokHandle: string;
    fullName: string;
    announcedAt: string;
  } | null;
}

export interface PaymentEntry {
  id: string;
  ticketNumber: string;
  showId: string;
  tiktokHandle: string;
  fullName: string;
  phone: string;
  email: string;
  amountPaid: number;
  paymentMethod: 'ZELLE' | 'VENMO' | 'CASH_APP' | 'CASHAPP' | 'PAYPAL';
  transactionReference: string;
  receiptUrl: string;
  shippingAddress: {
    street: string;
    aptSuite?: string;
    city: string;
    state: string;
    zip: string;
    zipCode?: string;
    country?: string;
  };
  status: 'APPROVED' | 'REJECTED';
  isEligibleForGiveaway: boolean;
  isWinner: boolean;
  createdAt: string;
  notes?: string;
}

export interface PastWinner {
  id: string;
  ticketNumber: string;
  tiktokHandle: string;
  fullName: string;
  prizeTitle: string;
  prizeValue: number;
  prizeImageUrl: string;
  date: string;
  showTitle: string;
}

export interface PaymentAccountSettings {
  zelle: {
    enabled: boolean;
    recipientName: string;
    email: string;
    phone: string;
    notes: string;
  };
  venmo: {
    enabled: boolean;
    handle: string;
    displayName: string;
    link: string;
    notes: string;
  };
  cashApp: {
    enabled: boolean;
    cashtag: string;
    link: string;
    notes: string;
  };
  paypal: {
    enabled: boolean;
    paypalMe: string;
    link: string;
    notes: string;
  };
  tiktok: {
    username: string;
    liveUrl: string;
  };
  supportPhone: string;
  supportEmail: string;
}
