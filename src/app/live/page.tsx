'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  ArrowLeft,
  Trophy,
  Gift,
  Clock,
  Sparkles,
  Calendar,
  Users,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check
} from 'lucide-react';
import { LiveShow, PaymentAccountSettings } from '@/lib/types';
import ConfettiCelebration from '@/components/ConfettiCelebration';
import { TikTokIcon, InstagramIcon, WhatsAppIcon } from '@/components/SocialIcons';

const DEFAULT_PRIZE = {
  title: 'Pakistani Dupatta & Royal Kundan Set',
  retailValue: 245,
  imageUrl: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=800&auto=format&fit=crop',
  description: 'Handcrafted luxury artisan set gifted exclusively to tonight\'s verified customer giveaway winner.'
};

const INITIAL_SHOW: LiveShow = {
  id: 'show-live-current',
  title: 'Friday Luxury Kundan & Bridal Drop #42',
  status: 'OFFLINE',
  tiktokLiveUrl: 'https://www.tiktok.com/@snzglam/live',
  timerEndTime: null,
  timerDurationMinutes: 30,
  featuredPrize: DEFAULT_PRIZE,
  startedAt: new Date().toISOString(),
  endedAt: null,
  winner: null
};

export default function LiveGiveawayPage() {
  const [show, setShow] = useState<LiveShow>(INITIAL_SHOW);
  const [remainingSeconds, setRemainingSeconds] = useState<number>(0);
  const [entrantsCount, setEntrantsCount] = useState<number>(4);

  // Form states
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [tiktokHandle, setTiktokHandle] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'ZELLE' | 'VENMO' | 'CASHAPP' | 'PAYPAL'>('ZELLE');
  const [amountPaid, setAmountPaid] = useState('');
  const [shippingAddress, setShippingAddress] = useState('');
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

  // Sync data with live backend
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
          setShow(showData.show);
          setRemainingSeconds(showData.remainingSeconds || 0);
        }
        if (entriesData.success && entriesData.entrants) {
          setEntrantsCount(entriesData.entrants.length);
        }
      } catch (e) {
        console.error('Error fetching live show:', e);
      }
    };

    fetchData();
    const poll = setInterval(fetchData, 8000);
    return () => clearInterval(poll);
  }, []);

  // Timer countdown local tick
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

  // Handle Form Submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!isWindowActive) {
      setErrorMsg('The payment window has closed.');
      return;
    }

    if (!fullName || !phoneNumber || !tiktokHandle || !amountPaid) {
      setErrorMsg('Please fill in your name, phone number, TikTok username, and amount.');
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
            street: shippingAddress || 'Pending verification',
            city: 'NY',
            state: 'NY',
            zipCode: '10001'
          }
        })
      });

      const data = await res.json();
      if (data.success && data.entry) {
        setLuckyTicket({
          ticketNumber: data.entry.ticketNumber,
          fullName: data.entry.fullName
        });
        setFullName('');
        setPhoneNumber('');
        setTiktokHandle('');
        setAmountPaid('');
        setShippingAddress('');
      } else {
        setErrorMsg(data.error || 'Failed to submit entry. Please try again or WhatsApp host.');
      }
    } catch {
      setErrorMsg('Network error. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#faf7f2] text-[#1f1b19] font-body selection:bg-amber-100">
      {/* Top Header */}
      <header className="max-w-2xl mx-auto px-4 pt-6 pb-2 flex items-center justify-between">
        <Link
          href="/"
          className="text-xs text-stone-500 hover:text-stone-900 transition-colors flex items-center gap-1.5 font-medium"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Home</span>
        </Link>

        <Link href="/" className="flex items-center gap-2 group">
          <div className="relative w-8 h-8 rounded-full overflow-hidden border border-[#d4af37]/60 shadow-xs">
            <Image src="/logo.jpg" alt="S&Z GLAM" fill className="object-cover" />
          </div>
          <span className="font-heading font-extrabold text-sm tracking-wider uppercase text-stone-900">
            S&amp;Z GLAM
          </span>
        </Link>
      </header>

      {/* Main Content Area */}
      <main className="max-w-xl mx-auto px-4 py-6 space-y-8 text-center">

        {/* 1. Header Giveaway Title */}
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-1.5 bg-[#fef9ec] border border-[#fae8b8] text-[#b8860b] px-3.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider">
            <Gift className="w-3.5 h-3.5 text-[#b8860b]" />
            <span>AFTER-LIVE GIVEAWAY</span>
          </div>

          <h1 className="font-heading text-3xl sm:text-4xl font-extrabold text-stone-900 tracking-tight">
            {show.featuredPrize?.title || DEFAULT_PRIZE.title}
          </h1>

          <p className="text-stone-500 text-sm font-medium">
            Retail ${show.featuredPrize?.retailValue || DEFAULT_PRIZE.retailValue}
          </p>
        </div>

        {/* Confetti modal if ticket won */}
        {luckyTicket && (
          <div className="bg-white rounded-3xl p-6 border-2 border-amber-300 shadow-md space-y-3">
            <ConfettiCelebration />
            <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h3 className="font-heading text-xl font-bold text-stone-900">
              Entry Verified! Ticket #{luckyTicket.ticketNumber}
            </h3>
            <p className="text-xs text-stone-600">
              Thank you, {luckyTicket.fullName}. Your ticket is entered into tonight&apos;s draw!
            </p>
          </div>
        )}

        {/* 2. Status / Form Card */}
        {isWindowActive ? (
          /* ACTIVE PAYMENT WINDOW FORM */
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/90 shadow-xs text-left space-y-5">
            <div className="text-center space-y-1 pb-2 border-b border-stone-100">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-50 text-red-700 text-xs font-bold animate-pulse">
                <Clock className="w-3.5 h-3.5" />
                <span className="font-mono text-sm">{formatTime(remainingSeconds)} remaining</span>
              </div>
              <h2 className="font-heading text-xl font-bold text-stone-900 pt-1">
                Enter Tonight&apos;s Giveaway
              </h2>
              <p className="text-stone-500 text-xs font-normal">
                Submit your payment details below to claim your Lucky Ticket.
              </p>
            </div>

            {/* Quick Payment Info */}
            <div className="p-3.5 rounded-2xl bg-[#faf7f2] border border-amber-200/70 text-xs space-y-2">
              <div className="font-bold text-stone-900 text-xs flex items-center justify-between">
                <span>Official US Payment Info</span>
                <span className="text-[10px] text-amber-800 font-semibold">1-Click Copy</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-[11px] font-mono">
                <button
                  type="button"
                  onClick={() => copyText('(929) 600-1937', 'zelle')}
                  className="p-2 rounded-xl bg-white border border-stone-200 flex items-center justify-between hover:border-amber-400"
                >
                  <span className="truncate">Zelle: (929) 600-1937</span>
                  {copiedKey === 'zelle' ? <Check className="w-3 h-3 text-emerald-600 shrink-0" /> : <Copy className="w-3 h-3 text-stone-400 shrink-0" />}
                </button>
                <button
                  type="button"
                  onClick={() => copyText('@snzglam', 'venmo')}
                  className="p-2 rounded-xl bg-white border border-stone-200 flex items-center justify-between hover:border-amber-400"
                >
                  <span className="truncate">Venmo: @snzglam</span>
                  {copiedKey === 'venmo' ? <Check className="w-3 h-3 text-emerald-600 shrink-0" /> : <Copy className="w-3 h-3 text-stone-400 shrink-0" />}
                </button>
              </div>
            </div>

            {errorMsg && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ayesha Khan"
                  value={fullName}
                  onChange={e => setFullName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 bg-stone-50/50 text-sm focus:border-amber-500 focus:bg-white focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="(xxx) xxx-xxxx"
                    value={phoneNumber}
                    onChange={e => setPhoneNumber(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 bg-stone-50/50 text-sm focus:border-amber-500 focus:bg-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                    TikTok Handle *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="@yourhandle"
                    value={tiktokHandle}
                    onChange={e => setTiktokHandle(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 bg-stone-50/50 text-sm focus:border-amber-500 focus:bg-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                    Payment Method *
                  </label>
                  <select
                    value={paymentMethod}
                    onChange={e => setPaymentMethod(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 bg-white text-sm focus:border-amber-500 focus:outline-none"
                  >
                    <option value="ZELLE">Zelle</option>
                    <option value="VENMO">Venmo</option>
                    <option value="CASHAPP">Cash App</option>
                    <option value="PAYPAL">PayPal</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                    Amount Paid ($USD) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    placeholder="$0.00"
                    value={amountPaid}
                    onChange={e => setAmountPaid(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 bg-stone-50/50 text-sm focus:border-amber-500 focus:bg-white focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                  USPS Delivery Address (Optional)
                </label>
                <input
                  type="text"
                  placeholder="Street Address, City, State, ZIP"
                  value={shippingAddress}
                  onChange={e => setShippingAddress(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 bg-stone-50/50 text-sm focus:border-amber-500 focus:bg-white focus:outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 rounded-xl bg-[#d49e24] hover:bg-[#c28e1d] text-white font-bold text-sm tracking-wide shadow-sm transition-all text-center flex items-center justify-center gap-2 mt-4"
              >
                {isSubmitting ? (
                  <span>Generating Ticket...</span>
                ) : (
                  <span>Enter Tonight&apos;s Giveaway</span>
                )}
              </button>
            </form>
          </div>
        ) : (
          /* CLOSED STATUS CARD (EXACTLY MATCHING IMAGE 1) */
          <div className="bg-white rounded-3xl p-8 sm:p-10 border border-stone-200/90 shadow-xs space-y-4">
            <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
              Entries closed
            </h2>

            <p className="text-stone-500 text-xs sm:text-sm leading-relaxed max-w-md mx-auto font-normal">
              The 30-minute payment window has ended. S&amp;Z GLAM is confirming approved entries, then the wheel will spin.
            </p>

            <div className="flex items-center justify-center gap-2 text-stone-500 text-xs font-medium pt-1">
              <Users className="w-3.5 h-3.5 text-stone-400" />
              <span>{entrantsCount} entries in the draw</span>
            </div>

            <div className="pt-2">
              <a
                href="https://www.tiktok.com/@snzglam/live"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block py-3 px-8 rounded-xl border border-[#d49e24] text-[#b8860b] hover:bg-amber-50 font-bold text-sm tracking-wide transition-all shadow-xs"
              >
                Watch the live on TikTok
              </a>
            </div>
          </div>
        )}

        {/* 3. Last Giveaway Winner Card (Matching Image 1) */}
        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-stone-200/80 shadow-xs flex flex-col sm:flex-row items-center gap-6 text-left">
          {/* Jewelry Photo */}
          <div className="relative w-full sm:w-56 h-64 sm:h-64 rounded-2xl overflow-hidden shrink-0 bg-stone-100 border border-stone-200/60">
            <Image
              src="https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=800&auto=format&fit=crop"
              alt="Multicolor Kundan Statement Necklace & Earring Set"
              fill
              className="object-cover"
            />
          </div>

          {/* Winner Details */}
          <div className="space-y-2 w-full">
            <div className="w-9 h-9 rounded-full bg-[#fdf5e5] text-[#b8860b] flex items-center justify-center">
              <Trophy className="w-4 h-4" />
            </div>

            <div className="text-[10px] font-bold uppercase tracking-widest text-[#b8860b]">
              LAST GIVEAWAY WINNER
            </div>

            <h3 className="font-heading text-xl sm:text-2xl font-extrabold text-stone-900 leading-snug">
              Congratulations, <br />
              mahwish subzwari!
            </h3>

            <p className="text-stone-700 text-xs sm:text-sm font-medium">
              Won <strong className="text-stone-900">Multicolor Kundan Statement Necklace &amp; Earring Set</strong>
            </p>

            <div className="text-stone-500 text-xs font-normal">
              Retail $95
            </div>

            <div className="pt-2 text-stone-400 text-xs flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" />
              <span>Revealed September 22, 2026</span>
            </div>
          </div>
        </div>

        {/* 4. Bottom Centered Social Icons */}
        <div className="flex items-center justify-center gap-3 pt-6 pb-8">
          <a
            href="https://www.tiktok.com/@snzglam"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="TikTok @snzglam"
            className="w-10 h-10 rounded-full bg-white border border-stone-200/90 hover:border-stone-800 text-stone-700 hover:text-black flex items-center justify-center transition-all shadow-xs hover:scale-105"
          >
            <TikTokIcon className="w-4 h-4" />
          </a>
          <a
            href="https://www.instagram.com/snzglam/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram @snzglam"
            className="w-10 h-10 rounded-full bg-white border border-stone-200/90 hover:border-pink-500 text-stone-700 hover:text-pink-600 flex items-center justify-center transition-all shadow-xs hover:scale-105"
          >
            <InstagramIcon className="w-4 h-4" />
          </a>
          <a
            href="https://wa.me/19296001937"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="WhatsApp Concierge"
            className="w-10 h-10 rounded-full bg-white border border-stone-200/90 hover:border-emerald-500 text-stone-700 hover:text-emerald-600 flex items-center justify-center transition-all shadow-xs hover:scale-105"
          >
            <WhatsAppIcon className="w-4 h-4" />
          </a>
        </div>
      </main>
    </div>
  );
}
