'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Video,
  Gift,
  Sparkles,
  Trophy,
  ArrowRight,
  MapPin,
  Calendar,
  Truck,
  ShieldCheck,
  Heart,
  ChevronRight,
  ExternalLink,
  Clock,
  Phone,
  CheckCircle2,
  Gem,
  Award,
  Copy,
  Check,
  Star,
  Send,
  AlertCircle,
  ShoppingBag,
  Crown,
  Zap,
  CheckCircle,
  HelpCircle
} from 'lucide-react';
import { InstagramIcon, TikTokIcon, WhatsAppIcon, PhoneCallIcon } from '@/components/SocialIcons';
import ConfettiCelebration from '@/components/ConfettiCelebration';

interface PrizeData {
  title: string;
  retailValue: number;
  imageUrl: string;
  description: string;
}

const DEFAULT_PRIZE: PrizeData = {
  title: '24K Gold Plated Royal Kundan & Basra Pearl Bridal Choker Set',
  retailValue: 245,
  imageUrl: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=1200&auto=format&fit=crop',
  description: 'Exquisite royal bridal choker encrusted with hand-faceted polki kundan stones, imperial emerald glass drop beads, and micro-woven Basra seed pearls. Includes matching chandelier chandbalis and royal maang tikka.'
};

const VAULT_ITEMS = [
  {
    id: 'v1',
    name: 'Royal Mughal Polki & Emerald Bridal Set',
    category: 'Kundan Chokers',
    retailPrice: 285,
    livePrice: 195,
    tag: 'TikTok Viral Drop',
    image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=800&auto=format&fit=crop',
    description: '24K gold dipped copper alloy with hand-cut polki kundan, mint meenakari enameling, and matching statement earrings.',
    purity: '24K Gold Vermeil • Anti-Tarnish'
  },
  {
    id: 'v2',
    name: 'Imperial Nizam Basra Pearl Multi-Strand Haar',
    category: 'Pearl Haars',
    retailPrice: 220,
    livePrice: 145,
    tag: 'Host Favorite',
    image: 'https://images.unsplash.com/photo-1611591475870-1798365d9560?q=80&w=800&auto=format&fit=crop',
    description: '7-strand graded micro Basra seed pearls centered with an ornate Mughal crest pendant encrusted with ruby cabochons.',
    purity: 'Cultured Basra Pearls • Hand-Strung'
  },
  {
    id: 'v3',
    name: 'American Diamond Solitaire Halo Reception Set',
    category: 'Diamond & Solitaire',
    retailPrice: 240,
    livePrice: 165,
    tag: 'High-Shine CZ',
    image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=800&auto=format&fit=crop',
    description: 'Rhodium platinum-plated luxury set studded with heart & arrows princess-cut solitaires. Indistinguishable from real diamonds.',
    purity: 'Rhodium Dipped • Swiss Cubic Zirconia'
  },
  {
    id: 'v4',
    name: 'Ruby Velvet Polki Bridal Chandbalis',
    category: 'Chandbalis & Jhumkas',
    retailPrice: 150,
    livePrice: 95,
    tag: 'Limited Drop',
    image: 'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?q=80&w=800&auto=format&fit=crop',
    description: 'Traditional Punjabi bridal chandbalis with layered pearl drops and detachable royal ear-chains (saharas).',
    purity: 'Hypoallergenic • Featherlight Weight'
  },
  {
    id: 'v5',
    name: 'Jaipuri Handcrafted Meenakari Kada Bangles (Pair)',
    category: 'Kundan Chokers',
    retailPrice: 140,
    livePrice: 85,
    tag: 'Bridal Must-Have',
    image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=800&auto=format&fit=crop',
    description: 'Openable screw-lock bridal kadas adorned with intricate floral meenakari art and uncut kundan stones.',
    purity: '22K Matte Gold • Brass Core'
  },
  {
    id: 'v6',
    name: 'Zirconia Crystal Cascading Tennis Choker',
    category: 'Diamond & Solitaire',
    retailPrice: 195,
    livePrice: 125,
    tag: 'Sangeet Special',
    image: 'https://images.unsplash.com/photo-1611591475870-1798365d9560?q=80&w=800&auto=format&fit=crop',
    description: 'Modern fusion tennis choker with teardrop diamond crystal drops for cocktail dinners and sangeet glam.',
    purity: 'Platinum Finished • AAAAA Crystals'
  }
];

const LIVE_ENTRANTS_STREAM = [
  { name: 'Ayesha K.', city: 'Dallas, TX', method: 'Zelle', ticket: '#SZ-4891', time: '2m ago' },
  { name: 'Farah M.', city: 'Queens, NY', method: 'Venmo', ticket: '#SZ-4892', time: '4m ago' },
  { name: 'Priya S.', city: 'Fremont, CA', method: 'Cash App', ticket: '#SZ-4893', time: '7m ago' },
  { name: 'Nimra B.', city: 'Chicago, IL', method: 'Zelle', ticket: '#SZ-4894', time: '11m ago' },
  { name: 'Zoya H.', city: 'Houston, TX', method: 'PayPal', ticket: '#SZ-4895', time: '14m ago' },
  { name: 'Samina T.', city: 'Atlanta, GA', method: 'Zelle', ticket: '#SZ-4896', time: '18m ago' }
];

const US_STATES = [
  'AL','AK','AZ','AR','CA','CO','CT','DE','FL','GA','HI','ID','IL','IN','IA',
  'KS','KY','LA','ME','MD','MA','MI','MN','MS','MO','MT','NE','NV','NH','NJ',
  'NM','NY','NC','ND','OH','OK','OR','PA','RI','SC','SD','TN','TX','UT','VT',
  'VA','WA','WV','WI','WY'
];

