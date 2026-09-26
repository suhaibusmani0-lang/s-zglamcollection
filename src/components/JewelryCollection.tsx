'use client';

import React from 'react';
import Image from 'next/image';
import { Sparkles, Video, ArrowRight } from 'lucide-react';

const FEATURED_PIECES = [
  {
    id: 'p1',
    name: 'Royal Heritage Polki Kundan Set',
    category: 'Bridal Collection',
    price: '$185',
    image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=800&auto=format&fit=crop',
    tag: 'TikTok Viral'
  },
  {
    id: 'p2',
    name: 'Emerald Green Mughal Pearl Choker',
    category: 'Choker & Jhumkas',
    price: '$145',
    image: 'https://images.unsplash.com/photo-1611591475870-1798365d9560?q=80&w=800&auto=format&fit=crop',
    tag: 'Best Seller'
  },
  {
    id: 'p3',
    name: 'American Diamond Solitaire Halo Set',
    category: 'Party & Reception',
    price: '$165',
    image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=800&auto=format&fit=crop',
    tag: 'Limited Edition'
  },
  {
    id: 'p4',
    name: 'Ruby Velvet Polki Bridal Chandelier',
    category: 'Statement Jhumkas',
    price: '$95',
    image: 'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?q=80&w=800&auto=format&fit=crop',
    tag: 'New Drop'
  }
];

export default function JewelryCollection() {
  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-stone-200">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 text-amber-900 border border-amber-300 text-xs font-bold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>Curated Showcase</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900 mb-2">
            Featured Live Show Collections
          </h2>
          <p className="text-stone-600 text-sm max-w-lg font-normal">
            Every piece is showcased in high-definition on our live streams with 360° shine tests and custom styling advice.
          </p>
        </div>

        <a
          href="https://www.tiktok.com/@szglamcollection/live"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-sm text-amber-800 hover:text-amber-950 font-bold group transition-colors"
        >
          <span>Claim Next Drop on TikTok</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </a>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {FEATURED_PIECES.map(item => (
          <div
            key={item.id}
            className="glass-panel rounded-3xl overflow-hidden border border-amber-200/70 hover:border-amber-400 transition-all duration-300 group flex flex-col justify-between bg-white shadow-md hover:shadow-xl"
          >
            <div>
              <div className="relative h-64 w-full overflow-hidden bg-stone-100">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                />
                <div className="absolute top-3 left-3">
                  <span className="px-2.5 py-1 rounded-full bg-white/90 text-amber-900 text-[11px] font-bold border border-amber-300 shadow-sm">
                    {item.tag}
                  </span>
                </div>
              </div>

              <div className="p-5">
                <span className="text-[11px] uppercase tracking-wider text-stone-500 block mb-1 font-semibold">
                  {item.category}
                </span>
                <h4 className="font-serif text-base font-bold text-stone-900 mb-2">
                  {item.name}
                </h4>
              </div>
            </div>

            <div className="p-5 pt-0">
              <div className="pt-3 border-t border-stone-100 flex items-center justify-between">
                <span className="font-mono text-base font-bold text-amber-900">
                  {item.price}
                </span>
                <a
                  href="https://www.tiktok.com/@szglamcollection/live"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-50 hover:bg-amber-400 text-stone-900 text-xs font-bold transition-colors border border-amber-300"
                >
                  <Video className="w-3 h-3 text-red-600" />
                  <span>Claim Live</span>
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
