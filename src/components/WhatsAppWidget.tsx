'use client';

import React, { useState } from 'react';
import { MessageCircle, X } from 'lucide-react';

interface WhatsAppWidgetProps {
  phoneNumber?: string;
  defaultMessage?: string;
}

export default function WhatsAppWidget({
  phoneNumber = '19296001937',
  defaultMessage = 'Hi! I am reaching out from S&Z Glam Collection regarding live jewelry show orders and giveaways.'
}: WhatsAppWidgetProps) {
  const [showTooltip, setShowTooltip] = useState(true);

  const whatsappUrl = `https://wa.me/${phoneNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(defaultMessage)}`;

  return (
    <aside aria-label="Customer Support Chat" className="fixed bottom-6 left-6 z-50 flex items-center gap-3">
      {/* Tooltip bubble with close button */}
      {showTooltip && (
        <div className="relative hidden sm:flex items-center gap-2 bg-white/95 backdrop-blur-md px-3.5 py-2 rounded-full border border-stone-200/90 shadow-[0_4px_20px_rgba(0,0,0,0.08)] text-xs text-stone-700 font-medium animate-in fade-in slide-in-from-left-2 duration-300">
          <button
            onClick={() => setShowTooltip(false)}
            aria-label="Close tooltip"
            className="text-stone-400 hover:text-stone-700 -ml-1 p-0.5 rounded-full hover:bg-stone-100 transition-colors"
          >
            <X className="w-3 h-3" />
          </button>
          <span>Hi, how can I help you?</span>
          <div className="absolute right-[-6px] top-1/2 -translate-y-1/2 w-2 h-2 bg-white border-t border-r border-stone-200 rotate-45" />
        </div>
      )}

      {/* Floating WhatsApp Action Button */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with S&Z Glam Collection on WhatsApp"
        className="relative group w-13 h-13 rounded-full bg-[#25D366] hover:bg-[#20bd5a] text-white flex items-center justify-center shadow-[0_6px_25px_rgba(37,211,102,0.4)] hover:scale-105 active:scale-95 transition-all duration-300"
      >
        <MessageCircle className="w-7 h-7 fill-white text-[#25D366]" />

        {/* Unread message badge "1" */}
        <span className="absolute -top-1 -right-1 w-5 h-5 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white shadow-sm">
          1
        </span>
      </a>
    </aside>
  );
}
