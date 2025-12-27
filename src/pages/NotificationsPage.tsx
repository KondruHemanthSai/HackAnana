import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Bell, AlertTriangle, Calendar, UtensilsCrossed, Info } from 'lucide-react';
import { Link } from 'react-router-dom';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'emergency' | 'event' | 'canteen' | 'info';
  createdAt: any;
}

const NotificationsPage: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'notifications'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Notification[];
      setNotifications(data);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'emergency': return <AlertTriangle className="w-5 h-5 text-destructive" />;
      case 'event': return <Calendar className="w-5 h-5 text-pink-400" />;
      case 'canteen': return <UtensilsCrossed className="w-5 h-5 text-success" />;
      default: return <Info className="w-5 h-5 text-blue-400" />;
    }
  };

  const getTypeStyle = (type: string) => {
    switch (type) {
      case 'emergency': return 'bg-destructive/10 border-destructive/20';
      case 'event': return 'bg-pink-400/10 border-pink-400/20';
      case 'canteen': return 'bg-success/10 border-success/20';
      default: return 'bg-blue-400/10 border-blue-400/20';
    }
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <header className="px-4 pt-4 pb-4 safe-area-top sticky top-0 bg-background/80 backdrop-blur-md z-10 border-b">
        <div className="flex items-center gap-3">
          <Link to="/" className="p-2 -ml-2 rounded-xl hover:bg-card transition-colors">
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </Link>
          <div>
            <h1 className="text-xl font-bold text-foreground">Notifications</h1>
            <p className="text-sm text-muted-foreground">Latest campus updates</p>
          </div>
        </div>
      </header>

      {/* Notifications List */}
      <div className="px-4 py-4 space-y-4">
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          </div>
        ) : notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
            <Bell className="w-12 h-12 mb-4 opacity-20" />
            <p>No new notifications</p>
          </div>
        ) : (
          notifications.map((notif, index) => (
            <motion.div
              key={notif.id}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: index * 0.05 }}
              className={`border p-4 rounded-2xl ${getTypeStyle(notif.type)}`}
            >
              <div className="flex gap-4">
                <div className="mt-1">
                  {getTypeIcon(notif.type)}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="font-semibold text-foreground">{notif.title}</h3>
                    <span className="text-xs text-muted-foreground whitespace-nowrap">
                      {notif.createdAt?.seconds
                        ? new Date(notif.createdAt.seconds * 1000).toLocaleDateString()
                        : 'Just now'}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {notif.message}
                  </p>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
};

export default NotificationsPage;
