import React from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { Film, LayoutDashboard, Calendar, Ticket, BarChart3, Tag, MonitorPlay, Users, LogOut, ShieldCheck, Building2, Coins } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { CinematicBackground } from '../common/CinematicBackground';

export const AdminLayout: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const navItems = [
    { label: 'Dashboard', path: '/admin', icon: LayoutDashboard },
    { label: 'Pricing Governance', path: '/admin/pricing', icon: Coins },
    { label: 'Movie Management', path: '/admin/movies', icon: Film },
    { label: 'Show Scheduling', path: '/admin/shows', icon: Calendar },
    { label: 'Theatre Verification', path: '/admin/theatres', icon: Building2 },
    { label: 'Screens & Audis', path: '/admin/screens', icon: MonitorPlay },
    { label: 'Bookings Ledger', path: '/admin/bookings', icon: Ticket },
    { label: 'Reports & Revenue', path: '/admin/reports', icon: BarChart3 },
    { label: 'Coupons & Promos', path: '/admin/coupons', icon: Tag },
    { label: 'Staff Directory', path: '/admin/users', icon: Users },
  ];

  const handleSignOut = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="flex min-h-screen relative text-white font-display overflow-hidden">
      {/* Classy 3D Animated Background for Admin */}
      <CinematicBackground variant="admin" />

      {/* Sidebar */}
      <aside className="w-64 bg-zinc-950/80 backdrop-blur-2xl border-r border-white/10 flex flex-col justify-between p-6 flex-shrink-0 z-20 shadow-2xl">
        <div>
          {/* Brand */}
          <div className="flex items-center space-x-2.5 mb-8">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-rose-700 flex items-center justify-center text-white font-black text-xl shadow-lg shadow-primary/40">
              C
            </div>
            <div>
              <h2 className="font-display font-bold text-lg text-white">CineGo</h2>
              <span className="text-[10px] text-primary uppercase font-bold tracking-widest block -mt-0.5">Admin Console</span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1.5">
            {navItems.map(item => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-3 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-primary text-white shadow-lg shadow-primary/30 font-bold translate-x-1'
                      : 'text-zinc-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom Actions */}
        <div className="pt-6 border-t border-white/10 space-y-3">
          <div className="p-3 rounded-xl bg-zinc-900/80 backdrop-blur-md border border-white/5 text-xs text-zinc-400">
            <span className="flex items-center text-emerald-400 font-bold mb-1">
              <ShieldCheck className="w-3.5 h-3.5 mr-1" /> Active Session
            </span>
            <p className="text-white font-bold truncate">{user?.name || 'Administrator'}</p>
            <p className="text-[10px] text-zinc-500 font-mono">Role: {user?.role || 'ADMIN'}</p>
          </div>
          <button
            onClick={handleSignOut}
            className="w-full flex items-center justify-center space-x-2 text-xs text-red-400 hover:bg-red-500/10 px-3 py-2 rounded-xl transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out Session</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-8 sm:p-10 overflow-y-auto relative z-10">
        <Outlet />
      </main>
    </div>
  );
};
