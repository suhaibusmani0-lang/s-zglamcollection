'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  Gift,
  Clock,
  Sparkles,
  Trophy,
  DollarSign,
  Users,
  Video,
  Copy,
  Check,
  Send,
  AlertCircle,
  Calendar,
  ExternalLink,
  ShieldCheck,
  Phone,
  CheckCircle2
} from 'lucide-react';
import { LiveShow, PaymentAccountSettings, PastWinner } from '@/lib/types';
import ConfettiCelebration from '@/components/ConfettiCelebration';

const INITIAL_PRIZE = {
  title: '24K Gold Plated Royal Kundan & Pearl Bridal Choker Set',
  retailValue: 245,
  imageUrl: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=1200&auto=format&fit=crop',
  description: 'Exquisite handcrafted bridal choker necklace adorned with uncut polki kundan stones, green tourmaline drop beads, and matching chandelier jhumkas + maang tikka. Hypoallergenic & nickel-free.'
};

const INITIAL_SHOW: LiveShow = {
  id: 'show-live-current',
  title: 'Friday Luxury Kundan & Bridal Drop #42',
  status: 'PAYMENT_WINDOW',
  tiktokLiveUrl: 'https://www.tiktok.com/@snzglam/live',
  timerEndTime: new Date(Date.now() + 25 * 60 * 1000).toISOString(),
  timerDurationMinutes: 30,
  featuredPrize: INITIAL_PRIZE,
  startedAt: new Date(Date.now() - 35 * 60 * 1000).toISOString(),
  endedAt: null,
  winner: null
};

