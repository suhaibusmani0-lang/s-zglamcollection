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
  Award
} from 'lucide-react';

const FEATURED_COLLECTIONS = [
  {
    id: 'c1',
    name: 'Royal Heritage Polki Kundan Choker',
    category: 'Bridal Heirloom',
    price: '$185',
    image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=800&auto=format&fit=crop',
    tag: 'TikTok Viral Drop',
    details: '24K Gold finish with uncut polki & emerald drop beads'
  },
  {
    id: 'c2',
    name: 'Mughal Emerald & Basra Pearl Haar',
    category: 'Imperial Chokers',
    price: '$145',
    image: 'https://images.unsplash.com/photo-1611591475870-1798365d9560?q=80&w=800&auto=format&fit=crop',
    tag: 'Most Claimed',
    details: 'Multi-strand micro pearls with hand-enameled meenakari'
  },
  {
    id: 'c3',
    name: 'American Diamond Solitaire Reception Set',
    category: 'Cocktail & Sangeet',
    price: '$165',
    image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=800&auto=format&fit=crop',
    tag: 'High-Shine CZ',
    details: 'Rhodium platinum finish with princess cut solitaires'
  },
  {
    id: 'c4',
    name: 'Ruby Velvet Polki Bridal Chandbalis',
    category: 'Statement Jhumkas',
    price: '$95',
    image: 'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?q=80&w=800&auto=format&fit=crop',
    tag: 'New Edition',
    details: 'Lightweight bridal earrings with pearl ear chain attachments'
  }
];

