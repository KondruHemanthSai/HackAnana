import React, { useState, useEffect } from 'react';
import { collection, addDoc, query, orderBy, onSnapshot, deleteDoc, doc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ArrowLeft, Bell, Trash2, Send, AlertTriangle, Calendar, UtensilsCrossed, Info } from 'lucide-react';
import { toast } from 'sonner';

interface Notification {
    id: string;
    title: string;
    message: string;
    type: 'emergency' | 'event' | 'canteen' | 'info';
    createdAt: any;
}

const NotificationsAdminPage = () => {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [title, setTitle] = useState('');
    const [message, setMessage] = useState('');
    const [type, setType] = useState<'emergency' | 'event' | 'canteen' | 'info'>('info');
    const [isSending, setIsSending] = useState(false);

    useEffect(() => {
        const q = query(collection(db, 'notifications'), orderBy('createdAt', 'desc'));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const data = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as Notification[];
            setNotifications(data);
        });
        return () => unsubscribe();
    }, []);

    const handleSendNotification = async () => {
        if (!title.trim() || !message.trim()) {
            toast.error("Please enter a title and message");
            return;
        }

        setIsSending(true);
        try {
            await addDoc(collection(db, 'notifications'), {
                title,
                message,
                type,
                createdAt: serverTimestamp(),
                readBy: [] // Can be used to track reads later if needed
            });
            toast.success("Notification sent successfully!");
            setTitle('');
            setMessage('');
            setType('info');
        } catch (error) {
            console.error("Error sending notification:", error);
            toast.error("Failed to send notification");
        } finally {
            setIsSending(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (confirm("Delete this notification? It will be removed for all students.")) {
            try {
                await deleteDoc(doc(db, 'notifications', id));
                toast.success("Notification deleted");
            } catch (error) {
                toast.error("Failed to delete");
            }
        }
    };

    const getTypeIcon = (type: string) => {
        switch (type) {
            case 'emergency': return <AlertTriangle className="w-5 h-5 text-destructive" />;
            case 'event': return <Calendar className="w-5 h-5 text-pink-400" />;
            case 'canteen': return <UtensilsCrossed className="w-5 h-5 text-success" />;
            default: return <Info className="w-5 h-5 text-blue-400" />;
        }
    };

    return (
        <div className="flex flex-col h-full bg-background fade-in">
            <header className="sticky top-0 z-30 px-6 py-4 glass-panel-heavy border-b bg-background/80 backdrop-blur-md flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                    <Link to="/admin/dashboard" className="p-2 -ml-2 rounded-xl hover:bg-muted/50 transition-colors">
                        <ArrowLeft className="w-6 h-6 text-foreground" />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-foreground">Notifications</h1>
                        <p className="text-sm text-muted-foreground">Broadcast updates to students</p>
                    </div>
                </div>
            </header>

            <div className="flex-1 px-6 pb-24 max-w-5xl mx-auto w-full grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Compose Section */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-card border border-border p-6 rounded-3xl shadow-sm">
                        <h2 className="font-bold text-lg mb-4 flex items-center gap-2">
                            <Send className="w-5 h-5 text-primary" /> Compose
                        </h2>

                        <div className="space-y-4">
                            <div>
                                <label className="text-sm font-medium text-muted-foreground mb-1 block">Type</label>
                                <div className="grid grid-cols-4 gap-2">
                                    {[
                                        { id: 'info', icon: Info, color: 'text-blue-400', bg: 'bg-blue-400/10' },
                                        { id: 'event', icon: Calendar, color: 'text-pink-400', bg: 'bg-pink-400/10' },
                                        { id: 'canteen', icon: UtensilsCrossed, color: 'text-success', bg: 'bg-success/10' },
                                        { id: 'emergency', icon: AlertTriangle, color: 'text-destructive', bg: 'bg-destructive/10' },
                                    ].map((t) => (
                                        <button
                                            key={t.id}
                                            onClick={() => setType(t.id as any)}
                                            className={`p-3 rounded-xl flex flex-col items-center justify-center gap-1 transition-all border-2 ${type === t.id ? `border-primary/50 ${t.bg}` : 'border-transparent hover:bg-muted'
                                                }`}
                                        >
                                            <t.icon className={`w-5 h-5 ${t.color}`} />
                                            <span className="text-[10px] capitalize">{t.id}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <input
                                placeholder="Title"
                                className="w-full p-3 border rounded-xl bg-background"
                                value={title}
                                onChange={e => setTitle(e.target.value)}
                            />

                            <textarea
                                placeholder="Message body..."
                                className="w-full p-3 border rounded-xl bg-background h-32 resize-none"
                                value={message}
                                onChange={e => setMessage(e.target.value)}
                            />

                            <Button
                                onClick={handleSendNotification}
                                disabled={isSending}
                                className="w-full"
                            >
                                {isSending ? 'Sending...' : 'Send Notification'}
                            </Button>
                        </div>
                    </div>
                </div>

                {/* History Section */}
                <div className="lg:col-span-2">
                    <h2 className="font-bold text-lg mb-4 flex items-center gap-2">
                        <Bell className="w-5 h-5 text-primary" /> Recent History
                    </h2>

                    <div className="space-y-3">
                        {notifications.length === 0 ? (
                            <div className="text-center py-12 text-muted-foreground bg-card/50 rounded-3xl border border-dashed">
                                No notifications sent yet.
                            </div>
                        ) : (
                            notifications.map(notif => (
                                <div key={notif.id} className="bg-card border border-border p-4 rounded-2xl flex items-start gap-4 group">
                                    <div className={`p-3 rounded-xl shrink-0 ${notif.type === 'emergency' ? 'bg-destructive/10' :
                                            notif.type === 'event' ? 'bg-pink-400/10' :
                                                notif.type === 'canteen' ? 'bg-success/10' : 'bg-blue-400/10'
                                        }`}>
                                        {getTypeIcon(notif.type)}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-start">
                                            <h3 className="font-bold text-foreground truncate">{notif.title}</h3>
                                            <span className="text-xs text-muted-foreground whitespace-nowrap ml-2">
                                                {notif.createdAt?.seconds
                                                    ? new Date(notif.createdAt.seconds * 1000).toLocaleDateString()
                                                    : 'Just now'}
                                            </span>
                                        </div>
                                        <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{notif.message}</p>
                                    </div>
                                    <button
                                        onClick={() => handleDelete(notif.id)}
                                        className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NotificationsAdminPage;
