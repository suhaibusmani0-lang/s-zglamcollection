'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
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
  CheckCircle2,
  Lock,
  Radio,
  Truck
} from 'lucide-react';
import { LiveShow, PaymentAccountSettings } from '@/lib/types';
import ConfettiCelebration from '@/components/ConfettiCelebration';
import { InstagramIcon, TikTokIcon, WhatsAppIcon, PhoneCallIcon } from '@/components/SocialIcons';

const INITIAL_PRIZE = {
  title: '24K Gold Plated Royal Kundan & Pearl Bridal Choker Set',
  retailValue: 245,
  imageUrl: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=1200&auto=format&fit=crop',
  description: 'Exquisite handcrafted bridal choker necklace adorned with uncut polki kundan stones, green tourmaline drop beads, and matching chandelier jhumkas + maang tikka. Hypoallergenic & nickel-free.'
};

const INITIAL_SHOW: LiveShow = {
  id: 'show-live-current',
  title: 'Tonight\'s Royal Kundan & Bridal Live Drop',
  status: 'OFFLINE',
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

const LAST_WINNERS = [
  {
    name: 'Mahwish Subzwari',
    tiktokHandle: '@mahwish_subzwari',
    prize: 'Multicolor Kundan Statement Necklace & Earring Set',
    retail: '$95',
    date: 'September 22, 2026',
    ticket: '#SZ-9042',
    imageUrl: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=800&auto=format&fit=crop'
  },
  {
    name: 'Sobia Tariq',
    tiktokHandle: '@sobiatariq_us',
    prize: '24K Gold Dipped Nizam Pearl Choker Set',
    retail: '$145',
    date: 'September 18, 2026',
    ticket: '#SZ-8831',
    imageUrl: 'https://images.unsplash.com/photo-1611591475870-1798365d9560?q=80&w=800&auto=format&fit=crop'
  },
  {
    name: 'Fatima Zahra',
    tiktokHandle: '@fatimazahra_ny',
    prize: 'High-Shine Diamond Solitaire Halo Bridal Suite',
    retail: '$195',
    date: 'September 14, 2026',
    ticket: '#SZ-8519',
    imageUrl: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=800&auto=format&fit=crop'
  }
];

const US_STATES = [
  'AL','AK','AZ','AR','CA','CO','CT','DE','FL','GA','HI','ID','IL','IN','IA',
  'KS','KY','LA','ME','MD','MA','MI','MN','MS','MO','MT','NE','NV','NH','NJ',
  'NM','NY','NC','ND','OH','OK','OR','PA','RI','SC','SD','TN','TX','UT','VT',
  'VA','WA','WV','WI','WY'
];

export default function LiveGiveawayPortal() {
  const [show, setShow] = useState<LiveShow>(INITIAL_SHOW);
  const [settings, setSettings] = useState<PaymentAccountSettings>(INITIAL_SETTINGS);
  const [entrants, setEntrants] = useState<{ ticketNumber: string; tiktokHandle: string; createdAt: string }[]>([]);
  const [remainingSeconds, setRemainingSeconds] = useState<number>(0);

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

  // Window is active ONLY when show status is PAYMENT_WINDOW and time is greater than 0
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

  // Form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!isWindowActive) {
      setErrorMsg('Tonight\'s payment window has closed. Entries are no longer being accepted.');
      return;
    }

    if (!fullName || !phoneNumber || !tiktokHandle || !amountPaid || !streetAddress || !city || !zipCode) {
      setErrorMsg('Please fill in all required fields including full shipping address.');
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch('/api/entries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName,
          phoneNumber,
          tiktokHandle: tiktokHandle.startsWith('@') ? tiktokHandle : `@${tiktokHandle}`,
          paymentMethod,
          amountPaid: parseFloat(amountPaid),
          shippingAddress: {
            street: streetAddress,
            city,
            state,
            zipCode
          },
          receiptImageUrl: receiptImage || null
        })
      });

      const data = await res.json();

      if (data.success && data.entry) {
        setLuckyTicket({
          ticketNumber: data.entry.ticketNumber,
          fullName: data.entry.fullName
        });
        // Reset inputs
        setFullName('');
        setPhoneNumber('');
        setTiktokHandle('');
        setAmountPaid('');
        setStreetAddress('');
        setCity('');
        setZipCode('');
        setReceiptImage('');
      } else {
        setErrorMsg(data.error || 'Failed to submit entry. Please try again or WhatsApp host.');
      }
    } catch {
      setErrorMsg('Network error while submitting. Please check your connection.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#faf8f5] text-stone-800 font-body">
      {/* Top Banner */}
      <header className="sticky top-0 z-50 bg-[#1a1715] text-[#d6cdbe] border-b border-[#3d3630] py-3 px-4 shadow-md">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="flex items-center gap-1.5 text-xs text-amber-200/90 hover:text-white transition-colors font-medium"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Main Showroom</span>
            </Link>
            <span className="hidden sm:inline text-stone-600">•</span>
            <div className="hidden sm:flex items-center gap-2">
              <span className="font-heading text-xs font-bold text-amber-400 tracking-wider uppercase">
                S&amp;Z GLAM LIVE
              </span>
              <span className="text-[10px] text-stone-400 font-heading">
                Curated by Sumera Usmani
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="https://www.tiktok.com/@snzglam/live"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-rose-600/90 hover:bg-rose-600 text-white text-xs font-bold transition-all shadow-sm"
            >
              <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
              <Video className="w-3.5 h-3.5" />
              <span>TikTok Live Stream</span>
            </a>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-5xl mx-auto px-4 py-8 sm:py-12">
        {/* Breadcrumb / Notice */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-8 pb-4 border-b border-stone-200">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-semibold text-amber-800 uppercase tracking-widest mb-1 font-heading">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>Official Live Stream Portal • United States</span>
            </div>
            <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
              Tonight&apos;s Live Jewelry Drop &amp; Giveaway
            </h1>
            <p className="text-xs text-stone-500 font-body">
              Curated by Sumera Usmani • Fast 2-3 Day USPS Priority Mail Nationwide
            </p>
          </div>

          {/* Status Badge */}
          <div className="flex items-center gap-2 self-start sm:self-center">
            {isWindowActive ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-bold shadow-sm">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                Payment Window Active
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-stone-900 text-amber-300 text-xs font-bold shadow-sm">
                <Lock className="w-3 h-3 text-amber-400" />
                Window Closed • Winner Reveal Live
              </span>
            )}
          </div>
        </div>

        {/* Live Timer & Prize Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
          {/* Left: Featured Tonight Prize */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-amber-200/80 shadow-lg relative overflow-hidden flex flex-col justify-between">
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-100/50 rounded-full blur-3xl pointer-events-none" />

            <div>
              <div className="flex items-center justify-between gap-2 mb-4">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-300 text-[#8c671b] text-xs font-bold uppercase tracking-wider font-heading">
                  <Gift className="w-3.5 h-3.5 text-amber-600" />
                  Tonight&apos;s Featured Giveaway
                </span>
                <span className="font-heading font-extrabold text-stone-900 text-base sm:text-lg">
                  Valued at ${show.featuredPrize?.retailValue || 245}
                </span>
              </div>

              <div className="relative h-64 sm:h-80 w-full rounded-2xl overflow-hidden mb-6 border border-stone-200 shadow-inner bg-stone-100">
                <Image
                  src={show.featuredPrize?.imageUrl || INITIAL_PRIZE.imageUrl}
                  alt={show.featuredPrize?.title || INITIAL_PRIZE.title}
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-700"
                  priority
                />
                <div className="absolute bottom-3 left-3 bg-black/70 backdrop-blur-md px-3 py-1 rounded-full text-[11px] text-amber-200 font-semibold flex items-center gap-1.5 border border-amber-400/30">
                  <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                  <span>100% Authentic Handcrafted • 24K Dipped</span>
                </div>
              </div>

              <h2 className="font-heading text-xl sm:text-2xl font-bold text-stone-900 mb-2 leading-snug">
                {show.featuredPrize?.title || INITIAL_PRIZE.title}
              </h2>

              <p className="text-stone-600 text-xs sm:text-sm leading-relaxed mb-6 font-normal">
                {show.featuredPrize?.description || INITIAL_PRIZE.description}
              </p>
            </div>

            {/* Quick Guarantees */}
            <div className="pt-4 border-t border-stone-100 grid grid-cols-2 gap-3 text-xs text-stone-600">
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-amber-700 shrink-0" />
                <span>USPS 2-3 Day Priority Mail</span>
              </div>
              <div className="flex items-center gap-2">
                <Trophy className="w-4 h-4 text-emerald-700 shrink-0" />
                <span>Provably Fair Live Winner Draw</span>
              </div>
            </div>
          </div>

          {/* Right: Countdown Clock & Entrants Info */}
          <div className="lg:col-span-5 flex flex-col justify-between gap-6">
            {/* The Countdown Card */}
            <div className="bg-gradient-to-br from-[#1a1715] to-[#2b2521] text-white p-6 sm:p-8 rounded-3xl shadow-xl border border-amber-500/30 relative overflow-hidden text-center">
              <div className="absolute top-0 right-0 w-40 h-40 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold uppercase tracking-wider mb-4 border border-amber-500/30">
                <Clock className="w-3.5 h-3.5 text-amber-400 animate-spin" />
                <span>Official Show Timer</span>
              </div>

              <div className="font-heading text-6xl sm:text-7xl font-black text-white tracking-tight drop-shadow-md mb-2 font-mono">
                {formatTime(remainingSeconds)}
              </div>

              <p className="text-amber-200/90 text-xs sm:text-sm mb-6 font-medium">
                {isWindowActive
                  ? 'Complete your payment & submit form before clock hits 00:00!'
                  : 'Timer has ended! Winner selection is live on TikTok stream.'}
              </p>

              {/* Live Ticker */}
              <div className="bg-white/10 rounded-2xl p-4 border border-white/10 flex items-center justify-between text-left">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-amber-400/20 flex items-center justify-center text-amber-300">
                    <Users className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-lg font-bold text-white font-heading">
                      {entrants.length + 18} Verified
                    </div>
                    <div className="text-[11px] text-stone-300">Tonight&apos;s Entrants Pool</div>
                  </div>
                </div>

                <a
                  href="https://www.tiktok.com/@snzglam/live"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all"
                >
                  <Radio className="w-3.5 h-3.5 text-stone-950" />
                  <span>Join Live</span>
                </a>
              </div>
            </div>

            {/* Concierge Support Box */}
            <div className="bg-[#faf5eb] rounded-3xl p-6 border border-amber-200 text-xs space-y-3">
              <div className="flex items-center gap-2 font-bold text-stone-900 font-heading text-sm">
                <Sparkles className="w-4 h-4 text-amber-700" />
                <span>Concierge Direct Line</span>
              </div>
              <p className="text-stone-600 leading-relaxed font-normal">
                Direct consultation with Sumera Usmani for custom bridal jewelry sets, order claims, and payment assistance:
              </p>
              <div className="flex items-center gap-3 pt-1">
                <a
                  href="https://wa.me/19296001937"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-center flex items-center justify-center gap-1.5 shadow-sm transition-all"
                >
                  <WhatsAppIcon className="w-4 h-4" />
                  <span>WhatsApp Concierge</span>
                </a>
                <a
                  href="tel:19296001937"
                  className="py-2.5 px-3 rounded-xl bg-white border border-stone-300 text-stone-800 hover:text-amber-800 font-bold text-center flex items-center justify-center gap-1.5 shadow-sm transition-all"
                >
                  <PhoneCallIcon className="w-3.5 h-3.5" />
                  <span>(929) 600-1937</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Confetti Alert if ticket received */}
        {luckyTicket && (
          <div className="mb-10 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-amber-50 via-yellow-50 to-amber-50 border-2 border-amber-400 shadow-xl">
            <ConfettiCelebration />
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-amber-500 text-stone-950 flex items-center justify-center font-bold text-2xl shadow-md shrink-0">
                  🎟️
                </div>
                <div>
                  <span className="text-xs font-bold uppercase tracking-widest text-amber-800">
                    Registration Confirmed!
                  </span>
                  <h3 className="text-2xl font-black text-stone-900 font-heading">
                    Lucky Ticket: {luckyTicket.ticketNumber}
                  </h3>
                  <p className="text-xs text-stone-600 mt-1">
                    Thank you, {luckyTicket.fullName}! Your ticket has been entered into tonight&apos;s live draw pool.
                  </p>
                </div>
              </div>
              <a
                href="https://www.tiktok.com/@snzglam/live"
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 rounded-xl bg-stone-900 hover:bg-black text-amber-300 font-bold text-xs uppercase tracking-wider shadow-lg flex items-center gap-2 shrink-0"
              >
                <Video className="w-4 h-4 text-rose-500" />
                <span>Watch Winner Draw Live</span>
              </a>
            </div>
          </div>
        )}

        {/* CONDITIONAL RENDER: WHEN TIMER IS ACTIVE -> SHOW PAYMENT & FORM */}
        {/* WHEN TIMER IS CLOSED -> HIDE FORM COMPLETELY & SHOW LUXURY CLOSED CARD */}
        {isWindowActive ? (
          <>
            {/* Step 1: Payment Instructions */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-amber-200/80 shadow-md mb-8">
              <div className="flex items-center gap-2 text-[#8c671b] text-xs font-bold uppercase tracking-wider mb-2 font-heading">
                <DollarSign className="w-4 h-4 text-amber-600" />
                <span>Step 1: Send Payment via Official US Method</span>
              </div>
              <h3 className="font-heading text-2xl font-bold text-stone-900 mb-2">
                Official S&amp;Z Glam Collection Accounts
              </h3>
              <p className="text-stone-600 text-xs sm:text-sm mb-6 leading-relaxed font-normal">
                Choose any verified method below to complete payment for your claimed jewelry piece. Please put your TikTok username in the memo note.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Zelle */}
                <div className="p-4 rounded-2xl bg-[#faf8f4] border border-amber-200/80 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-bold text-sm text-stone-900 flex items-center gap-1.5 font-heading">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#7414CA]" />
                        Zelle Bank Transfer
                      </span>
                      <span className="text-[10px] uppercase font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                        Instant • $0 Fee
                      </span>
                    </div>
                    <p className="text-[11px] text-stone-500 mb-2">{settings.zelle.recipientName}</p>
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
                </div>

                {/* Venmo */}
                <div className="p-4 rounded-2xl bg-[#faf8f4] border border-amber-200/80 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-bold text-sm text-stone-900 flex items-center gap-1.5 font-heading">
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
                      <span className="font-bold text-sm text-stone-900 flex items-center gap-1.5 font-heading">
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
                      <span className="font-bold text-sm text-stone-900 flex items-center gap-1.5 font-heading">
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

            {/* Step 2: Instant Registration Form */}
            <div id="entry-form" className="bg-white rounded-3xl p-6 sm:p-10 mb-12 border-2 border-[#d4af37]/80 shadow-xl">
              <div className="flex items-center gap-2 text-[#8c671b] text-xs font-bold uppercase tracking-wider mb-2 font-heading">
                <Sparkles className="w-4 h-4 text-amber-600" />
                <span>Step 2: Register Payment &amp; Get Verifiable Lucky Ticket</span>
              </div>
              <h2 className="font-heading text-2xl sm:text-3xl font-bold text-stone-900 mb-2">
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
                      className="px-3 py-2.5 rounded-xl border border-stone-300 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 text-sm bg-white"
                    >
                      {US_STATES.map(s => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                    <input
                      type="text"
                      required
                      placeholder="Zip Code"
                      value={zipCode}
                      onChange={e => setZipCode(e.target.value)}
                      className="px-4 py-2.5 rounded-xl border border-stone-300 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 text-sm bg-stone-50/50"
                    />
                  </div>
                </div>

                {/* Optional Screenshot */}
                <div className="pt-3 border-t border-stone-100">
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                    Payment Screenshot (Recommended for Instant Approval)
                  </label>
                  <div className="flex items-center gap-3">
                    <label className="cursor-pointer px-4 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold transition-colors border border-stone-300 flex items-center gap-2">
                      <Send className="w-3.5 h-3.5 rotate-45 text-amber-700" />
                      <span>{uploadingReceipt ? 'Uploading Screenshot...' : 'Attach Receipt Image'}</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileUpload}
                        className="hidden"
                        disabled={uploadingReceipt}
                      />
                    </label>
                    {receiptImage && (
                      <span className="text-xs text-emerald-700 font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Screenshot Attached!
                      </span>
                    )}
                  </div>
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={isSubmitting || uploadingReceipt}
                    className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#98752c] to-[#b8860b] hover:from-[#8c671b] hover:to-[#996515] text-white font-bold text-sm uppercase tracking-wider shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <>
                        <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Generating Official Ticket...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4 text-amber-200" />
                        <span>Register Payment &amp; Get Lucky Ticket</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </>
        ) : (
          /* LUXURY CLOSED CARD - DISPLAYED WHEN TIMER IS ENDED */
          <div className="bg-white rounded-3xl p-8 sm:p-12 mb-12 border-2 border-amber-300 shadow-xl text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-amber-100/40 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-rose-100/30 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 max-w-2xl mx-auto space-y-4">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-stone-900 text-amber-300 text-xs font-bold uppercase tracking-wider shadow-sm">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse" />
                <span>Payment Window Closed • Winner Draw Underway</span>
              </div>

              <h2 className="font-heading text-3xl sm:text-4xl font-extrabold text-stone-900 tracking-tight">
                Tonight&apos;s Entry Window Is Now Closed
              </h2>

              <p className="text-stone-600 text-sm sm:text-base leading-relaxed font-normal">
                Submissions for tonight&apos;s featured giveaway drop are now officially locked. Founder <strong className="text-stone-900 font-semibold">Sumera Usmani</strong> is reviewing all submitted Lucky Tickets and picking the lucky winner live on TikTok!
              </p>

              <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200 text-stone-800 text-xs flex items-center justify-center gap-2 max-w-lg mx-auto">
                <Sparkles className="w-4 h-4 text-amber-700 shrink-0" />
                <span>Watch the live draw right now on our official TikTok stream!</span>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                <a
                  href="https://www.tiktok.com/@snzglam/live"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-black hover:bg-stone-800 text-white font-bold text-xs uppercase tracking-wider shadow-xl flex items-center justify-center gap-2.5 transition-all hover:scale-105"
                >
                  <Video className="w-4 h-4 text-rose-500" />
                  <span>Watch Winner Draw on TikTok Live</span>
                </a>

                <a
                  href="https://wa.me/19296001937"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider shadow-xl flex items-center justify-center gap-2.5 transition-all hover:scale-105"
                >
                  <WhatsAppIcon className="w-4 h-4" />
                  <span>WhatsApp Sumera Usmani</span>
                </a>
              </div>

              <div className="pt-6 border-t border-stone-200 text-stone-500 text-xs">
                Missed tonight&apos;s timer? Follow <strong className="text-stone-800">@snzglam</strong> on TikTok &amp; turn on live notifications for our next daily drop!
              </div>
            </div>
          </div>
        )}

        {/* Hall of Fame: Past Lucky Winners */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-amber-200/80 shadow-md mb-12">
          <div className="flex items-center justify-between mb-6">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-amber-800 uppercase tracking-wider mb-1 font-heading">
                <Trophy className="w-4 h-4 text-amber-600" />
                <span>Verified Winner Hall of Fame</span>
              </div>
              <h3 className="font-heading text-xl sm:text-2xl font-bold text-stone-900">
                Recent Lucky Customers
              </h3>
            </div>
            <span className="text-xs text-stone-500 font-medium">
              100% Provably Fair
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {LAST_WINNERS.map((w, idx) => (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-[#faf8f4] border border-amber-200/60 hover:border-amber-400 transition-all hover:shadow-md flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="font-mono text-xs font-bold text-amber-800 bg-amber-100/80 px-2 py-0.5 rounded-md">
                      {w.ticket}
                    </span>
                    <span className="text-[11px] text-stone-500 flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-stone-400" />
                      {w.date}
                    </span>
                  </div>

                  <div className="relative h-40 w-full rounded-xl overflow-hidden mb-3 border border-stone-200 bg-stone-100">
                    <Image
                      src={w.imageUrl}
                      alt={w.prize}
                      fill
                      className="object-cover"
                    />
                  </div>

                  <h4 className="font-heading font-bold text-stone-900 text-sm mb-1">
                    {w.name}
                  </h4>
                  <p className="text-xs font-semibold text-amber-700 mb-2">
                    {w.tiktokHandle}
                  </p>
                  <p className="text-xs text-stone-600 line-clamp-2">
                    {w.prize}
                  </p>
                </div>

                <div className="pt-3 border-t border-amber-200/40 mt-3 flex items-center justify-between text-xs">
                  <span className="text-stone-500">Prize Value</span>
                  <span className="font-bold text-emerald-700">{w.retail} (Gifted Free)</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Social Links on Live Page */}
        <div className="flex items-center justify-center gap-3 text-stone-500 text-xs pt-6 pb-8 border-t border-stone-200">
          <a
            href="https://www.instagram.com/snzglam/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram @snzglam"
            className="w-10 h-10 rounded-full bg-stone-100 hover:bg-gradient-to-tr hover:from-amber-600 hover:to-pink-600 text-stone-700 hover:text-white flex items-center justify-center transition-all duration-300 border border-stone-300 hover:border-amber-400 shadow-sm hover:scale-110"
          >
            <InstagramIcon className="w-4 h-4" />
          </a>

          <a
            href="https://www.tiktok.com/@snzglam"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="TikTok @snzglam"
            className="w-10 h-10 rounded-full bg-stone-100 hover:bg-black text-stone-700 hover:text-white flex items-center justify-center transition-all duration-300 border border-stone-300 hover:border-stone-900 shadow-sm hover:scale-110"
          >
            <TikTokIcon className="w-4 h-4" />
          </a>

          <a
            href="https://wa.me/19296001937"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="WhatsApp Concierge"
            className="w-10 h-10 rounded-full bg-stone-100 hover:bg-emerald-600 text-stone-700 hover:text-white flex items-center justify-center transition-all duration-300 border border-stone-300 hover:border-emerald-500 shadow-sm hover:scale-110"
          >
            <WhatsAppIcon className="w-4 h-4" />
          </a>

          <a
            href="tel:19296001937"
            aria-label="Direct Phone Line"
            className="w-10 h-10 rounded-full bg-stone-100 hover:bg-amber-600 text-stone-700 hover:text-white flex items-center justify-center transition-all duration-300 border border-stone-300 hover:border-amber-500 shadow-sm hover:scale-110"
          >
            <PhoneCallIcon className="w-3.5 h-3.5" />
          </a>
        </div>
      </main>

      {/* Footer with Zarnetic Credit */}
      <footer className="border-t border-[#ebd9b5] bg-[#1a1715] text-[#d6cdbe] py-10 px-4 text-center text-xs">
        <p className="mb-2">
          Questions? Message Sumera Usmani &amp; Concierge on{' '}
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
          <p>&copy; {new Date().getFullYear()} S&amp;Z GLAM COLLECTION LLC • Curated by Sumera Usmani. All rights reserved.</p>

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
