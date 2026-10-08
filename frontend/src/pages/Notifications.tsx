import React, { useState } from 'react';
import { Bell, CheckCheck, Ticket, Sparkles, AlertCircle, Info, Trash2 } from 'lucide-react';
import { Button } from '@/components/common/Button';
import toast from 'react-hot-toast';

interface NotificationItem {
  id: number;
  title: string;
  message: string;
  type: 'BOOKING' | 'OFFER' | 'SYSTEM' | 'ALERT';
  isRead: boolean;
  timestamp: string;
}

const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 1,
    title: 'Booking Confirmed: Baththa',
    message: 'Your tickets for Baththa at PVR INOX (Screen 1) on Oct 06, 07:30 PM are confirmed! Show your QR e-ticket at the cinema entrance.',
    type: 'BOOKING',
    isRead: false,
    timestamp: '10 minutes ago'
  },
  {
    id: 2,
    title: 'Exclusive Offer: WELCOME100',
    message: 'Get ₹100 flat discount on your next reservation with code WELCOME100 on orders above ₹300.',
    type: 'OFFER',
    isRead: false,
    timestamp: '2 hours ago'
  },
  {
    id: 3,
    title: 'Upcoming Release: Jailer 2 (Tamil)',
    message: 'Advance bookings for Jailer 2 starring Rajinikanth open on Oct 23! Add to your watchlist now.',
    type: 'SYSTEM',
    isRead: true,
    timestamp: '1 day ago'
  },
  {
    id: 4,
    title: 'Refund Processed: Booking #5003',
    message: 'Refund of ₹760 has been successfully credited to your source account for Digger.',
    type: 'ALERT',
    isRead: true,
    timestamp: '3 days ago'
  }
];

export const Notifications: React.FC = () => {
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    toast.success('All notifications marked as read');
  };

  const deleteNotification = (id: number) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
    toast.success('Notification removed');
  };

  const getIcon = (type: NotificationItem['type']) => {
    switch (type) {
      case 'BOOKING':
        return <Ticket className="w-5 h-5 text-emerald-400" />;
      case 'OFFER':
        return <Sparkles className="w-5 h-5 text-amber-400" />;
      case 'ALERT':
        return <AlertCircle className="w-5 h-5 text-primary" />;
      default:
        return <Info className="w-5 h-5 text-blue-400" />;
    }
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div className="min-h-screen bg-dark text-white pt-32 sm:pt-36 md:pt-40 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 pb-6 border-b border-white/10">
          <div>
            <div className="flex items-center space-x-2 text-primary font-medium text-sm mb-1 uppercase tracking-wider">
              <Bell className="w-4 h-4" />
              <span>Activity Center</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-display font-bold">Notifications</h1>
            <p className="text-zinc-400 mt-1">
              You have <span className="text-primary font-bold">{unreadCount}</span> unread alert{unreadCount !== 1 ? 's' : ''}.
            </p>
          </div>
          {unreadCount > 0 && (
            <div className="mt-4 sm:mt-0">
              <Button variant="outline" size="sm" onClick={markAllAsRead} className="rounded-xl text-xs">
                <CheckCheck className="w-4 h-4 mr-1.5" /> Mark All as Read
              </Button>
            </div>
          )}
        </div>

        {/* Notifications List */}
        {notifications.length === 0 ? (
          <div className="glass-card rounded-2xl p-12 text-center max-w-md mx-auto">
            <Bell className="w-12 h-12 text-zinc-600 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-white mb-1">No notifications yet</h3>
            <p className="text-zinc-400 text-sm">We'll notify you here about booking updates, deals, and showtimes.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {notifications.map(n => (
              <div
                key={n.id}
                className={`glass-card rounded-2xl p-5 border transition-all flex items-start justify-between gap-4 ${
                  n.isRead
                    ? 'border-white/5 bg-zinc-900/30'
                    : 'border-primary/40 bg-zinc-900/80 shadow-lg shadow-primary/5'
                }`}
              >
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    {getIcon(n.type)}
                  </div>
                  <div>
                    <div className="flex items-center space-x-2 mb-1">
                      <h3 className={`font-bold text-base ${n.isRead ? 'text-zinc-300' : 'text-white'}`}>
                        {n.title}
                      </h3>
                      {!n.isRead && (
                        <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                      )}
                    </div>
                    <p className="text-sm text-zinc-400 leading-relaxed">{n.message}</p>
                    <span className="text-xs text-zinc-500 mt-2 block font-medium">{n.timestamp}</span>
                  </div>
                </div>

                <button
                  onClick={() => deleteNotification(n.id)}
                  className="text-zinc-500 hover:text-red-400 transition-colors p-1"
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Notification Preferences Note */}
        <div className="mt-12 p-4 rounded-xl bg-zinc-900/40 border border-white/5 flex items-center space-x-3 text-xs text-zinc-400">
          <Bell className="w-4 h-4 text-primary flex-shrink-0" />
          <span>You will receive real-time push alerts and email confirmations for showtime updates, booking receipts, and exclusive offers.</span>
        </div>
      </div>
    </div>
  );
};
