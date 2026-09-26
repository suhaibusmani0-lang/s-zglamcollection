'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ShieldCheck, Truck } from 'lucide-react';
import { InstagramIcon, TikTokIcon, WhatsAppIcon, PhoneCallIcon } from '@/components/SocialIcons';

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
                <span className="font-heading text-xl font-bold tracking-wider gold-gradient-text block uppercase">
                  S&amp;Z GLAM COLLECTION
                </span>
                <span className="text-[10px] uppercase tracking-widest text-stone-500 font-semibold font-heading">
                  Curated by Sumera Usmani • USA
                </span>
              </div>
            </div>

            <p className="text-stone-600 text-xs max-w-md leading-relaxed font-normal">
              Premier US boutique curated by Sumera Usmani for handcrafted South Asian bridal jewelry, royal kundan choker sets, uncut polki, and high-shine American Diamond pieces. Join our daily TikTok live drops and customer giveaways!
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
            <h4 className="text-stone-900 font-bold text-sm uppercase tracking-wider font-heading">
              Live Show &amp; Giveaways
            </h4>
            <ul className="space-y-2 text-xs font-medium">
              <li>
                <a href="#giveaway" className="hover:text-amber-800 transition-colors">
                  Tonight&apos;s Featured Prize
                </a>
              </li>
              <li>
                <a href="#payment-portal" className="hover:text-amber-800 transition-colors">
                  Official US Payment Methods
                </a>
              </li>
              <li>
                <Link href="/shop" className="hover:text-amber-800 transition-colors">
                  Dedicated VIP Shop Portal
                </Link>
              </li>
              <li>
                <a href="#hall-of-fame" className="hover:text-amber-800 transition-colors">
                  Past Lucky Winners
                </a>
              </li>
            </ul>
          </div>

          {/* Col 3: Customer Care & Social Media Icons */}
          <div className="space-y-3">
            <h4 className="text-stone-900 font-bold text-sm uppercase tracking-wider font-heading">
              Connect &amp; Concierge
            </h4>
            <p className="text-xs text-stone-600 leading-relaxed font-normal">
              Direct consultation with Sumera Usmani for custom bridal jewelry &amp; order inquiries:
            </p>

            {/* Sleek Social Media Icons */}
            <div className="flex items-center gap-2.5 pt-2">
              {/* Instagram */}
              <a
                href="https://www.instagram.com/snzglam/"
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram @snzglam"
                className="w-10 h-10 rounded-full bg-white hover:bg-gradient-to-tr hover:from-amber-600 hover:to-pink-600 text-stone-700 hover:text-white flex items-center justify-center transition-all duration-300 border border-stone-300 hover:border-amber-400 shadow-sm hover:scale-110"
              >
                <InstagramIcon className="w-4 h-4" />
              </a>

              {/* TikTok */}
              <a
                href="https://www.tiktok.com/@snzglam"
                target="_blank"
                rel="noreferrer"
                aria-label="TikTok @snzglam"
                className="w-10 h-10 rounded-full bg-white hover:bg-black text-stone-700 hover:text-white flex items-center justify-center transition-all duration-300 border border-stone-300 hover:border-stone-900 shadow-sm hover:scale-110"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.31 0 .61.05.89.14V8.98a6.34 6.34 0 0 0-.89-.06 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34-6.34V8.71a8.21 8.21 0 0 0 4.76 1.49V6.75a4.87 4.87 0 0 1-1-.06z" />
                </svg>
              </a>

              {/* WhatsApp */}
              <a
                href="https://wa.me/19296001937"
                target="_blank"
                rel="noreferrer"
                aria-label="WhatsApp Concierge"
                className="w-10 h-10 rounded-full bg-white hover:bg-emerald-600 text-stone-700 hover:text-white flex items-center justify-center transition-all duration-300 border border-stone-300 hover:border-emerald-500 shadow-sm hover:scale-110"
              >
                <WhatsAppIcon className="w-4 h-4" />
              </a>

              {/* Direct Phone */}
              <a
                href="tel:19296001937"
                aria-label="Direct Phone Line"
                className="w-10 h-10 rounded-full bg-white hover:bg-amber-600 text-stone-700 hover:text-white flex items-center justify-center transition-all duration-300 border border-stone-300 hover:border-amber-500 shadow-sm hover:scale-110"
              >
                <PhoneCallIcon className="w-3.5 h-3.5" />
              </a>
            </div>

            <div className="pt-3">
              <Link
                href="/admin"
                className="inline-block px-3 py-1.5 rounded-lg bg-white border border-stone-300 text-stone-700 hover:text-amber-800 text-[11px] font-semibold shadow-sm font-heading"
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
