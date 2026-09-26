'use client';

import React, { useState } from 'react';
import { Search, CheckCircle2, Ticket, Users } from 'lucide-react';

interface Entrant {
  ticketNumber: string;
  tiktokHandle: string;
  createdAt: string;
}

interface LiveEntrantsTickerProps {
  entrants: Entrant[];
}

export default function LiveEntrantsTicker({ entrants }: LiveEntrantsTickerProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = entrants.filter(e =>
    e.tiktokHandle.toLowerCase().includes(searchQuery.toLowerCase()) ||
    e.ticketNumber.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <section id="entrants" className="py-14 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 text-amber-900 border border-amber-300 text-xs font-bold uppercase tracking-wider mb-2">
            <Users className="w-3.5 h-3.5 text-amber-600" />
            <span>Live Draw Qualified List</span>
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900">
            Tonight&apos;s Verified Entrants ({entrants.length})
          </h2>
          <p className="text-stone-600 text-xs sm:text-sm font-normal">
            Every customer listed below has registered their payment and is eligible for tonight&apos;s lucky prize draw.
          </p>
        </div>

        {/* Ticket Search Bar */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search your TikTok or Ticket #"
            className="w-full pl-10 pr-4 py-2.5 rounded-full bg-white border border-stone-300 text-stone-900 placeholder-stone-400 text-xs focus:outline-none focus:border-amber-500 shadow-sm"
          />
        </div>
      </div>

      {/* Grid of Entrants */}
      <div className="glass-panel rounded-3xl p-6 border border-amber-200/80 bg-white shadow-md">
        {filtered.length === 0 ? (
          <div className="text-center py-12 text-stone-500 text-sm">
            {searchQuery ? 'No matching entrant found with that handle or ticket.' : 'No entries registered yet. Be the first to submit!'}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 max-h-96 overflow-y-auto pr-1">
            {filtered.map((entrant, idx) => (
              <div
                key={entrant.ticketNumber || idx}
                className="flex items-center justify-between p-3.5 rounded-2xl bg-stone-50 border border-stone-200 hover:border-amber-400 transition-colors shadow-sm"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-amber-100 border border-amber-300 text-amber-800 flex items-center justify-center font-mono font-bold text-xs">
                    <Ticket className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <span className="font-bold text-stone-900 text-xs block truncate max-w-[130px]">
                      {entrant.tiktokHandle}
                    </span>
                    <span className="font-mono text-[11px] text-amber-800 font-semibold">
                      {entrant.ticketNumber}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-300">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  <span>Entered</span>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-6 pt-4 border-t border-stone-100 text-center text-xs text-stone-500">
          Showing <span className="text-amber-800 font-bold">{filtered.length}</span> verified customer entries for tonight&apos;s giveaway.
        </div>
      </div>
    </section>
  );
}
