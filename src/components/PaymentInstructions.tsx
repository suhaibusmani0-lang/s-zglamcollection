'use client';

import React, { useState } from 'react';
import { Copy, Check, ExternalLink, ShieldCheck, AlertCircle } from 'lucide-react';
import { PaymentAccountSettings } from '@/lib/types';

interface PaymentInstructionsProps {
  settings: PaymentAccountSettings;
}

export default function PaymentInstructions({ settings }: PaymentInstructionsProps) {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'ZELLE' | 'VENMO' | 'CASH_APP' | 'PAYPAL'>('ZELLE');

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  return (
    <section id="payment" className="py-14 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-300 text-xs font-bold uppercase tracking-widest mb-3">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>Step 1: Official US Payment Methods</span>
        </div>
        <h2 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900 mb-2">
          Pay Your Live Show Invoice
        </h2>
        <p className="text-stone-600 text-sm max-w-xl mx-auto font-normal">
          Send the exact invoice total sent by the host. Choose your preferred US payment method below.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center justify-center gap-2 sm:gap-3 mb-6 flex-wrap">
        <button
          onClick={() => setActiveTab('ZELLE')}
          className={`px-5 py-2.5 rounded-full text-xs sm:text-sm font-bold tracking-wide transition-all ${
            activeTab === 'ZELLE'
              ? 'bg-[#7414CA] text-white shadow-md border border-purple-400'
              : 'bg-white text-stone-700 hover:text-stone-900 border border-stone-200 shadow-sm'
          }`}
        >
          Zelle (Chase, BoA, Citi, etc.)
        </button>

        <button
          onClick={() => setActiveTab('VENMO')}
          className={`px-5 py-2.5 rounded-full text-xs sm:text-sm font-bold tracking-wide transition-all ${
            activeTab === 'VENMO'
              ? 'bg-[#008CFF] text-white shadow-md border border-sky-400'
              : 'bg-white text-stone-700 hover:text-stone-900 border border-stone-200 shadow-sm'
          }`}
        >
          Venmo
        </button>

        <button
          onClick={() => setActiveTab('CASH_APP')}
          className={`px-5 py-2.5 rounded-full text-xs sm:text-sm font-bold tracking-wide transition-all ${
            activeTab === 'CASH_APP'
              ? 'bg-[#00D632] text-stone-950 shadow-md border border-emerald-500'
              : 'bg-white text-stone-700 hover:text-stone-900 border border-stone-200 shadow-sm'
          }`}
        >
          Cash App
        </button>

        <button
          onClick={() => setActiveTab('PAYPAL')}
          className={`px-5 py-2.5 rounded-full text-xs sm:text-sm font-bold tracking-wide transition-all ${
            activeTab === 'PAYPAL'
              ? 'bg-[#003087] text-white shadow-md border border-blue-400'
              : 'bg-white text-stone-700 hover:text-stone-900 border border-stone-200 shadow-sm'
          }`}
        >
          PayPal
        </button>
      </div>

      {/* Tab Panels */}
      <div className="glass-panel-glow rounded-3xl p-6 sm:p-8 border-2 border-amber-300 relative overflow-hidden bg-white shadow-xl">
        {/* Important Warning Banner */}
        <div className="mb-6 p-3.5 rounded-xl bg-amber-50 border border-amber-300 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />
          <p className="text-xs text-amber-950">
            <strong>CRITICAL:</strong> Please put your <strong>TikTok Username</strong> in the payment note/memo so we can instantly match your payment with your claimed items!
          </p>
        </div>

        {/* ZELLE */}
        {activeTab === 'ZELLE' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between flex-wrap gap-2 border-b border-stone-100 pb-4">
              <div>
                <span className="text-xs uppercase tracking-widest text-purple-700 font-bold">
                  Recommended for US Banks
                </span>
                <h3 className="text-xl font-bold text-stone-900">Pay with Zelle</h3>
                <p className="text-xs text-stone-500">Instant transfer with zero fees from your mobile banking app.</p>
              </div>
              <span className="px-3 py-1 rounded-full bg-purple-50 text-purple-800 text-xs font-bold border border-purple-200">
                0% Fees • Instant
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Recipient Name */}
              <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200/80">
                <span className="text-[11px] uppercase tracking-wider text-stone-500 block mb-1 font-semibold">
                  Recipient Name
                </span>
                <span className="font-bold text-stone-900 text-base">
                  {settings.zelle.recipientName}
                </span>
              </div>

              {/* Zelle Email */}
              <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200/80 flex items-center justify-between">
                <div>
                  <span className="text-[11px] uppercase tracking-wider text-stone-500 block mb-1 font-semibold">
                    Zelle Email Address
                  </span>
                  <span className="font-mono text-amber-900 font-bold text-sm sm:text-base">
                    {settings.zelle.email}
                  </span>
                </div>
                <button
                  onClick={() => copyToClipboard(settings.zelle.email, 'zelle-email')}
                  className="p-2 rounded-lg bg-white hover:bg-stone-100 text-stone-700 hover:text-stone-900 transition-colors border border-stone-200 shadow-sm"
                  title="Copy Email"
                >
                  {copiedKey === 'zelle-email' ? (
                    <Check className="w-4 h-4 text-emerald-600" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
              </div>

              {/* Zelle Phone */}
              <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200/80 flex items-center justify-between sm:col-span-2">
                <div>
                  <span className="text-[11px] uppercase tracking-wider text-stone-500 block mb-1 font-semibold">
                    Or Pay via Phone Number
                  </span>
                  <span className="font-mono text-amber-900 font-bold text-base">
                    {settings.zelle.phone}
                  </span>
                </div>
                <button
                  onClick={() => copyToClipboard(settings.zelle.phone, 'zelle-phone')}
                  className="p-2 rounded-lg bg-white hover:bg-stone-100 text-stone-700 hover:text-stone-900 transition-colors border border-stone-200 shadow-sm"
                  title="Copy Phone"
                >
                  {copiedKey === 'zelle-phone' ? (
                    <Check className="w-4 h-4 text-emerald-600" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* VENMO */}
        {activeTab === 'VENMO' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between flex-wrap gap-2 border-b border-stone-100 pb-4">
              <div>
                <span className="text-xs uppercase tracking-widest text-sky-700 font-bold">
                  Fast &amp; Popular
                </span>
                <h3 className="text-xl font-bold text-stone-900">Pay with Venmo</h3>
                <p className="text-xs text-stone-500">Tap below to open your Venmo app or scan our official handle.</p>
              </div>
              <a
                href={settings.venmo.link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#008CFF] text-white text-xs font-bold hover:bg-sky-500 transition-colors shadow-sm"
              >
                <span>Open Venmo App</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200/80 flex items-center justify-between">
                <div>
                  <span className="text-[11px] uppercase tracking-wider text-stone-500 block mb-1 font-semibold">
                    Venmo Username
                  </span>
                  <span className="font-mono text-sky-700 font-bold text-lg">
                    {settings.venmo.handle}
                  </span>
                </div>
                <button
                  onClick={() => copyToClipboard(settings.venmo.handle, 'venmo-handle')}
                  className="p-2 rounded-lg bg-white hover:bg-stone-100 text-stone-700 hover:text-stone-900 transition-colors border border-stone-200 shadow-sm"
                >
                  {copiedKey === 'venmo-handle' ? (
                    <Check className="w-4 h-4 text-emerald-600" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
              </div>

              <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200/80">
                <span className="text-[11px] uppercase tracking-wider text-stone-500 block mb-1 font-semibold">
                  Display Profile Name
                </span>
                <span className="font-bold text-stone-900 text-base">
                  {settings.venmo.displayName}
                </span>
              </div>
            </div>

            <p className="text-xs text-stone-600 bg-stone-50 p-3 rounded-xl border border-stone-200">
              💡 {settings.venmo.notes}
            </p>
          </div>
        )}

        {/* CASH APP */}
        {activeTab === 'CASH_APP' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between flex-wrap gap-2 border-b border-stone-100 pb-4">
              <div>
                <span className="text-xs uppercase tracking-widest text-emerald-700 font-bold">
                  Direct Cashtag
                </span>
                <h3 className="text-xl font-bold text-stone-900">Pay with Cash App</h3>
                <p className="text-xs text-stone-500">Send payment directly to our verified cashtag.</p>
              </div>
              <a
                href={settings.cashApp.link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#00D632] text-stone-950 text-xs font-bold hover:bg-emerald-400 transition-colors shadow-sm"
              >
                <span>Open Cash App</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200/80 flex items-center justify-between">
              <div>
                <span className="text-[11px] uppercase tracking-wider text-stone-500 block mb-1 font-semibold">
                  Our Cashtag
                </span>
                <span className="font-mono text-emerald-700 font-bold text-2xl">
                  {settings.cashApp.cashtag}
                </span>
              </div>
              <button
                onClick={() => copyToClipboard(settings.cashApp.cashtag, 'cashtag')}
                className="p-2.5 rounded-lg bg-white hover:bg-stone-100 text-stone-700 hover:text-stone-900 transition-colors border border-stone-200 shadow-sm"
              >
                {copiedKey === 'cashtag' ? (
                  <Check className="w-5 h-5 text-emerald-600" />
                ) : (
                  <Copy className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>
        )}

        {/* PAYPAL */}
        {activeTab === 'PAYPAL' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between flex-wrap gap-2 border-b border-stone-100 pb-4">
              <div>
                <span className="text-xs uppercase tracking-widest text-blue-700 font-bold">
                  PayPal Me
                </span>
                <h3 className="text-xl font-bold text-stone-900">Pay with PayPal</h3>
                <p className="text-xs text-stone-500">Fast payment via PayPal.Me link.</p>
              </div>
              <a
                href={settings.paypal.link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#003087] text-white text-xs font-bold hover:bg-blue-700 transition-colors shadow-sm"
              >
                <span>Open PayPal.Me</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200/80 flex items-center justify-between">
              <div>
                <span className="text-[11px] uppercase tracking-wider text-stone-500 block mb-1 font-semibold">
                  PayPal Link
                </span>
                <span className="font-mono text-blue-800 font-bold text-base">
                  {settings.paypal.link}
                </span>
              </div>
              <button
                onClick={() => copyToClipboard(settings.paypal.link, 'paypal-link')}
                className="p-2 rounded-lg bg-white hover:bg-stone-100 text-stone-700 hover:text-stone-900 transition-colors border border-stone-200 shadow-sm"
              >
                {copiedKey === 'paypal-link' ? (
                  <Check className="w-4 h-4 text-emerald-600" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
