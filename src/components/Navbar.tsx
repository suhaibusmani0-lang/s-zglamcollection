'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Sparkles, Video, ShieldCheck, Gift } from 'lucide-react';
import { ShowStatus } from '@/lib/types';

interface NavbarProps {
  status: ShowStatus;
  remainingSeconds: number;
  totalEntrants: number;
}

export default function Navbar({ status, remainingSeconds, totalEntrants }: NavbarProps) {
  const isTimerActive = status === 'PAYMENT_WINDOW' && remainingSeconds > 0;
  const isLive = status === 'LIVE_NOW';

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-amber-200/60 shadow-sm">
      {/* Top Ticker Bar */}
      <div className="bg-gradient-to-r from-amber-100 via-amber-50 to-amber-100 text-amber-950 text-xs py-1.5 px-4 text-center font-medium tracking-wide flex items-center justify-center gap-2 border-b border-amber-200/50">
        <Sparkles className="w-3.5 h-3.5 text-amber-600 animate-spin" style={{ animationDuration: '6s' }} />
        <span>
          {isTimerActive
            ? `⚡ 30-Min Payment Window Open • All payments made within 30 mins enter Tonight's Giveaway! (${totalEntrants} qualified)`
            : isLive
            ? `🔴 We are LIVE on TikTok! Claim your jewelry pieces on stream!`
            : `✨ Welcome to S&Z Glam Collection • Live Jewelry Shows & Giveaways • US Fast Shipping`}
        </span>
        <Sparkles className="w-3.5 h-3.5 text-amber-600 animate-spin" style={{ animationDuration: '6s' }} />
      </div>

      {/* Main Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Logo and Brand */}
        <Link href="/" className="flex items-center gap-3.5 group">
          <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-[#d4af37] shadow-[0_2px_10px_rgba(212,175,55,0.3)] group-hover:scale-105 transition-transform duration-300">
            <Image
              src="/logo.png"
              alt="S&Z Glam Collection Logo"
              fill
              className="object-contain"
              priority
            />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-serif text-xl sm:text-2xl font-bold tracking-wider gold-gradient-text uppercase">
                S&amp;Z GLAM
              </span>
              <span className="hidden sm:inline-block text-[10px] tracking-widest uppercase px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-300 font-semibold">
                USA
              </span>
            </div>
            <p className="text-[10px] sm:text-xs text-stone-500 tracking-[0.2em] uppercase font-medium">
              Jewelry That Celebrates You
            </p>
          </div>
        </Link>

        {/* Navigation Links */}
        <div className="hidden md:flex items-center gap-6">
          <Link
            href="#giveaway"
            className="text-sm font-medium text-stone-700 hover:text-amber-700 transition-colors flex items-center gap-1.5"
          >
            <Gift className="w-4 h-4 text-amber-600" />
            <span>Tonight&apos;s Giveaway</span>
          </Link>
          <Link
            href="#payment"
            className="text-sm font-medium text-stone-700 hover:text-amber-700 transition-colors flex items-center gap-1.5"
          >
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>How to Pay &amp; Register</span>
          </Link>
          <Link
            href="#entrants"
            className="text-sm font-medium text-stone-700 hover:text-amber-700 transition-colors"
          >
            Live Entrants ({totalEntrants})
          </Link>
          <Link
            href="#winners"
            className="text-sm font-medium text-stone-700 hover:text-amber-700 transition-colors"
          >
            Past Winners
          </Link>
        </div>

        {/* Action Button: TikTok Live & Admin Link */}
        <div className="flex items-center gap-3">
          {isTimerActive ? (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-50 border border-red-200 text-red-700 text-xs font-bold animate-pulse shadow-sm">
              <span className="w-2 h-2 rounded-full bg-red-600 animate-ping" />
              <span>TIMER ACTIVE</span>
            </div>
          ) : isLive ? (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-50 border border-red-200 text-red-700 text-xs font-bold shadow-sm">
              <span className="w-2 h-2 rounded-full bg-red-600" />
              <span>LIVE ON TIKTOK</span>
            </div>
          ) : null}

          <a
            href="https://www.tiktok.com/@szglamcollection/live"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 text-stone-950 font-bold text-xs tracking-wider uppercase shadow-[0_2px_10px_rgba(212,175,55,0.35)] hover:shadow-[0_4px_15px_rgba(212,175,55,0.5)] hover:scale-105 transition-all"
          >
            <Video className="w-3.5 h-3.5 text-stone-950" />
            <span>TikTok Live</span>
          </a>

          <Link
            href="/admin"
            className="text-xs font-medium text-stone-600 hover:text-amber-800 transition-colors px-2.5 py-1.5 rounded-lg border border-stone-200 hover:border-amber-400 bg-stone-50"
            title="Host Control Center"
          >
            Host Login
          </Link>
        </div>
      </div>
    </header>
  );
}
