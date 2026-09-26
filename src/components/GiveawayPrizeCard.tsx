'use client';

import React from 'react';
import { Gift, Sparkles, Check, DollarSign, Clock, Trophy } from 'lucide-react';
import { FeaturedPrize } from '@/lib/types';

interface GiveawayPrizeCardProps {
  prize: FeaturedPrize;
}

export default function GiveawayPrizeCard({ prize }: GiveawayPrizeCardProps) {
  const steps = [
    {
      num: '1',
      title: 'Claim on TikTok Live',
      desc: 'Watch the live stream and claim your favorite jewelry pieces by commenting your TikTok handle.'
    },
    {
      num: '2',
      title: 'Receive Bill & Pay',
      desc: 'Once the live ends, the host sends your bill total. Pay via Zelle, Venmo, Cash App, or PayPal.'
    },
    {
      num: '3',
      title: 'Register in 30 Mins',
      desc: 'Submit your payment screenshot & US shipping address below before the 30-minute timer hits zero.'
    },
    {
      num: '4',
      title: 'Win Tonight’s Prize',
      desc: 'You receive an instant Lucky Ticket #. Host spins the wheel live and announces the winning customer!'
    }
  ];

  return (
    <section id="giveaway" className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 text-amber-900 border border-amber-300 text-xs font-bold uppercase tracking-widest mb-3">
          <Gift className="w-3.5 h-3.5 text-amber-600" />
          <span>Exclusive After-Live Giveaway</span>
        </div>
        <h2 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900 mb-3">
          Tonight&apos;s Featured Giveaway Prize
        </h2>
        <p className="text-stone-600 text-sm max-w-2xl mx-auto font-normal">
          Every customer who pays their live show bill within the 30-minute window gets automatically entered into tonight&apos;s luxury draw.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Prize Showcase Card */}
        <div className="lg:col-span-7">
          <div className="glass-panel-glow rounded-3xl overflow-hidden relative group border-2 border-amber-300 shadow-xl bg-white">
            {/* Top Prize Badge */}
            <div className="absolute top-4 left-4 z-20 flex items-center gap-2">
              <span className="px-3.5 py-1.5 rounded-full bg-stone-900/90 text-amber-300 border border-amber-400 text-xs font-bold tracking-wider uppercase shadow-lg flex items-center gap-1.5">
                <Trophy className="w-3.5 h-3.5 text-amber-400" />
                <span>Tonight&apos;s Lucky Prize</span>
              </span>
            </div>

            <div className="absolute top-4 right-4 z-20">
              <span className="px-3.5 py-1.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-300 text-xs font-extrabold tracking-wider shadow-md flex items-center gap-1">
                <DollarSign className="w-3.5 h-3.5 text-emerald-600" />
                <span>${prize.retailValue} Value</span>
              </span>
            </div>

            {/* Image Container with Luxury Overlay */}
            <div className="relative h-80 sm:h-96 w-full overflow-hidden bg-stone-100">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={prize.imageUrl}
                alt={prize.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                loading="eager"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-900/60 via-transparent to-transparent pointer-events-none" />
            </div>

            {/* Content Details */}
            <div className="p-6 sm:p-8 bg-white border-t border-amber-100">
              <div className="flex items-center gap-2 text-amber-700 text-xs tracking-widest uppercase font-bold mb-2">
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                <span>Artisan Handcrafted Jewelry</span>
              </div>
              <h3 className="font-serif text-xl sm:text-2xl font-bold text-stone-900 mb-3">
                {prize.title}
              </h3>
              <p className="text-stone-600 text-sm leading-relaxed mb-6 font-normal">
                {prize.description}
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-4 border-t border-stone-100 text-xs text-stone-700 font-medium">
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-amber-600" />
                  <span>22K-24K Gold Plating</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-amber-600" />
                  <span>Uncut Polki Stones</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-amber-600" />
                  <span>Free US Shipping</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 4 Rules / How It Works Card */}
        <div className="lg:col-span-5 space-y-4">
          <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-amber-200/80 bg-white/95 shadow-md">
            <div className="flex items-center gap-2 text-amber-800 font-bold text-xs uppercase tracking-widest mb-6">
              <Clock className="w-4 h-4 text-amber-600" />
              <span>How To Enter &amp; Win</span>
            </div>

            <div className="space-y-6">
              {steps.map(step => (
                <div key={step.num} className="flex items-start gap-4">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 text-stone-950 font-black text-sm flex items-center justify-center shrink-0 shadow-sm">
                    {step.num}
                  </div>
                  <div>
                    <h4 className="text-stone-900 font-bold text-sm mb-1">{step.title}</h4>
                    <p className="text-stone-600 text-xs leading-relaxed font-normal">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 pt-6 border-t border-stone-200">
              <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 flex items-start gap-3">
                <Sparkles className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <p className="text-xs text-amber-950 leading-snug">
                  <strong>Fair &amp; Transparent:</strong> The winner is selected using our verifiable random draw engine live on TikTok stream right after the 30-minute timer expires.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
