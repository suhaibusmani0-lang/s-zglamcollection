'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import confetti from 'canvas-confetti';
import {
  Play, Plus, RotateCcw, Award, CheckCircle2, XCircle,
  Eye, Download, Lock, Video, DollarSign, Clock, Users,
  Trash2, Sparkles, ExternalLink
} from 'lucide-react';
import { LiveShow, PaymentEntry, PaymentAccountSettings } from '@/lib/types';

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [authError, setAuthError] = useState('');

  // Host Data State
  const [show, setShow] = useState<LiveShow | null>(null);
  const [entries, setEntries] = useState<PaymentEntry[]>([]);
  const [settings, setSettings] = useState<PaymentAccountSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'TIMER_PRIZE' | 'SUBMISSIONS' | 'SETTINGS'>('TIMER_PRIZE');

  // Receipt Modal
  const [viewingReceipt, setViewingReceipt] = useState<string | null>(null);

  // Winner animation state
  const [isPickingWinner, setIsPickingWinner] = useState(false);
  const [pickedWinnerMsg, setPickedWinnerMsg] = useState<string | null>(null);

  // Manual payment modal
  const [showManualModal, setShowManualModal] = useState(false);
  const [manualHandle, setManualHandle] = useState('');
  const [manualName, setManualName] = useState('');
  const [manualAmount, setManualAmount] = useState('');
  const [manualMethod, setManualMethod] = useState<'ZELLE' | 'VENMO' | 'CASH_APP' | 'PAYPAL'>('ZELLE');

  // Prize Edit form
  const [prizeTitle, setPrizeTitle] = useState('');
  const [prizeValue, setPrizeValue] = useState(0);
  const [prizeImg, setPrizeImg] = useState('');
  const [prizeDesc, setPrizeDesc] = useState('');
  const [isSavingPrize, setIsSavingPrize] = useState(false);

  // Settings Edit form
  const [zelleEmail, setZelleEmail] = useState('');
  const [zellePhone, setZellePhone] = useState('');
  const [zelleName, setZelleName] = useState('');
  const [venmoHandle, setVenmoHandle] = useState('');
  const [cashAppTag, setCashAppTag] = useState('');
  const [isSavingSettings, setIsSavingSettings] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput === 'szglam2026' || pinInput === '1234') {
      setIsAuthenticated(true);
      setAuthError('');
      sessionStorage.setItem('sz_host_auth', 'true');
    } else {
      setAuthError('Incorrect Host PIN. Default is: szglam2026');
    }
  };

  useEffect(() => {
    if (sessionStorage.getItem('sz_host_auth') === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  const loadAdminData = async () => {
    try {
      setIsLoading(true);
      const [showRes, entriesRes, settingsRes] = await Promise.all([
        fetch('/api/show'),
        fetch('/api/admin/entries'),
        fetch('/api/settings')
      ]);

      const showData = await showRes.json();
      const entriesData = await entriesRes.json();
      const settingsData = await settingsRes.json();

      if (showData.success) {
        setShow(showData.show);
        setPrizeTitle(showData.show.featuredPrize.title);
        setPrizeValue(showData.show.featuredPrize.retailValue);
        setPrizeImg(showData.show.featuredPrize.imageUrl);
        setPrizeDesc(showData.show.featuredPrize.description);
      }
      if (entriesData.success) {
        setEntries(entriesData.entries || []);
      }
      if (settingsData.success) {
        setSettings(settingsData.settings);
        setZelleEmail(settingsData.settings.zelle.email);
        setZellePhone(settingsData.settings.zelle.phone);
        setZelleName(settingsData.settings.zelle.recipientName);
        setVenmoHandle(settingsData.settings.venmo.handle);
        setCashAppTag(settingsData.settings.cashApp.cashtag);
      }
    } catch (err) {
      console.error('Failed to load admin data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadAdminData();
      const interval = setInterval(loadAdminData, 10000);
      return () => clearInterval(interval);
    }
  }, [isAuthenticated]);

  // Timer Controls
  const handleStartTimer = async (mins = 30) => {
    try {
      const res = await fetch('/api/show', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'START_TIMER', durationMinutes: mins })
      });
      const data = await res.json();
      if (data.success) {
        setShow(data.show);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleExtendTimer = async (mins = 5) => {
    try {
      const res = await fetch('/api/show', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'EXTEND_TIMER', durationMinutes: mins })
      });
      const data = await res.json();
      if (data.success) {
        setShow(data.show);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleResetTimer = async () => {
    if (!confirm('Are you sure you want to stop/reset the live payment window?')) return;
    try {
      const res = await fetch('/api/show', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'RESET_TIMER' })
      });
      const data = await res.json();
      if (data.success) {
        setShow(data.show);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSetStatus = async (status: string) => {
    try {
      const res = await fetch('/api/show', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'UPDATE_STATUS', status })
      });
      const data = await res.json();
      if (data.success) {
        setShow(data.show);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Prize Update
  const handleSavePrize = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingPrize(true);
    try {
      const res = await fetch('/api/show', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'UPDATE_PRIZE',
          prize: {
            title: prizeTitle,
            retailValue: Number(prizeValue),
            imageUrl: prizeImg,
            description: prizeDesc
          }
        })
      });
      const data = await res.json();
      if (data.success) {
        setShow(data.show);
        alert('Giveaway Prize updated successfully!');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSavingPrize(false);
    }
  };

  // Entry Actions
  const handleStatusChange = async (id: string, status: 'APPROVED' | 'REJECTED') => {
    try {
      const res = await fetch('/api/admin/entries', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status })
      });
      const data = await res.json();
      if (data.success) {
        setEntries(prev => prev.map(e => (e.id === id ? { ...e, status, isEligibleForGiveaway: status === 'APPROVED' } : e)));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteEntry = async (id: string) => {
    if (!confirm('Are you sure you want to delete this payment submission?')) return;
    try {
      const res = await fetch(`/api/admin/entries?id=${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setEntries(prev => prev.filter(e => e.id !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Add Manual Entry
  const handleAddManual = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualHandle || !manualAmount) return;

    try {
      const res = await fetch('/api/entries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tiktokHandle: manualHandle,
          fullName: manualName || manualHandle,
          phone: '(000) 000-0000',
          amountPaid: parseFloat(manualAmount),
          paymentMethod: manualMethod,
          transactionReference: 'Manual Entry by Host',
          receiptUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?q=80&w=800&auto=format&fit=crop',
          shippingAddress: { street: 'Manual / Hold for Live', city: 'US', state: 'NY', zip: '10001' }
        })
      });
      const data = await res.json();
      if (data.success) {
        setEntries(prev => [data.entry, ...prev]);
        setShowManualModal(false);
        setManualHandle('');
        setManualName('');
        setManualAmount('');
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Pick Lucky Winner Engine
  const handlePickLuckyWinner = async () => {
    const approvedCount = entries.filter(e => e.status === 'APPROVED').length;
    if (approvedCount === 0) {
      alert('There are no approved entries. Please approve customer submissions before drawing.');
      return;
    }

    if (!confirm(`Are you ready to draw tonight's Lucky Winner among ${approvedCount} qualified customers?`)) return;

    setIsPickingWinner(true);
    setPickedWinnerMsg(null);

    try {
      const res = await fetch('/api/admin/pick-winner', { method: 'POST' });
      const data = await res.json();

      if (data.success) {
        confetti({
          particleCount: 200,
          spread: 100,
          origin: { y: 0.5 },
          colors: ['#d4af37', '#b8860b', '#10b981', '#f59e0b']
        });

        setShow(data.show);
        setPickedWinnerMsg(data.message);
        loadAdminData();
      } else {
        alert(data.error || 'Failed to pick winner.');
      }
    } catch (err: any) {
      alert(err.message || 'Error picking winner.');
    } finally {
      setIsPickingWinner(false);
    }
  };

  // Export CSV for Shipping Labels
  const handleExportCSV = () => {
    if (entries.length === 0) return alert('No orders to export.');

    const headers = ['Ticket #', 'TikTok Handle', 'Full Name', 'Phone', 'Email', 'Amount Paid', 'Payment Method', 'Street Address', 'Apt/Suite', 'City', 'State', 'ZIP', 'Status', 'Date'];
    const rows = entries.map(e => [
      e.ticketNumber,
      e.tiktokHandle,
      `"${e.fullName}"`,
      `"${e.phone}"`,
      e.email,
      e.amountPaid,
      e.paymentMethod,
      `"${e.shippingAddress?.street || ''}"`,
      `"${e.shippingAddress?.aptSuite || ''}"`,
      `"${e.shippingAddress?.city || ''}"`,
      e.shippingAddress?.state || '',
      e.shippingAddress?.zip || '',
      e.status,
      new Date(e.createdAt).toLocaleString()
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `SZ_Glam_Orders_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Save Settings
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingSettings(true);
    try {
      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          zelle: {
            ...settings?.zelle,
            email: zelleEmail,
            phone: zellePhone,
            recipientName: zelleName
          },
          venmo: {
            ...settings?.venmo,
            handle: venmoHandle
          },
          cashApp: {
            ...settings?.cashApp,
            cashtag: cashAppTag
          }
        })
      });
      const data = await res.json();
      if (data.success) {
        setSettings(data.settings);
        alert('Payment settings saved!');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSavingSettings(false);
    }
  };

  // If Not Authenticated, Show PIN Screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#faf7f2] flex items-center justify-center p-4 selection:bg-amber-100">
        <div className="rounded-3xl p-8 sm:p-10 max-w-sm w-full border border-stone-200/80 text-center shadow-xs bg-white space-y-4">
          <div className="w-12 h-12 rounded-full bg-[#fdf8ed] text-[#b8860b] flex items-center justify-center mx-auto mb-2">
            <Lock className="w-5 h-5" />
          </div>

          <div>
            <h2 className="font-heading text-2xl font-bold text-stone-900">S&amp;Z GLAM Admin</h2>
            <p className="text-stone-500 text-xs mt-1 font-normal">Sign in to manage the site</p>
          </div>

          {authError && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold">
              {authError}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-3 pt-2 text-left">
            <div>
              <input
                type="text"
                placeholder="Email"
                defaultValue="admin@szglam.com"
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 bg-stone-50/50 text-sm focus:border-amber-500 focus:bg-white focus:outline-none"
              />
            </div>
            <div>
              <input
                type="password"
                value={pinInput}
                onChange={e => setPinInput(e.target.value)}
                placeholder="Password (Default: szglam2026)"
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 bg-stone-50/50 text-sm focus:border-amber-500 focus:bg-white focus:outline-none"
                autoFocus
              />
            </div>
            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-[#d49e24] hover:bg-[#c28e1d] text-white font-bold text-sm tracking-wide shadow-xs transition-colors"
            >
              Sign In
            </button>
          </form>

          <div className="space-y-1.5 pt-2 text-xs text-stone-400">
            <div>
              <button
                type="button"
                onClick={() => alert('Default PIN / Password is: szglam2026')}
                className="hover:text-stone-600 transition-colors"
              >
                Forgot password?
              </button>
            </div>
            <div>
              <Link href="/" className="hover:text-stone-600 transition-colors">
                Back to home
              </Link>
            </div>
            <div className="pt-2 text-[10px] text-stone-400">
              <a
                href="https://www.zarnetic.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline"
              >
                Developed by Zarnetic
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const approvedEntries = entries.filter(e => e.status === 'APPROVED');
  const totalRevenue = entries
    .filter(e => e.status === 'APPROVED')
    .reduce((sum, e) => sum + e.amountPaid, 0);

  return (
    <div className="min-h-screen bg-[#fbf9f5] text-stone-900">
      {/* Admin Top Navigation */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-amber-200/80 px-4 sm:px-8 py-4 shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-amber-400">
              <Image src="/logo.png" alt="Logo" fill className="object-contain" />
            </div>
            <div>
              <span className="font-serif font-bold text-lg text-stone-900 tracking-wider">
                S&amp;Z GLAM <span className="text-amber-700 text-xs font-sans uppercase font-bold">Host Studio</span>
              </span>
              <p className="text-[10px] text-stone-500 font-medium">Live Show, Timer &amp; Giveaway Control Center</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/"
              target="_blank"
              className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-stone-50 border border-stone-300 text-xs font-bold text-stone-700 hover:text-amber-800 shadow-sm"
            >
              <span>View Public Site</span>
              <ExternalLink className="w-3 h-3 text-amber-600" />
            </Link>

            <button
              onClick={() => {
                sessionStorage.removeItem('sz_host_auth');
                setIsAuthenticated(false);
              }}
              className="px-3.5 py-1.5 rounded-full bg-red-50 border border-red-200 text-xs font-bold text-red-700 hover:bg-red-100"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Quick Metrics Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          <div className="glass-panel rounded-2xl p-4 border border-stone-200 bg-white shadow-sm">
            <span className="text-[11px] uppercase tracking-wider text-stone-500 block mb-1 font-semibold">Show Status</span>
            <span className="text-base font-bold text-amber-800 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-600 animate-ping" />
              {show?.status || 'OFFLINE'}
            </span>
          </div>

          <div className="glass-panel rounded-2xl p-4 border border-stone-200 bg-white shadow-sm">
            <span className="text-[11px] uppercase tracking-wider text-stone-500 block mb-1 font-semibold">Submissions</span>
            <span className="text-xl font-bold text-stone-900">
              {entries.length} Orders
            </span>
          </div>

          <div className="glass-panel rounded-2xl p-4 border border-stone-200 bg-white shadow-sm">
            <span className="text-[11px] uppercase tracking-wider text-stone-500 block mb-1 font-semibold">Qualified in Draw</span>
            <span className="text-xl font-bold text-emerald-700">
              {approvedEntries.length} Tickets
            </span>
          </div>

          <div className="glass-panel rounded-2xl p-4 border border-stone-200 bg-white shadow-sm">
            <span className="text-[11px] uppercase tracking-wider text-stone-500 block mb-1 font-semibold">Live Verified Total</span>
            <span className="text-xl font-bold text-amber-800">
              ${totalRevenue.toFixed(2)}
            </span>
          </div>
        </div>

        {/* Winner Announcement Notification */}
        {pickedWinnerMsg && (
          <div className="mb-8 p-6 rounded-3xl bg-amber-50 border-2 border-amber-300 text-center shadow-lg animate-in zoom-in-95">
            <Award className="w-10 h-10 text-amber-600 mx-auto mb-2 animate-bounce" />
            <h3 className="font-serif text-2xl font-bold text-stone-900 mb-1">Lucky Draw Complete!</h3>
            <p className="text-amber-900 text-sm font-bold">{pickedWinnerMsg}</p>
          </div>
        )}

        {/* Tab Selection */}
        <div className="flex items-center gap-2 mb-8 border-b border-stone-200 pb-4 flex-wrap">
          <button
            onClick={() => setActiveTab('TIMER_PRIZE')}
            className={`px-5 py-2.5 rounded-full text-xs font-bold tracking-wide transition-all ${
              activeTab === 'TIMER_PRIZE'
                ? 'bg-amber-500 text-stone-950 shadow-md'
                : 'bg-white text-stone-600 hover:text-stone-900 border border-stone-200 shadow-sm'
            }`}
          >
            ⏱️ 30-Min Timer &amp; Giveaway Setup
          </button>

          <button
            onClick={() => setActiveTab('SUBMISSIONS')}
            className={`px-5 py-2.5 rounded-full text-xs font-bold tracking-wide transition-all ${
              activeTab === 'SUBMISSIONS'
                ? 'bg-amber-500 text-stone-950 shadow-md'
                : 'bg-white text-stone-600 hover:text-stone-900 border border-stone-200 shadow-sm'
            }`}
          >
            📋 Customer Payment Submissions ({entries.length})
          </button>

          <button
            onClick={() => setActiveTab('SETTINGS')}
            className={`px-5 py-2.5 rounded-full text-xs font-bold tracking-wide transition-all ${
              activeTab === 'SETTINGS'
                ? 'bg-amber-500 text-stone-950 shadow-md'
                : 'bg-white text-stone-600 hover:text-stone-900 border border-stone-200 shadow-sm'
            }`}
          >
            ⚙️ Zelle &amp; Payment Settings
          </button>
        </div>

        {/* TAB 1: TIMER & GIVEAWAY PRIZE */}
        {activeTab === 'TIMER_PRIZE' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Live Timer Control Card */}
            <div className="lg:col-span-6 space-y-6">
              <div className="glass-panel-glow rounded-3xl p-6 sm:p-8 border-2 border-amber-300 shadow-xl bg-white">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-serif text-xl font-bold text-stone-900 flex items-center gap-2">
                    <Clock className="w-5 h-5 text-amber-600" />
                    <span>Live Show Timer Control</span>
                  </h3>
                  <span className="text-xs uppercase px-2.5 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-300 font-bold">
                    {show?.status}
                  </span>
                </div>

                <p className="text-stone-600 text-xs leading-relaxed mb-6 font-normal">
                  When you finish selling on TikTok Live and send out your customer bills, tap <strong>&quot;Start 30-Minute Payment Window&quot;</strong>. This activates the synchronized countdown on the website!
                </p>

                {/* Big Action Buttons */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                  <button
                    onClick={() => handleStartTimer(30)}
                    className="py-4 px-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold text-sm uppercase tracking-wider hover:opacity-95 shadow-md flex items-center justify-center gap-2"
                  >
                    <Play className="w-4 h-4 fill-current" />
                    <span>Start 30-Min Window</span>
                  </button>

                  <button
                    onClick={() => handleExtendTimer(5)}
                    className="py-4 px-4 rounded-2xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 font-bold text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-sm"
                  >
                    <Plus className="w-4 h-4" />
                    <span>+5 Mins Extension</span>
                  </button>

                  <button
                    onClick={() => handleSetStatus('LIVE_NOW')}
                    className="py-3 px-4 rounded-2xl bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 font-bold text-xs uppercase flex items-center justify-center gap-2"
                  >
                    <Video className="w-4 h-4" />
                    <span>Set &apos;Live on TikTok&apos;</span>
                  </button>

                  <button
                    onClick={handleResetTimer}
                    className="py-3 px-4 rounded-2xl bg-stone-50 hover:bg-stone-100 text-stone-700 border border-stone-300 font-bold text-xs uppercase flex items-center justify-center gap-2"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>Stop / Reset Timer</span>
                  </button>
                </div>

                {/* Pick Winner Button */}
                <div className="pt-6 border-t border-stone-200">
                  <button
                    onClick={handlePickLuckyWinner}
                    disabled={isPickingWinner || approvedEntries.length === 0}
                    className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 text-stone-950 font-extrabold text-base uppercase tracking-wider shadow-lg hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
                  >
                    <Sparkles className="w-5 h-5 fill-current" />
                    <span>{isPickingWinner ? 'Drawing Winner Live...' : `Spin & Pick Winner (${approvedEntries.length} In Draw)`}</span>
                  </button>
                  <p className="text-center text-[11px] text-stone-500 mt-2 font-medium">
                    Fair, verifiable RNG automatically selects one customer among verified payments.
                  </p>
                </div>
              </div>
            </div>

            {/* Tonight's Prize Editor */}
            <div className="lg:col-span-6">
              <div className="glass-panel-glow rounded-3xl p-6 sm:p-8 border-2 border-amber-300 shadow-xl bg-white">
                <h3 className="font-serif text-xl font-bold text-stone-900 mb-2 flex items-center gap-2">
                  <Award className="w-5 h-5 text-amber-600" />
                  <span>Tonight&apos;s Giveaway Prize Details</span>
                </h3>
                <p className="text-stone-600 text-xs mb-6 font-normal">
                  Announce the prize you are giving away tonight on TikTok live.
                </p>

                <form onSubmit={handleSavePrize} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">Prize Title</label>
                    <input
                      type="text"
                      value={prizeTitle}
                      onChange={e => setPrizeTitle(e.target.value)}
                      required
                      className="w-full px-4 py-2.5 rounded-xl bg-stone-50 border border-stone-300 text-stone-900 text-sm focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-stone-700 mb-1">Retail Value ($)</label>
                      <input
                        type="number"
                        value={prizeValue}
                        onChange={e => setPrizeValue(Number(e.target.value))}
                        required
                        className="w-full px-4 py-2.5 rounded-xl bg-stone-50 border border-stone-300 text-stone-900 text-sm font-mono focus:outline-none focus:border-amber-500 font-bold"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-stone-700 mb-1">Prize Photo URL</label>
                      <input
                        type="url"
                        value={prizeImg}
                        onChange={e => setPrizeImg(e.target.value)}
                        required
                        className="w-full px-4 py-2.5 rounded-xl bg-stone-50 border border-stone-300 text-stone-900 text-xs font-mono focus:outline-none focus:border-amber-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">Description</label>
                    <textarea
                      rows={3}
                      value={prizeDesc}
                      onChange={e => setPrizeDesc(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-stone-50 border border-stone-300 text-stone-900 text-sm focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSavingPrize}
                    className="w-full py-3 rounded-xl bg-stone-100 hover:bg-amber-100 text-amber-900 border border-amber-300 font-bold text-xs uppercase tracking-wider transition-colors shadow-sm"
                  >
                    {isSavingPrize ? 'Saving...' : 'Update Prize on Website'}
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: CUSTOMER SUBMISSIONS */}
        {activeTab === 'SUBMISSIONS' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h3 className="font-serif text-2xl font-bold text-stone-900">
                  Payment Submissions ({entries.length})
                </h3>
                <p className="text-stone-600 text-xs font-normal">
                  Review payment receipts uploaded by customers and approve for the giveaway draw.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => setShowManualModal(true)}
                  className="px-4 py-2 rounded-full bg-white hover:bg-stone-50 text-amber-900 border border-amber-300 text-xs font-bold flex items-center gap-1.5 shadow-sm"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Manual Payment</span>
                </button>

                <button
                  onClick={handleExportCSV}
                  className="px-4 py-2 rounded-full bg-amber-500 text-stone-950 text-xs font-bold flex items-center gap-1.5 shadow-md hover:bg-amber-400"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Export CSV (USPS Shipping)</span>
                </button>
              </div>
            </div>

            {/* Submissions Table */}
            <div className="glass-panel rounded-3xl overflow-hidden border border-stone-200 bg-white shadow-md">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-stone-700">
                  <thead className="bg-stone-50 text-stone-600 uppercase font-mono text-[10px] tracking-wider border-b border-stone-200">
                    <tr>
                      <th className="py-3 px-4 font-bold">Ticket #</th>
                      <th className="py-3 px-4 font-bold">TikTok Username</th>
                      <th className="py-3 px-4 font-bold">Customer</th>
                      <th className="py-3 px-4 font-bold">Paid</th>
                      <th className="py-3 px-4 font-bold">Method</th>
                      <th className="py-3 px-4 font-bold">Receipt</th>
                      <th className="py-3 px-4 font-bold">US Shipping</th>
                      <th className="py-3 px-4 font-bold">Status</th>
                      <th className="py-3 px-4 text-right font-bold">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {entries.length === 0 ? (
                      <tr>
                        <td colSpan={9} className="py-8 text-center text-stone-500 text-xs font-medium">
                          No payments registered yet. They will appear here in real-time as customers submit.
                        </td>
                      </tr>
                    ) : (
                      entries.map(entry => (
                        <tr key={entry.id} className="hover:bg-amber-50/40 transition-colors">
                          <td className="py-3 px-4 font-mono font-bold text-amber-900">
                            {entry.ticketNumber}
                          </td>
                          <td className="py-3 px-4 font-bold text-stone-900">
                            {entry.tiktokHandle}
                          </td>
                          <td className="py-3 px-4">
                            <span className="font-semibold text-stone-900 block">{entry.fullName}</span>
                            <span className="text-[10px] text-stone-500 font-mono">{entry.phone}</span>
                          </td>
                          <td className="py-3 px-4 font-mono font-bold text-emerald-700 text-sm">
                            ${entry.amountPaid.toFixed(2)}
                          </td>
                          <td className="py-3 px-4">
                            <span className="px-2 py-0.5 rounded bg-stone-100 text-stone-800 font-mono text-[10px] border border-stone-200 font-semibold">
                              {entry.paymentMethod}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            {entry.receiptUrl ? (
                              <button
                                onClick={() => setViewingReceipt(entry.receiptUrl)}
                                className="inline-flex items-center gap-1 text-[11px] text-amber-800 hover:underline font-semibold"
                              >
                                <Eye className="w-3.5 h-3.5 text-amber-600" />
                                <span>View Receipt</span>
                              </button>
                            ) : (
                              <span className="text-stone-400">None</span>
                            )}
                          </td>
                          <td className="py-3 px-4 max-w-[180px] truncate text-[11px] text-stone-600">
                            {entry.shippingAddress?.street}, {entry.shippingAddress?.city}, {entry.shippingAddress?.state} {entry.shippingAddress?.zip}
                          </td>
                          <td className="py-3 px-4">
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                entry.status === 'APPROVED'
                                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-300'
                                  : entry.status === 'REJECTED'
                                  ? 'bg-red-50 text-red-700 border border-red-200'
                                  : 'bg-amber-50 text-amber-800 border border-amber-300'
                              }`}
                            >
                              {entry.status}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-right space-x-1.5 whitespace-nowrap">
                            {entry.status !== 'APPROVED' && (
                              <button
                                onClick={() => handleStatusChange(entry.id, 'APPROVED')}
                                className="p-1 rounded bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-300 shadow-sm"
                                title="Approve & Enter in Giveaway"
                              >
                                <CheckCircle2 className="w-4 h-4" />
                              </button>
                            )}

                            {entry.status !== 'REJECTED' && (
                              <button
                                onClick={() => handleStatusChange(entry.id, 'REJECTED')}
                                className="p-1 rounded bg-stone-100 hover:bg-red-50 text-stone-600 hover:text-red-700 border border-stone-200 shadow-sm"
                                title="Reject"
                              >
                                <XCircle className="w-4 h-4" />
                              </button>
                            )}

                            <button
                              onClick={() => handleDeleteEntry(entry.id)}
                              className="p-1 rounded bg-stone-100 hover:bg-red-50 text-stone-400 hover:text-red-600 border border-stone-200 shadow-sm"
                              title="Delete"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: PAYMENT SETTINGS */}
        {activeTab === 'SETTINGS' && (
          <div className="max-w-2xl mx-auto">
            <div className="glass-panel-glow rounded-3xl p-6 sm:p-8 border-2 border-amber-300 shadow-xl bg-white">
              <h3 className="font-serif text-xl font-bold text-stone-900 mb-2">
                US Payment Account Handles
              </h3>
              <p className="text-stone-600 text-xs mb-6 font-normal">
                These details will be shown to your customers on the payment instructions screen.
              </p>

              <form onSubmit={handleSaveSettings} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Zelle Recipient Name</label>
                  <input
                    type="text"
                    value={zelleName}
                    onChange={e => setZelleName(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-stone-50 border border-stone-300 text-stone-900 text-sm focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">Zelle Email</label>
                    <input
                      type="email"
                      value={zelleEmail}
                      onChange={e => setZelleEmail(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-stone-50 border border-stone-300 text-stone-900 text-sm focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">Zelle Phone Number</label>
                    <input
                      type="text"
                      value={zellePhone}
                      onChange={e => setZellePhone(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-stone-50 border border-stone-300 text-stone-900 text-sm font-mono focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">Venmo Handle</label>
                    <input
                      type="text"
                      value={venmoHandle}
                      onChange={e => setVenmoHandle(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-stone-50 border border-stone-300 text-stone-900 text-sm focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">Cash App $Cashtag</label>
                    <input
                      type="text"
                      value={cashAppTag}
                      onChange={e => setCashAppTag(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-stone-50 border border-stone-300 text-stone-900 text-sm focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSavingSettings}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-stone-950 font-bold text-xs uppercase tracking-wider hover:opacity-95 shadow-md"
                >
                  {isSavingSettings ? 'Saving...' : 'Save Payment Settings'}
                </button>
              </form>
            </div>
          </div>
        )}
      </main>

      {/* Modal: Receipt Lightbox */}
      {viewingReceipt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="relative max-w-2xl w-full bg-white rounded-2xl p-4 border border-amber-300 shadow-2xl">
            <button
              onClick={() => setViewingReceipt(null)}
              className="absolute top-3 right-3 p-2 rounded-full bg-stone-100 text-stone-600 hover:text-stone-900"
            >
              <XCircle className="w-6 h-6" />
            </button>
            <h4 className="text-sm font-bold text-stone-900 mb-3">Customer Payment Screenshot</h4>
            <div className="relative max-h-[80vh] overflow-auto rounded-xl border border-stone-200">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={viewingReceipt} alt="Receipt proof" className="w-full object-contain mx-auto" />
            </div>
          </div>
        </div>
      )}

      {/* Modal: Manual Payment Entry */}
      {showManualModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="glass-panel-glow rounded-3xl p-6 sm:p-8 max-w-md w-full border-2 border-amber-300 bg-white shadow-xl">
            <h3 className="font-serif text-xl font-bold text-stone-900 mb-1">Add Manual Payment</h3>
            <p className="text-xs text-stone-500 mb-4 font-medium">Add a customer who paid via direct message or cash during the live.</p>

            <form onSubmit={handleAddManual} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">TikTok Handle</label>
                <input
                  type="text"
                  value={manualHandle}
                  onChange={e => setManualHandle(e.target.value)}
                  placeholder="@customer_handle"
                  required
                  className="w-full px-4 py-2.5 rounded-xl bg-stone-50 border border-stone-300 text-stone-900 text-sm focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Customer Name</label>
                <input
                  type="text"
                  value={manualName}
                  onChange={e => setManualName(e.target.value)}
                  placeholder="Full Name"
                  className="w-full px-4 py-2.5 rounded-xl bg-stone-50 border border-stone-300 text-stone-900 text-sm focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Amount ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={manualAmount}
                    onChange={e => setManualAmount(e.target.value)}
                    placeholder="75.00"
                    required
                    className="w-full px-4 py-2.5 rounded-xl bg-stone-50 border border-stone-300 text-stone-900 text-sm font-mono focus:outline-none focus:border-amber-500 font-bold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Method</label>
                  <select
                    value={manualMethod}
                    onChange={e => setManualMethod(e.target.value as any)}
                    className="w-full px-4 py-2.5 rounded-xl bg-stone-50 border border-stone-300 text-stone-900 text-sm focus:outline-none focus:border-amber-500 font-medium"
                  >
                    <option value="ZELLE">Zelle</option>
                    <option value="VENMO">Venmo</option>
                    <option value="CASH_APP">Cash App</option>
                    <option value="PAYPAL">PayPal</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowManualModal(false)}
                  className="px-4 py-2 rounded-xl bg-stone-100 text-stone-600 text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-500 text-stone-950 text-xs font-bold uppercase tracking-wider shadow-sm hover:bg-amber-400"
                >
                  Save &amp; Enter Ticket
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Admin Footer */}
      <footer className="mt-20 pt-8 pb-12 border-t border-stone-200 text-center text-xs text-stone-600">
        <p>
          SZ GLAM Live Show Management Studio •{' '}
          <a
            href="https://www.zarnetic.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-amber-800 font-semibold hover:text-amber-900 underline transition-colors"
          >
            Developed by Zarnetic
          </a>
        </p>
      </footer>
    </div>
  );
}
