import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const TransportPage = () => {
  const navigate = useNavigate();
  const [mode, setMode] = useState<'college' | 'public'>('college');

  return (
    <div className="flex flex-col h-full fade-in">
      {/* Header */}
      <header className="sticky top-0 z-30 px-5 pt-6 pb-2 transition-all duration-300">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[28px]">location_on</span>
            <div className="flex flex-col">
              <span className="text-xs font-semibold text-text-muted uppercase tracking-wider">Current Zone</span>
              <span className="text-[#101419] text-sm font-bold leading-none">Main Gate</span>
            </div>
          </div>
          <button className="relative flex h-10 w-10 items-center justify-center rounded-full bg-white/40 border border-white/50 backdrop-blur-md shadow-sm hover:bg-white/60 transition-colors">
            <span className="material-symbols-outlined text-primary">notifications</span>
            <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-red-500 border border-white"></span>
          </button>
        </div>
        <div className="mt-4 flex items-center justify-between">
          <h1 className="text-2xl font-extrabold text-[#101419] tracking-tight">Campus Transit</h1>
          <button className="text-primary text-sm font-bold hover:underline">View Map</button>
        </div>
      </header>

      {/* Toggle Switch */}
      <div className="px-4 py-3 sticky top-[100px] z-20">
        <div className="glass-panel rounded-full p-1.5 flex h-14 relative">
          <button
            onClick={() => setMode('college')}
            className={`flex-1 relative z-10 h-full flex items-center justify-center rounded-full text-sm font-bold transition-all duration-300 ${mode === 'college'
                ? 'text-primary bg-white/90 shadow-md'
                : 'text-text-muted hover:text-primary'
              }`}
          >
            <span className="material-symbols-outlined mr-2 text-[20px]">school</span>
            College
          </button>
          <button
            onClick={() => setMode('public')}
            className={`flex-1 relative z-10 h-full flex items-center justify-center rounded-full text-sm font-bold transition-all duration-300 ${mode === 'public'
                ? 'text-primary bg-white/90 shadow-md'
                : 'text-text-muted hover:text-primary'
              }`}
          >
            <span className="material-symbols-outlined mr-2 text-[20px]">directions_bus</span>
            Public
          </button>
        </div>
      </div>

      {/* Status Meta */}
      <div className="px-4 py-2 text-center">
        <p className="inline-flex items-center justify-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-semibold text-primary backdrop-blur-sm border border-primary/10">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-primary"></span>
          </span>
          3 Shuttles active nearby
        </p>
      </div>

      {/* Scrollable Content */}
      <main className="flex flex-col gap-5 px-4 pt-2 pb-24">
        {/* Active Route Card (Detailed) */}
        <div className="glass-panel rounded-3xl p-0 overflow-hidden group">
          {/* Header of Card */}
          <div className="p-5 pb-0">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary text-white shadow-lg shadow-primary/30">
                  <span className="material-symbols-outlined text-2xl">directions_bus</span>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[#101419] leading-tight">Dormitory Express</h3>
                  <p className="text-text-muted text-sm font-medium">Route 4A • 85% Full</p>
                </div>
              </div>
              <div className="flex flex-col items-end">
                <span className="text-xl font-bold text-primary">4 min</span>
                <span className="text-xs font-semibold text-text-muted">Arriving</span>
              </div>
            </div>
          </div>

          {/* Soft Roadmap Timeline */}
          <div className="relative px-5 py-6">
            {/* Vertical Line */}
            <div className="absolute left-[38px] top-6 bottom-6 w-0.5 bg-gradient-to-b from-primary/20 via-primary/50 to-primary/20"></div>

            {/* Stops */}
            <div className="flex flex-col gap-6 relative">
              {/* Stop 1 */}
              <div className="flex items-center gap-4">
                <div className="z-10 flex h-3 w-3 shrink-0 items-center justify-center rounded-full bg-white ring-4 ring-primary/20">
                  <div className="h-1.5 w-1.5 rounded-full bg-primary"></div>
                </div>
                <div className="flex flex-1 justify-between items-center">
                  <p className="text-sm font-bold text-[#101419]">Main Gate</p>
                  <span className="text-xs font-medium text-text-muted">Now</span>
                </div>
              </div>

              {/* Stop 2 */}
              <div className="flex items-center gap-4">
                <div className="z-10 flex h-3 w-3 shrink-0 items-center justify-center rounded-full bg-white ring-4 ring-secondary/20">
                  <div className="h-1.5 w-1.5 rounded-full bg-secondary"></div>
                </div>
                <div className="flex flex-1 justify-between items-center">
                  <p className="text-sm font-medium text-slate-600">Library Circle</p>
                  <span className="text-xs font-medium text-text-muted">+2m</span>
                </div>
              </div>

              {/* Stop 3 */}
              <div className="flex items-center gap-4 opacity-60">
                <div className="z-10 flex h-3 w-3 shrink-0 items-center justify-center rounded-full bg-white ring-2 ring-slate-200">
                  <div className="h-1.5 w-1.5 rounded-full bg-slate-300"></div>
                </div>
                <div className="flex flex-1 justify-between items-center">
                  <p className="text-sm font-medium text-slate-600">Dorms A-C</p>
                  <span className="text-xs font-medium text-text-muted">+6m</span>
                </div>
              </div>
            </div>
          </div>

          {/* Visual Map Preview Footer */}
          <div className="relative h-28 w-full bg-slate-100">
            <div
              className="absolute inset-0 bg-cover bg-center opacity-80"
              style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=300&h=100")' }}
            ></div>
            <div className="absolute inset-0 bg-gradient-to-t from-white/90 to-transparent"></div>
            <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
              <button className="flex-1 bg-primary hover:bg-primary/90 text-white text-sm font-bold py-2.5 rounded-xl shadow-lg shadow-blue-500/30 flex items-center justify-center gap-2 transition-all active:scale-95">
                <span className="material-symbols-outlined text-[18px]">near_me</span>
                Track Live
              </button>
            </div>
          </div>
        </div>

        {/* Secondary Route Card (Collapsed) */}
        <div className="glass-panel rounded-2xl p-4 flex items-center justify-between transition-transform active:scale-[0.99] cursor-pointer hover:bg-white/50">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-secondary/10 text-secondary border border-secondary/20">
              <span className="material-symbols-outlined">science</span>
            </div>
            <div>
              <h3 className="text-base font-bold text-[#101419]">Science Block Loop</h3>
              <p className="text-text-muted text-xs font-medium">Arriving in 12 min</p>
            </div>
          </div>
          <span className="material-symbols-outlined text-slate-400">chevron_right</span>
        </div>

        {/* Public Transport Preview Card */}
        <div className="glass-panel rounded-2xl p-4 flex items-center justify-between transition-transform active:scale-[0.99] cursor-pointer hover:bg-white/50 opacity-80">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-indigo-100 text-indigo-600 border border-indigo-200">
              <span className="material-symbols-outlined">train</span>
            </div>
            <div>
              <h3 className="text-base font-bold text-[#101419]">Metro Blue Line</h3>
              <p className="text-text-muted text-xs font-medium">Station Connector • Delayed</p>
            </div>
          </div>
          <span className="material-symbols-outlined text-slate-400">chevron_right</span>
        </div>
      </main>
    </div>
  );
};

export default TransportPage;
