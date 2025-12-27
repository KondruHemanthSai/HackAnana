import React, { useState, useEffect } from 'react';
import { collection, addDoc, deleteDoc, doc, onSnapshot, query, orderBy, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Trash2, Plus, Bus, Phone, Clock, MapPin, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';

interface BusRoute {
    id: string;
    routeNumber: string;
    driverName: string;
    driverPhone: string;
    startTime: string;
    stops: string[]; // Array of strings
    liveLink?: string; // Optional custom tracking link
    status: 'active' | 'inactive';
}

const TransportAdminPage = () => {
    const [routes, setRoutes] = useState<BusRoute[]>([]);
    const [isAdding, setIsAdding] = useState(false);

    // Form State
    const [newRoute, setNewRoute] = useState({
        routeNumber: '',
        driverName: '',
        driverPhone: '',
        startTime: '07:30 AM',
        stopsString: '', // To parse into array
        liveLink: ''
    });

    useEffect(() => {
        const q = query(collection(db, 'bus_routes'), orderBy('routeNumber'));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const data = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as BusRoute[];
            setRoutes(data);
        });
        return () => unsubscribe();
    }, []);

    const handleAddRoute = async () => {
        if (!newRoute.routeNumber || !newRoute.driverName) {
            toast.error("Please fill required fields");
            return;
        }

        try {
            await addDoc(collection(db, 'bus_routes'), {
                routeNumber: newRoute.routeNumber,
                driverName: newRoute.driverName,
                driverPhone: newRoute.driverPhone,
                startTime: newRoute.startTime,
                stops: newRoute.stopsString.split(',').map(s => s.trim()).filter(s => s.length > 0),
                liveLink: newRoute.liveLink || '',
                status: 'active',
                createdAt: new Date().toISOString()
            });
            toast.success("Route added successfully");
            setIsAdding(false);
            setNewRoute({ routeNumber: '', driverName: '', driverPhone: '', startTime: '07:30 AM', stopsString: '', liveLink: '' });
        } catch (error) {
            console.error("Error adding route:", error);
            toast.error("Failed to add route");
        }
    };

    const handleDelete = async (id: string) => {
        if (confirm("Are you sure you want to delete this route?")) {
            await deleteDoc(doc(db, 'bus_routes', id));
            toast.success("Route deleted");
        }
    };

    return (
        <div className="flex flex-col h-full bg-background fade-in">
            {/* Header */}
            <header className="sticky top-0 z-30 px-6 py-4 glass-panel-heavy border-b bg-background/80 backdrop-blur-md flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                    <Link to="/admin/dashboard" className="p-2 -ml-2 rounded-xl hover:bg-muted/50 transition-colors">
                        <ArrowLeft className="w-6 h-6 text-foreground" />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-foreground">Transport Management</h1>
                        <p className="text-sm text-muted-foreground">College bus routes & tracking</p>
                    </div>
                </div>
                <div className="flex gap-2">
                    <Button onClick={() => setIsAdding(!isAdding)} className="gap-2">
                        {isAdding ? 'Cancel' : <><Plus className="w-4 h-4" /> Add Route</>}
                    </Button>
                </div>
            </header>

            {/* Content */}
            <div className="flex-1 px-6 pb-24 max-w-5xl mx-auto w-full">
                {isAdding && (
                    <div className="bg-card border border-border p-6 rounded-2xl shadow-sm mb-6 animate-in slide-in-from-top-4">
                        <h2 className="font-bold text-lg mb-4">Add New Route</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <input
                                placeholder="Route Number (e.g. 15)"
                                className="p-3 border rounded-xl bg-background"
                                value={newRoute.routeNumber}
                                onChange={e => setNewRoute({ ...newRoute, routeNumber: e.target.value })}
                            />
                            <input
                                placeholder="Driver Name"
                                className="p-3 border rounded-xl bg-background"
                                value={newRoute.driverName}
                                onChange={e => setNewRoute({ ...newRoute, driverName: e.target.value })}
                            />
                            <input
                                placeholder="Driver Phone"
                                className="p-3 border rounded-xl bg-background"
                                value={newRoute.driverPhone}
                                onChange={e => setNewRoute({ ...newRoute, driverPhone: e.target.value })}
                            />
                            <input
                                placeholder="Start Time (07:30 AM)"
                                className="p-3 border rounded-xl bg-background"
                                value={newRoute.startTime}
                                onChange={e => setNewRoute({ ...newRoute, startTime: e.target.value })}
                            />
                            <div className="md:col-span-2">
                                <input
                                    placeholder="Live Tracking Link (Optional - overrides default map)"
                                    className="w-full p-3 border rounded-xl bg-background mb-4"
                                    value={newRoute.liveLink || ''}
                                    onChange={e => setNewRoute({ ...newRoute, liveLink: e.target.value })}
                                />
                                <textarea
                                    placeholder="Stops (comma separated, e.g. KPHB, JNTU, Miyapur)"
                                    className="w-full p-3 border rounded-xl bg-background h-24"
                                    value={newRoute.stopsString}
                                    onChange={e => setNewRoute({ ...newRoute, stopsString: e.target.value })}
                                />
                            </div>
                        </div>
                        <Button onClick={handleAddRoute} className="w-full">Save Route</Button>
                    </div>
                )}

                <div className="grid gap-4">
                    {routes.map(route => (
                        <div key={route.id} className="bg-card border border-border p-5 rounded-2xl flex flex-col md:flex-row justify-between gap-4 items-start md:items-center group">
                            <div className="flex gap-4 items-center">
                                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                                    <Bus className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg flex items-center gap-2">
                                        Route {route.routeNumber}
                                        <span className="text-xs bg-muted px-2 py-0.5 rounded-full font-normal">
                                            {route.stops?.length || 0} stops
                                        </span>
                                    </h3>
                                    <div className="flex gap-4 text-sm text-muted-foreground mt-1">
                                        <span className="flex items-center gap-1"><Phone className="w-3 h-3" /> {route.driverName} ({route.driverPhone})</span>
                                        <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {route.startTime}</span>
                                    </div>
                                </div>
                            </div>

                            <Button
                                variant="ghost"
                                className="text-red-500 hover:text-red-600 hover:bg-red-50"
                                onClick={() => handleDelete(route.id)}
                            >
                                <Trash2 className="w-5 h-5" />
                            </Button>
                        </div>
                    ))}
                    {routes.length === 0 && !isAdding && (
                        <div className="text-center py-20 text-muted-foreground">
                            No routes found. Click "Add Route" to create Route 15.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TransportAdminPage;
