import React from 'react';
import { useNavigate } from 'react-router-dom';

const MentalHealthPage = () => {
  const navigate = useNavigate();

  const moods = [
    { emoji: '😊', label: 'Happy' },
    { emoji: '😌', label: 'Calm' },
    { emoji: '😐', label: 'Okay' },
    { emoji: '😔', label: 'Sad' },
    { emoji: '😰', label: 'Anxious' },
  ];

  return (
    <div className="flex flex-col h-full fade-in pb-24">
      {/* Top App Bar */}
      <header className="sticky top-0 z-30 px-4 py-3 flex items-center justify-between glass-panel mx-2 mt-2 rounded-2xl shadow-sm">
        <div className="flex items-center gap-3">
          <div className="relative group cursor-pointer">
            <div className="bg-center bg-no-repeat bg-cover rounded-full size-10 border-2 border-white shadow-sm" style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop")' }}></div>
            <div className="absolute bottom-0 right-0 size-3 bg-green-400 rounded-full border-2 border-white"></div>
          </div>
          <div className="flex flex-col">
            <h1 className="text-sm font-semibold text-primary uppercase tracking-wider">Safe Space</h1>
            <span className="text-xs text-text-muted">Online</span>
          </div>
        </div>
        <button aria-label="Emergency SOS" className="flex items-center justify-center size-10 rounded-full bg-red-50 text-red-500 hover:bg-red-100 transition-colors shadow-sm border border-red-100/50">
          <span className="material-symbols-outlined text-[20px]">sos</span>
        </button>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col px-4 pt-6 gap-6">
        {/* Greeting */}
        <section className="animate-float">
          <h2 className="text-3xl font-bold leading-tight text-primary/90">
            Hi, Student. <br />
            <span className="text-text-dark/80 text-2xl font-medium">How are you feeling today?</span>
          </h2>
        </section>

        {/* Mood Carousel */}
        <section>
          <div className="flex overflow-x-auto no-scrollbar pb-2 -mx-4 px-4 gap-4 snap-x">
            {moods.map((mood, index) => (
              <button key={index} className="snap-center shrink-0 flex flex-col items-center gap-2 group">
                <div className="size-16 rounded-2xl glass-button flex items-center justify-center text-3xl shadow-sm group-hover:scale-105 transition-transform bg-white/40">
                  {mood.emoji}
                </div>
                <span className="text-xs font-semibold text-primary">{mood.label}</span>
              </button>
            ))}
          </div>
        </section>

        {/* Chat Preview Area */}
        <section className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-primary">Recent Support</h3>
            <button className="text-xs font-bold text-secondary hover:text-primary transition-colors">View All</button>
          </div>
          {/* Chat Bubble */}
          <div className="glass-panel p-4 rounded-2xl flex items-start gap-3 transform hover:translate-y-[-2px] transition-transform duration-300 cursor-pointer">
            <div className="bg-center bg-no-repeat bg-cover rounded-full size-12 border-2 border-white shrink-0" style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=200&auto=format&fit=crop")' }}></div>
            <div className="flex flex-col flex-1 gap-1">
              <div className="flex justify-between items-center w-full">
                <span className="font-bold text-sm text-primary">Campus Support</span>
                <span className="text-[10px] text-text-muted font-medium bg-white/50 px-2 py-0.5 rounded-full">2m ago</span>
              </div>
              <div className="bg-white/50 rounded-lg rounded-tl-none p-3 text-sm text-text-dark/90 leading-relaxed shadow-sm">
                It's okay not to be okay. I'm here if you need to talk or just vent about finals. 💙
              </div>
            </div>
          </div>
        </section>

        {/* Actions */}
        <section className="flex flex-col gap-3">
          <button className="w-full h-14 bg-primary hover:bg-[#2a5d96] text-white rounded-2xl shadow-lg shadow-primary/20 flex items-center justify-center gap-2 font-bold text-base transition-all active:scale-[0.98]">
            <span className="material-symbols-outlined">forum</span>
            Chat with a Counselor
          </button>
          <button className="w-full h-14 glass-button text-primary font-bold rounded-2xl flex items-center justify-center gap-2 text-base shadow-sm hover:bg-white/60">
            <span className="material-symbols-outlined">smart_toy</span>
            Talk to CalmBot
          </button>
        </section>

        {/* Quick Resources Grid */}
        <section className="grid grid-cols-2 gap-3 mt-2">
          {/* Resource 1 */}
          <div className="glass-panel p-4 rounded-2xl flex flex-col justify-between h-32 relative overflow-hidden group cursor-pointer hover:bg-white/40 transition-colors">
            <div className="absolute right-[-10px] top-[-10px] size-16 bg-accent/30 rounded-full blur-xl group-hover:bg-accent/50 transition-colors"></div>
            <div className="size-10 rounded-full bg-white/70 flex items-center justify-center text-primary mb-2 shadow-sm">
              <span className="material-symbols-outlined">self_improvement</span>
            </div>
            <div>
              <h4 className="font-bold text-sm text-primary">Breathe</h4>
              <p className="text-[10px] text-text-muted">3 min exercise</p>
            </div>
          </div>
          {/* Resource 2 */}
          <div className="glass-panel p-4 rounded-2xl flex flex-col justify-between h-32 relative overflow-hidden group cursor-pointer hover:bg-white/40 transition-colors">
            <div className="absolute right-[-10px] top-[-10px] size-16 bg-secondary/20 rounded-full blur-xl group-hover:bg-secondary/40 transition-colors"></div>
            <div className="size-10 rounded-full bg-white/70 flex items-center justify-center text-primary mb-2 shadow-sm">
              <span className="material-symbols-outlined">headphones</span>
            </div>
            <div>
              <h4 className="font-bold text-sm text-primary">Lofi Mix</h4>
              <p className="text-[10px] text-text-muted">Focus & Calm</p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default MentalHealthPage;
