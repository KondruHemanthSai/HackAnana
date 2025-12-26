import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const EmergencyPage = () => {
  const navigate = useNavigate();
  const [isSOSActive, setIsSOSActive] = useState(false);
  const [countdown, setCountdown] = useState(5);

  const handleSOSClick = () => {
    setIsSOSActive(true);
    // Simulate countdown
    let timer = 5;
    const interval = setInterval(() => {
      timer -= 1;
      setCountdown(timer);
      if (timer === 0) {
        clearInterval(interval);
        // Trigger alert action here
      }
    }, 1000);
  };

  const handleCancel = () => {
    setIsSOSActive(false);
    setCountdown(5);
  };

  return (
    <div className="flex flex-col h-full bg-red-50/50 min-h-screen pb-24 fade-in">
      {/* Header */}
      <header className="px-5 pt-8 pb-4 flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center justify-center size-10 rounded-full bg-white/60 hover:bg-white transition-colors text-[#101419]"
        >
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <span className="text-[#101419] font-bold text-lg uppercase tracking-wider">Safety Center</span>
        <div className="size-10"></div>
      </header>

      {/* Main Content */}
      <main className="flex-1 px-5 flex flex-col items-center">

        {/* SOS Activity Status */}
        <div className={`transition-all duration-500 ease-out mb-8 text-center ${isSOSActive ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 pointer-events-none absolute'}`}>
          <h2 className="text-3xl font-black text-red-600 mb-2">SENDING ALERT</h2>
          <p className="text-gray-600 font-medium">Notifying security in <span className="text-red-600 font-bold text-xl">{countdown}s</span></p>
          <button
            onClick={handleCancel}
            className="mt-6 px-8 py-3 bg-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-300 transition-colors"
          >
            CANCEL REQUEST
          </button>
        </div>

        {/* SOS Button */}
        <button
          onClick={handleSOSClick}
          className={`relative group transition-all duration-500 ${isSOSActive ? 'scale-75 opacity-50 pointer-events-none' : 'scale-100'}`}
        >
          {/* Ripple Effects */}
          <div className="absolute inset-0 bg-red-500 rounded-full opacity-20 animate-ping duration-[2000ms]"></div>
          <div className="absolute inset-[-20px] bg-red-500 rounded-full opacity-10 animate-pulse"></div>

          {/* Main Button */}
          <div className="relative size-64 rounded-full bg-gradient-to-br from-red-500 to-red-600 shadow-[0_20px_50px_rgba(239,68,68,0.4)] flex flex-col items-center justify-center border-4 border-red-400/50 z-10 active:scale-95 transition-transform">
            <span className="material-symbols-outlined text-white" style={{ fontSize: '64px' }}>sos</span>
            <span className="text-white font-bold text-xl mt-2 tracking-widest">PRESS HELP</span>
          </div>
        </button>

        {/* Map/Location Preview */}
        <div className={`w-full mt-10 transition-all duration-500 ${isSOSActive ? 'mt-4' : 'mt-10'}`}>
          <div className="glass-panel p-4 rounded-3xl bg-white/60 backdrop-blur-md">
            <div className="flex items-center gap-4 mb-4">
              <div className="size-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 shrink-0">
                <span className="material-symbols-outlined">my_location</span>
              </div>
              <div>
                <h3 className="text-[#101419] font-bold text-lg leading-tight">Your Location</h3>
                <p className="text-gray-500 text-sm font-medium">Near Engineering Block B</p>
              </div>
            </div>
            <div className="h-32 w-full rounded-2xl bg-gray-200 relative overflow-hidden">
              <div
                className="absolute inset-0 bg-cover bg-center opacity-70"
                style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1569336415962-a4bd9f69cd83?auto=format&fit=crop&q=80&w=400&h=200")' }}
              ></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="relative flex h-4 w-4">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-500 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-4 w-4 bg-blue-600 border-2 border-white shadow-md"></span>
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Emergency Contacts */}
        <div className="w-full mt-6 grid grid-cols-2 gap-4">
          <button className="glass-panel p-4 rounded-2xl flex flex-col items-center justify-center gap-2 hover:bg-white/80 transition-colors">
            <span className="material-symbols-outlined text-green-600 text-[32px]">local_hospital</span>
            <span className="text-[#101419] font-bold text-sm">Medical</span>
          </button>
          <button className="glass-panel p-4 rounded-2xl flex flex-col items-center justify-center gap-2 hover:bg-white/80 transition-colors">
            <span className="material-symbols-outlined text-blue-600 text-[32px]">security</span>
            <span className="text-[#101419] font-bold text-sm">Campus Security</span>
          </button>
        </div>

      </main>
    </div>
  );
};

export default EmergencyPage;
