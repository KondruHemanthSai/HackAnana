import React, { useState } from 'react';

const EventsPage = () => {
  const [activeTab, setActiveTab] = useState('All');

  const tabs = [
    { id: 'All', icon: 'star', label: 'All Events' },
    { id: 'Volunteering', icon: 'volunteer_activism', label: 'Volunteering' },
    { id: 'Social', icon: 'groups', label: 'Social' },
    { id: 'Sports', icon: 'emoji_events', label: 'Sports' },
  ];

  const events = [
    {
      id: 1,
      title: 'Campus Beach Cleanup',
      category: 'Volunteering',
      date: '14',
      day: 'Sat',
      time: '9:00 AM',
      location: 'North Beach',
      badge: '+5 Karma',
      badgeColor: 'text-green-600 bg-green-100',
      image: 'https://images.unsplash.com/photo-1618477461853-5f8dd68aa395?q=80&w=200&auto=format&fit=crop',
      action: 'Join'
    },
    {
      id: 2,
      title: 'Coding Bootcamp Intro',
      category: 'Workshop',
      date: '17',
      day: 'Tue',
      time: '5:00 PM',
      location: 'Lab 304',
      badge: 'Free Pizza',
      badgeColor: 'text-orange-600 bg-orange-100',
      image: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=200&auto=format&fit=crop',
      action: 'Register'
    },
    {
      id: 3,
      title: 'Friday Night Mixer',
      category: 'Social',
      date: '20',
      day: 'Fri',
      time: '8:00 PM',
      location: 'Student Union',
      image: 'https://images.unsplash.com/photo-1528605248644-14dd04022da1?q=80&w=200&auto=format&fit=crop',
      action: 'RSVP'
    }
  ];

  return (
    <div className="flex flex-col h-full fade-in pb-28">
      {/* Sticky Header */}
      <header className="sticky top-0 z-30 glass-panel-heavy px-4 py-3 flex items-center justify-between shadow-sm rounded-none border-t-0">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="bg-center bg-no-repeat bg-cover rounded-full size-10 border-2 border-white shadow-sm" style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=200&auto=format&fit=crop")' }}></div>
            <div className="absolute bottom-0 right-0 size-3 bg-green-400 rounded-full border-2 border-white"></div>
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-semibold text-secondary uppercase tracking-wider">Campus OS</span>
            <h1 className="text-primary text-lg font-bold leading-none">What's Happening</h1>
          </div>
        </div>
        <button className="flex items-center justify-center size-10 rounded-full bg-white/50 hover:bg-white transition-colors text-primary relative">
          <span className="material-symbols-outlined" style={{ fontSize: '24px' }}>notifications</span>
          <span className="absolute top-2 right-2 size-2 bg-red-500 rounded-full border border-white"></span>
        </button>
      </header>

      {/* Greeting */}
      <div className="px-5 pt-6 pb-2">
        <h2 className="text-[#101419] text-[28px] font-bold leading-tight">Hello, Alex! 👋</h2>
        <p className="text-secondary font-medium">Ready to explore campus life?</p>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-3 px-5 py-4 overflow-x-auto no-scrollbar mask-gradient-right">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex h-10 shrink-0 items-center justify-center gap-x-2 rounded-full pl-4 pr-5 transition-transform active:scale-95 ${activeTab === tab.id
                ? 'bg-primary text-white shadow-lg shadow-primary/20 font-bold'
                : 'glass-panel text-primary hover:bg-white/80 font-semibold'
              }`}
          >
            <span className={`material-symbols-outlined ${activeTab === tab.id ? 'text-white' : 'text-primary'}`} style={{ fontSize: '20px' }}>
              {tab.icon}
            </span>
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Hero Section (Featured) */}
      <div className="px-5 mt-2">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-primary text-xl font-bold tracking-tight">Featured Event</h3>
          <span className="text-xs font-bold text-secondary bg-white/50 px-2 py-1 rounded-lg">🔥 Hot</span>
        </div>
        <div className="relative w-full aspect-[4/5] rounded-[32px] overflow-hidden shadow-glass group cursor-pointer active:scale-[0.99] transition-transform duration-300">
          <div
            className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
            style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1459749411177-0473ef716189?q=80&w=400&auto=format&fit=crop")' }}
          ></div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
          <div className="absolute top-4 right-4 glass-panel bg-white/90 rounded-2xl p-2.5 flex flex-col items-center shadow-lg w-[60px]">
            <span className="text-xs font-bold text-secondary uppercase">Apr</span>
            <span className="text-xl font-extrabold text-primary leading-none">12</span>
          </div>
          <div className="absolute bottom-0 left-0 w-full p-6">
            <div className="flex gap-2 mb-2">
              <span className="inline-flex items-center rounded-md bg-accent/90 px-2 py-1 text-xs font-bold text-[#104a6b] backdrop-blur-sm">Social</span>
              <span className="inline-flex items-center rounded-md bg-black/40 px-2 py-1 text-xs font-bold text-white backdrop-blur-sm">
                <span className="material-symbols-outlined text-[14px] mr-1">location_on</span>
                Quad
              </span>
            </div>
            <h2 className="text-white text-2xl font-bold leading-tight mb-2 drop-shadow-md">Spring Music Festival</h2>
            <p className="text-white/90 text-sm mb-4 line-clamp-2">Join 500+ students this weekend for live bands, food trucks, and good vibes!</p>
            <div className="flex gap-3">
              <button className="flex-1 bg-primary hover:bg-[#2a5d94] text-white font-bold h-11 rounded-xl shadow-lg shadow-blue-900/20 flex items-center justify-center gap-2 transition-colors">
                RSVP Now
              </button>
              <button className="size-11 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/30 transition-colors">
                <span className="material-symbols-outlined">favorite</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Vertical List Section */}
      <div className="px-5 mt-8 space-y-4">
        <h3 className="text-primary text-xl font-bold tracking-tight">Upcoming Opportunities</h3>
        {events.map((event) => (
          <div key={event.id} className="glass-panel p-3 rounded-[24px] flex gap-4 items-center shadow-sm hover:scale-[1.01] transition-transform cursor-pointer">
            <div className="relative shrink-0">
              <div className="w-24 h-24 rounded-2xl bg-cover bg-center" style={{ backgroundImage: `url('${event.image}')` }}></div>
              <div className="absolute -bottom-2 -right-2 bg-white rounded-xl px-2 py-1 shadow-sm border border-gray-100 flex flex-col items-center min-w-[40px]">
                <span className="text-[10px] font-bold text-secondary uppercase">{event.day}</span>
                <span className="text-sm font-extrabold text-[#101419] leading-none">{event.date}</span>
              </div>
            </div>
            <div className="flex flex-col flex-1 py-1 min-w-0">
              <div className="flex justify-between items-start">
                <span className="text-xs font-bold text-secondary mb-1">{event.category}</span>
                {event.badge && (
                  <span className={`text-xs font-bold px-1.5 py-0.5 rounded ${event.badgeColor}`}>{event.badge}</span>
                )}
              </div>
              <h4 className="text-[#101419] font-bold text-lg leading-tight truncate">{event.title}</h4>
              <p className="text-gray-500 text-xs mt-1 flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px]">schedule</span> {event.time} • {event.location}
              </p>
              <div className="mt-2 flex justify-end items-center">
                <button className="text-primary text-sm font-bold bg-primary/10 px-3 py-1.5 rounded-lg hover:bg-primary/20 transition-colors">
                  {event.action}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Floating Action Button */}
      <button className="fixed bottom-24 right-5 z-40 size-14 bg-accent rounded-full shadow-[0_4px_20px_rgba(161,227,249,0.5)] flex items-center justify-center text-[#104a6b] hover:scale-105 active:scale-95 transition-transform">
        <span className="material-symbols-outlined" style={{ fontSize: '32px' }}>add</span>
      </button>
    </div>
  );
};

export default EventsPage;
