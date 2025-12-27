import React, { useState, useEffect } from 'react';
import { collection, addDoc, updateDoc, deleteDoc, doc, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

import { toast } from 'sonner';
import { Bus, Plus, Pencil, Trash2, MapPin, Phone, User, ExternalLink } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export interface TransportRoute {
    id: string;
    routeNumber: string;
    busName: string; // e.g., "Miyapur Express"
    trackingUrl: string; // The Fleetx link
    driverName: string;
    driverContact: string;
    status: 'active' | 'maintenance' | 'inactive';
    frequency?: string; // e.g., "7:30 AM, 5:00 PM"
}

const TransportAdminPage = () => {
    const [routes, setRoutes] = useState<TransportRoute[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingRoute, setEditingRoute] = useState<TransportRoute | null>(null);

    // Form State
    const [formData, setFormData] = useState<Omit<TransportRoute, 'id'>>({
        routeNumber: '',
        busName: '',
        trackingUrl: '',
        driverName: '',
        driverContact: '',
        status: 'active',
        frequency: ''
    });

    useEffect(() => {
        const q = query(collection(db, 'transport_routes'), orderBy('routeNumber'));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const fetchedRoutes = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as TransportRoute[];
            setRoutes(fetchedRoutes);
            setIsLoading(false);
        }, (error) => {
            console.error("Error fetching routes:", error);
            toast.error("Failed to load transport routes");
            setIsLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editingRoute) {
                await updateDoc(doc(db, 'transport_routes', editingRoute.id), formData);
                toast.success('Route updated successfully');
            } else {
                await addDoc(collection(db, 'transport_routes'), formData);
                toast.success('New route added successfully');
            }
            setIsDialogOpen(false);
            resetForm();
        } catch (error) {
            console.error("Error saving route:", error);
            toast.error('Failed to save route');
        }
    };

    const handleDelete = async (id: string) => {
        if (window.confirm('Are you sure you want to delete this route?')) {
            try {
                await deleteDoc(doc(db, 'transport_routes', id));
                toast.success('Route deleted successfully');
            } catch (error) {
                toast.error('Failed to delete route');
            }
        }
    };

    const resetForm = () => {
        setFormData({
            routeNumber: '',
            busName: '',
            trackingUrl: '',
            driverName: '',
            driverContact: '',
            status: 'active',
            frequency: ''
        });
        setEditingRoute(null);
    };

    const openEditDialog = (route: TransportRoute) => {
        setEditingRoute(route);
        setFormData({
            routeNumber: route.routeNumber,
            busName: route.busName,
            trackingUrl: route.trackingUrl,
            driverName: route.driverName,
            driverContact: route.driverContact,
            status: route.status,
            frequency: route.frequency || ''
        });
        setIsDialogOpen(true);
    };

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-6 pb-24">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold flex items-center gap-2">
                        <Bus className="w-8 h-8 text-primary" />
                        Transport Management
                    </h1>
                    <p className="text-muted-foreground">Manage college bus routes, drivers, and live tracking links.</p>
                </div>
                <Button onClick={() => { resetForm(); setIsDialogOpen(true); }} className="gap-2">
                    <Plus className="w-4 h-4" /> Add New Route
                </Button>
            </div>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="sm:max-w-[600px]">
                    <DialogHeader>
                        <DialogTitle>{editingRoute ? 'Edit Route' : 'Add New Route'}</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Route Number</label>
                                <Input
                                    placeholder="e.g. 15"
                                    value={formData.routeNumber}
                                    onChange={(e) => setFormData({ ...formData, routeNumber: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Bus Name/Route</label>
                                <Input
                                    placeholder="e.g. Miyapur Express"
                                    value={formData.busName}
                                    onChange={(e) => setFormData({ ...formData, busName: e.target.value })}
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Tracking URL (Fleetx)</label>
                            <div className="flex gap-2">
                                <Input
                                    placeholder="https://tinyurl.com/..."
                                    value={formData.trackingUrl}
                                    onChange={(e) => setFormData({ ...formData, trackingUrl: e.target.value })}
                                />
                                {formData.trackingUrl && (
                                    <Button type="button" variant="ghost" size="icon" onClick={() => window.open(formData.trackingUrl, '_blank')}>
                                        <ExternalLink className="w-4 h-4" />
                                    </Button>
                                )}
                            </div>
                            <p className="text-xs text-muted-foreground">Paste the shareable link from Fleetx.</p>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Driver Name</label>
                                <div className="relative">
                                    <User className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        className="pl-9"
                                        placeholder="Driver Name"
                                        value={formData.driverName}
                                        onChange={(e) => setFormData({ ...formData, driverName: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Driver Contact</label>
                                <div className="relative">
                                    <Phone className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        className="pl-9"
                                        placeholder="Phone Number"
                                        value={formData.driverContact}
                                        onChange={(e) => setFormData({ ...formData, driverContact: e.target.value })}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Frequency / Timings</label>
                            <Input
                                placeholder="e.g. 7:30 AM (Campus), 5:00 PM (Return)"
                                value={formData.frequency}
                                onChange={(e) => setFormData({ ...formData, frequency: e.target.value })}
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Status</label>
                            <select
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                value={formData.status}
                                onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                            >
                                <option value="active">Active</option>
                                <option value="maintenance">Maintenance</option>
                                <option value="inactive">Inactive</option>
                            </select>
                        </div>

                        <div className="flex justify-end gap-3 pt-4">
                            <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                            <Button type="submit">{editingRoute ? 'Update Route' : 'Create Route'}</Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>

            <div className="bg-card rounded-xl border shadow-sm overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Route</TableHead>
                            <TableHead>Driver Info</TableHead>
                            <TableHead>Tracking</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center py-8">Loading routes...</TableCell>
                            </TableRow>
                        ) : routes.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">No routes found. Create one to get started.</TableCell>
                            </TableRow>
                        ) : (
                            routes.map((route) => (
                                <TableRow key={route.id}>
                                    <TableCell>
                                        <div className="flex flex-col">
                                            <span className="font-bold text-lg">#{route.routeNumber}</span>
                                            <span className="text-muted-foreground text-sm">{route.busName}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex flex-col text-sm">
                                            <span className="flex items-center gap-1"><User className="w-3 h-3" /> {route.driverName || 'N/A'}</span>
                                            <span className="flex items-center gap-1 text-muted-foreground"><Phone className="w-3 h-3" /> {route.driverContact || 'N/A'}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        {route.trackingUrl ? (
                                            <a href={route.trackingUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-blue-600 hover:underline text-sm font-medium">
                                                <MapPin className="w-3 h-3" /> View Map
                                            </a>
                                        ) : (
                                            <span className="text-muted-foreground text-xs italic">No URL set</span>
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={route.status === 'active' ? 'default' : route.status === 'maintenance' ? 'secondary' : 'destructive'}>
                                            {route.status.toUpperCase()}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <Button variant="ghost" size="icon" onClick={() => openEditDialog(route)}>
                                                <Pencil className="w-4 h-4 text-primary" />
                                            </Button>
                                            <Button variant="ghost" size="icon" onClick={() => handleDelete(route.id)}>
                                                <Trash2 className="w-4 h-4 text-destructive" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
};

export default TransportAdminPage;
