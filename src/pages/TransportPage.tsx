import React, { useState } from 'react';
import { ArrowLeft, Bus, Train, Navigation, Clock, MapPin, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { User } from 'lucide-react';
import { getBestRoute, TransportRoute } from '@/lib/routing';
import { toast } from 'sonner';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { searchBusStops } from '@/lib/hydBusData';

// Sub-components defined OUTSIDE to prevent re-creation on render (fixes focus loss)

const SelectionView = ({ setMode }: { setMode: (mode: 'selection' | 'college' | 'public') => void }) => (
  <div className="flex flex-col gap-6 px-4 pt-10">
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center mb-4"
    >
      <h1 className="text-3xl font-bold mb-2">Choose Transport</h1>
      <p className="text-muted-foreground">Select your preferred mode of travel</p>
    </motion.div>

    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => setMode('college')}
      className="bg-card border border-border/50 p-6 rounded-3xl shadow-sm relative overflow-hidden group"
    >
      <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
        <Bus size={120} />
      </div>
      <div className="flex items-center gap-4 relative z-10">
        <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
          <Bus size={32} />
        </div>
        <div className="text-left">
          <h2 className="text-xl font-bold">College Transport</h2>
          <p className="text-muted-foreground text-sm">Official shuttle service & routes</p>
        </div>
      </div>
    </motion.button>

    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => setMode('public')}
      className="bg-card border border-border/50 p-6 rounded-3xl shadow-sm relative overflow-hidden group"
    >
      <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
        <Train size={120} />
      </div>
      <div className="flex items-center gap-4 relative z-10">
        <div className="w-16 h-16 rounded-2xl bg-orange-500/10 flex items-center justify-center text-orange-600">
          <Train size={32} />
        </div>
        <div className="text-left">
          <h2 className="text-xl font-bold">Public Transport</h2>
          <p className="text-muted-foreground text-sm">RTC buses & Metro guide</p>
        </div>
      </div>
    </motion.button>
  </div>
);

