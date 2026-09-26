'use client';

import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { UploadCloud, CheckCircle2, Ticket, Sparkles, Loader2, ShieldCheck } from 'lucide-react';
import { PaymentMethod } from '@/lib/types';

interface PaymentRegistrationFormProps {
  onEntrySuccess?: (newEntry: any) => void;
}

const US_STATES = [
  'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA',
  'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD',
  'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ',
  'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC',
  'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY'
];

export default function PaymentRegistrationForm({ onEntrySuccess }: PaymentRegistrationFormProps) {
  const [tiktokHandle, setTiktokHandle] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [amountPaid, setAmountPaid] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('ZELLE');
  const [transactionRef, setTransactionRef] = useState('');
  const [receiptImage, setReceiptImage] = useState<string | null>(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  // Address
  const [street, setStreet] = useState('');
  const [aptSuite, setAptSuite] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('NY');
  const [zip, setZip] = useState('');

  // Submission state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [submittedTicket, setSubmittedTicket] = useState<any | null>(null);

  // Handle US phone format
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let input = e.target.value.replace(/\D/g, '');
    if (input.length > 10) input = input.substring(0, 10);

    let formatted = input;
    if (input.length > 6) {
      formatted = `(${input.substring(0, 3)}) ${input.substring(3, 6)}-${input.substring(6)}`;
    } else if (input.length > 3) {
      formatted = `(${input.substring(0, 3)}) ${input.substring(3)}`;
    } else if (input.length > 0) {
      formatted = `(${input}`;
    }
    setPhone(formatted);
  };

  // Image Upload handler (Cloudinary API integration)
  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      alert('File size exceeds 10MB. Please upload a smaller screenshot.');
      return;
    }

    setIsUploadingImage(true);
    setErrorMessage('');

    const reader = new FileReader();
    reader.onload = async () => {
      try {
        const base64Data = reader.result as string;
        const res = await fetch('/api/upload', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ image: base64Data, folder: 'sz_glam_receipts' })
        });
        const data = await res.json();
        if (data.success && data.url) {
          setReceiptImage(data.url);
        } else {
          setReceiptImage(base64Data);
        }
      } catch (err) {
        console.error('Image upload failed:', err);
        setReceiptImage(reader.result as string);
      } finally {
        setIsUploadingImage(false);
      }
    };
    reader.readAsDataURL(file);
  };

  // Form submit handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!tiktokHandle.trim()) {
      setErrorMessage('Please enter your TikTok username.');
      return;
    }
    if (!fullName.trim()) {
      setErrorMessage('Please enter your full name.');
      return;
    }
    if (!phone.trim()) {
      setErrorMessage('Please enter a valid US phone number.');
      return;
    }
    if (!amountPaid || parseFloat(amountPaid) <= 0) {
      setErrorMessage('Please enter the total amount you paid ($).');
      return;
    }
    if (!receiptImage) {
      setErrorMessage('Please upload a screenshot or photo of your payment receipt.');
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch('/api/entries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tiktokHandle: tiktokHandle.startsWith('@') ? tiktokHandle : `@${tiktokHandle}`,
          fullName,
          phone,
          email,
          amountPaid: parseFloat(amountPaid),
          paymentMethod,
          transactionReference: transactionRef,
          receiptUrl: receiptImage,
          shippingAddress: {
            street,
            aptSuite,
            city,
            state,
            zip
          }
        })
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to submit payment verification.');
      }

      // Fire celebratory confetti!
      confetti({
        particleCount: 120,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#d4af37', '#b8860b', '#f59e0b', '#10b981']
      });

      setSubmittedTicket(data.entry);
      if (onEntrySuccess) {
        onEntrySuccess(data.entry);
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'An error occurred while submitting.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="register" className="py-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-100 text-amber-900 border border-amber-300 text-xs font-bold uppercase tracking-widest mb-3">
          <Ticket className="w-3.5 h-3.5 text-amber-600" />
          <span>Step 2: Register Payment &amp; Enter Lucky Draw</span>
        </div>
        <h2 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900 mb-2">
          Verify Payment &amp; Claim Lucky Ticket
        </h2>
        <p className="text-stone-600 text-sm max-w-lg mx-auto font-normal">
          Fill out this form to register your payment before the 30-minute timer expires. You will receive an instant Lucky Ticket #!
        </p>
      </div>

      <div className="glass-panel-glow rounded-3xl p-6 sm:p-10 border-2 border-amber-300 shadow-xl relative bg-white">
        {/* Error notification */}
        {errorMessage && (
          <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-center gap-3">
            <span className="font-bold">Error:</span> {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Section: Customer Live Identity */}
          <div className="border-b border-stone-100 pb-6">
            <h3 className="text-amber-800 font-bold text-sm uppercase tracking-wider mb-4 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-600" />
              <span>TikTok &amp; Contact Details</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* TikTok Username */}
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                  TikTok Handle <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400 text-sm font-mono">
                    @
                  </span>
                  <input
                    type="text"
                    value={tiktokHandle.replace(/^@/, '')}
                    onChange={e => setTiktokHandle(e.target.value)}
                    placeholder="e.g. anita_k_glam"
                    required
                    className="w-full pl-8 pr-4 py-3 rounded-xl bg-stone-50 border border-stone-300 text-stone-900 placeholder-stone-400 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 text-sm transition-colors"
                  />
                </div>
                <p className="text-[11px] text-stone-500 mt-1">Must match the account used to claim on live.</p>
              </div>

              {/* Full Name */}
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={e => setFullName(e.target.value)}
                  placeholder="e.g. Anita Patel"
                  required
                  className="w-full px-4 py-3 rounded-xl bg-stone-50 border border-stone-300 text-stone-900 placeholder-stone-400 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 text-sm transition-colors"
                />
              </div>

              {/* US Phone */}
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                  US Phone Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={handlePhoneChange}
                  placeholder="(555) 000-0000"
                  required
                  className="w-full px-4 py-3 rounded-xl bg-stone-50 border border-stone-300 text-stone-900 placeholder-stone-400 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 text-sm font-mono transition-colors"
                />
                <p className="text-[11px] text-stone-500 mt-1">For USPS delivery updates &amp; winner notification.</p>
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                  Email Address <span className="text-stone-400 font-normal">(Optional)</span>
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full px-4 py-3 rounded-xl bg-stone-50 border border-stone-300 text-stone-900 placeholder-stone-400 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 text-sm transition-colors"
                />
              </div>
            </div>
          </div>

          {/* Section: Payment Verification Details */}
          <div className="border-b border-stone-100 pb-6">
            <h3 className="text-amber-800 font-bold text-sm uppercase tracking-wider mb-4 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Payment Details &amp; Receipt Upload</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              {/* Amount Paid */}
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                  Total Amount Paid ($ USD) <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-500 text-base font-bold">
                    $
                  </span>
                  <input
                    type="number"
                    step="0.01"
                    min="1"
                    value={amountPaid}
                    onChange={e => setAmountPaid(e.target.value)}
                    placeholder="85.00"
                    required
                    className="w-full pl-8 pr-4 py-3 rounded-xl bg-stone-50 border border-stone-300 text-stone-900 placeholder-stone-400 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 text-sm font-mono font-bold transition-colors"
                  />
                </div>
              </div>

              {/* Payment Method */}
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                  Payment Method Used <span className="text-red-500">*</span>
                </label>
                <select
                  value={paymentMethod}
                  onChange={e => setPaymentMethod(e.target.value as PaymentMethod)}
                  className="w-full px-4 py-3 rounded-xl bg-stone-50 border border-stone-300 text-stone-900 focus:outline-none focus:border-amber-500 text-sm font-medium"
                >
                  <option value="ZELLE">Zelle Transfer</option>
                  <option value="VENMO">Venmo</option>
                  <option value="CASH_APP">Cash App</option>
                  <option value="PAYPAL">PayPal</option>
                  <option value="APPLE_CASH">Apple Cash</option>
                </select>
              </div>
            </div>

            {/* Transaction Ref / Memo */}
            <div className="mb-4">
              <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                Transaction Reference / Memo Note <span className="text-stone-400 font-normal">(Optional)</span>
              </label>
              <input
                type="text"
                value={transactionRef}
                onChange={e => setTransactionRef(e.target.value)}
                placeholder="e.g. Zelle Confirmation #94012 or Kundan Choker Set"
                className="w-full px-4 py-3 rounded-xl bg-stone-50 border border-stone-300 text-stone-900 placeholder-stone-400 focus:outline-none focus:border-amber-500 text-sm"
              />
            </div>

            {/* Cloudinary Screenshot Upload */}
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                Upload Payment Screenshot / Receipt <span className="text-red-500">*</span>
              </label>
              
              <div className="border-2 border-dashed border-amber-300 hover:border-amber-500 rounded-2xl p-4 sm:p-6 text-center bg-amber-50/30 transition-colors">
                {receiptImage ? (
                  <div className="space-y-3">
                    <div className="relative w-48 h-48 mx-auto rounded-xl overflow-hidden border border-amber-300 shadow-md">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={receiptImage}
                        alt="Uploaded payment proof"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex items-center justify-center gap-2 text-xs text-emerald-700 font-bold">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>Receipt Uploaded to Cloudinary</span>
                    </div>
                    <label className="inline-block text-xs text-amber-800 underline cursor-pointer hover:text-amber-900 font-semibold">
                      Change Screenshot
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                      />
                    </label>
                  </div>
                ) : (
                  <div>
                    {isUploadingImage ? (
                      <div className="py-6 flex flex-col items-center gap-2">
                        <Loader2 className="w-8 h-8 text-amber-600 animate-spin" />
                        <span className="text-xs text-amber-800 font-semibold">Uploading to Cloudinary CDN...</span>
                      </div>
                    ) : (
                      <label className="cursor-pointer block py-4">
                        <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center mx-auto mb-3 border border-amber-200">
                          <UploadCloud className="w-6 h-6" />
                        </div>
                        <span className="text-sm font-bold text-stone-900 block mb-1">
                          Tap to Upload Payment Proof
                        </span>
                        <span className="text-xs text-stone-500 block mb-3">
                          PNG, JPG, or screenshot from your mobile banking app
                        </span>
                        <span className="inline-block px-4 py-2 rounded-full bg-white text-stone-800 border border-stone-300 text-xs font-bold shadow-sm hover:bg-stone-50">
                          Choose File
                        </span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageChange}
                          required
                          className="hidden"
                        />
                      </label>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Section: US Shipping Address */}
          <div>
            <h3 className="text-amber-800 font-bold text-sm uppercase tracking-wider mb-4 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-600" />
              <span>US Shipping Address</span>
            </h3>

            <div className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <input
                    type="text"
                    value={street}
                    onChange={e => setStreet(e.target.value)}
                    placeholder="Street Address (e.g. 142 Main St)"
                    required
                    className="w-full px-4 py-3 rounded-xl bg-stone-50 border border-stone-300 text-stone-900 placeholder-stone-400 focus:outline-none focus:border-amber-500 text-sm"
                  />
                </div>
                <div>
                  <input
                    type="text"
                    value={aptSuite}
                    onChange={e => setAptSuite(e.target.value)}
                    placeholder="Apt / Suite / Unit"
                    className="w-full px-4 py-3 rounded-xl bg-stone-50 border border-stone-300 text-stone-900 placeholder-stone-400 focus:outline-none focus:border-amber-500 text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <input
                    type="text"
                    value={city}
                    onChange={e => setCity(e.target.value)}
                    placeholder="City"
                    required
                    className="w-full px-4 py-3 rounded-xl bg-stone-50 border border-stone-300 text-stone-900 placeholder-stone-400 focus:outline-none focus:border-amber-500 text-sm"
                  />
                </div>
                <div>
                  <select
                    value={state}
                    onChange={e => setState(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-stone-50 border border-stone-300 text-stone-900 focus:outline-none focus:border-amber-500 text-sm font-medium"
                  >
                    {US_STATES.map(st => (
                      <option key={st} value={st}>
                        {st}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <input
                    type="text"
                    value={zip}
                    onChange={e => setZip(e.target.value.replace(/\D/g, '').substring(0, 5))}
                    placeholder="5-digit ZIP"
                    required
                    className="w-full px-4 py-3 rounded-xl bg-stone-50 border border-stone-300 text-stone-900 placeholder-stone-400 focus:outline-none focus:border-amber-500 text-sm font-mono"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={isSubmitting || isUploadingImage}
              className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 text-stone-950 font-bold text-base uppercase tracking-wider shadow-[0_4px_20px_rgba(212,175,55,0.4)] hover:shadow-[0_6px_25px_rgba(212,175,55,0.6)] hover:scale-[1.01] active:scale-[0.99] transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Generating Lucky Ticket...</span>
                </>
              ) : (
                <>
                  <Ticket className="w-5 h-5" />
                  <span>Submit Payment &amp; Get Lucky Ticket</span>
                </>
              )}
            </button>
            <p className="text-center text-[11px] text-stone-500 mt-2 font-medium">
              🔒 Your payment is secured and directly reviewed by the S&amp;Z Glam live team.
            </p>
          </div>
        </form>
      </div>

      {/* Instant Lucky Ticket Modal (Light Theme) */}
      {submittedTicket && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="glass-panel-glow rounded-3xl p-6 sm:p-8 max-w-md w-full border-2 border-amber-300 relative text-center bg-white shadow-2xl">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 text-stone-950 flex items-center justify-center mx-auto mb-4 shadow-md">
              <Sparkles className="w-8 h-8" />
            </div>

            <span className="text-xs uppercase tracking-widest text-emerald-700 font-bold block mb-1">
              Payment Registered Successfully!
            </span>
            <h3 className="font-serif text-2xl font-bold text-stone-900 mb-2">
              You&apos;re In Tonight&apos;s Draw!
            </h3>
            <p className="text-stone-600 text-xs mb-6 font-normal">
              Save or screenshot your Lucky Ticket Number. The host will spin the wheel live on TikTok stream!
            </p>

            {/* Ticket Card */}
            <div className="p-6 rounded-2xl bg-amber-50/60 border border-amber-300 shadow-inner mb-6 relative overflow-hidden text-stone-900">
              <span className="text-[11px] uppercase tracking-widest text-stone-500 block mb-1 font-semibold">
                Your Official Lucky Ticket Number
              </span>
              <span className="font-mono text-3xl sm:text-4xl font-black text-amber-900 tracking-wider block mb-2">
                {submittedTicket.ticketNumber}
              </span>
              <div className="text-xs text-stone-700 font-medium space-y-0.5">
                <p>TikTok: <strong className="text-stone-900">{submittedTicket.tiktokHandle}</strong></p>
                <p>Customer: <strong className="text-stone-900">{submittedTicket.fullName}</strong></p>
                <p>Amount: <strong className="text-emerald-700">${submittedTicket.amountPaid?.toFixed(2)}</strong> via {submittedTicket.paymentMethod}</p>
              </div>
            </div>

            <button
              onClick={() => setSubmittedTicket(null)}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-stone-950 font-bold text-sm tracking-wide uppercase hover:opacity-95 transition-opacity"
            >
              Done &amp; Watch Live Stream
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