export default function HomePage() {
  const [showStatus, setShowStatus] = useState<string>('OFFLINE');
  const [remainingSecs, setRemainingSecs] = useState<number>(0);
  const [entrantsCount, setEntrantsCount] = useState<number>(8);
  const [prize, setPrize] = useState<PrizeData>(DEFAULT_PRIZE);
  const [activeCategory, setActiveCategory] = useState<string>('ALL');

  // Copy helper
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2500);
  };

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

  // Sync with API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [showRes, entriesRes] = await Promise.all([
          fetch('/api/show'),
          fetch('/api/entries')
        ]);
        const showData = await showRes.json();
        const entriesData = await entriesRes.json();

        if (showData.success && showData.show) {
          setShowStatus(showData.show.status);
          setRemainingSecs(showData.remainingSeconds || 0);
          if (showData.show.featuredPrize) {
            setPrize(showData.show.featuredPrize);
          }
        }
        if (entriesData.success && entriesData.entrants) {
          setEntrantsCount(entriesData.entrants.length);
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
    const poll = setInterval(fetchData, 8000);
    return () => clearInterval(poll);
  }, []);

  // Local seconds countdown tick
  useEffect(() => {
    const timer = setInterval(() => {
      setRemainingSecs(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatCountdown = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return {
      minutes: m.toString().padStart(2, '0'),
      seconds: s.toString().padStart(2, '0')
    };
  };

  const isTimerActive = showStatus === 'PAYMENT_WINDOW' && remainingSecs > 0;
  const time = formatCountdown(remainingSecs);

  // File upload handler
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

  // Submit registration form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!fullName.trim()) return setErrorMsg('Please enter your full name');
    if (!phoneNumber.trim()) return setErrorMsg('Please enter your US phone number');
    if (!tiktokHandle.trim()) return setErrorMsg('Please enter your TikTok username');
    if (!amountPaid || isNaN(Number(amountPaid))) return setErrorMsg('Please enter the valid amount paid');
    if (!streetAddress.trim()) return setErrorMsg('Please enter your shipping street address');
    if (!city.trim()) return setErrorMsg('Please enter your city');
    if (!zipCode.trim()) return setErrorMsg('Please enter your ZIP code');

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/entries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName,
          phoneNumber,
          tiktokHandle,
          paymentMethod,
          amountPaid: Number(amountPaid),
          shippingAddress: {
            street: streetAddress,
            city,
            state,
            zip: zipCode
          },
          receiptImage: receiptImage || null
        })
      });

      const data = await res.json();
      if (!data.success) {
        throw new Error(data.error || 'Failed to submit entry');
      }

      setLuckyTicket({
        ticketNumber: data.entry.ticketNumber,
        fullName: data.entry.fullName
      });

      // Clear form
      setFullName('');
      setPhoneNumber('');
      setTiktokHandle('');
      setAmountPaid('');
      setStreetAddress('');
      setCity('');
      setZipCode('');
      setReceiptImage('');
    } catch (err: any) {
      setErrorMsg(err.message || 'Something went wrong. Please reach out on WhatsApp.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredVault = activeCategory === 'ALL'
    ? VAULT_ITEMS
    : VAULT_ITEMS.filter(item => item.category === activeCategory);

  return (
    <div className="min-h-screen bg-[#faf8f5] text-[#1c1816] selection:bg-amber-100 flex flex-col font-sans">
      {/* 1. ULTRA-LUXURY TOP RUNNING MARQUEE BANNER */}
      <div className="bg-gradient-to-r from-[#211d1a] via-[#161311] to-[#211d1a] text-[#f7ecd5] border-b border-[#3b322a] overflow-hidden py-2.5">
        <div className="animate-marquee whitespace-nowrap text-[11px] font-semibold tracking-[0.2em] uppercase flex items-center gap-10">
          <span className="flex items-center gap-3">
            <Sparkles className="w-3.5 h-3.5 text-[#d4af37]" />
            <span>S&amp;Z GLAM ATELIER NEW YORK</span>
          </span>
          <span>✦</span>
          <span>ROYAL 24K GOLD VERMEIL &amp; UNCUT KUNDAN HEIRLOOMS</span>
          <span>✦</span>
          <span>FAST COMPLIMENTARY INSURED US SHIPPING OVER $100</span>
          <span>✦</span>
          <span className="text-[#f3d47e] font-bold">TONIGHT&apos;S 30-MINUTE LIVE GIVEAWAY PORTAL IS ACTIVE</span>
          <span>✦</span>
          <span>ZELLE • VENMO • CASH APP • PAYPAL ACCEPTED</span>
          <span>✦</span>
          <span className="flex items-center gap-3">
            <Sparkles className="w-3.5 h-3.5 text-[#d4af37]" />
            <span>S&amp;Z GLAM ATELIER NEW YORK</span>
          </span>
          <span>✦</span>
          <span>ROYAL 24K GOLD VERMEIL &amp; UNCUT KUNDAN HEIRLOOMS</span>
          <span>✦</span>
          <span>FAST COMPLIMENTARY INSURED US SHIPPING OVER $100</span>
          <span>✦</span>
          <span className="text-[#f3d47e] font-bold">TONIGHT&apos;S 30-MINUTE LIVE GIVEAWAY PORTAL IS ACTIVE</span>
          <span>✦</span>
          <span>ZELLE • VENMO • CASH APP • PAYPAL ACCEPTED</span>
        </div>
      </div>

      {/* 2. SUBTLE METROPOLITAN CONCIERGE TOPBAR */}
      <div className="bg-[#f5ede0] border-b border-[#e6d6bc]/80 text-[#54432a] py-1.5 px-4 text-[11px] font-medium tracking-wide">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-1.5 text-center sm:text-left">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
            <span className="font-semibold text-stone-800">
              New York Atelier Showroom &amp; TikTok Live Studio
            </span>
            <span className="text-stone-400 hidden md:inline">•</span>
            <span className="hidden md:inline text-stone-600">
              Daily Live Shows with 360° Shine Tests
            </span>
          </div>

          <div className="flex items-center gap-5 tracking-wider font-semibold uppercase text-[10px]">
            <a
              href="https://wa.me/19296001937"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#875d14] hover:text-[#5e3f08] transition-colors flex items-center gap-1.5"
            >
              <Phone className="w-3 h-3 text-emerald-700" />
              <span>WhatsApp: +1 (929) 600-1937</span>
            </a>
            <span className="text-stone-300">|</span>
            <a
              href="https://www.instagram.com/snzglam/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-stone-600 hover:text-[#875d14] transition-colors"
            >
              Instagram: @snzglam
            </a>
            <span className="text-stone-300 hidden sm:inline">|</span>
            <span className="text-stone-500 hidden sm:inline">TikTok: @snzglam</span>
          </div>
        </div>
      </div>

      {/* 3. FLAGSHIP LUXURY NAVBAR */}
      <header className="sticky top-0 z-40 bg-[#faf8f5]/95 backdrop-blur-md border-b border-[#ebd9b5]/90 py-3.5 px-4 sm:px-8 shadow-xs">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Brand Emblem & Royal Typography */}
          <Link href="/" className="flex items-center gap-3.5 group">
            <div className="w-13 h-13 rounded-full overflow-hidden border-2 border-[#d4af37] shadow-[0_2px_14px_rgba(212,175,55,0.35)] group-hover:scale-105 transition-transform duration-500 relative p-0.5 bg-gradient-to-tr from-[#d4af37] via-[#fff] to-[#aa8222]">
              <div className="w-full h-full rounded-full overflow-hidden bg-white">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/logo.jpg"
                  alt="S&Z Glam Collection Crest"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            <div className="text-left">
              <span className="font-royal text-xl sm:text-2xl font-black tracking-[0.12em] text-[#1c1816] block group-hover:text-[#996515] transition-colors uppercase">
                S&amp;Z GLAM
              </span>
              <span className="text-[9px] uppercase tracking-[0.3em] text-[#8a7251] font-bold block -mt-0.5">
                Haute Joaillerie • New York
              </span>
            </div>
          </Link>

          {/* Center Navigation Links (Editorial) */}
          <nav className="hidden lg:flex items-center gap-8 text-xs font-bold tracking-wider uppercase text-stone-700">
            <a href="#vault" className="hover:text-[#996515] transition-colors">
              The Vault
            </a>
            <a href="#giveaway" className="hover:text-[#996515] transition-colors flex items-center gap-1">
              <Crown className="w-3.5 h-3.5 text-[#b8860b]" />
              <span>Live Giveaway</span>
            </a>
            <a href="#how-it-works" className="hover:text-[#996515] transition-colors">
              Live Protocol
            </a>
            <a href="#payment-portal" className="hover:text-[#996515] transition-colors">
              US Payment Hub
            </a>
            <a href="#hall-of-fame" className="hover:text-[#996515] transition-colors">
              Hall of Fame
            </a>
            <a href="#concierge" className="hover:text-[#996515] transition-colors">
              Concierge
            </a>
          </nav>

          {/* Right Live Callout & Primary CTA */}
          <div className="flex items-center gap-3">
            {isTimerActive ? (
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-50 border border-red-200 text-red-700 text-xs font-bold pulse-gold">
                <span className="w-2 h-2 rounded-full bg-red-600 animate-ping" />
                <span className="font-mono text-xs">{time.minutes}:{time.seconds}</span>
              </div>
            ) : (
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold">
                <span className="w-2 h-2 rounded-full bg-emerald-600 animate-ping" />
                <span>LIVE ON-AIR</span>
              </div>
            )}

            <Link
              href="#payment-portal"
              className="btn-royal-gold px-5 sm:px-6 py-2.5 rounded-full text-xs font-bold flex items-center gap-1.5 shadow-sm"
            >
              <Gift className="w-3.5 h-3.5 text-white" />
              <span>Claim Ticket</span>
            </Link>
          </div>
        </div>
      </header>

      {/* MAIN CONTAINER */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 sm:py-14 space-y-24">

        {/* ========================================================================= */}
        {/* 4. BESPOKE HAUTE-COUTURE SPLIT-HERO SECTION */}
        {/* ========================================================================= */}
        <section className="relative">
          {/* Subtle Ambient Glow */}
          <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-96 h-96 bg-amber-100/40 rounded-full blur-3xl pointer-events-none -z-10" />
          <div className="absolute top-1/3 right-10 w-80 h-80 bg-amber-200/30 rounded-full blur-3xl pointer-events-none -z-10" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            {/* LEFT COLUMN: Editorial Storytelling & Action */}
            <div className="lg:col-span-7 space-y-8">
              {/* Crest Eyebrow Badge */}
              <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-[#fbf5e8] border border-[#d9c193] text-[#825c15] text-[11px] font-extrabold uppercase tracking-[0.2em] shadow-2xs">
                <Crown className="w-3.5 h-3.5 text-[#b8860b]" />
                <span>Haute Artisanal South Asian Heirlooms • New York Atelier</span>
              </div>

              {/* Grand Luxury Typography */}
              <div className="space-y-4">
                <h1 className="font-royal text-4xl sm:text-6xl lg:text-7xl font-extrabold text-[#1c1816] leading-[1.08] tracking-tight">
                  Jewelry That Bestows <br className="hidden sm:inline" />
                  <span className="gold-text-gradient font-black">Royalty Upon You.</span>
                </h1>
                <p className="font-editorial text-xl sm:text-2xl text-[#6b583f] italic font-normal">
                  Handcrafted 24K Gold Vermeil, Uncut Polki Kundan &amp; Basra Pearl Masterpieces
                </p>
              </div>

              {/* Narrative Context */}
              <p className="text-stone-600 text-sm sm:text-base leading-relaxed max-w-xl font-normal">
                Experience high-definition live boutique shopping directly on TikTok. Every piece is presented with 360° diamond sparkle tests and custom bridal styling advice. Settle effortlessly via US Zelle, Venmo, or Cash App, and unlock your golden ticket for tonight&apos;s live lucky wheel spin!
              </p>

              {/* Dual Action Luxury Buttons */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
                <a
                  href="https://www.tiktok.com/@snzglam/live"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-royal-gold px-8 py-4 rounded-full text-xs sm:text-sm font-extrabold flex items-center justify-center gap-3 shadow-md group"
                >
                  <Video className="w-4 h-4 text-white group-hover:scale-110 transition-transform" />
                  <span>Watch On TikTok Live Stream</span>
                </a>

                <Link
                  href="#payment-portal"
                  className="btn-royal-outline px-8 py-4 rounded-full text-xs sm:text-sm font-extrabold flex items-center justify-center gap-2.5 shadow-xs"
                >
                  <Gift className="w-4 h-4 text-[#8c671b]" />
                  <span>Enter Tonight&apos;s 30-Min Draw</span>
                </Link>
              </div>

              {/* Luxury Guarantee Badges (Editorial 4-Grid) */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 border-t border-[#ebd9b5]/90 text-xs text-stone-700">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-[#fbf5e8] border border-[#d9c193] flex items-center justify-center text-[#996515] shrink-0">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-bold text-stone-900 leading-tight">24K Gold Plated</div>
                    <div className="text-[10px] text-stone-500 font-medium">Anti-Tarnish Seal</div>
                  </div>
                </div>

                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-[#fbf5e8] border border-[#d9c193] flex items-center justify-center text-[#996515] shrink-0">
                    <Truck className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-bold text-stone-900 leading-tight">Fast US Shipping</div>
                    <div className="text-[10px] text-stone-500 font-medium">USPS 2-3 Day Priority</div>
                  </div>
                </div>

                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-[#fbf5e8] border border-[#d9c193] flex items-center justify-center text-[#996515] shrink-0">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-bold text-stone-900 leading-tight">US Bank Secured</div>
                    <div className="text-[10px] text-stone-500 font-medium">Zelle &amp; Venmo Hub</div>
                  </div>
                </div>

                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-[#fbf5e8] border border-[#d9c193] flex items-center justify-center text-[#996515] shrink-0">
                    <Trophy className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-bold text-stone-900 leading-tight">Live Giveaways</div>
                    <div className="text-[10px] text-stone-500 font-medium">Every Show Wheel Spin</div>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: Interactive Tonight's Grand Prize Showcase Card */}
            <div className="lg:col-span-5" id="giveaway">
              <div className="royal-card-highlight p-6 sm:p-8 bg-gradient-to-br from-[#ffffff] via-[#fcfbf9] to-[#f7eedc] relative overflow-hidden shadow-xl border-2 border-[#d4af37]/80">
                {/* Floating Top Badge */}
                <div className="flex items-center justify-between mb-4">
                  <span className="px-3 py-1 rounded-full bg-stone-950 text-[#f7e7c4] text-[10px] font-extrabold uppercase tracking-widest border border-[#d4af37] shadow-sm flex items-center gap-1.5">
                    <Crown className="w-3.5 h-3.5 text-[#d4af37]" />
                    <span>Tonight&apos;s Spotlight Prize</span>
                  </span>

                  <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-300 text-[11px] font-black uppercase tracking-wide">
                    ${prize.retailValue} Appraised Value
                  </span>
                </div>

                {/* High-Definition Luxury Visual with Shimmer */}
                <div className="relative h-72 sm:h-80 w-full rounded-2xl overflow-hidden bg-stone-100 border border-[#ebd9b5] mb-6 shimmer-card shadow-inner">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={prize.imageUrl}
                    alt={prize.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-stone-950/70 via-transparent to-transparent pointer-events-none" />

                  <div className="absolute bottom-3 left-3 right-3 text-white">
                    <div className="text-[10px] uppercase font-bold tracking-widest text-[#f5db91] mb-0.5">
                      Live Customer Giveaway
                    </div>
                    <h3 className="font-royal text-base sm:text-lg font-bold leading-tight drop-shadow-md line-clamp-1">
                      {prize.title}
                    </h3>
                  </div>
                </div>

                {/* Synchronized 30-Minute Countdown Clock */}
                <div className="p-4 rounded-2xl bg-white border border-[#ebd9b5] shadow-xs mb-6">
                  <div className="flex items-center justify-between text-xs font-bold text-stone-700 mb-2">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-[#996515] animate-pulse" />
                      <span className="uppercase tracking-wider">
                        {isTimerActive ? '30-Min Payment Window Open' : 'Giveaway Window Status'}
                      </span>
                    </div>
                    <span className="text-[11px] text-[#996515] font-semibold">
                      {isTimerActive ? 'Clock Synced' : 'Ready'}
                    </span>
                  </div>

                  {/* Big Luxury Clock Numbers */}
                  <div className="grid grid-cols-2 gap-3 text-center my-2">
                    <div className="p-3 rounded-xl bg-gradient-to-b from-[#fbf8f0] to-[#f4ecd8] border border-[#dfcaa4]">
                      <div className="font-mono text-3xl sm:text-4xl font-black text-stone-900 tracking-wider">
                        {time.minutes}
                      </div>
                      <div className="text-[9px] uppercase tracking-widest text-stone-500 font-bold mt-0.5">
                        Minutes
                      </div>
                    </div>

                    <div className="p-3 rounded-xl bg-gradient-to-b from-[#fbf8f0] to-[#f4ecd8] border border-[#dfcaa4]">
                      <div className="font-mono text-3xl sm:text-4xl font-black text-[#996515] tracking-wider animate-pulse">
                        {time.seconds}
                      </div>
                      <div className="text-[9px] uppercase tracking-widest text-stone-500 font-bold mt-0.5">
                        Seconds
                      </div>
                    </div>
                  </div>

                  {/* Entrants Pulse Status */}
                  <div className="mt-3 flex items-center justify-between text-[11px] text-stone-600 font-medium pt-2 border-t border-stone-100">
                    <span>✨ {entrantsCount} US Viewers Registered</span>
                    <span className="text-emerald-700 font-bold">100% Free Entry with Live Order</span>
                  </div>
                </div>

                {/* Direct Action Link */}
                <Link
                  href="#payment-portal"
                  className="btn-royal-gold w-full py-3.5 rounded-xl text-xs font-extrabold flex items-center justify-center gap-2 shadow-md text-center"
                >
                  <span>Submit Payment &amp; Get Official Ticket</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 5. REAL-TIME LIVE ACTIVITY & TICKETS STREAM */}
        {/* ========================================================================= */}
        <section className="border-y border-[#ebd9b5]/90 py-5 bg-[#f7eedc]/50 rounded-2xl px-4 overflow-hidden">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 shrink-0">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
              <span className="font-royal text-xs font-bold uppercase tracking-wider text-stone-900">
                Recent VIP Entries
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 w-full">
              {LIVE_ENTRANTS_STREAM.map((item, idx) => (
                <div
                  key={idx}
                  className="bg-white/90 border border-[#dfcaa4] rounded-xl px-3 py-2 text-center shadow-2xs text-[11px]"
                >
                  <div className="font-bold text-stone-900 truncate">{item.name}</div>
                  <div className="text-[10px] text-stone-500 truncate">{item.city}</div>
                  <div className="text-[10px] font-mono font-bold text-[#996515] mt-0.5">
                    {item.ticket} • {item.method}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 6. SIGNATURE LIVE DROP VAULT (INTERACTIVE CATEGORIES) */}
        {/* ========================================================================= */}
        <section id="vault" className="space-y-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#fbf5e8] border border-[#d9c193] text-[#825c15] text-[10px] font-bold uppercase tracking-widest mb-2">
                <Sparkles className="w-3.5 h-3.5 text-[#b8860b]" />
                <span>The Bridal &amp; Festive Collection</span>
              </div>
              <h2 className="font-royal text-3xl sm:text-4xl lg:text-5xl font-black text-stone-900">
                The Signature Live Vault
              </h2>
              <p className="font-editorial text-lg text-stone-600 italic mt-1">
                Handcrafted treasures available to claim on stream or reserve with our concierge
              </p>
            </div>

            {/* Filter Tabs */}
            <div className="flex flex-wrap items-center gap-2">
              {['ALL', 'Kundan Chokers', 'Pearl Haars', 'Diamond & Solitaire', 'Chandbalis & Jhumkas'].map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-2 rounded-full text-xs font-bold tracking-wide transition-all ${
                    activeCategory === cat
                      ? 'bg-[#1c1816] text-[#f7ecd5] shadow-sm'
                      : 'bg-white text-stone-600 hover:text-stone-950 border border-stone-200'
                  }`}
                >
                  {cat === 'ALL' ? 'All Masterpieces' : cat}
                </button>
              ))}
            </div>
          </div>

          {/* Product Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredVault.map(item => (
              <div
                key={item.id}
                className="royal-card overflow-hidden bg-white border border-[#ebd9b5] group flex flex-col justify-between hover:shadow-xl transition-all duration-500"
              >
                <div>
                  {/* Image with Tag */}
                  <div className="relative h-72 w-full overflow-hidden bg-stone-100 shimmer-card">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 ease-out"
                    />
                    <div className="absolute top-3 left-3">
                      <span className="px-3 py-1 rounded-full bg-stone-900/90 text-amber-300 text-[10px] font-extrabold tracking-wider uppercase border border-amber-400/60 shadow-sm">
                        {item.tag}
                      </span>
                    </div>

                    <div className="absolute bottom-3 right-3">
                      <span className="px-2.5 py-1 rounded-full bg-white/95 text-stone-900 text-[10px] font-black uppercase tracking-wider border border-stone-200 shadow-sm">
                        {item.category}
                      </span>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-6 space-y-3">
                    <div className="text-[11px] font-bold text-[#996515] uppercase tracking-widest">
                      {item.purity}
                    </div>

                    <h4 className="font-royal text-lg font-bold text-stone-900 leading-snug group-hover:text-[#996515] transition-colors">
                      {item.name}
                    </h4>

                    <p className="text-stone-500 text-xs leading-relaxed font-normal">
                      {item.description}
                    </p>
                  </div>
                </div>

                {/* Bottom Pricing & WhatsApp Claim CTA */}
                <div className="p-6 pt-0">
                  <div className="pt-4 border-t border-stone-100 flex items-center justify-between">
                    <div>
                      <div className="text-[10px] text-stone-400 line-through font-semibold">
                        Retail ${item.retailPrice}
                      </div>
                      <div className="font-mono text-xl font-black text-stone-900">
                        ${item.livePrice}{' '}
                        <span className="text-[10px] text-emerald-700 uppercase font-sans font-bold">
                          Live Special
                        </span>
                      </div>
                    </div>

                    <a
                      href={`https://wa.me/19296001937?text=Hi%20SZ%20Glam!%20I%20am%20interested%20in%20claiming%20${encodeURIComponent(item.name)}%20from%20your%20Live%20Vault.`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2.5 rounded-full bg-[#fbf5e8] hover:bg-[#996515] text-[#825c15] hover:text-white border border-[#d9c193] text-xs font-bold flex items-center gap-1.5 transition-all shadow-2xs"
                    >
                      <Phone className="w-3.5 h-3.5 text-emerald-600 group-hover:text-white" />
                      <span>Request on Live</span>
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 7. THE 3-STEP FRICTIONLESS LIVE SHOPPING PROTOCOL */}
        {/* ========================================================================= */}
        <section id="how-it-works" className="space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs uppercase tracking-[0.25em] text-[#996515] font-extrabold block">
              Transparent &amp; Effortless
            </span>
            <h2 className="font-royal text-3xl sm:text-4xl lg:text-5xl font-black text-stone-900">
              How The Live Show Works
            </h2>
            <p className="font-editorial text-lg text-stone-600 italic">
              No complicated shopping carts. Direct, personal, and thrilling.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="royal-card p-8 bg-white border border-[#ebd9b5] flex flex-col justify-between relative group hover:border-[#d4af37] transition-all">
              <div>
                <div className="text-4xl font-royal font-black text-[#d4af37]/40 mb-4 group-hover:text-[#d4af37] transition-colors">
                  01
                </div>
                <h3 className="font-royal text-xl font-bold text-stone-900 mb-2">
                  Claim Live on TikTok
                </h3>
                <p className="text-stone-600 text-xs sm:text-sm leading-relaxed font-normal">
                  Join our stream and comment your handle to claim exclusive items in real-time. Host Suhaib holds each piece up-close for clarity and sparkle testing.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-stone-100 text-[11px] text-stone-500 font-semibold flex items-center gap-1">
                <span>🔴 Live every Tuesday &amp; Friday evening</span>
              </div>
            </div>

            {/* Step 2 */}
            <div className="royal-card p-8 bg-white border border-[#ebd9b5] flex flex-col justify-between relative group hover:border-[#d4af37] transition-all">
              <div>
                <div className="text-4xl font-royal font-black text-[#d4af37]/40 mb-4 group-hover:text-[#d4af37] transition-colors">
                  02
                </div>
                <h3 className="font-royal text-xl font-bold text-stone-900 mb-2">
                  Settle via US Payment Hub
                </h3>
                <p className="text-stone-600 text-xs sm:text-sm leading-relaxed font-normal">
                  At show conclusion, send your total via Zelle, Venmo, Cash App, or PayPal. 100% safe bank-to-bank US transactions with zero hidden processing fees.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-stone-100 text-[11px] text-[#825c15] font-semibold flex items-center gap-1">
                <span>⚡ Instant confirmation via US Bank</span>
              </div>
            </div>

            {/* Step 3 */}
            <div className="royal-card p-8 bg-white border border-[#ebd9b5] flex flex-col justify-between relative group hover:border-[#d4af37] transition-all">
              <div>
                <div className="text-4xl font-royal font-black text-[#d4af37]/40 mb-4 group-hover:text-[#d4af37] transition-colors">
                  03
                </div>
                <h3 className="font-royal text-xl font-bold text-stone-900 mb-2">
                  Unlock Your Official Lucky Ticket
                </h3>
                <p className="text-stone-600 text-xs sm:text-sm leading-relaxed font-normal">
                  Submit your address below within the 30-minute window. You receive an instant #SZ Lucky Ticket for tonight&apos;s live wheel spin!
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-stone-100 text-[11px] text-emerald-700 font-semibold flex items-center gap-1">
                <span>🎉 Winner receives luxury prize in order</span>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 8. VERIFIED LAST WINNER HALL OF FAME SHOWCASE */}
        {/* ========================================================================= */}
        <section id="hall-of-fame" className="space-y-6">
          <div className="royal-card overflow-hidden border-2 border-[#d4af37]/80 bg-white grid grid-cols-1 lg:grid-cols-12 shadow-xl">
            {/* Visual Column */}
            <div className="lg:col-span-6 relative h-80 sm:h-96 w-full bg-stone-100 shimmer-card">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=1000&auto=format&fit=crop"
                alt="Verified Winner Prize"
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 left-4">
                <span className="px-3.5 py-1.5 rounded-full bg-stone-900/95 text-amber-300 text-xs font-bold tracking-wider uppercase border border-amber-400 shadow-md flex items-center gap-1.5">
                  <Award className="w-3.5 h-3.5 text-amber-400" />
                  <span>Verified Stream Draw</span>
                </span>
              </div>
            </div>

            {/* Winner Details Column */}
            <div className="lg:col-span-6 p-8 sm:p-12 flex flex-col justify-between bg-gradient-to-br from-white to-[#faf5ea]">
              <div>
                <div className="flex items-center gap-2 text-xs font-bold text-[#825c15] uppercase tracking-widest mb-2">
                  <Trophy className="w-4 h-4 text-[#b8860b]" />
                  <span>Hall of Fame Customer</span>
                </div>

                <h3 className="font-royal text-2xl sm:text-3xl font-black text-stone-900 leading-tight mb-2">
                  Congratulations, Mahwish Subzwari!
                </h3>

                <p className="text-xs sm:text-sm font-semibold text-[#825c15] mb-2">
                  Ticket #SZ-8921 • Announced on TikTok Live
                </p>

                <p className="text-stone-600 text-xs sm:text-sm leading-relaxed mb-6 font-normal">
                  Won the <strong>Multicolor Royal Kundan Statement Choker &amp; Earring Set</strong> ($95 Valuation) after completing payment within the 30-minute post-show window. Package shipped securely via USPS Priority Mail with tracking.
                </p>

                <div className="p-4 rounded-2xl bg-white border border-[#ebd9b5] mb-6 shadow-2xs">
                  <div className="text-[11px] uppercase tracking-wider text-stone-500 font-bold mb-1">
                    Live Random Wheel Spin Guarantee
                  </div>
                  <div className="text-xs text-stone-700 leading-snug">
                    Every ticket is digitally randomized and spun live on stream. No hidden entries, 100% fair and transparent to all viewers.
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-amber-200/50 text-xs">
                <span className="text-stone-500 font-medium">Tonight&apos;s Giveaway Prize: ${prize.retailValue} Royal Set</span>
                <Link href="#payment-portal" className="text-[#825c15] font-bold hover:underline flex items-center gap-1">
                  Enter Tonight&apos;s Draw &rarr;
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 9. THE US PAYMENT HUB & INSTANT REGISTRATION PORTAL */}
        {/* ========================================================================= */}
        <section id="payment-portal" className="space-y-10">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs uppercase tracking-[0.25em] text-[#996515] font-extrabold block">
              1-Click US Payment Hub
            </span>
            <h2 className="font-royal text-3xl sm:text-4xl lg:text-5xl font-black text-stone-900">
              Settle &amp; Receive Lucky Ticket
            </h2>
            <p className="font-editorial text-lg text-stone-600 italic">
              Tap any payment button below to copy coordinates, then enter your details for instant ticket generation
            </p>
          </div>

          {/* 4 US PAYMENT METHOD CARDS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {/* ZELLE */}
            <div className="royal-card p-6 bg-white border-2 border-[#7414CA]/20 hover:border-[#7414CA] transition-all flex flex-col justify-between shadow-sm hover:shadow-md">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="font-black text-lg text-[#7414CA]">Zelle</span>
                  <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-200">
                    No Fees
                  </span>
                </div>
                <p className="text-stone-500 text-xs mb-3 font-normal">
                  Direct transfer from your US bank app (Chase, BoA, Wells Fargo, etc.)
                </p>
                <div className="font-mono text-sm font-bold text-stone-900 bg-stone-50 p-2.5 rounded-xl border border-stone-200 select-all mb-2">
                  (929) 600-1937
                </div>
                <div className="text-[10px] text-stone-500">Name: S&amp;Z Glam Collection</div>
              </div>

              <button
                onClick={() => handleCopy('9296001937', 'zelle')}
                className="mt-4 w-full py-2.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-[#7414CA] font-bold text-xs flex items-center justify-center gap-1.5 transition-colors border border-purple-200"
              >
                {copiedKey === 'zelle' ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-600" />
                    <span>Copied Phone! ✓</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Zelle Number</span>
                  </>
                )}
              </button>
            </div>

            {/* VENMO */}
            <div className="royal-card p-6 bg-white border-2 border-[#008CFF]/20 hover:border-[#008CFF] transition-all flex flex-col justify-between shadow-sm hover:shadow-md">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="font-black text-lg text-[#008CFF]">Venmo</span>
                  <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                    Popular
                  </span>
                </div>
                <p className="text-stone-500 text-xs mb-3 font-normal">
                  Please turn OFF &quot;Turn on for purchases&quot; to avoid fee deduction.
                </p>
                <div className="font-mono text-sm font-bold text-stone-900 bg-stone-50 p-2.5 rounded-xl border border-stone-200 select-all mb-2">
                  @snzglam
                </div>
                <div className="text-[10px] text-stone-500">Note: Enter TikTok username</div>
              </div>

              <button
                onClick={() => handleCopy('@snzglam', 'venmo')}
                className="mt-4 w-full py-2.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-[#008CFF] font-bold text-xs flex items-center justify-center gap-1.5 transition-colors border border-blue-200"
              >
                {copiedKey === 'venmo' ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-600" />
                    <span>Copied Handle! ✓</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Venmo Handle</span>
                  </>
                )}
              </button>
            </div>

            {/* CASH APP */}
            <div className="royal-card p-6 bg-white border-2 border-[#00D632]/20 hover:border-[#00D632] transition-all flex flex-col justify-between shadow-sm hover:shadow-md">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="font-black text-lg text-[#00A827]">Cash App</span>
                  <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                    Instant
                  </span>
                </div>
                <p className="text-stone-500 text-xs mb-3 font-normal">
                  Send payment directly to our official cashtag with your TikTok username.
                </p>
                <div className="font-mono text-sm font-bold text-stone-900 bg-stone-50 p-2.5 rounded-xl border border-stone-200 select-all mb-2">
                  $SZGlamLive
                </div>
                <div className="text-[10px] text-stone-500">Memo: Your TikTok handle</div>
              </div>

              <button
                onClick={() => handleCopy('$SZGlamLive', 'cashapp')}
                className="mt-4 w-full py-2.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-[#00A827] font-bold text-xs flex items-center justify-center gap-1.5 transition-colors border border-emerald-200"
              >
                {copiedKey === 'cashapp' ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-600" />
                    <span>Copied Cashtag! ✓</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Cash App Tag</span>
                  </>
                )}
              </button>
            </div>

            {/* PAYPAL */}
            <div className="royal-card p-6 bg-white border-2 border-[#003087]/20 hover:border-[#003087] transition-all flex flex-col justify-between shadow-sm hover:shadow-md">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="font-black text-lg text-[#003087]">PayPal</span>
                  <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-sky-50 text-sky-700 border border-sky-200">
                    Protected
                  </span>
                </div>
                <p className="text-stone-500 text-xs mb-3 font-normal">
                  Select &quot;Friends &amp; Family&quot; for instant verification and no delay.
                </p>
                <div className="font-mono text-sm font-bold text-stone-900 bg-stone-50 p-2.5 rounded-xl border border-stone-200 select-all mb-2">
                  paypal.me/snzglam
                </div>
                <div className="text-[10px] text-stone-500">Recipient: S&amp;Z Glam Live</div>
              </div>

              <button
                onClick={() => handleCopy('https://paypal.me/snzglam', 'paypal')}
                className="mt-4 w-full py-2.5 rounded-xl bg-sky-50 hover:bg-sky-100 text-[#003087] font-bold text-xs flex items-center justify-center gap-1.5 transition-colors border border-sky-200"
              >
                {copiedKey === 'paypal' ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-600" />
                    <span>Copied Link! ✓</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy PayPal Link</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* INSTANT REGISTRATION & RECEIPT SUBMISSION FORM */}
          <div className="royal-card-highlight p-8 sm:p-12 bg-white border-2 border-[#d4af37]/80 shadow-2xl max-w-4xl mx-auto">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-stone-200">
              <div className="w-12 h-12 rounded-full bg-[#fbf5e8] border border-[#d9c193] flex items-center justify-center text-[#996515] shrink-0">
                <Gift className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-royal text-2xl font-bold text-stone-900">
                  Register Your Payment &amp; Claim Official Lucky Ticket
                </h3>
                <p className="text-stone-500 text-xs font-normal">
                  Takes 30 seconds. Your Lucky Ticket will appear immediately with golden confetti confirmation.
                </p>
              </div>
            </div>

            {errorMsg && (
              <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold mb-6 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {isTimerActive ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Row 1: Name & Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-bold text-stone-800 uppercase tracking-wider mb-2">
                    Full Name (Recipient) *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ayesha Khan"
                    value={fullName}
                    onChange={e => setFullName(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-stone-50 border border-stone-300 text-stone-900 text-sm focus:outline-none focus:border-[#b8860b] focus:bg-white transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-800 uppercase tracking-wider mb-2">
                    US Phone Number (SMS Tracking) *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="e.g. (929) 600-1937"
                    value={phoneNumber}
                    onChange={e => setPhoneNumber(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-stone-50 border border-stone-300 text-stone-900 text-sm focus:outline-none focus:border-[#b8860b] focus:bg-white transition-all"
                  />
                </div>
              </div>

              {/* Row 2: TikTok Username, Payment Method & Amount */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                <div>
                  <label className="block text-xs font-bold text-stone-800 uppercase tracking-wider mb-2">
                    TikTok Username *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. @ayesha_us"
                    value={tiktokHandle}
                    onChange={e => setTiktokHandle(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-stone-50 border border-stone-300 text-stone-900 text-sm focus:outline-none focus:border-[#b8860b] focus:bg-white transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-800 uppercase tracking-wider mb-2">
                    Payment Method Used *
                  </label>
                  <select
                    value={paymentMethod}
                    onChange={e => setPaymentMethod(e.target.value as any)}
                    className="w-full px-4 py-3 rounded-xl bg-stone-50 border border-stone-300 text-stone-900 text-sm focus:outline-none focus:border-[#b8860b] focus:bg-white transition-all font-medium"
                  >
                    <option value="ZELLE">Zelle</option>
                    <option value="VENMO">Venmo</option>
                    <option value="CASHAPP">Cash App</option>
                    <option value="PAYPAL">PayPal</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-800 uppercase tracking-wider mb-2">
                    Amount Paid ($ USD) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    placeholder="e.g. 145.00"
                    value={amountPaid}
                    onChange={e => setAmountPaid(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-stone-50 border border-stone-300 text-stone-900 text-sm focus:outline-none focus:border-[#b8860b] focus:bg-white transition-all"
                  />
                </div>
              </div>

              {/* Row 3: US Delivery Address */}
              <div className="space-y-3">
                <label className="block text-xs font-bold text-stone-800 uppercase tracking-wider">
                  US Shipping Address (USPS Insured Priority Delivery) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Street Address, Apt / Suite #"
                  value={streetAddress}
                  onChange={e => setStreetAddress(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-stone-50 border border-stone-300 text-stone-900 text-sm focus:outline-none focus:border-[#b8860b] focus:bg-white transition-all mb-3"
                />

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <input
                    type="text"
                    required
                    placeholder="City"
                    value={city}
                    onChange={e => setCity(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-stone-50 border border-stone-300 text-stone-900 text-sm focus:outline-none focus:border-[#b8860b] focus:bg-white transition-all"
                  />

                  <select
                    value={state}
                    onChange={e => setState(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-stone-50 border border-stone-300 text-stone-900 text-sm focus:outline-none focus:border-[#b8860b] focus:bg-white transition-all font-medium"
                  >
                    {US_STATES.map(st => (
                      <option key={st} value={st}>
                        {st}
                      </option>
                    ))}
                  </select>

                  <input
                    type="text"
                    required
                    placeholder="ZIP Code"
                    value={zipCode}
                    onChange={e => setZipCode(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-stone-50 border border-stone-300 text-stone-900 text-sm focus:outline-none focus:border-[#b8860b] focus:bg-white transition-all"
                  />
                </div>
              </div>

              {/* Row 4: Receipt Upload */}
              <div>
                <label className="block text-xs font-bold text-stone-800 uppercase tracking-wider mb-2">
                  Attach Payment Proof / Screenshot (Optional but recommended)
                </label>
                <div className="flex items-center gap-4">
                  <label className="cursor-pointer inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold transition-colors border border-stone-300">
                    <Send className="w-3.5 h-3.5 text-stone-500" />
                    <span>{uploadingReceipt ? 'Processing Screenshot...' : 'Upload Screenshot'}</span>
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
                      <Check className="w-4 h-4" />
                      <span>Receipt Screenshot Attached!</span>
                    </span>
                  )}
                </div>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={isSubmitting || uploadingReceipt}
                className="btn-royal-gold w-full py-4 rounded-xl text-sm font-extrabold uppercase tracking-wider shadow-lg flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <span>Generating Official Ticket...</span>
                ) : (
                  <>
                    <Crown className="w-4 h-4 text-white" />
                    <span>Lock In My Payment &amp; Get Lucky Ticket</span>
                  </>
                )}
              </button>
            </form>
            ) : (
              <div className="text-center py-10 px-4 bg-[#faf7f2] rounded-2xl border border-amber-200 space-y-4">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-stone-900 text-amber-300 text-xs font-bold uppercase tracking-wider mb-2 shadow-sm">
                  <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                  <span>Payment Window Closed • Winner Draw Underway</span>
                </div>
                <h4 className="font-heading text-2xl sm:text-3xl font-bold text-stone-900">
                  Tonight&apos;s Entry Window Is Now Closed
                </h4>
                <p className="text-stone-600 text-xs sm:text-sm max-w-lg mx-auto leading-relaxed font-normal">
                  Submissions for tonight&apos;s featured giveaway drop are now officially locked. Founder <strong className="text-stone-900 font-semibold">Sumera Usmani</strong> is verifying all submitted Lucky Tickets and picking tonight&apos;s lucky winner live on TikTok!
                </p>
                <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                  <a
                    href="https://www.tiktok.com/@snzglam/live"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-6 py-3 rounded-xl bg-black hover:bg-stone-800 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg transition-all"
                  >
                    <Video className="w-4 h-4 text-rose-500" />
                    <span>Watch Winner Draw on TikTok Live</span>
                  </a>
                  <a
                    href="https://wa.me/19296001937"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg transition-all"
                  >
                    <WhatsAppIcon className="w-4 h-4" />
                    <span>Inquire via WhatsApp Concierge</span>
                  </a>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 10. CLIENT REVIEWS & TESTIMONIALS */}
        {/* ========================================================================= */}
        <section className="space-y-10">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <span className="text-xs uppercase tracking-[0.25em] text-[#996515] font-extrabold block">
              Verified Buyer Praise
            </span>
            <h2 className="font-royal text-3xl sm:text-4xl font-bold text-stone-900">
              Loved by Queens Across The USA
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="royal-card p-6 bg-white border border-[#ebd9b5] flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-1 text-[#b8860b] mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <p className="text-stone-600 text-xs sm:text-sm leading-relaxed mb-4 italic">
                  &quot;The shine on the polki choker was 10x better in real life than on the live stream! Arrived in Dallas in exactly 2 days. The packaging looks like Cartier.&quot;
                </p>
              </div>
              <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-xs">
                <span className="font-bold text-stone-900">Ayesha K.</span>
                <span className="text-stone-400">Dallas, TX</span>
              </div>
            </div>

            <div className="royal-card p-6 bg-white border border-[#ebd9b5] flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-1 text-[#b8860b] mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <p className="text-stone-600 text-xs sm:text-sm leading-relaxed mb-4 italic">
                  &quot;S&amp;Z Glam is the only TikTok seller I trust blindly. The Zelle payment was verified in 2 minutes and I got my lucky ticket immediately. Super smooth!&quot;
                </p>
              </div>
              <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-xs">
                <span className="font-bold text-stone-900">Nimra S.</span>
                <span className="text-stone-400">Queens, New York</span>
              </div>
            </div>

            <div className="royal-card p-6 bg-white border border-[#ebd9b5] flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-1 text-[#b8860b] mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <p className="text-stone-600 text-xs sm:text-sm leading-relaxed mb-4 italic">
                  &quot;The bridal set has weight, pure brass core, completely anti-tarnish after wearing it for 3 wedding functions. Everyone asked where I got it!&quot;
                </p>
              </div>
              <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-xs">
                <span className="font-bold text-stone-900">Priya D.</span>
                <span className="text-stone-400">Fremont, California</span>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 11. ATELIER HERITAGE & PRIVATE CONCIERGE */}
        {/* ========================================================================= */}
        <section id="concierge" className="royal-card-highlight p-8 sm:p-14 bg-gradient-to-br from-white via-[#fcfbf9] to-[#f6eedf] border border-[#ebd9b5]">
          <div className="flex flex-col md:flex-row items-center gap-10">
            <div className="w-36 h-36 sm:w-48 sm:h-48 rounded-full overflow-hidden border-4 border-[#d4af37] shrink-0 shadow-lg relative p-1 bg-gradient-to-tr from-[#d4af37] to-[#aa8222]">
              <div className="w-full h-full rounded-full overflow-hidden bg-white">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=600&auto=format&fit=crop"
                  alt="S&Z Glam Atelier Curator"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#fbf5e8] border border-[#d9c193] text-[#825c15] text-[10px] font-bold uppercase tracking-widest">
                <Crown className="w-3.5 h-3.5 text-[#b8860b]" />
                <span>Private Styling &amp; Bridal Matching</span>
              </div>

              <h3 className="font-royal text-2xl sm:text-3xl font-black text-stone-900">
                Crafted for Queens • The S&amp;Z Atelier Story
              </h3>

              <p className="text-stone-600 text-xs sm:text-sm leading-relaxed font-normal">
                Born out of passion for royal South Asian artisanal jewelry, S&amp;Z Glam brings uncut Polki Kundan chokers, Victorian crystal necklaces, and heirloom Jhumkas directly to US doorsteps. Our daily TikTok live shows bring the shopping bazaar experience directly to your phone screen with complete transparency, luxury packaging, and exciting customer giveaways.
              </p>

              <div className="flex flex-wrap items-center gap-6 pt-2 text-xs font-bold text-stone-800">
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-[#996515]" />
                  <span>New York / New Jersey Showroom</span>
                </span>
                <span>•</span>
                <a
                  href="https://wa.me/19296001937"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-emerald-700 hover:text-emerald-900 underline flex items-center gap-1.5"
                >
                  <Phone className="w-4 h-4 text-emerald-600" />
                  <span>Personal Stylist WhatsApp: +1 (929) 600-1937</span>
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 12. FREQUENTLY ASKED QUESTIONS */}
        {/* ========================================================================= */}
        <section className="max-w-4xl mx-auto space-y-8">
          <div className="text-center space-y-2">
            <span className="text-xs uppercase tracking-[0.25em] text-[#996515] font-extrabold block">
              Clear Answers
            </span>
            <h2 className="font-royal text-3xl font-bold text-stone-900">
              Live Shopping &amp; Giveaway FAQ
            </h2>
          </div>

          <div className="space-y-4">
            <div className="royal-card p-6 bg-white border border-[#ebd9b5]">
              <h4 className="font-royal text-base font-bold text-stone-900 mb-2">
                How do I know my payment is verified?
              </h4>
              <p className="text-stone-600 text-xs sm:text-sm leading-relaxed font-normal">
                Once you send payment via Zelle, Venmo, Cash App, or PayPal and submit the form above, our automated system generates your official Lucky Ticket (#SZ-XXXX). Our host also announces verified names live on the TikTok stream!
              </p>
            </div>

            <div className="royal-card p-6 bg-white border border-[#ebd9b5]">
              <h4 className="font-royal text-base font-bold text-stone-900 mb-2">
                When does the live giveaway wheel spin happen?
              </h4>
              <p className="text-stone-600 text-xs sm:text-sm leading-relaxed font-normal">
                The wheel spin takes place as soon as the 30-minute post-show countdown hits zero. The wheel contains all customer ticket numbers logged during the payment window.
              </p>
            </div>

            <div className="royal-card p-6 bg-white border border-[#ebd9b5]">
              <h4 className="font-royal text-base font-bold text-stone-900 mb-2">
                How fast is US shipping?
              </h4>
              <p className="text-stone-600 text-xs sm:text-sm leading-relaxed font-normal">
                All orders are dispatched from our New York atelier within 24 hours via USPS Priority Mail or FedEx Express (2-3 business days delivery with tracking).
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* ========================================================================= */}
      {/* 13. ULTRA-LUXURY FOOTER WITH ZARNETIC LINK */}
      {/* ========================================================================= */}
      <footer className="border-t border-[#ebd9b5] bg-[#1a1715] text-[#d6cdbe] py-16 px-4 sm:px-8 mt-20">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-stone-800">
          {/* Brand Info */}
          <div className="md:col-span-5 space-y-4 text-center md:text-left">
            <span className="font-royal text-2xl sm:text-3xl font-black text-[#f7ecd5] tracking-wider block uppercase">
              S&amp;Z GLAM COLLECTION
            </span>
            <p className="text-xs text-stone-400 max-w-md leading-relaxed font-normal">
              New York&apos;s premier boutique for artisanal South Asian royal jewelry, uncut Polki Kundan chokers, Basra pearl haars, and transparent customer giveaways on TikTok Live.
            </p>
            <div className="flex items-center justify-center md:justify-start gap-4 text-xs text-amber-300 font-semibold pt-2">
              <span>📍 New York / New Jersey</span>
              <span>•</span>
              <span>⚡ 2-3 Day US Priority</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-3 space-y-3 text-center md:text-left">
            <div className="text-xs font-bold uppercase tracking-widest text-[#f7ecd5]">
              Navigation
            </div>
            <ul className="space-y-2 text-xs text-stone-400">
              <li>
                <a href="#vault" className="hover:text-amber-300 transition-colors">
                  The Signature Vault
                </a>
              </li>
              <li>
                <a href="#giveaway" className="hover:text-amber-300 transition-colors">
                  Tonight&apos;s Grand Prize
                </a>
              </li>
              <li>
                <Link href="/live" className="hover:text-amber-300 transition-colors">
                  Dedicated Live Giveaway Portal (/live)
                </Link>
              </li>
              <li>
                <a href="#payment-portal" className="hover:text-amber-300 transition-colors">
                  US Payment Hub
                </a>
              </li>
            </ul>
          </div>

          {/* Socials & Concierge */}
          <div className="md:col-span-4 space-y-3 text-center md:text-left">
            <div className="text-xs font-bold uppercase tracking-widest text-[#f7ecd5]">
              Contact Concierge
            </div>
            <p className="text-xs text-stone-400 font-normal">
              Have questions about sizing, custom bridal sets, or live order status?
            </p>
            <div className="space-y-2 text-xs text-stone-300 pt-1">
              <div>
                <a
                  href="https://wa.me/19296001937"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-amber-300 transition-colors font-bold text-amber-400"
                >
                  WhatsApp: +1 (929) 600-1937
                </a>
              </div>
              <div>
                <a
                  href="https://www.instagram.com/snzglam/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-amber-300 transition-colors"
                >
                  Instagram: @snzglam
                </a>
              </div>
              <div className="text-stone-400">
                TikTok: @snzglam
              </div>
            </div>
          </div>
        </div>

        {/* BOTTOM CREDITS & ZARNETIC LINK */}
        <div className="max-w-7xl mx-auto pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-500 text-center sm:text-left">
          <p>&copy; {new Date().getFullYear()} S&amp;Z GLAM COLLECTION LLC. All rights reserved.</p>

          <p className="text-stone-400 font-medium">
            Developed by{' '}
            <a
              href="https://www.zarnetic.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#d4af37] hover:text-[#f7e7c4] underline font-extrabold tracking-wide transition-colors"
            >
              Zarnetic
            </a>
          </p>
        </div>
      </footer>

      {/* CONFETTI CELEBRATION MODAL ON LUCKY TICKET GENERATION */}
      {luckyTicket && (
        <ConfettiCelebration
          ticketNumber={luckyTicket.ticketNumber}
          customerName={luckyTicket.fullName}
          prizeTitle={prize.title}
          onClose={() => setLuckyTicket(null)}
        />
      )}
    </div>
  );
}
