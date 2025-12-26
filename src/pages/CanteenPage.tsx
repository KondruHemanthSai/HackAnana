import React, { useState } from 'react';

const CanteenPage = () => {
  const [activeTab, setActiveTab] = useState('All');

  const categories = [
    { id: 'All', icon: 'restaurant', label: 'All' },
    { id: 'Veg', icon: '🥗', label: 'Veg' },
    { id: 'Non-Veg', icon: '🍗', label: 'Non-Veg' },
    { id: 'Drinks', icon: '🥤', label: 'Drinks' },
  ];

  const foodItems = [
    {
      id: 1,
      name: 'Cheese Burger',
      price: 4.50,
      image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=200&auto=format&fit=crop',
      category: 'Non-Veg'
    },
    {
      id: 2,
      name: 'Iced Matcha',
      price: 3.00,
      image: 'https://images.unsplash.com/photo-1515823662972-da6a2e1d3102?q=80&w=200&auto=format&fit=crop',
      category: 'Drinks'
    },
    {
      id: 3,
      name: 'Spicy Tacos',
      price: 5.00,
      image: 'https://images.unsplash.com/photo-1599974579688-8dbdd335c77f?q=80&w=200&auto=format&fit=crop',
      category: 'Non-Veg'
    },
    {
      id: 4,
      name: 'Fruit Bowl',
      price: 2.50,
      image: 'https://images.unsplash.com/photo-1511690656952-34342d5c2899?q=80&w=200&auto=format&fit=crop',
      category: 'Veg'
    },
    {
      id: 5,
      name: 'Dumplings',
      price: 6.50,
      image: 'https://images.unsplash.com/photo-1496116218417-1a781b1c417c?q=80&w=200&auto=format&fit=crop',
      category: 'Veg'
    },
    {
      id: 6,
      name: 'Choco Donut',
      price: 2.00,
      image: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?q=80&w=200&auto=format&fit=crop',
      category: 'Veg'
    },
  ];

  const filteredItems = activeTab === 'All'
    ? foodItems
    : foodItems.filter(item => item.category === activeTab);

  return (
    <div className="flex flex-col h-full fade-in pb-32">
      {/* Top App Bar */}
      <header className="z-20 px-5 pt-12 pb-4 glass-nav rounded-b-3xl sticky top-0 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full overflow-hidden border-2 border-white shadow-sm bg-gray-200" style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200&auto=format&fit=crop")', backgroundSize: 'cover', backgroundPosition: 'center' }}>
          </div>
          <div>
            <p className="text-xs font-semibold text-secondary uppercase tracking-wider">Good Morning,</p>
            <h1 className="text-lg font-bold text-primary leading-tight">Alex Hunter 👋</h1>
          </div>
        </div>
        <button className="relative p-2 rounded-xl bg-white/40 hover:bg-white/60 transition-colors text-primary">
          <span className="material-symbols-outlined">notifications</span>
          <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-red-400 border border-white"></span>
        </button>
      </header>

      {/* Main Content */}
      <main className="flex-1 px-1 pt-2">
        {/* Search Bar */}
        <div className="px-4 mt-4 mb-2">
          <div className="glass-card rounded-2xl flex items-center h-12 px-4 gap-3 focus-within:ring-2 focus-within:ring-primary/20 transition-all">
            <span className="material-symbols-outlined text-secondary">search</span>
            <input
              className="bg-transparent border-none focus:ring-0 text-primary placeholder-primary/50 text-base w-full p-0 font-medium"
              placeholder="Search for dumplings, soda..."
              type="text"
            />
          </div>
        </div>

        {/* Categories Chips */}
        <div className="flex gap-3 px-4 py-4 overflow-x-auto no-scrollbar snap-x">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveTab(cat.id)}
              className={`snap-start shrink-0 h-9 px-5 rounded-xl text-sm font-semibold flex items-center gap-2 transition-all ${activeTab === cat.id
                  ? 'bg-primary text-white shadow-lg shadow-primary/30 font-bold'
                  : 'glass-card text-primary hover:bg-white/70'
                }`}
            >
              {cat.id === 'All' ? (
                <span className="material-symbols-outlined text-[18px]">{cat.icon}</span>
              ) : (
                <span>{cat.icon}</span>
              )}
              {cat.label}
            </button>
          ))}
        </div>

        {/* Featured Promo */}
        {activeTab === 'All' && (
          <div className="px-4 mb-6">
            <div className="w-full h-36 rounded-2xl relative overflow-hidden shadow-glass group cursor-pointer">
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=400&auto=format&fit=crop")' }}
              ></div>
              <div className="absolute inset-0 bg-gradient-to-r from-primary/80 to-transparent flex flex-col justify-center px-6">
                <span className="bg-accent/30 text-white text-[10px] font-bold px-2 py-1 rounded-md w-fit backdrop-blur-md mb-2">PROMO</span>
                <h3 className="text-white text-xl font-bold mb-1">20% OFF</h3>
                <p className="text-white/90 text-sm font-medium">On all large pizzas today!</p>
              </div>
            </div>
          </div>
        )}

        {/* Food Grid */}
        <div className="px-4 pb-4">
          <h2 className="text-lg font-bold text-primary mb-3 px-1">Popular Now 🔥</h2>
          <div className="grid grid-cols-2 gap-4">
            {filteredItems.map((item) => (
              <div key={item.id} className="glass-card rounded-2xl p-3 flex flex-col gap-3 group hover:scale-[1.02] transition-transform duration-300">
                <div className="aspect-square rounded-xl overflow-hidden relative bg-gray-100">
                  <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url('${item.image}')` }}></div>
                  <button className="absolute bottom-2 right-2 h-8 w-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-primary shadow-sm hover:bg-primary hover:text-white transition-colors">
                    <span className="material-symbols-outlined text-[20px]">favorite</span>
                  </button>
                </div>
                <div>
                  <h3 className="text-primary font-bold text-base leading-tight mb-1 truncate">{item.name}</h3>
                  <div className="flex items-center justify-between">
                    <span className="text-secondary font-semibold text-sm">${item.price.toFixed(2)}</span>
                    <button className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center text-white shadow-lg shadow-primary/20 active:scale-90 transition-transform">
                      <span className="material-symbols-outlined text-[20px]">add</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Floating Cart */}
      <div className="fixed bottom-[90px] left-4 right-4 z-30">
        <div className="cursor-pointer glass-panel rounded-2xl p-2 flex items-center justify-between shadow-glass group hover:bg-white/70 transition-colors">
          <div className="flex items-center gap-3 pl-3">
            <div className="bg-secondary/20 p-2 rounded-lg text-secondary group-hover:scale-110 transition-transform duration-300">
              <span className="material-symbols-outlined">shopping_bag</span>
            </div>
            <div className="flex flex-col">
              <span className="text-xs text-secondary font-semibold uppercase tracking-wide">Total</span>
              <span className="text-primary font-bold text-lg leading-none">$12.50</span>
            </div>
          </div>
          <button className="bg-primary hover:bg-[#2a5d96] text-white h-10 px-5 rounded-xl flex items-center gap-2 font-bold text-sm shadow-lg shadow-primary/25 group-active:scale-95 transition-transform">
            Checkout
            <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default CanteenPage;