const CollegeView = ({ onBack }: { onBack: () => void }) => {
  const [routes, setRoutes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    // Real-time listener for bus routes
    const q = query(collection(db, 'bus_routes'), orderBy('routeNumber'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const routesData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setRoutes(routesData);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching routes:", error);
      toast.error("Failed to load college bus routes");
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="flex flex-col h-full bg-background">
      <header className="px-4 py-4 flex items-center gap-4 border-b border-border">
        <button onClick={onBack} className="p-2 -ml-2 hover:bg-muted rounded-xl">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-xl font-bold">College Transport</h1>
      </header>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 pb-24">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-muted-foreground gap-2">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
            <p>Loading active routes...</p>
          </div>
        ) : routes.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground">
            <Bus className="w-12 h-12 mx-auto mb-3 opacity-20" />
            <p>No active bus routes found.</p>
            <p className="text-xs mt-1">Please ask Admin to add Route 15.</p>
          </div>
        ) : (
          routes.map((route) => (
            <div key={route.id} className="bg-card border border-border rounded-2xl p-5 shadow-sm">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Badge className="bg-primary text-primary-foreground hover:bg-primary text-lg px-3 py-1">
                      Route {route.routeNumber}
                    </Badge>
                    {route.status === 'active' && (
                      <span className="flex h-2.5 w-2.5 relative">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
                      </span>
                    )}
                  </div>
                  <h3 className="font-bold text-lg">{route.driverName}</h3>
                  <p className="text-muted-foreground text-sm">{route.driverPhone}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-primary">{route.startTime || '07:30 AM'}</p>
                  <p className="text-xs text-muted-foreground">Start Time</p>
                </div>
              </div>

              <div className="space-y-3 relative pl-2 border-l-2 border-dashed border-border ml-1">
                {route.stops && route.stops.map((stop: string, idx: number) => (
                  <div key={idx} className="flex gap-3 items-center relative -left-[9px]">
                    <div className={`w-4 h-4 rounded-full border-2 ${idx === 0 || idx === route.stops.length - 1 ? 'bg-primary border-primary' : 'bg-background border-muted-foreground'}`} />
                    <p className="text-sm">{stop}</p>
                  </div>
                ))}
              </div>

              <Button
                className="w-full mt-6 gap-2 rounded-xl"
                onClick={() => window.open(route.liveLink || import.meta.env.VITE_COLLEGE_BUS_MAP_URL, '_blank')}
              >
                <MapPin className="w-4 h-4" />
                Track Live Location
              </Button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

interface PublicViewProps {
  destination: string;
  setDestination: (val: string) => void;
  loading: boolean;
  routeData: TransportRoute | null;
  onGetRoute: () => void;
  onBack: () => void;
}

const PublicView = ({ destination, setDestination, loading, routeData, onGetRoute, onBack }: PublicViewProps) => (
  <div className="flex flex-col min-h-screen bg-background">
    <header className="px-4 py-4 flex items-center gap-4 border-b border-border sticky top-0 bg-background/80 backdrop-blur-md z-10">
      <button onClick={onBack} className="p-2 -ml-2 hover:bg-muted rounded-xl">
        <ArrowLeft className="w-6 h-6" />
      </button>
      <h1 className="text-xl font-bold">Public Transport Guide</h1>
    </header>

    <main className="p-4 flex flex-col gap-6 pb-24">
      {/* Missing Key Warning */}
      {!import.meta.env.VITE_OPENAI_API_KEY && (
        <div className="bg-blue-50 text-blue-800 p-4 rounded-xl border border-blue-200 flex items-start gap-3 text-sm">
          <div className="text-xl">🤖</div>
          <div>
            <p className="font-bold">ChatGPT (OpenAI) Integration Active</p>
            <p className="text-blue-700/80 mt-1">
              Please add your <code>VITE_OPENAI_API_KEY</code> to the <code>.env</code> file to enable live AI routing.
              <br />
              Currently using <b>Static Database</b> for common routes.
            </p>
          </div>
        </div>
      )}

      {/* Input Section */}
      <div className="bg-card border border-border rounded-2xl p-5 shadow-sm space-y-4">
        <div className="flex items-start gap-3">
          <div className="flex flex-col items-center gap-1 mt-1">
            <div className="w-3 h-3 rounded-full bg-primary" />
            <div className="w-0.5 h-8 bg-border border-l border-dashed" />
            <div className="w-3 h-3 rounded-full bg-orange-500" />
          </div>
          <div className="flex-1 space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-muted-foreground uppercase">From</label>
              <div className="p-3 bg-muted rounded-xl text-sm font-medium">
                KLH University, Bowrampet
              </div>
            </div>
            <div className="space-y-1 relative">
              <label className="text-xs font-bold text-muted-foreground uppercase">To Location</label>
              <input
                type="text"
                placeholder="Enter destination (e.g. Miyapur Metro)"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                className="w-full p-3 bg-background border border-border rounded-xl text-sm outline-none focus:ring-2 ring-orange-500/20"
              />

              {/* Autocomplete Suggestions */}
              {destination.length > 2 && !routeData && !loading && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-popover border border-border rounded-xl shadow-lg z-20 max-h-48 overflow-y-auto">
                  {searchBusStops(destination).map(stop => (
                    <button
                      key={stop.id}
                      className="w-full text-left px-4 py-2 text-sm hover:bg-muted transition-colors border-b border-border/50 last:border-0"
                      onClick={() => setDestination(stop.name)}
                    >
                      {stop.name} <span className="text-xs text-muted-foreground ml-1">({stop.id})</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <Button
          onClick={onGetRoute}
          disabled={loading}
          className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold h-12 rounded-xl"
        >
          {loading ? <Loader2 className="animate-spin w-5 h-5 mr-2" /> : <Navigation className="w-5 h-5 mr-2" />}
          {loading ? 'Finding Route...' : 'Find RTC Route'}
        </Button>
      </div>

      {/* Results Section */}
      <AnimatePresence>
        {routeData && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <div className="flex gap-4">
              <div className="flex-1 bg-blue-50 border border-blue-100 p-4 rounded-2xl">
                <p className="text-xs text-blue-600 font-bold uppercase mb-1">Bus Numbers</p>
                <div className="flex flex-wrap gap-2">
                  {routeData.busNumbers.map((bus, i) => (
                    <span key={i} className="bg-blue-600 text-white text-sm font-bold px-2 py-1 rounded-md">{bus}</span>
                  ))}
                </div>
              </div>
              <div className="flex-1 bg-orange-50 border border-orange-100 p-4 rounded-2xl">
                <p className="text-xs text-orange-600 font-bold uppercase mb-1">Est. Time</p>
                <div className="flex items-center gap-2 text-orange-900 font-bold">
                  <Clock className="w-4 h-4" />
                  {routeData.estimatedTime}
                </div>
              </div>
            </div>

            <div className="bg-card border border-border rounded-2xl p-5 shadow-sm">
              <h3 className="font-bold mb-4 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-primary" />
                Route Roadmap
              </h3>
              <div className="space-y-6 relative pl-2">
                <div className="absolute left-[11px] top-2 bottom-2 w-0.5 bg-muted" />
                {routeData.steps.map((step, i) => (
                  <div key={i} className="flex gap-4 relative">
                    <div className="w-5 h-5 rounded-full bg-background border-4 border-primary z-10 shrink-0" />
                    <p className="text-sm text-foreground/80 leading-snug">{step}</p>
                  </div>
                ))}
              </div>
            </div>

            <Button
              variant="outline"
              className="w-full h-12 rounded-xl border-border hover:bg-muted"
              onClick={() => window.open(`https://www.google.com/maps/dir/?api=1&origin=KLH+University+Bowrampet&destination=${encodeURIComponent(destination)}&travelmode=transit`, '_blank')}
            >
              Open full route in Google Maps
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  </div>
);

const TransportPage = () => {
  const navigate = useNavigate();
  const [mode, setMode] = useState<'selection' | 'college' | 'public'>('selection');

  // Public Transport State
  const [destination, setDestination] = useState('');
  const [loading, setLoading] = useState(false);
  const [routeData, setRouteData] = useState<TransportRoute | null>(null);

  const handleGetRoute = async () => {
    if (!destination.trim()) {
      toast.error("Please enter a destination");
      return;
    }

    setLoading(true);
    setRouteData(null);
    try {
      // Helper uses OpenAI -> Gemini -> Static fallback
      const data = await getBestRoute(destination);
      setRouteData(data);
    } catch (error) {
      toast.error("Failed to find route");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {mode === 'selection' && <SelectionView setMode={setMode} />}
      {mode === 'college' && <CollegeView onBack={() => setMode('selection')} />}
      {mode === 'public' && (
        <PublicView
          destination={destination}
          setDestination={setDestination}
          loading={loading}
          routeData={routeData}
          onGetRoute={handleGetRoute}
          onBack={() => setMode('selection')}
        />
      )}
    </div>
  );
};

export default TransportPage;
