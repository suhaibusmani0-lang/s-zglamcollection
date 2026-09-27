'use client';

import React from 'react';
import { Sparkles, Trophy, CheckCircle, X, Video } from 'lucide-react';

interface ConfettiCelebrationProps {
  ticketNumber?: string;
  customerName?: string;
  prizeTitle?: string;
  onClose?: () => void;
}

export default function ConfettiCelebration({
  ticketNumber = '',
  customerName = '',
  prizeTitle = '',
  onClose = () => {}
}: ConfettiCelebrationProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/70 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="relative w-full max-w-md bg-white rounded-3xl overflow-hidden shadow-2xl border-2 border-[#bfa15f] text-center p-8">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Celebration Trophy Icon */}
        <div className="w-16 h-16 rounded-full bg-[#fbf5e8] border-2 border-[#bfa15f] flex items-center justify-center mx-auto mb-4 shadow-md text-[#9c7731]">
          <Trophy className="w-8 h-8 animate-bounce" />
        </div>

        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-300 text-xs font-bold uppercase tracking-wider mb-3">
          <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
          <span>Payment Registered!</span>
        </span>

        <h3 className="font-serif-luxury text-2xl sm:text-3xl font-bold text-stone-900 mb-1">
          You&apos;re In The Draw!
        </h3>

        <p className="text-stone-600 text-xs sm:text-sm mb-6 font-normal">
          Congratulations <strong>{customerName}</strong>! Your payment has been logged and your entry is locked in for tonight&apos;s live giveaway.
        </p>

        {/* Lucky Ticket Golden Box */}
        <div className="p-6 rounded-2xl bg-gradient-to-br from-[#faf6ee] via-white to-[#f5eedf] border border-[#d9c7a7] shadow-inner mb-6 relative overflow-hidden">
          <div className="text-[11px] uppercase tracking-widest text-[#8b6520] font-extrabold mb-1">
            Your Official Lucky Ticket
          </div>
          <div className="font-mono text-3xl sm:text-4xl font-black text-stone-900 tracking-wider my-1">
            #{ticketNumber}
          </div>
          <div className="text-xs text-stone-500 font-medium">
            Entering for: <span className="font-semibold text-stone-800">{prizeTitle}</span>
          </div>

          <div className="mt-4 pt-3 border-t border-amber-200/60 flex items-center justify-center gap-1.5 text-[11px] text-[#8b6520] font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-[#bfa15f]" />
            <span>Host will spin the wheel live on TikTok stream</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <a
            href="https://www.tiktok.com/@szglamcollection/live"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-gold-solid w-full py-3.5 rounded-full text-sm font-bold flex items-center justify-center gap-2 shadow-md"
          >
            <Video className="w-4 h-4 text-white" />
            <span>Watch Live Wheel Spin on TikTok</span>
          </a>

          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-full text-xs font-semibold text-stone-500 hover:text-stone-800 transition-colors"
          >
            Close &amp; Back to Giveaway
          </button>
        </div>
      </div>
    </div>
  );
}
