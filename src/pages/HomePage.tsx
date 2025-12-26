import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";

const HomePage = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [sosClicks, setSosClicks] = useState(0);
  const [isSosActive, setIsSosActive] = useState(false);
  const [countdown, setCountdown] = useState(5);
  const clickTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // SOS Triple Click Logic
  const handleSosClick = () => {
    if (isSosActive) return;

    setSosClicks(prev => {
      const newCount = prev + 1;

      // Clear existing timeout
      if (clickTimeoutRef.current) {
        clearTimeout(clickTimeoutRef.current);
      }

      // Reset count if no 3rd click within 1 second
      clickTimeoutRef.current = setTimeout(() => {
        setSosClicks(0);
      }, 1000);

      // Trigger SOS
      if (newCount >= 3) {
        if (clickTimeoutRef.current) clearTimeout(clickTimeoutRef.current);
        setIsSosActive(true);
        setSosClicks(0); // Reset for next time
        return 0;
      }
      return newCount;
    });
  };

  // Countdown Logic
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isSosActive && countdown > 0) {
      interval = setInterval(() => {
        setCountdown(prev => prev - 1);
      }, 1000);
    } else if (isSosActive && countdown === 0) {
      // Trigger Action (e.g., sim call)
      console.log("SOS CALL INITIATED");
      // Optional: window.location.href = "tel:112";
    }
    return () => clearInterval(interval);
  }, [isSosActive, countdown]);

  // Redirect to login if not authenticated
  if (!isAuthenticated && !user) {
    navigate("/login");
    return null;
  }

  const currentDate = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });

  return (
    <div className="flex flex-col animate-in fade-in duration-500">
      {/* Red Screen Overlay */}
      {isSosActive && (
        <div className="fixed inset-0 z-[100] bg-red-600 flex flex-col items-center justify-center text-white animate-in fade-in duration-200">
          <div className="text-9xl font-black mb-4 animate-pulse">{countdown}</div>
          <h2 className="text-4xl font-bold mb-8 uppercase tracking-widest">SOS Triggered</h2>
          <p className="text-xl opacity-90 mb-12">Calling emergency contacts...</p>
          <button
            onClick={() => {
              setIsSosActive(false);
              setSosClicks(0);
              setCountdown(5);
            }}
            className="bg-white text-red-600 px-8 py-3 rounded-full font-bold text-lg active:scale-95 transition-transform"
          >
            CANCEL
          </button>
        </div>
      )}

      {/* Header */}
      <header className="flex items-center justify-between px-6 pt-14 pb-4">
        <div className="flex flex-col">
          <span className="text-muted-foreground text-sm font-semibold tracking-wide uppercase">{currentDate}</span>
          <h1 className="text-2xl font-extrabold text-foreground tracking-tight">Hi, {user?.name?.split(' ')[0] || 'Student'}! 👋</h1>
        </div>
        <button aria-label="Notifications" onClick={() => navigate('/notifications')} className="glass w-12 h-12 flex items-center justify-center rounded-xl text-primary active:scale-95 transition-transform duration-200 relative">
          <span className="material-symbols-outlined text-[26px]">notifications</span>
          <span className="absolute top-3 right-3 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
        </button>
      </header>

      {/* SOS Hero Section */}
      <section className="flex flex-col items-center justify-center py-8">
        <div className="relative w-48 h-48 flex items-center justify-center mb-6">
          {/* Outer Glow Rings */}
          <div className="absolute inset-0 rounded-full border-4 border-primary/10 animate-[spin_10s_linear_infinite]"></div>
          <div className="absolute inset-4 rounded-full border-4 border-dashed border-primary/20 animate-[spin_15s_linear_infinite_reverse]"></div>

          {/* Main SOS Button */}
          <button
            onClick={handleSosClick}
            className="relative w-36 h-36 rounded-full bg-gradient-to-br from-white to-[#ebf4f5] shadow-[0_10px_40px_rgba(54,116,181,0.25)] flex flex-col items-center justify-center z-10 active:scale-95 transition-all duration-300 border-4 border-white/60 group overflow-hidden"
          >
            <div className={`absolute inset-0 transition-opacity duration-200 ${sosClicks > 0 ? 'bg-red-500/10 opacity-100' : 'bg-primary/5 opacity-0 group-hover:opacity-100'}`}></div>
            <span className={`material-symbols-outlined text-[48px] mb-1 material-symbols-filled drop-shadow-sm transition-colors ${sosClicks > 0 ? 'text-red-500' : 'text-primary'}`}>emergency_share</span>
            <span className={`font-black text-xl tracking-wider transition-colors ${sosClicks > 0 ? 'text-red-500' : 'text-primary'}`}>SOS</span>
          </button>

          {/* Pulsing Effect behind button */}
          <div className="absolute inset-0 rounded-full bg-primary/10 -z-10 animate-ripple"></div>
        </div>
        <div className="text-center space-y-1">
          <h2 className="text-2xl font-bold text-foreground tracking-tight">Emergency?</h2>
          <p className="text-muted-foreground text-base font-medium">Press 3 times for help ({sosClicks}/3)</p>
        </div>
      </section>

      {/* Quick Actions Strip */}
      <div className="w-full overflow-x-auto no-scrollbar pl-6 py-4 flex gap-3 snap-x">
        {[
          { icon: 'badge', label: 'My ID', action: () => { } },
          { icon: 'directions_bus', label: 'Bus Pass', action: () => { } },
        ].map((item, idx) => (
          <button
            key={idx}
            onClick={item.action}
            className="glass shrink-0 h-11 pl-4 pr-5 rounded-full flex items-center gap-2 text-sm font-bold text-foreground whitespace-nowrap snap-start active:bg-white/60 transition shadow-sm"
          >
            <span className="material-symbols-outlined text-primary text-[20px]">{item.icon}</span>
            {item.label}
          </button>
        ))}
      </div>

      {/* Recent Updates (Placeholder for "Something Else") */}
      <div className="px-6 mt-4 pb-24">
        <h3 className="text-lg font-bold text-foreground mb-4">Recent Updates</h3>
        <div className="space-y-3">
          <div className="glass-card p-4 rounded-2xl flex gap-4 items-center">
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
              <span className="material-symbols-outlined text-[20px]">info</span>
            </div>
            <div>
              <h4 className="font-semibold text-sm">Exam Schedule Released</h4>
              <p className="text-xs text-muted-foreground">Check your dashboard for details</p>
            </div>
          </div>
          <div className="glass-card p-4 rounded-2xl flex gap-4 items-center">
            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600">
              <span className="material-symbols-outlined text-[20px]">event</span>
            </div>
            <div>
              <h4 className="font-semibold text-sm">Tech Fest Registration</h4>
              <p className="text-xs text-muted-foreground">Open until Friday</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
