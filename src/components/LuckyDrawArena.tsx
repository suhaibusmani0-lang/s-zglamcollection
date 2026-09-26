'use client';

import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Trophy, Sparkles, Crown, Award, Volume2, VolumeX } from 'lucide-react';
import { FeaturedPrize } from '@/lib/types';

interface LuckyDrawArenaProps {
  prize: FeaturedPrize;
  entrants: { ticketNumber: string; tiktokHandle: string }[];
  winner?: {
    ticketNumber: string;
    tiktokHandle: string;
    fullName: string;
    announcedAt: string;
  } | null;
}

export default function LuckyDrawArena({ prize, entrants, winner }: LuckyDrawArenaProps) {
  const [isSpinning, setIsSpinning] = useState(false);
  const [displayCandidate, setDisplayCandidate] = useState<string>('???');
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Trigger celebration confetti when winner is announced
  useEffect(() => {
    if (winner) {
      confetti({
        particleCount: 150,
        spread: 90,
        origin: { y: 0.5 },
        colors: ['#d4af37', '#b8860b', '#f59e0b', '#10b981']
      });
    }
  }, [winner]);

  // Demo spin simulation for viewers to see the transparency
  const handleSimulateSpin = () => {
    if (entrants.length === 0 || isSpinning) return;
    setIsSpinning(true);

    let counter = 0;
    const speed = 70;
    const totalSpins = 40;

    const interval = setInterval(() => {
      const randomIdx = Math.floor(Math.random() * entrants.length);
      setDisplayCandidate(`${entrants[randomIdx].tiktokHandle} (${entrants[randomIdx].ticketNumber})`);
      counter++;

      if (counter >= totalSpins) {
        clearInterval(interval);
        setIsSpinning(false);
        confetti({
          particleCount: 80,
          spread: 60,
          origin: { y: 0.6 }
        });
      }
    }, speed);
  };

  return (
    <section id="winners" className="py-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-100 text-amber-900 border border-amber-300 text-xs font-bold uppercase tracking-widest mb-3">
          <Trophy className="w-3.5 h-3.5 text-amber-600" />
          <span>Interactive Lucky Draw Stage</span>
        </div>
        <h2 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900 mb-2">
          Tonight&apos;s Winner Announcement
        </h2>
        <p className="text-stone-600 text-sm max-w-lg mx-auto font-normal">
          Watch the host draw the lucky customer live on TikTok, or verify the winner below.
        </p>
      </div>

      <div className="glass-panel-glow rounded-3xl p-6 sm:p-10 border-2 border-amber-300 relative overflow-hidden bg-white shadow-xl">
        {/* Ambient Top Glow */}
        <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-80 h-36 bg-amber-200/30 rounded-full blur-3xl pointer-events-none" />

        {/* If Winner is announced */}
        {winner ? (
          <div className="text-center py-6 animate-in zoom-in-95 duration-500">
            <div className="inline-flex p-4 rounded-full bg-gradient-to-br from-amber-400 via-yellow-300 to-amber-500 text-stone-950 mb-4 shadow-lg animate-bounce">
              <Crown className="w-10 h-10" />
            </div>

            <span className="text-xs uppercase tracking-widest text-amber-800 font-extrabold block mb-2">
              🎉 Official Lucky Customer Winner 🎉
            </span>

            <h3 className="font-serif text-3xl sm:text-5xl font-black text-stone-900 mb-2">
              {winner.fullName}
            </h3>

            <p className="font-mono text-xl sm:text-2xl text-amber-900 font-bold mb-4">
              {winner.tiktokHandle} • Ticket #{winner.ticketNumber}
            </p>

            <div className="inline-block p-4 rounded-2xl bg-amber-50/70 border border-amber-300 max-w-md mx-auto text-stone-800 text-xs sm:text-sm shadow-sm">
              <div className="flex items-center justify-center gap-2 text-amber-800 font-bold mb-1">
                <Award className="w-4 h-4 text-amber-600" />
                <span>Prize Awarded</span>
              </div>
              <p className="text-stone-900 font-bold">{prize.title}</p>
              <p className="text-emerald-700 font-bold mt-0.5">${prize.retailValue} Retail Value</p>
            </div>

            <p className="text-stone-500 text-xs mt-6 font-normal">
              Announced on TikTok Live • Host will ship this prize along with your live order!
            </p>
          </div>
        ) : (
          <div className="text-center py-6">
            <div className="w-20 h-20 rounded-full bg-amber-50 border-2 border-amber-300 text-amber-700 flex items-center justify-center mx-auto mb-6 shadow-md">
              <Sparkles className="w-10 h-10 animate-pulse" />
            </div>

            <h3 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 mb-2">
              Live Random Drawing Machine
            </h3>
            <p className="text-stone-600 text-sm max-w-md mx-auto mb-8 font-normal">
              Eligible entrants: <strong className="text-amber-800 font-bold">{entrants.length} Customers</strong>. Host will trigger the official spin on stream once the 30-minute timer hits zero!
            </p>

            {/* Candidate Box */}
            <div className="bg-stone-50 border-2 border-amber-300 rounded-2xl p-6 max-w-md mx-auto mb-8 shadow-inner">
              <span className="text-[11px] uppercase tracking-widest text-stone-500 block mb-1 font-semibold">
                {isSpinning ? 'Selecting at random...' : 'Awaiting Host Live Spin'}
              </span>
              <div className="font-mono text-xl sm:text-2xl font-bold text-amber-900 truncate min-h-[36px] flex items-center justify-center">
                {displayCandidate}
              </div>
            </div>

            <div className="flex items-center justify-center gap-3">
              <button
                onClick={handleSimulateSpin}
                disabled={isSpinning || entrants.length === 0}
                className="px-6 py-3 rounded-full bg-white hover:bg-stone-50 text-amber-800 border border-amber-400 text-xs font-bold tracking-wider uppercase transition-all disabled:opacity-50 shadow-sm"
              >
                {isSpinning ? 'Randomizing...' : 'Preview Draw Animation'}
              </button>

              <button
                onClick={() => setSoundEnabled(!soundEnabled)}
                className="p-3 rounded-full bg-white text-stone-600 hover:text-stone-900 border border-stone-300 transition-colors shadow-sm"
                title={soundEnabled ? 'Mute' : 'Unmute'}
              >
                {soundEnabled ? <Volume2 className="w-4 h-4 text-amber-600" /> : <VolumeX className="w-4 h-4" />}
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
