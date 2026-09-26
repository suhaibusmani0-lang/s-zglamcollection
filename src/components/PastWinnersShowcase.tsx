'use client';

import React from 'react';
import Image from 'next/image';
import { Calendar, DollarSign, Trophy } from 'lucide-react';
import { PastWinner } from '@/lib/types';

interface PastWinnersShowcaseProps {
  winners: PastWinner[];
}

export default function PastWinnersShowcase({ winners }: PastWinnersShowcaseProps) {
  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-stone-200">
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 text-amber-900 border border-amber-300 text-xs font-bold uppercase tracking-wider mb-2">
          <Trophy className="w-3.5 h-3.5 text-amber-600" />
          <span>Hall of Fame</span>
        </div>
        <h2 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900 mb-2">
          Past Live Show Lucky Winners
        </h2>
        <p className="text-stone-600 text-sm max-w-xl mx-auto font-normal">
          Meet our verified lucky customers who won high-value jewelry sets from previous TikTok Live shows!
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {winners.map(win => (
          <div
            key={win.id}
            className="glass-panel rounded-3xl overflow-hidden border border-amber-200/70 hover:border-amber-400 transition-all duration-300 group flex flex-col justify-between bg-white shadow-md hover:shadow-xl"
          >
            <div>
              <div className="relative h-56 w-full overflow-hidden bg-stone-100">
                <Image
                  src={win.prizeImageUrl}
                  alt={win.prizeTitle}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-900/50 via-transparent to-transparent" />
                <div className="absolute top-3 right-3">
                  <span className="px-2.5 py-1 rounded-full bg-white/95 text-emerald-800 text-xs font-bold border border-emerald-300 flex items-center gap-1 shadow-md">
                    <DollarSign className="w-3 h-3 text-emerald-600" />
                    <span>${win.prizeValue} Won</span>
                  </span>
                </div>
              </div>

              <div className="p-6">
                <div className="flex items-center gap-2 text-xs text-stone-500 mb-2 font-medium">
                  <Calendar className="w-3.5 h-3.5 text-amber-600" />
                  <span>{win.date} • {win.showTitle}</span>
                </div>
                <h4 className="font-serif text-lg font-bold text-stone-900 mb-2 line-clamp-2">
                  {win.prizeTitle}
                </h4>
              </div>
            </div>

            <div className="p-6 pt-0">
              <div className="pt-4 border-t border-stone-100 flex items-center justify-between">
                <div>
                  <span className="font-bold text-amber-900 text-sm block">
                    {win.tiktokHandle}
                  </span>
                  <span className="text-stone-500 text-xs font-medium">{win.fullName}</span>
                </div>
                <span className="font-mono text-xs text-stone-600 bg-stone-100 px-2.5 py-1 rounded-full border border-stone-200 font-semibold">
                  #{win.ticketNumber}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