const INITIAL_SETTINGS: PaymentAccountSettings = {
  zelle: {
    enabled: true,
    recipientName: 'S&Z Glam Collection LLC',
    email: 'pay@szglamcollection.com',
    phone: '(929) 600-1937',
    notes: 'Free instant transfer from any US bank app. Please put your TikTok username in the memo.'
  },
  venmo: {
    enabled: true,
    handle: '@snzglam',
    displayName: 'S&Z Glam Collection',
    link: 'https://venmo.com/u/snzglam',
    notes: 'Please add your TikTok username in the note. Turn OFF goods/services toggle.'
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

const LAST_WINNER = {
  name: 'Mahwish Subzwari',
  tiktokHandle: '@mahwish_subzwari',
  prize: 'Multicolor Kundan Statement Necklace & Earring Set',
  retail: '$95',
  date: 'September 22, 2026',
  imageUrl: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=800&auto=format&fit=crop'
};

const US_STATES = [
  'AL','AK','AZ','AR','CA','CO','CT','DE','FL','GA','HI','ID','IL','IN','IA',
  'KS','KY','LA','ME','MD','MA','MI','MN','MS','MO','MT','NE','NV','NH','NJ',
  'NM','NY','NC','ND','OH','OK','OR','PA','RI','SC','SD','TN','TX','UT','VT',
  'VA','WA','WV','WI','WY'
];

export default function ShopGiveawayPage() {
  const [show, setShow] = useState<LiveShow>(INITIAL_SHOW);
  const [settings, setSettings] = useState<PaymentAccountSettings>(INITIAL_SETTINGS);
  const [entrants, setEntrants] = useState<{ ticketNumber: string; tiktokHandle: string; createdAt: string }[]>([]);
  const [remainingSeconds, setRemainingSeconds] = useState<number>(1500);

  // Form states
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [tiktokHandle, setTiktokHandle] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'ZELLE' | 'VENMO' | 'CASHAPP' | 'PAYPAL'>('ZELLE');
  const [amountPaid, setAmountPaid] = useState('');
  const [streetAddress, setStreetAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('NY');
  const [zipCode, setZipCode] = useState('');
  const [receiptImage, setReceiptImage] = useState('');
  const [uploadingReceipt, setUploadingReceipt] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [luckyTicket, setLuckyTicket] = useState<{ ticketNumber: string; fullName: string } | null>(null);

  // Copy helper
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const copyText = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  // Sync timer & live status
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [showRes, entriesRes, settingsRes] = await Promise.all([
          fetch('/api/show'),
          fetch('/api/entries'),
          fetch('/api/settings')
        ]);
        const showData = await showRes.json();
        const entriesData = await entriesRes.json();
        const settingsData = await settingsRes.json();

        if (showData.success && showData.show) {
          setShow(showData.show);
          setRemainingSeconds(showData.remainingSeconds || 0);
        }
        if (entriesData.success && entriesData.entrants) {
          setEntrants(entriesData.entrants);
        }
        if (settingsData.success && settingsData.settings) {
          setSettings(settingsData.settings);
        }
      } catch (e) {
        console.error(e);
      }
    };

    fetchData();
    const poll = setInterval(fetchData, 8000);
    return () => clearInterval(poll);
  }, []);

  // Local seconds countdown tick
  useEffect(() => {
    const timer = setInterval(() => {
      setRemainingSeconds(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const isWindowActive = show.status === 'PAYMENT_WINDOW' && remainingSeconds > 0;

  // Handle receipt image upload
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingReceipt(true);
    setErrorMsg('');

    try {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64Data = reader.result as string;
        try {
          const res = await fetch('/api/upload', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ image: base64Data })
          });
          const data = await res.json();
          if (data.success && data.url) {
            setReceiptImage(data.url);
          } else {
            setReceiptImage(base64Data);
          }
        } catch {
          setReceiptImage(base64Data);
        } finally {
          setUploadingReceipt(false);
        }
      };
      reader.readAsDataURL(file);
    } catch {
      setErrorMsg('Failed to process image file');
      setUploadingReceipt(false);
    }
  };

  // Submit form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!fullName.trim()) return setErrorMsg('Please enter your full name');
    if (!phoneNumber.trim()) return setErrorMsg('Please enter your phone number');
    if (!tiktokHandle.trim()) return setErrorMsg('Please enter your TikTok username');
    if (!amountPaid || isNaN(Number(amountPaid))) return setErrorMsg('Please enter a valid payment amount');
    if (!streetAddress.trim() || !city.trim() || !zipCode.trim()) {
      return setErrorMsg('Please enter your complete US shipping address');
    }

    setIsSubmitting(true);

    try {
      const payload = {
        fullName,
        phoneNumber,
        tiktokHandle: tiktokHandle.startsWith('@') ? tiktokHandle : `@${tiktokHandle}`,
        paymentMethod,
        amountPaid: Number(amountPaid),
        shippingAddress: {
          street: streetAddress,
          city,
          state,
          zipCode,
          country: 'USA'
        },
        receiptImageUrl: receiptImage || 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=400'
      };

      const res = await fetch('/api/entries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (data.success && data.entry) {
        setLuckyTicket({
          ticketNumber: data.entry.ticketNumber,
          fullName: data.entry.fullName
        });
        setEntrants(prev => [
          {
            ticketNumber: data.entry.ticketNumber,
            tiktokHandle: data.entry.tiktokHandle,
            createdAt: new Date().toISOString()
          },
          ...prev
        ]);
        // Reset form fields
        setFullName('');
        setPhoneNumber('');
        setTiktokHandle('');
        setAmountPaid('');
        setStreetAddress('');
        setCity('');
        setZipCode('');
        setReceiptImage('');
      } else {
        setErrorMsg(data.error || 'Failed to submit payment entry. Please try again.');
      }
    } catch {
      setErrorMsg('Network error. Please try submitting again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fcfbf9] text-[#1c1816] pb-24 selection:bg-amber-100 flex flex-col font-sans">
      {luckyTicket && (
        <ConfettiCelebration
          ticketNumber={luckyTicket.ticketNumber}
          customerName={luckyTicket.fullName}
          prizeTitle={show.featuredPrize.title}
          onClose={() => setLuckyTicket(null)}
        />
      )}

      {/* Top Header */}
      <header className="max-w-4xl mx-auto w-full px-4 sm:px-6 pt-8 pb-4 flex items-center justify-between">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-bold text-stone-700 hover:text-amber-900 transition-colors py-2 px-3.5 rounded-full bg-white border border-stone-200 hover:border-amber-400 shadow-xs"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Boutique</span>
        </Link>

        {/* Brand Crest */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-full overflow-hidden border-2 border-[#d4af37] shadow-sm relative">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.jpg" alt="S&Z Glam" className="w-full h-full object-cover" />
          </div>
          <span className="font-royal text-lg sm:text-xl font-bold tracking-wider text-stone-900 group-hover:text-amber-900 transition-colors">
            S&amp;Z GLAM
          </span>
        </Link>
      </header>

      {/* Main Content Showcase */}
      <main className="max-w-3xl mx-auto w-full px-4 sm:px-6 pt-4 flex-1">
        {/* Giveaway Pill Badge */}
        <div className="text-center mb-3">
          <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#fbf5e8] text-[#8c671b] border border-[#ebd9b5] text-xs font-bold uppercase tracking-widest shadow-xs">
            <Gift className="w-3.5 h-3.5 text-[#bfa15f]" />
            <span>VIP After-Live Giveaway Portal</span>
          </span>
        </div>

        {/* Big Royal Title & Retail Value */}
        <div className="text-center mb-8">
          <h1 className="font-royal text-3xl sm:text-4xl lg:text-5xl font-extrabold text-stone-900 leading-[1.18] mb-2">
            {show.featuredPrize.title}
          </h1>
          <p className="text-[#8c671b] text-sm sm:text-base font-bold tracking-wider uppercase font-royal">
            Retail ${show.featuredPrize.retailValue} Value • Included in Tonight&apos;s Draw
          </p>
        </div>

        {/* Center Live Countdown Meter */}
        <div className="royal-card p-6 sm:p-8 text-center mb-8 border border-[#ebd9b5] bg-white shadow-md">
          {isWindowActive ? (
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-300 text-xs font-bold uppercase tracking-wider mb-3">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                <span>30-Minute Payment Window Active</span>
              </div>
              <div className="font-mono text-4xl sm:text-5xl font-black text-amber-950 tracking-tight my-2">
                {formatTime(remainingSeconds)}
              </div>
              <p className="text-stone-600 text-xs sm:text-sm max-w-md mx-auto leading-relaxed mt-2 font-normal">
                Payment window is live! Submit your payment receipt below before the clock expires to register your verifiable Lucky Ticket for tonight&apos;s random draw.
              </p>
            </div>
          ) : (
            <div>
              <h2 className="font-royal text-2xl sm:text-3xl font-bold text-stone-900 mb-2">
                Entries Closed
              </h2>
              <p className="text-stone-600 text-xs sm:text-sm max-w-md mx-auto leading-relaxed font-normal">
                The 30-minute payment window has concluded. S&amp;Z GLAM is verifying customer entries. Watch the wheel spin live on stream!
              </p>
            </div>
          )}

          {/* Entrants Count */}
          <div className="mt-5 pt-4 border-t border-stone-100 flex items-center justify-center gap-2 text-xs font-bold text-stone-700">
            <Users className="w-4 h-4 text-amber-700" />
            <span>{entrants.length} Verified Entries In Tonight&apos;s Draw</span>
          </div>
        </div>

        {/* Watch Live on TikTok CTA */}
        <div className="text-center mb-10">
          <a
            href="https://www.tiktok.com/@snzglam/live"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-royal-outline inline-flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-full text-xs sm:text-sm font-bold shadow-xs hover:shadow-md"
          >
            <Video className="w-4 h-4 text-red-600" />
            <span>Watch The Live Draw On TikTok</span>
          </a>
        </div>

        {/* US Payment Instructions Card */}
        <div className="royal-card p-6 sm:p-8 mb-10 bg-white border border-[#ebd9b5]">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2 text-[#8c671b] text-xs font-bold uppercase tracking-wider">
              <DollarSign className="w-4 h-4 text-amber-600" />
              <span>Step 1: Send Your Live Bill Total</span>
            </div>
            <span className="text-[11px] text-stone-500 font-medium">1-Click Auto Copy</span>
          </div>

          <p className="text-stone-600 text-xs sm:text-sm leading-relaxed mb-6 font-normal">
            Pay your claimed total using any verified US payment method. Put your <strong>TikTok username</strong> in the payment memo/notes:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Zelle */}
            <div className="p-4 rounded-2xl bg-[#faf8f4] border border-amber-200/80">
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-sm text-stone-900 flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#7414CA]" />
                  Zelle (Direct Bank)
                </span>
                <span className="text-[10px] uppercase font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  Instant • $0 Fee
                </span>
              </div>
              <p className="text-xs text-stone-500 mb-2">{settings.zelle.recipientName}</p>
              <div className="space-y-1.5 text-xs">
                <div className="flex items-center justify-between bg-white px-3 py-2 rounded-xl border border-stone-200 font-mono text-stone-800">
                  <span>(929) 600-1937</span>
                  <button
                    onClick={() => copyText('(929) 600-1937', 'zelle_phone')}
                    className="text-amber-800 hover:text-amber-950 p-1 flex items-center gap-1 text-[11px] font-bold"
                  >
                    {copiedKey === 'zelle_phone' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedKey === 'zelle_phone' ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
                <div className="flex items-center justify-between bg-white px-3 py-2 rounded-xl border border-stone-200 font-mono text-stone-800">
                  <span className="truncate">{settings.zelle.email}</span>
                  <button
                    onClick={() => copyText(settings.zelle.email, 'zelle_email')}
                    className="text-amber-800 hover:text-amber-950 p-1 flex items-center gap-1 text-[11px] font-bold shrink-0 ml-1"
                  >
                    {copiedKey === 'zelle_email' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedKey === 'zelle_email' ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Venmo */}
            <div className="p-4 rounded-2xl bg-[#faf8f4] border border-amber-200/80 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-sm text-stone-900 flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#008CFF]" />
                    Venmo
                  </span>
                  <a
                    href="https://venmo.com/u/snzglam"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[10px] text-amber-800 hover:underline flex items-center gap-0.5 font-bold"
                  >
                    Open App <ExternalLink className="w-2.5 h-2.5" />
                  </a>
                </div>
                <div className="flex items-center justify-between bg-white px-3 py-2 rounded-xl border border-stone-200 font-mono text-xs text-stone-800 mt-2">
                  <span>@snzglam</span>
                  <button
                    onClick={() => copyText('@snzglam', 'venmo')}
                    className="text-amber-800 hover:text-amber-950 p-1 flex items-center gap-1 text-[11px] font-bold"
                  >
                    {copiedKey === 'venmo' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedKey === 'venmo' ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
              </div>
              <p className="text-[11px] text-stone-500 mt-2">Turn OFF goods/services toggle</p>
            </div>

            {/* Cash App */}
            <div className="p-4 rounded-2xl bg-[#faf8f4] border border-amber-200/80 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-sm text-stone-900 flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#00D632]" />
                    Cash App
                  </span>
                  <a
                    href="https://cash.app/$SZGlamLive"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[10px] text-amber-800 hover:underline flex items-center gap-0.5 font-bold"
                  >
                    Open App <ExternalLink className="w-2.5 h-2.5" />
                  </a>
                </div>
                <div className="flex items-center justify-between bg-white px-3 py-2 rounded-xl border border-stone-200 font-mono text-xs text-stone-800 mt-2">
                  <span>$SZGlamLive</span>
                  <button
                    onClick={() => copyText('$SZGlamLive', 'cashapp')}
                    className="text-amber-800 hover:text-amber-950 p-1 flex items-center gap-1 text-[11px] font-bold"
                  >
                    {copiedKey === 'cashapp' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedKey === 'cashapp' ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
              </div>
              <p className="text-[11px] text-stone-500 mt-2">Include TikTok handle in note</p>
            </div>

            {/* PayPal */}
            <div className="p-4 rounded-2xl bg-[#faf8f4] border border-amber-200/80 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-sm text-stone-900 flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#003087]" />
                    PayPal
                  </span>
                  <a
                    href="https://paypal.me/snzglam"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[10px] text-amber-800 hover:underline flex items-center gap-0.5 font-bold"
                  >
                    Open App <ExternalLink className="w-2.5 h-2.5" />
                  </a>
                </div>
                <div className="flex items-center justify-between bg-white px-3 py-2 rounded-xl border border-stone-200 font-mono text-xs text-stone-800 mt-2">
                  <span>paypal.me/snzglam</span>
                  <button
                    onClick={() => copyText('https://paypal.me/snzglam', 'paypal')}
                    className="text-amber-800 hover:text-amber-950 p-1 flex items-center gap-1 text-[11px] font-bold"
                  >
                    {copiedKey === 'paypal' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedKey === 'paypal' ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
              </div>
              <p className="text-[11px] text-stone-500 mt-2">Select Friends &amp; Family</p>
            </div>
          </div>
        </div>

        {/* Step 2: Form */}
        <div id="entry-form" className="royal-card p-6 sm:p-10 mb-12 bg-white border border-[#ebd9b5] shadow-md">
          <div className="flex items-center gap-2 text-[#8c671b] text-xs font-bold uppercase tracking-wider mb-2">
            <Sparkles className="w-4 h-4 text-amber-600" />
            <span>Step 2: Register Payment &amp; Get Lucky Ticket</span>
          </div>
          <h2 className="font-royal text-2xl sm:text-3xl font-bold text-stone-900 mb-2">
            Submit Your Verification Form
          </h2>
          <p className="text-stone-600 text-xs sm:text-sm leading-relaxed mb-6 font-normal">
            Enter your details below to generate your verifiable Lucky Ticket number (`#SZ-XXXX`) entered into tonight&apos;s live giveaway.
          </p>

          {errorMsg && (
            <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 flex items-start gap-3 text-rose-800 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ayesha Khan"
                  value={fullName}
                  onChange={e => setFullName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-300 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 text-sm bg-stone-50/50"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                  US Phone Number *
                </label>
                <input
                  type="tel"
                  required
                  placeholder="(xxx) xxx-xxxx"
                  value={phoneNumber}
                  onChange={e => setPhoneNumber(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-300 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 text-sm bg-stone-50/50"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                  TikTok Username *
                </label>
                <input
                  type="text"
                  required
                  placeholder="@yourhandle"
                  value={tiktokHandle}
                  onChange={e => setTiktokHandle(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-300 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 text-sm bg-stone-50/50"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                  Payment Method *
                </label>
                <select
                  value={paymentMethod}
                  onChange={e => setPaymentMethod(e.target.value as any)}
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-300 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 text-sm bg-white"
                >
                  <option value="ZELLE">Zelle</option>
                  <option value="VENMO">Venmo</option>
                  <option value="CASHAPP">Cash App</option>
                  <option value="PAYPAL">PayPal</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                  Total Paid ($USD) *
                </label>
                <input
                  type="number"
                  step="0.01"
                  required
                  placeholder="$0.00"
                  value={amountPaid}
                  onChange={e => setAmountPaid(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-300 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 text-sm bg-stone-50/50"
                />
              </div>
            </div>

            {/* USPS Shipping Address */}
            <div className="pt-3 border-t border-stone-100">
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                USPS Delivery Address (For Claimed Items &amp; Giveaway Prize) *
              </label>
              <input
                type="text"
                required
                placeholder="Street Address or Apt #"
                value={streetAddress}
                onChange={e => setStreetAddress(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-stone-300 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 text-sm bg-stone-50/50 mb-3"
              />
              <div className="grid grid-cols-3 gap-3">
                <input
                  type="text"
                  required
                  placeholder="City"
                  value={city}
                  onChange={e => setCity(e.target.value)}
                  className="px-4 py-2.5 rounded-xl border border-stone-300 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 text-sm bg-stone-50/50"
                />
                <select
                  value={state}
                  onChange={e => setState(e.target.value)}
                  className="px-4 py-2.5 rounded-xl border border-stone-300 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 text-sm bg-white"
                >
                  {US_STATES.map(st => (
                    <option key={st} value={st}>{st}</option>
                  ))}
                </select>
                <input
                  type="text"
                  required
                  placeholder="ZIP Code"
                  value={zipCode}
                  onChange={e => setZipCode(e.target.value)}
                  className="px-4 py-2.5 rounded-xl border border-stone-300 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 text-sm bg-stone-50/50"
                />
              </div>
            </div>

            {/* Screenshot Upload */}
            <div className="pt-3 border-t border-stone-100">
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                Payment Screenshot / Receipt (Speeds Up Approval)
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="text-xs text-stone-500 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-amber-100 file:text-amber-900 hover:file:bg-amber-200 cursor-pointer"
                />
                {uploadingReceipt && <span className="text-xs text-amber-700 animate-pulse font-medium">Uploading receipt...</span>}
                {receiptImage && <span className="text-xs text-emerald-700 font-bold flex items-center gap-1"><Check className="w-3.5 h-3.5" /> Attached</span>}
              </div>
            </div>

            {/* Submit CTA */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={isSubmitting || uploadingReceipt}
                className="btn-royal-gold w-full py-4 rounded-2xl text-sm font-extrabold flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span>Generating Lucky Ticket...</span>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Submit Payment &amp; Lock In Lucky Ticket</span>
                  </>
                )}
              </button>
              <div className="flex items-center justify-center gap-2 text-[11px] text-stone-500 mt-3 font-medium">
                <ShieldCheck className="w-3.5 h-3.5 text-amber-700" />
                <span>Verified by S&amp;Z Glam Host • 100% Fair Random Draw Engine</span>
              </div>
            </div>
          </form>
        </div>

        {/* Last Giveaway Winner Spotlight Card */}
        <div className="royal-card overflow-hidden border border-amber-200/80 bg-white grid grid-cols-1 md:grid-cols-2 mb-16 shadow-md">
          <div className="relative h-72 md:h-full w-full bg-stone-100 min-h-[280px]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={LAST_WINNER.imageUrl}
              alt={LAST_WINNER.prize}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-stone-900/30 via-transparent to-transparent pointer-events-none" />
          </div>

          <div className="p-6 sm:p-8 flex flex-col justify-between">
            <div>
              <div className="w-9 h-9 rounded-full bg-amber-100 border border-amber-200 flex items-center justify-center text-amber-800 mb-3 shadow-xs">
                <Trophy className="w-4 h-4 text-amber-700" />
              </div>
              <span className="text-[11px] uppercase tracking-wider text-amber-800 font-extrabold block mb-1">
                Last Giveaway Winner
              </span>
              <h3 className="font-royal text-2xl sm:text-3xl font-bold text-stone-900 leading-tight mb-2">
                Congratulations, {LAST_WINNER.name}!
              </h3>
              <p className="text-stone-700 text-xs sm:text-sm font-medium mb-1">
                Won <strong className="text-stone-900 font-semibold">{LAST_WINNER.prize}</strong>
              </p>
              <p className="text-stone-500 text-xs font-mono mb-4">
                Retail {LAST_WINNER.retail}
              </p>
            </div>

            <div className="pt-3 border-t border-stone-100 flex items-center gap-1.5 text-xs text-stone-500">
              <Calendar className="w-3.5 h-3.5 text-amber-700" />
              <span>Revealed {LAST_WINNER.date}</span>
            </div>
          </div>
        </div>

        {/* Social Links on Shop Page */}
        <div className="flex items-center justify-center gap-4 text-stone-500 text-xs pt-4 pb-8 border-t border-stone-200">
          <a
            href="https://www.tiktok.com/@snzglam/live"
            target="_blank"
            rel="noopener noreferrer"
            className="w-9 h-9 rounded-full bg-stone-100 hover:bg-amber-100 text-stone-700 hover:text-amber-900 flex items-center justify-center transition-colors font-bold text-xs"
            title="TikTok"
          >
            TT
          </a>
          <a
            href="https://www.instagram.com/snzglam/"
            target="_blank"
            rel="noopener noreferrer"
            className="w-9 h-9 rounded-full bg-stone-100 hover:bg-amber-100 text-stone-700 hover:text-amber-900 flex items-center justify-center transition-colors font-bold text-xs"
            title="Instagram"
          >
            IG
          </a>
          <a
            href="https://wa.me/19296001937"
            target="_blank"
            rel="noopener noreferrer"
            className="w-9 h-9 rounded-full bg-stone-100 hover:bg-emerald-100 text-stone-700 hover:text-emerald-900 flex items-center justify-center transition-colors font-bold text-xs"
            title="WhatsApp"
          >
            WA
          </a>
        </div>
      </main>

      {/* Footer with Zarnetic Credit */}
      <footer className="border-t border-[#ebd9b5] bg-[#1a1715] text-[#d6cdbe] py-10 px-4 text-center text-xs">
        <p className="mb-2">
          Questions? Message S&amp;Z GLAM on{' '}
          <a
            href="https://wa.me/19296001937"
            target="_blank"
            rel="noopener noreferrer"
            className="text-amber-300 underline font-semibold"
          >
            WhatsApp (+1 929 600-1937)
          </a>{' '}
          or{' '}
          <a
            href="https://www.instagram.com/snzglam/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-amber-300 underline font-semibold"
          >
            Instagram (@snzglam)
          </a>.
        </p>

        <div className="pt-4 border-t border-stone-800 flex flex-col sm:flex-row items-center justify-between max-w-4xl mx-auto gap-2 text-stone-500">
          <p>&copy; {new Date().getFullYear()} S&amp;Z GLAM COLLECTION. All rights reserved.</p>

          <p className="text-stone-400 font-medium">
            Developed by{' '}
            <a
              href="https://www.zarnetic.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#d4af37] hover:text-[#f3da7e] underline font-bold tracking-wide transition-colors"
            >
              Zarnetic
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
