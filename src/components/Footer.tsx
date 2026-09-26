'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ShieldCheck, Truck, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#f4efe6] border-t border-amber-200/80 pt-16 pb-12 px-4 sm:px-6 lg:px-8 text-stone-600 text-xs">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Col 1: Brand */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-amber-400 shadow-sm">
                <Image
                  src="/logo.jpg"
                  alt="S&Z Glam Collection Logo"
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <span className="font-serif text-xl font-bold tracking-wider gold-gradient-text block">
                  S&amp;Z GLAM COLLECTION
                </span>
                <span className="text-[10px] uppercase tracking-widest text-stone-500 font-semibold">
                  Jewelry That Celebrates You • USA
                </span>
              </div>
            </div>

            <p className="text-stone-600 text-xs max-w-md leading-relaxed font-normal">
              Premier US boutique for handcrafted South Asian bridal jewelry, royal kundan choker sets, uncut polki, and high-shine American Diamond pieces. Join our daily TikTok live drops and customer giveaways!
            </p>

            <div className="flex items-center gap-4 text-stone-700 pt-2 font-medium">
              <div className="flex items-center gap-1.5 text-xs">
                <Truck className="w-4 h-4 text-amber-700" />
                <span>USPS 2-3 Day Priority Mail</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs">
                <ShieldCheck className="w-4 h-4 text-emerald-700" />
                <span>100% Authentic Handcrafted</span>
              </div>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div className="space-y-3">
            <h4 className="text-stone-900 font-bold text-sm uppercase tracking-wider">
              Live Show &amp; Giveaways
            </h4>
            <ul className="space-y-2 text-xs font-medium">
              <li>
                <a href="#giveaway" className="hover:text-amber-800 transition-colors">
                  Tonight&apos;s Featured Prize
                </a>
              </li>
              <li>
                <a href="#payment" className="hover:text-amber-800 transition-colors">
                  Official US Payment Methods
                </a>
              </li>
              <li>
                <a href="#register" className="hover:text-amber-800 transition-colors">
                  Submit 30-Min Payment Proof
                </a>
              </li>
              <li>
                <a href="#entrants" className="hover:text-amber-800 transition-colors">
                  Tonight&apos;s Live Qualified List
                </a>
              </li>
              <li>
                <a href="#winners" className="hover:text-amber-800 transition-colors">
                  Past Lucky Winners
                </a>
              </li>
            </ul>
          </div>

          {/* Col 3: Customer Care & TikTok */}
          <div className="space-y-3">
            <h4 className="text-stone-900 font-bold text-sm uppercase tracking-wider">
              Host &amp; Support
            </h4>
            <p className="text-xs text-stone-600 leading-relaxed font-normal">
              Have questions about your bill or shipping? Reach out to the host directly:
            </p>
            <div className="space-y-1.5 text-xs font-medium">
              <p className="text-stone-900 font-semibold">Instagram: <a href="https://www.instagram.com/snzglam/" target="_blank" rel="noreferrer" className="text-amber-800 underline">@snzglam</a></p>
              <p className="text-stone-700">WhatsApp: <a href="https://wa.me/19296001937" target="_blank" rel="noreferrer" className="text-amber-800 underline">+1 (929) 600-1937</a></p>
              <p className="text-stone-700">Email: orders@szglamcollection.com</p>
            </div>
            <div className="pt-2">
              <Link
                href="/admin"
                className="inline-block px-3 py-1.5 rounded-lg bg-white border border-stone-300 text-stone-700 hover:text-amber-800 text-[11px] font-semibold shadow-sm"
              >
                Host Control Room (Admin)
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Bar with Zarnetic Credit */}
        <div className="pt-8 border-t border-amber-200/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <p className="text-[11px] text-stone-500 font-medium">
            &copy; {new Date().getFullYear()} S&amp;Z Glam Collection LLC. All Rights Reserved. Based in the United States.
          </p>
          <p className="text-xs text-stone-600 font-medium">
            Developed by{' '}
            <a
              href="https://www.zarnetic.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#98752c] hover:text-[#d4af37] underline font-bold tracking-wide transition-colors"
            >
              Zarnetic
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
