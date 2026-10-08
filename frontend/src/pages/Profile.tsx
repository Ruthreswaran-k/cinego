import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { User, Heart, Ticket, Bell, LogOut, Shield, Building2, CheckCircle2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/common/Button';
import toast from 'react-hot-toast';

export const Profile: React.FC = () => {
  const { user, logout } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user?.name || 'Ravi Kumar');
  const [email, setEmail] = useState(user?.email || 'ravi@gmail.com');
  const [phone, setPhone] = useState(user?.phone || '9000000011');

  const bookingCount = (() => {
    try {
      const saved = JSON.parse(localStorage.getItem('cinego_customer_bookings') || '[]');
      if (Array.isArray(saved) && saved.length > 0) return saved.length;
    } catch {}
    return 3;
  })();

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsEditing(false);
    toast.success('Profile details updated successfully');
  };

  return (
    <div className="min-h-screen bg-dark text-white px-4 sm:px-6 md:px-10 font-display pt-32 sm:pt-36 md:pt-40 pb-20">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Profile Card */}
        <div className="glass-card p-6 sm:p-8 rounded-3xl flex flex-col md:flex-row items-center gap-8 border border-white/10 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-r from-primary/30 to-rose-950/40"></div>

          <div className="relative z-10 w-28 h-28 rounded-full bg-zinc-900 border-4 border-dark flex items-center justify-center text-3xl font-black text-white shadow-2xl">
            {name.charAt(0)}
          </div>

          <div className="relative z-10 text-center md:text-left flex-1 space-y-1">
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
              <h1 className="text-3xl font-bold">{name}</h1>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-primary/20 text-primary border border-primary/30 font-bold uppercase">
                {user?.role || 'CUSTOMER'}
              </span>
            </div>
            <p className="text-zinc-400 text-xs">+91 {phone}</p>
            <p className="text-zinc-400 text-xs">{email}</p>
            <p className="text-[11px] text-zinc-500 font-mono pt-1">Member ID #{user?.id || '1003'}</p>
          </div>

          <div className="relative z-10 flex gap-3 text-center">
            <div className="bg-zinc-900/80 p-3.5 rounded-2xl border border-white/5 min-w-[90px]">
              <p className="text-2xl font-bold text-primary">{bookingCount}</p>
              <p className="text-[10px] text-zinc-400 mt-0.5 uppercase font-semibold">Bookings</p>
            </div>
            <div className="bg-zinc-900/80 p-3.5 rounded-2xl border border-white/5 min-w-[90px]">
              <p className="text-2xl font-bold text-amber-400">2</p>
              <p className="text-[10px] text-zinc-400 mt-0.5 uppercase font-semibold">Favorites</p>
            </div>
          </div>
        </div>

        {/* Edit Profile Form */}
        <div className="glass-card p-6 sm:p-8 rounded-3xl border border-white/10 space-y-4">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <h2 className="text-lg font-bold text-white">Account Details</h2>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="text-xs text-primary font-bold hover:underline"
            >
              {isEditing ? 'Cancel' : 'Edit Information'}
            </button>
          </div>

          {isEditing ? (
            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-zinc-400 font-semibold mb-1">Full Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-zinc-900 border border-white/10 rounded-xl px-4 py-2.5 text-white"
                  />
                </div>
                <div>
                  <label className="block text-zinc-400 font-semibold mb-1">Email Address</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-zinc-900 border border-white/10 rounded-xl px-4 py-2.5 text-white"
                  />
                </div>
              </div>
              <Button type="submit" variant="primary" size="sm" className="rounded-xl px-6">
                Save Changes
              </Button>
            </form>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-zinc-300">
              <div>
                <span className="text-zinc-500 block">Name</span>
                <strong>{name}</strong>
              </div>
              <div>
                <span className="text-zinc-500 block">Email</span>
                <strong>{email}</strong>
              </div>
              <div>
                <span className="text-zinc-500 block">Mobile</span>
                <strong>+91 {phone}</strong>
              </div>
            </div>
          )}
        </div>

        {/* Action Shortcuts Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Link
            to="/bookings"
            className="glass-card p-6 rounded-2xl border border-white/10 flex items-center gap-4 hover:border-primary/50 transition-all group"
          >
            <div className="p-3 bg-white/5 rounded-xl group-hover:bg-primary/20 group-hover:text-primary transition-colors text-white">
              <Ticket className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white">My Bookings</h3>
              <p className="text-xs text-zinc-400">View upcoming admissions, e-tickets, and cancellation refunds</p>
            </div>
          </Link>

          <Link
            to="/favorites"
            className="glass-card p-6 rounded-2xl border border-white/10 flex items-center gap-4 hover:border-primary/50 transition-all group"
          >
            <div className="p-3 bg-white/5 rounded-xl group-hover:bg-rose-500/20 group-hover:text-rose-400 transition-colors text-white">
              <Heart className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white">Saved Favorites</h3>
              <p className="text-xs text-zinc-400">Bookmarked films and preferred cinemas</p>
            </div>
          </Link>

          <Link
            to="/notifications"
            className="glass-card p-6 rounded-2xl border border-white/10 flex items-center gap-4 hover:border-primary/50 transition-all group"
          >
            <div className="p-3 bg-white/5 rounded-xl group-hover:bg-amber-500/20 group-hover:text-amber-400 transition-colors text-white">
              <Bell className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white">Notifications</h3>
              <p className="text-xs text-zinc-400">Showtime reminders and promotional deals</p>
            </div>
          </Link>

          <Link
            to="/offers"
            className="glass-card p-6 rounded-2xl border border-white/10 flex items-center gap-4 hover:border-primary/50 transition-all group"
          >
            <div className="p-3 bg-white/5 rounded-xl group-hover:bg-emerald-500/20 group-hover:text-emerald-400 transition-colors text-white">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white">Promotional Coupons</h3>
              <p className="text-xs text-zinc-400">Redeem active discount promo codes</p>
            </div>
          </Link>
        </div>

        {/* Sign Out Action */}
        <div className="pt-4 border-t border-white/10 flex justify-end">
          <Button
            variant="danger"
            size="sm"
            onClick={logout}
            className="rounded-xl px-6 text-xs flex items-center"
          >
            <LogOut className="w-4 h-4 mr-2" /> Sign Out
          </Button>
        </div>
      </div>
    </div>
  );
};