export default function HomePage() {
  const [showStatus, setShowStatus] = useState<string>('PAYMENT_WINDOW');
  const [remainingSecs, setRemainingSecs] = useState<number>(1500);
  const [entrantsCount, setEntrantsCount] = useState<number>(6);

  useEffect(() => {
    const fetchStatus = async () => {
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
        console.error(err);
      }
    };

    fetchStatus();
    const poll = setInterval(fetchStatus, 8000);
    return () => clearInterval(poll);
  }, []);

  const formatCountdown = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const isTimerActive = showStatus === 'PAYMENT_WINDOW' && remainingSecs > 0;

  return (
    <div className="min-h-screen bg-[#fcfbf9] text-[#1c1816] selection:bg-amber-100 flex flex-col font-sans">
      {/* Top Royal Live Status Bar */}
      <div className="bg-[#1c1816] text-[#f7e7c4] py-2 px-4 text-xs font-medium tracking-wider flex items-center justify-between border-b border-[#3b322a]">
        <div className="max-w-6xl mx-auto w-full flex flex-col sm:flex-row items-center justify-between gap-1 text-center sm:text-left">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping shrink-0" />
            <span className="text-[11px] sm:text-xs">
              {isTimerActive
                ? `⚡ VIP 30-Minute Payment Portal Open • All verified payments enter tonight's draw! (${entrantsCount} qualified)`
                : `✨ S&Z GLAM Boutique • Handcrafted South Asian Heirlooms • Fast US Shipping`}
            </span>
          </div>

          <div className="flex items-center gap-4 text-[11px] tracking-widest uppercase">
            <a
              href="https://wa.me/19296001937"
              target="_blank"
              rel="noopener noreferrer"
              className="text-amber-300 hover:text-white transition-colors flex items-center gap-1"
            >
              <Phone className="w-3 h-3 text-emerald-400" />
              <span>+1 (929) 600-1937</span>
            </a>
            <span className="text-stone-600 hidden sm:inline">|</span>
            <a
              href="https://www.instagram.com/snzglam/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-stone-300 hover:text-amber-300 transition-colors hidden sm:inline"
            >
              @snzglam
            </a>
          </div>
        </div>
      </div>

      {/* Main Luxury Navigation Bar */}
      <header className="sticky top-0 z-40 bg-[#fcfbf9]/95 backdrop-blur-md border-b border-[#ebd9b5]/80 py-4 px-4 sm:px-8">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          {/* Brand Logo & Royal Title */}
          <Link href="/" className="flex items-center gap-3.5 group">
            <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-[#d4af37] shadow-[0_2px_12px_rgba(212,175,55,0.3)] group-hover:scale-105 transition-transform duration-300 relative">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/logo.jpg" alt="S&Z Glam Collection Logo" className="w-full h-full object-cover" />
            </div>
            <div className="text-left">
              <span className="font-royal text-xl sm:text-2xl font-bold tracking-wider text-stone-900 block group-hover:text-amber-900 transition-colors">
                S&amp;Z GLAM
              </span>
              <span className="text-[9px] uppercase tracking-[0.25em] text-stone-500 font-semibold block -mt-0.5">
                Collection • New York
              </span>
            </div>
          </Link>

          {/* Right Header Navigation CTAs */}
          <div className="flex items-center gap-3">
            <a
              href="https://www.instagram.com/snzglam/"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden md:flex items-center gap-1.5 text-xs font-bold text-stone-700 hover:text-amber-900 px-3 py-1.5 rounded-full border border-stone-200 hover:border-amber-400 transition-all bg-white"
            >
              <span>Instagram</span>
              <ExternalLink className="w-3 h-3 text-stone-400" />
            </a>

            <Link
              href="/shop"
              className="btn-royal-gold px-5 py-2.5 rounded-full text-xs font-bold flex items-center gap-1.5 shadow-sm"
            >
              <Gift className="w-3.5 h-3.5" />
              <span>Tonight&apos;s Giveaway</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Luxury Content */}
      <main className="flex-1 max-w-6xl mx-auto w-full px-4 sm:px-8 py-10 sm:py-16">
        {/* Bespoke Split-Hero Section */}
        <section className="mb-20">
          <div className="royal-card-highlight p-8 sm:p-14 bg-gradient-to-br from-[#ffffff] via-[#fcfbf9] to-[#f8f3e8] relative overflow-hidden">
            {/* Subtle background luxury ornament */}
            <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-amber-100/40 blur-3xl pointer-events-none" />

            <div className="max-w-3xl">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#fbf5e8] text-[#8c671b] border border-[#ebd9b5] text-xs font-bold uppercase tracking-wider mb-6 shadow-xs">
                <Gem className="w-3.5 h-3.5 text-[#bfa15f]" />
                <span>Handcrafted South Asian Bridal &amp; Festive Heirlooms</span>
              </div>

              {/* Main Headline */}
              <h1 className="font-royal text-3xl sm:text-5xl lg:text-6xl font-extrabold text-stone-900 leading-[1.12] mb-6">
                Royal Heirlooms &amp; Modern Sparkle,<br />
                <span className="text-[#96742a]">Live Drops Every Week</span>
              </h1>

              <p className="text-stone-600 text-sm sm:text-base leading-relaxed mb-8 max-w-2xl font-normal">
                Watch our high-definition TikTok live shows to claim signature Kundan, Polki, and American Diamond pieces. Pay easily via Zelle, Venmo, Cash App, or PayPal, and register your live payment on our dedicated giveaway portal!
              </p>

              {/* Dual Action Buttons */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 mb-8">
                <a
                  href="https://www.tiktok.com/@snzglam/live"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-royal-gold px-8 py-4 rounded-full text-xs sm:text-sm font-extrabold flex items-center justify-center gap-2.5"
                >
                  <Video className="w-4 h-4 text-white" />
                  <span>Watch on TikTok Live</span>
                </a>

                <Link
                  href="/shop"
                  className="btn-royal-outline px-8 py-4 rounded-full text-xs sm:text-sm font-extrabold flex items-center justify-center gap-2.5"
                >
                  <Gift className="w-4 h-4 text-[#8c671b]" />
                  <span>Enter Tonight&apos;s Giveaway</span>
                </Link>
              </div>

              {/* Trust Pillars */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 border-t border-amber-200/60 text-xs text-stone-700 font-medium">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#bfa15f] shrink-0" />
                  <span>22K-24K Gold Plated</span>
                </div>
                <div className="flex items-center gap-2">
                  <Truck className="w-4 h-4 text-[#bfa15f] shrink-0" />
                  <span>USPS 2-3 Day Priority</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#bfa15f] shrink-0" />
                  <span>Hypoallergenic &amp; Safe</span>
                </div>
                <div className="flex items-center gap-2">
                  <Trophy className="w-4 h-4 text-[#bfa15f] shrink-0" />
                  <span>Daily Live Giveaways</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Live Drop Announcement & VIP Portal Card */}
        <section className="mb-20">
          <div className="royal-card p-6 sm:p-8 bg-white border border-[#ebd9b5] flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-[#fbf5e8] border border-[#d8c29b] flex items-center justify-center text-[#8c671b] shrink-0 shadow-xs">
                <Clock className="w-7 h-7 text-[#bfa15f] animate-pulse" />
              </div>
              <div>
                <span className="text-[11px] uppercase tracking-wider text-[#8c671b] font-bold block mb-0.5">
                  After-Show Customer Portal
                </span>
                <h3 className="font-royal text-xl sm:text-2xl font-bold text-stone-900">
                  {isTimerActive
                    ? `Payment Window Is Open: ${formatCountdown(remainingSecs)} Remaining`
                    : `Next Live Show & Giveaway Announced`}
                </h3>
                <p className="text-stone-600 text-xs sm:text-sm mt-0.5 font-normal">
                  All customers who pay their live bill within 30 minutes qualify for tonight&apos;s announced luxury prize draw!
                </p>
              </div>
            </div>

            <Link
              href="/shop"
              className="btn-royal-gold w-full md:w-auto px-6 py-3.5 rounded-full text-xs font-bold flex items-center justify-center gap-2 shrink-0 shadow-sm"
            >
              <span>Submit Payment &amp; Get Ticket</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </section>

        {/* Verified Last Winner Showcase Card (Bespoke Luxury Architecture) */}
        <section className="mb-20">
          <div className="royal-card overflow-hidden border border-amber-200/90 bg-white grid grid-cols-1 lg:grid-cols-12 shadow-md">
            {/* Visual Column */}
            <div className="lg:col-span-6 relative h-80 sm:h-96 w-full bg-stone-100">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=1000&auto=format&fit=crop"
                alt="Multicolor Kundan Statement Necklace & Earring Set"
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 left-4">
                <span className="px-3.5 py-1.5 rounded-full bg-stone-900/95 text-amber-300 text-xs font-bold tracking-wider uppercase border border-amber-400 shadow-md flex items-center gap-1.5">
                  <Award className="w-3.5 h-3.5 text-amber-400" />
                  <span>Verified Customer Draw</span>
                </span>
              </div>
            </div>

            {/* Details Column */}
            <div className="lg:col-span-6 p-8 sm:p-12 flex flex-col justify-between bg-gradient-to-br from-white to-[#faf7f0]">
              <div>
                <div className="flex items-center gap-2 text-xs font-bold text-amber-800 uppercase tracking-widest mb-2">
                  <Trophy className="w-4 h-4 text-amber-600" />
                  <span>Hall of Fame Winner</span>
                </div>

                <h3 className="font-royal text-2xl sm:text-3xl font-extrabold text-stone-900 leading-tight mb-2">
                  Congratulations, Mahwish Subzwari!
                </h3>

                <p className="text-xs sm:text-sm font-semibold text-amber-900 mb-1">
                  Ticket #SZ-8921 • Claimed on TikTok Live
                </p>

                <p className="text-stone-600 text-xs sm:text-sm leading-relaxed mb-6 font-normal">
                  Won the <strong>Multicolor Royal Kundan Statement Choker &amp; Earring Set</strong> ($95 Retail Value) after completing payment within the 30-minute post-show window.
                </p>

                <div className="p-4 rounded-2xl bg-white border border-amber-200/80 mb-6">
                  <div className="text-[11px] uppercase tracking-wider text-stone-500 font-bold mb-1">
                    Live Random Wheel Spin Verification
                  </div>
                  <div className="text-xs text-stone-700 leading-snug">
                    Winner announced live on stream on September 22, 2026. Handcrafted piece securely packaged and shipped via USPS Priority Mail.
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-amber-200/50 text-xs">
                <span className="text-stone-500 font-medium">Tonight&apos;s Draw: $245 Kundan Set</span>
                <Link href="/shop" className="text-amber-900 font-bold hover:underline flex items-center gap-1">
                  Enter Draw &rarr;
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* The 3-Step Live Show Experience (Unique Timeline Cards) */}
        <section className="mb-20">
          <div className="text-center max-w-xl mx-auto mb-12">
            <span className="text-xs uppercase tracking-widest text-amber-800 font-bold block mb-1">
              Frictionless Live Shopping
            </span>
            <h2 className="font-royal text-3xl sm:text-4xl font-bold text-stone-900">
              How The Live Show Works
            </h2>
            <p className="text-stone-600 text-xs sm:text-sm mt-2 font-normal">
              No complicated apps or website checkouts. We keep it personal, exciting, and fast.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Step 1 */}
            <div className="royal-card p-8 bg-white border border-stone-200 flex flex-col justify-between relative group hover:border-[#d4af37] transition-all">
              <div className="text-3xl font-royal font-black text-amber-200/80 mb-4 group-hover:text-amber-400 transition-colors">
                01
              </div>
              <div>
                <h3 className="font-royal text-lg font-bold text-stone-900 mb-2">
                  Claim Live on TikTok
                </h3>
                <p className="text-stone-600 text-xs leading-relaxed font-normal">
                  Watch our stream and comment your handle to claim pieces in real time. We hold each item and show 360° shine tests on camera.
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="royal-card p-8 bg-white border border-stone-200 flex flex-col justify-between relative group hover:border-[#d4af37] transition-all">
              <div className="text-3xl font-royal font-black text-amber-200/80 mb-4 group-hover:text-amber-400 transition-colors">
                02
              </div>
              <div>
                <h3 className="font-royal text-lg font-bold text-stone-900 mb-2">
                  Pay via US Payment Hub
                </h3>
                <p className="text-stone-600 text-xs leading-relaxed font-normal">
                  Once the stream concludes, send your bill total via Zelle, Venmo, Cash App, or PayPal. Be sure to include your TikTok handle in the memo.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="royal-card p-8 bg-white border border-stone-200 flex flex-col justify-between relative group hover:border-[#d4af37] transition-all">
              <div className="text-3xl font-royal font-black text-amber-200/80 mb-4 group-hover:text-amber-400 transition-colors">
                03
              </div>
              <div>
                <h3 className="font-royal text-lg font-bold text-stone-900 mb-2">
                  Unlock Your Lucky Ticket
                </h3>
                <p className="text-stone-600 text-xs leading-relaxed font-normal">
                  Submit your details on our /shop page before the 30-minute timer expires. You receive an instant #SZ ticket for tonight&apos;s wheel spin!
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Signature Live Vault Collections */}
        <section className="mb-20">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
            <div>
              <span className="text-xs uppercase tracking-widest text-amber-800 font-bold block mb-1">
                Artisanal Catalog
              </span>
              <h2 className="font-royal text-3xl sm:text-4xl font-bold text-stone-900">
                Signature Live Drops
              </h2>
            </div>
            <a
              href="https://www.tiktok.com/@snzglam/live"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-bold text-amber-900 hover:text-amber-950 flex items-center gap-1 group self-start sm:self-auto"
            >
              <span>Watch Live Drops on TikTok</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </a>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {FEATURED_COLLECTIONS.map(item => (
              <div
                key={item.id}
                className="royal-card overflow-hidden border border-stone-200/80 bg-white group flex flex-col justify-between hover:shadow-lg transition-all duration-300"
              >
                <div>
                  <div className="relative h-60 w-full overflow-hidden bg-stone-100">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3">
                      <span className="px-2.5 py-1 rounded-full bg-white/95 text-amber-950 text-[10px] font-extrabold border border-amber-300 shadow-xs">
                        {item.tag}
                      </span>
                    </div>
                  </div>

                  <div className="p-5">
                    <span className="text-[10px] uppercase tracking-wider text-stone-400 block mb-1 font-semibold">
                      {item.category}
                    </span>
                    <h4 className="font-royal text-base font-bold text-stone-900 leading-snug mb-1">
                      {item.name}
                    </h4>
                    <p className="text-stone-500 text-[11px] font-normal leading-relaxed">
                      {item.details}
                    </p>
                  </div>
                </div>

                <div className="p-5 pt-0">
                  <div className="pt-3 border-t border-stone-100 flex items-center justify-between">
                    <span className="font-mono text-base font-bold text-stone-900">
                      {item.price}
                    </span>
                    <a
                      href="https://www.tiktok.com/@snzglam/live"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-bold text-amber-900 hover:text-amber-950 flex items-center gap-1"
                    >
                      <Video className="w-3.5 h-3.5 text-red-600" />
                      <span>Claim Live</span>
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Curators & Boutique Heritage */}
        <section className="mb-20">
          <div className="royal-card p-8 sm:p-12 bg-white border border-stone-200 flex flex-col md:flex-row items-center gap-8 shadow-sm">
            <div className="w-32 h-32 sm:w-44 sm:h-44 rounded-full overflow-hidden border-3 border-[#d4af37] shrink-0 shadow-md relative">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=600&auto=format&fit=crop"
                alt="S&Z Glam Curator"
                className="w-full h-full object-cover"
              />
            </div>

            <div>
              <span className="text-xs uppercase tracking-widest text-[#8c671b] font-bold block mb-1">
                About The Brand
              </span>
              <h3 className="font-royal text-2xl sm:text-3xl font-bold text-stone-900 mb-3">
                Crafted for Queens • S&amp;Z GLAM
              </h3>
              <p className="text-stone-600 text-xs sm:text-sm leading-relaxed mb-4 font-normal">
                Born out of passion for royal South Asian artisanal jewelry, S&amp;Z Glam brings uncut Polki Kundan chokers, Victorian crystal necklaces, and heirloom Jhumkas directly to US doorsteps. Our daily TikTok live shows bring the shopping bazaar experience directly to your phone screen with complete transparency, luxury packaging, and exciting customer giveaways.
              </p>
              <div className="flex items-center gap-4 text-xs font-bold text-stone-800">
                <span>📍 New York / New Jersey Showroom</span>
                <span>•</span>
                <a
                  href="https://wa.me/19296001937"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-emerald-700 hover:underline flex items-center gap-1"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>+1 (929) 600-1937</span>
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Luxury Footer with Zarnetic Credit */}
      <footer className="border-t border-[#ebd9b5] bg-[#1a1715] text-[#d6cdbe] py-14 px-4 sm:px-8">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left mb-10">
          <div>
            <span className="font-royal text-2xl font-bold text-[#f7e7c4] tracking-wider block">
              S&amp;Z GLAM COLLECTION
            </span>
            <p className="text-xs text-stone-400 mt-1 max-w-sm font-normal">
              Artisanal South Asian bridal jewelry, royal kundan chokers, and verified live customer giveaways.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 text-xs text-stone-300">
            <a
              href="https://wa.me/19296001937"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-amber-300 transition-colors"
            >
              WhatsApp: +1 (929) 600-1937
            </a>
            <a
              href="https://www.instagram.com/snzglam/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-amber-300 transition-colors"
            >
              Instagram: @snzglam
            </a>
            <Link href="/shop" className="text-amber-400 hover:text-amber-300 font-bold transition-colors">
              Giveaway Portal
            </Link>
          </div>
        </div>

        {/* Bottom Credits & Zarnetic Link */}
        <div className="max-w-6xl mx-auto pt-8 border-t border-stone-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-stone-500">
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
