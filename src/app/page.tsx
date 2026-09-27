'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Trophy,
  Gift,
  Radio,
  ExternalLink,
  MapPin,
  Calendar,
  Sparkles,
  CreditCard
} from 'lucide-react';
import { TikTokIcon, InstagramIcon, WhatsAppIcon } from '@/components/SocialIcons';

export default function HomePage() {
  const [showStatus, setShowStatus] = useState<string>('OFFLINE');
  const [remainingSecs, setRemainingSecs] = useState<number>(0);
  const [entrantsCount, setEntrantsCount] = useState<number>(4);

  // Sync state with live backend
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
        }
        if (entriesData.success && entriesData.entrants) {
          setEntrantsCount(entriesData.entrants.length);
        }
      } catch (err) {
        console.error('Error fetching live data:', err);
      }
    };

    fetchData();
    const poll = setInterval(fetchData, 8000);
    return () => clearInterval(poll);
  }, []);

  const isTimerActive = showStatus === 'PAYMENT_WINDOW' && remainingSecs > 0;

  return (
    <div className="min-h-screen bg-[#faf7f2] text-[#1f1b19] font-body selection:bg-amber-100">
      <div className="max-w-3xl mx-auto px-4 py-8 sm:py-12 space-y-12 sm:space-y-16">

        {/* 1. Centered Brand Header */}
        <header className="text-center pt-4">
          <Link href="/" className="inline-block group">
            <div className="relative w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-3 rounded-full overflow-hidden border-2 border-[#d4af37]/60 shadow-sm group-hover:scale-105 transition-transform duration-300">
              <Image
                src="/logo.png"
                alt="S&Z GLAM"
                fill
                className="object-contain"
                priority
              />
            </div>
            <span className="font-heading text-2xl sm:text-3xl font-extrabold tracking-[0.18em] text-stone-900 block uppercase">
              S&amp;Z GLAM
            </span>
            <span className="text-[10px] sm:text-xs tracking-[0.25em] uppercase text-stone-400 font-semibold block mt-0.5">
              Curated by Sumera Usmani • USA
            </span>
          </Link>
        </header>

        {/* 2. Hero Section */}
        <section className="text-center space-y-4 max-w-xl mx-auto">
          <h1 className="font-heading text-3xl sm:text-5xl font-extrabold text-stone-900 tracking-tight leading-[1.15]">
            Hand-picked jewelry, <br className="hidden sm:inline" />
            live every week
          </h1>
          <p className="text-stone-600 text-sm sm:text-base leading-relaxed max-w-lg mx-auto font-normal">
            Claim on TikTok Live, pay by Zelle or Venmo, and submit your giveaway entry anytime on the giveaway page.
          </p>

          {/* Action CTAs */}
          <div className="pt-2 flex flex-col items-center gap-3 w-full max-w-xs mx-auto">
            <a
              href="https://www.tiktok.com/@snzglam/live"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3.5 px-6 rounded-xl bg-[#d49e24] hover:bg-[#c28e1d] text-white font-bold text-sm tracking-wide shadow-sm transition-all text-center flex items-center justify-center gap-2 hover:shadow-md active:scale-95"
            >
              <span>Watch on TikTok</span>
            </a>

            <Link
              href="/live"
              className="w-full py-3 px-6 rounded-xl border border-[#d49e24] text-[#b8860b] hover:bg-amber-50 font-bold text-sm tracking-wide transition-all text-center flex items-center justify-center gap-2"
            >
              <span>Tonight&apos;s giveaway</span>
            </Link>
          </div>

          {/* Social Icons row */}
          <div className="flex items-center justify-center gap-3 pt-3">
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
        </section>

        {/* 3. Watch the latest from S&Z GLAM */}
        <section className="space-y-4 max-w-xl mx-auto">
          <div className="text-center space-y-1">
            <h2 className="font-heading text-xl sm:text-2xl font-bold text-stone-900">
              Watch the latest from S&amp;Z GLAM
            </h2>
            <p className="text-stone-500 text-xs sm:text-sm font-normal">
              Real moments from her live shows — the pieces, the excitement, and the wins.
            </p>
          </div>

          {/* TikTok Account Follow Card */}
          <div className="bg-white rounded-2xl p-4 border border-stone-200/80 shadow-xs flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-amber-50 text-[#b8860b] flex items-center justify-center shrink-0">
                <TikTokIcon className="w-4 h-4" />
              </div>
              <div className="text-left">
                <div className="font-heading font-bold text-sm text-stone-900">
                  @snzglam
                </div>
                <div className="text-[11px] text-stone-500 leading-tight">
                  Live jewelry shows, new drops &amp; giveaway wins
                </div>
              </div>
            </div>

            <a
              href="https://www.tiktok.com/@snzglam"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-1.5 rounded-full bg-[#d49e24] hover:bg-[#c28e1d] text-white text-xs font-bold shrink-0 transition-colors shadow-xs"
            >
              Follow ↗
            </a>
          </div>

          {/* Status Banner Pill */}
          <Link
            href="/live"
            className="bg-[#fdf8ed] border border-[#f5e4bc] rounded-2xl p-3.5 flex items-center justify-between text-xs text-stone-700 hover:bg-[#faeed3] transition-colors"
          >
            <div className="flex items-center gap-2 font-medium">
              <span className={`w-2 h-2 rounded-full ${isTimerActive ? 'bg-emerald-500 animate-ping' : 'bg-amber-500'}`} />
              <span>
                {isTimerActive
                  ? 'Payment window active • Enter giveaway'
                  : 'Winner announcement starting'}
              </span>
            </div>
            <div className="flex items-center gap-1.5 font-bold text-[#b8860b]">
              <span>{isTimerActive ? 'Clock running' : `${entrantsCount} spots`}</span>
              <Gift className="w-3.5 h-3.5" />
            </div>
          </Link>
        </section>

        {/* 4. Last Giveaway Winner Card */}
        <section className="max-w-2xl mx-auto">
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-stone-200/80 shadow-xs flex flex-col sm:flex-row items-center gap-6">
            {/* Jewelry photo on blue velvet bust */}
            <div className="relative w-full sm:w-56 h-64 sm:h-64 rounded-2xl overflow-hidden shrink-0 bg-stone-100 border border-stone-200/60">
              <Image
                src="https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=800&auto=format&fit=crop"
                alt="Multicolor Kundan Statement Necklace & Earring Set"
                fill
                className="object-cover"
              />
            </div>

            {/* Winner Details */}
            <div className="space-y-2 text-left w-full">
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
        </section>

        {/* 5. How the live show works (3 Cards) */}
        <section className="space-y-6 max-w-2xl mx-auto text-center">
          <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-stone-900">
            How the live show works
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
            {/* Card 1 */}
            <div className="bg-white rounded-2xl p-5 border border-stone-200/80 shadow-xs space-y-2.5">
              <div className="w-8 h-8 rounded-xl bg-[#fdf5e5] text-[#b8860b] flex items-center justify-center">
                <Radio className="w-4 h-4" />
              </div>
              <h3 className="font-heading font-bold text-sm text-stone-900">
                1. Watch the live
              </h3>
              <p className="text-stone-600 text-xs leading-relaxed font-normal">
                Sumera shows each piece on TikTok Live. Claim in the comments — no app, no checkout.
              </p>
            </div>

            {/* Card 2 */}
            <div className="bg-white rounded-2xl p-5 border border-stone-200/80 shadow-xs space-y-2.5">
              <div className="w-8 h-8 rounded-xl bg-[#fdf5e5] text-[#b8860b] flex items-center justify-center">
                <CreditCard className="w-4 h-4" />
              </div>
              <h3 className="font-heading font-bold text-sm text-stone-900">
                2. Pay &amp; enter anytime
              </h3>
              <p className="text-stone-600 text-xs leading-relaxed font-normal">
                Pay for your claimed items by Zelle or Venmo, then submit your payer name and phone number on the giveaway page — anytime, no need to wait.
              </p>
            </div>

            {/* Card 3 */}
            <div className="bg-white rounded-2xl p-5 border border-stone-200/80 shadow-xs space-y-2.5">
              <div className="w-8 h-8 rounded-xl bg-[#fdf5e5] text-[#b8860b] flex items-center justify-center">
                <Gift className="w-4 h-4" />
              </div>
              <h3 className="font-heading font-bold text-sm text-stone-900">
                3. Win the giveaway
              </h3>
              <p className="text-stone-600 text-xs leading-relaxed font-normal">
                Sumera verifies each payment and approves one entry per submission. After the 30-minute post-show window ends, she spins the wheel and reveals the winner and prize here.
              </p>
            </div>
          </div>
        </section>

        {/* 6. Meet Sumera Usmani */}
        <section className="max-w-2xl mx-auto py-4">
          <div className="flex flex-col sm:flex-row items-center gap-6 text-left">
            {/* Avatar Photo */}
            <div className="relative w-32 h-32 sm:w-36 sm:h-36 rounded-full overflow-hidden border-2 border-stone-200 shadow-sm shrink-0 bg-stone-100">
              <Image
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=600&auto=format&fit=crop"
                alt="Sumera Usmani"
                fill
                className="object-cover"
              />
            </div>

            {/* Quote details */}
            <div className="space-y-2">
              <h2 className="font-heading text-2xl font-extrabold text-stone-900">
                Meet Sumera Usmani
              </h2>
              <p className="text-stone-600 text-xs sm:text-sm leading-relaxed font-normal">
                &ldquo;Every piece I curate tells a story. I travel, I search, and I hand-select jewelry that speaks to the modern woman — pieces that are timeless yet bold, classic yet unexpected.
              </p>
              <p className="text-stone-600 text-xs sm:text-sm leading-relaxed font-normal">
                My live shows are where I share these finds with you in person — you see every detail, ask me anything, and claim it right there. This is personal. This is <strong className="text-stone-900 font-semibold">S&amp;Z GLAM</strong>.&rdquo;
              </p>
              <div className="text-[#b8860b] text-xs font-semibold pt-1">
                — Curated with love
              </div>
            </div>
          </div>
        </section>

        {/* 7. Prefer to shop in person? */}
        <section className="max-w-2xl mx-auto">
          <div className="bg-white rounded-3xl overflow-hidden border border-stone-200/80 shadow-xs">
            {/* Showroom Image */}
            <div className="relative h-64 sm:h-80 w-full bg-stone-100">
              <Image
                src="https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?q=80&w=1000&auto=format&fit=crop"
                alt="S&Z Glam Studio"
                fill
                className="object-cover"
              />
            </div>

            {/* Shop Details */}
            <div className="p-6 sm:p-8 text-center space-y-2.5">
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#b8860b] uppercase tracking-wider">
                <MapPin className="w-3.5 h-3.5" />
                <span>Visit the shop</span>
              </div>

              <h3 className="font-heading text-2xl font-extrabold text-stone-900">
                Prefer to shop in person?
              </h3>

              <p className="text-stone-600 text-xs sm:text-sm max-w-lg mx-auto leading-relaxed font-normal">
                S&amp;Z GLAM&apos;s jewelry studio is open in New York. Stop by to see the pieces up close, try them on, and meet the curator behind the live shows.
              </p>

              <div className="pt-2">
                <a
                  href="https://wa.me/19296001937?text=Hi%20Sumera!%20I%20would%20like%20to%20schedule%20an%20in-person%20studio%20visit."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-2.5 px-6 rounded-xl border border-[#d49e24] text-[#b8860b] hover:bg-amber-50 font-bold text-xs tracking-wide transition-colors inline-flex items-center gap-1.5"
                >
                  <span>Get directions / Book appointment</span>
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* 8. Minimalist Footer */}
        <footer className="text-center pt-8 pb-12 border-t border-stone-200/70 text-xs text-stone-500 space-y-2">
          <p>
            Questions? Message Sumera on{' '}
            <a
              href="https://wa.me/19296001937"
              target="_blank"
              rel="noopener noreferrer"
              className="text-stone-700 hover:text-amber-800 underline font-semibold"
            >
              WhatsApp
            </a>{' '}
            or{' '}
            <a
              href="https://www.instagram.com/snzglam/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-stone-700 hover:text-amber-800 underline font-semibold"
            >
              Instagram
            </a>.
          </p>

          <p>
            &copy; {new Date().getFullYear()} S&amp;Z GLAM COLLECTION. All rights reserved.
          </p>

          <p className="pt-1 text-[11px] text-stone-400">
            Developed by{' '}
            <a
              href="https://www.zarnetic.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#98752c] hover:text-[#d4af37] underline font-bold"
            >
              Zarnetic
            </a>
          </p>
        </footer>

      </div>
    </div>
  );
}
