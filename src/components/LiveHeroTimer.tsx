'use client';

import React, { useState, useEffect } from 'react';
import { Clock, ShieldAlert, Award, Video, ArrowDownCircle, CheckCircle2 } from 'lucide-react';
import { ShowStatus, FeaturedPrize } from '@/lib/types';

interface LiveHeroTimerProps {
  status: ShowStatus;
  initialRemainingSeconds: number;
  featuredPrize: FeaturedPrize;
  totalEntrants: number;
  winner?: {
    ticketNumber: string;
    tiktokHandle: string;
    fullName: string;
    announcedAt: string;
  } | null;
}

export default function LiveHeroTimer({
  status,
  initialRemainingSeconds,
  featuredPrize,
  totalEntrants,
  winner
}: LiveHeroTimerProps) {
  const [secondsLeft, setSecondsLeft] = useState(initialRemainingSeconds);

  // Sync remaining seconds
  useEffect(() => {
    setSecondsLeft(initialRemainingSeconds);
  }, [initialRemainingSeconds]);

  // Client-side 1-second countdown tick
  useEffect(() => {
    if (status !== 'PAYMENT_WINDOW' || secondsLeft <= 0) return;

    const interval = setInterval(() => {
      setSecondsLeft(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [status, secondsLeft]);

  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;
  const formattedMinutes = String(minutes).padStart(2, '0');
  const formattedSeconds = String(seconds).padStart(2, '0');

  // Percentage of 30 mins
  const totalWindowSeconds = 30 * 60;
  const progressPercent = Math.min(100, Math.max(0, (secondsLeft / totalWindowSeconds) * 100));

  const isTimerActive = status === 'PAYMENT_WINDOW' && secondsLeft > 0;
  const isTimerExpired = status === 'PAYMENT_WINDOW' && secondsLeft === 0;

  return (
    <div className="relative overflow-hidden pt-10 pb-16 px-4 sm:px-6 lg:px-8 border-b border-amber-200/50 bg-gradient-to-b from-amber-50/40 via-white to-transparent">
      {/* Background Ambient Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-gradient-to-tr from-amber-200/30 via-yellow-100/40 to-transparent rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-4xl mx-auto text-center relative z-10">
        {/* Dynamic Status Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-amber-300 shadow-sm mb-6">
          {isTimerActive ? (
            <>
              <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-ping" />
              <span className="text-xs uppercase tracking-widest text-red-700 font-bold">
                Live Show Just Ended • 30-Minute Payment Window Active
              </span>
            </>
          ) : status === 'LIVE_NOW' ? (
            <>
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 animate-ping" />
              <span className="text-xs uppercase tracking-widest text-emerald-800 font-bold">
                🔴 Currently Live on TikTok • Watch &amp; Claim Jewelry
              </span>
            </>
          ) : winner ? (
            <>
              <Award className="w-4 h-4 text-amber-600" />
              <span className="text-xs uppercase tracking-widest text-amber-800 font-bold">
                Tonight&apos;s Lucky Winner Announced!
              </span>
            </>
          ) : (
            <>
              <Clock className="w-4 h-4 text-amber-600" />
              <span className="text-xs uppercase tracking-widest text-stone-600 font-semibold">
                Next Live Show Scheduled Soon • Turn on TikTok Notifications
              </span>
            </>
          )}
        </div>

        {/* Main Headline */}
        <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-stone-900 mb-4">
          {isTimerActive ? (
            <>
              Pay &amp; Register Within <br className="hidden sm:inline" />
              <span className="gold-gradient-text">30 Minutes To Win</span>
            </>
          ) : winner ? (
            <>
              Congratulations to Our <br />
              <span className="gold-gradient-text">Lucky Customer Winner!</span>
            </>
          ) : (
            <>
              Exclusive TikTok Live <br className="hidden sm:inline" />
              <span className="gold-gradient-text">Jewelry Drops &amp; Giveaways</span>
            </>
          )}
        </h1>

        <p className="text-stone-600 text-sm sm:text-base max-w-2xl mx-auto mb-8 font-normal leading-relaxed">
          {isTimerActive ? (
            <>
              Host has sent out your bills! Submit your Zelle, Venmo, Cash App, or PayPal proof before the timer hits 00:00 to enter tonight&apos;s live lucky draw for the <strong className="text-amber-800 font-bold">{featuredPrize.title}</strong> (${featuredPrize.retailValue} Value).
            </>
          ) : (
            <>
              Claim luxury South Asian bridal &amp; fine party wear jewelry live on TikTok. Complete your payment within 30 minutes to get automatically entered in our high-stakes customer giveaways!
            </>
          )}
        </p>

        {/* Big Countdown Timer Card (Light Theme) */}
        {isTimerActive ? (
          <div className="glass-panel-glow rounded-3xl p-6 sm:p-8 max-w-xl mx-auto mb-8 pulse-timer border-2 border-amber-300 shadow-xl bg-white/95">
            <div className="flex items-center justify-center gap-2 text-stone-600 text-xs uppercase tracking-widest font-bold mb-4">
              <Clock className="w-4 h-4 text-amber-600" />
              <span>Payment Window Closes In</span>
            </div>

            <div className="flex items-center justify-center gap-3 sm:gap-6 mb-4">
              {/* Minutes Block */}
              <div className="flex flex-col items-center">
                <div className="bg-stone-50 text-stone-900 border-2 border-amber-200/80 rounded-2xl w-24 sm:w-32 py-3 sm:py-5 shadow-sm">
                  <span className="font-mono text-4xl sm:text-6xl font-black tracking-tight text-amber-900">
                    {formattedMinutes}
                  </span>
                </div>
                <span className="text-[11px] uppercase tracking-widest text-stone-500 mt-2 font-semibold">
                  Minutes
                </span>
              </div>

              {/* Colon Separator */}
              <div className="font-mono text-3xl sm:text-5xl font-bold text-amber-500 animate-pulse pb-6">
                :
              </div>

              {/* Seconds Block */}
              <div className="flex flex-col items-center">
                <div className="bg-stone-50 text-stone-900 border-2 border-amber-200/80 rounded-2xl w-24 sm:w-32 py-3 sm:py-5 shadow-sm">
                  <span className="font-mono text-4xl sm:text-6xl font-black tracking-tight text-amber-700">
                    {formattedSeconds}
                  </span>
                </div>
                <span className="text-[11px] uppercase tracking-widest text-stone-500 mt-2 font-semibold">
                  Seconds
                </span>
              </div>
            </div>

            {/* Visual Progress Bar */}
            <div className="w-full bg-stone-100 rounded-full h-2.5 overflow-hidden border border-stone-200 mb-4">
              <div
                className="h-full bg-gradient-to-r from-red-500 via-amber-400 to-emerald-500 transition-all duration-1000 ease-linear rounded-full"
                style={{ width: `${progressPercent}%` }}
              />
            </div>

            <div className="flex items-center justify-between text-xs text-stone-600 font-medium">
              <span>Fast Verification Active</span>
              <span className="text-amber-800 font-bold">{totalEntrants} Payments Submitted</span>
            </div>
          </div>
        ) : isTimerExpired ? (
          <div className="glass-panel rounded-2xl p-6 max-w-xl mx-auto mb-8 border border-red-200 text-center bg-red-50/60">
            <ShieldAlert className="w-8 h-8 text-amber-600 mx-auto mb-2" />
            <h3 className="text-lg font-bold text-stone-900 mb-1">30-Minute Window Has Ended</h3>
            <p className="text-sm text-stone-600">
              The host is now locking entries and drawing tonight&apos;s lucky winner live!
            </p>
          </div>
        ) : winner ? (
          <div className="glass-panel-glow rounded-3xl p-6 sm:p-8 max-w-xl mx-auto mb-8 border-2 border-amber-300 bg-gradient-to-b from-amber-50/70 to-white shadow-lg">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 border border-amber-300 text-xs font-bold uppercase tracking-wider mb-4">
              <CheckCircle2 className="w-3.5 h-3.5 text-amber-600" />
              <span>Official Giveaway Winner</span>
            </div>
            <h3 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 mb-2">
              {winner.fullName}
            </h3>
            <p className="font-mono text-amber-800 text-lg font-bold mb-3">
              {winner.tiktokHandle} • Ticket #{winner.ticketNumber}
            </p>
            <p className="text-sm text-stone-600">
              Won: <span className="text-amber-900 font-bold">{featuredPrize.title}</span> (${featuredPrize.retailValue} Value)
            </p>
          </div>
        ) : null}

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href="#register"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 text-stone-950 font-bold text-sm tracking-wide uppercase shadow-[0_4px_20px_rgba(212,175,55,0.4)] hover:shadow-[0_6px_25px_rgba(212,175,55,0.6)] hover:scale-105 transition-all duration-300"
          >
            <span>Submit Payment Proof</span>
            <ArrowDownCircle className="w-4 h-4" />
          </a>

          <a
            href="https://www.tiktok.com/@szglamcollection/live"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-white hover:bg-stone-50 text-stone-800 border border-stone-300 font-bold text-sm tracking-wide transition-all shadow-sm hover:border-amber-400"
          >
            <Video className="w-4 h-4 text-red-600" />
            <span>Watch Live on TikTok</span>
          </a>
        </div>
      </div>
    </div>
  );
}
