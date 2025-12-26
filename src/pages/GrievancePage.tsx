import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const GrievancePage = () => {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState('Facilities');
  const [isAnonymous, setIsAnonymous] = useState(true);

  const categories = [
    { id: 'Facilities', icon: 'engineering', label: 'Facilities' },
    { id: 'Academic', label: 'Academic' },
    { id: 'Harassment', label: 'Harassment' },
    { id: 'Other', label: 'Other' },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-mint/30 pb-24 fade-in">
      {/* Header */}
      <header className="flex items-center p-4 pt-6 justify-between sticky top-0 z-20">
        <button
          onClick={() => navigate(-1)}
          aria-label="Go back"
          className="text-primary flex size-10 shrink-0 items-center justify-center rounded-full active:bg-white/20 transition-colors"
        >
          <span className="material-symbols-outlined text-[28px]">arrow_back_ios_new</span>
        </button>
        <h2 className="text-[#101419] text-xl font-extrabold leading-tight tracking-[-0.015em] text-center drop-shadow-sm">Report a Grievance</h2>
        <div className="size-10"></div>
      </header>

      {/* Intro Text */}
      <div className="px-6 mb-4">
        <p className="text-[#36495d] text-base font-medium leading-relaxed text-center">
          Your voice matters. This safe space allows you to let us know what needs fixing on campus.
        </p>
      </div>

      {/* Main Glass Form Card */}
      <main className="px-4 flex-1 w-full max-w-lg mx-auto">
        <div className="glass-panel rounded-3xl p-6 w-full flex flex-col gap-6">

          {/* Category Chips */}
          <div className="flex flex-col gap-2">
            <label className="text-[#101419] text-sm font-bold ml-1">What is this regarding?</label>
            <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2 -mx-2 px-2">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`flex h-10 shrink-0 items-center justify-center gap-x-2 rounded-xl pl-5 pr-5 transition-transform active:scale-95 ${activeCategory === cat.id
                      ? 'bg-primary text-white shadow-md shadow-primary/20'
                      : 'bg-white/60 border border-white/50 text-[#36495d] hover:bg-white/80'
                    }`}
                >
                  {cat.icon && (
                    <span className="material-symbols-outlined text-[18px]">{cat.icon}</span>
                  )}
                  <span className="text-sm font-semibold">{cat.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Text Area */}
          <div className="flex flex-col gap-2">
            <label className="text-[#101419] text-sm font-bold ml-1" htmlFor="description">What happened?</label>
            <textarea
              id="description"
              className="glass-input w-full resize-none rounded-2xl text-[#101419] focus:outline-0 focus:ring-2 focus:ring-primary/50 focus:bg-white/70 border-none min-h-32 placeholder:text-text-muted p-4 text-base font-normal leading-normal shadow-inner transition-all"
              placeholder="Describe the incident or issue clearly..."
            ></textarea>
          </div>

          {/* Evidence Upload */}
          <div className="flex flex-col gap-2">
            <label className="text-[#101419] text-sm font-bold ml-1">Any proof? <span className="text-text-muted font-normal text-xs">(Optional)</span></label>
            <div className="w-full relative group cursor-pointer">
              <input className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" type="file" />
              <div className="border-2 border-dashed border-primary/30 group-hover:border-primary/60 rounded-2xl bg-white/30 p-4 flex flex-col items-center justify-center gap-2 transition-colors min-h-[100px]">
                <div className="size-10 rounded-full bg-accent/40 flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined">add_a_photo</span>
                </div>
                <p className="text-xs font-medium text-primary/80">Tap to upload photos</p>
              </div>
            </div>
          </div>

          {/* Anonymous Switch */}
          <div className="flex items-center justify-between bg-white/40 p-3 rounded-2xl border border-white/40 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-full bg-accent/30 flex items-center justify-center text-primary">
                <span className="material-symbols-outlined">visibility_off</span>
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-bold text-[#101419]">Stay Anonymous</span>
                <span className="text-xs text-gray-500">Your identity is hidden</span>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={isAnonymous}
                onChange={() => setIsAnonymous(!isAnonymous)}
              />
              <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
            </label>
          </div>

          {/* Submit Button */}
          <button className="w-full bg-primary hover:bg-[#2d629a] text-white font-bold text-lg h-14 rounded-2xl shadow-lg shadow-primary/30 flex items-center justify-center gap-2 mt-2 transition-all active:scale-[0.98]">
            <span>Send Report</span>
            <span className="material-symbols-outlined text-[20px]">send</span>
          </button>
        </div>
      </main>
    </div>
  );
};

export default GrievancePage;
