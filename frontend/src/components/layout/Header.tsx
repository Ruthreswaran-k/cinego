import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation as useRouterLocation } from 'react-router-dom';
import { Film, MapPin, Search, User, Menu, X, ChevronDown, LogOut, Ticket, Heart, Bell, Shield, Building2, Gift, Popcorn, Database, Tag, Sun, Moon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { useLocation } from '@/context/LocationContext';
import { useTheme } from '@/context/ThemeContext';
import { LoginModal } from '@/components/auth/LoginModal';
import { LocationModal } from '@/components/common/LocationModal';

export const Header: React.FC = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();
  const { selectedLocation, setIsLocationModalOpen } = useLocation();
  const { theme, toggleTheme, isDark } = useTheme();

  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let lastScrolled = false;
    const handleScroll = () => {
      const scrolled = window.scrollY > 20;
      if (scrolled !== lastScrolled) {
        lastScrolled = scrolled;
        setIsScrolled(scrolled);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close user dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const routerLocation = useRouterLocation();

  // Dynamically resolve navigation based on authenticated role
  const isStaffAdmin = user?.role === 'ADMIN';
  const isStaffManager = user?.role === 'MANAGER';

  let navItems: { label: string; path: string }[] = [];
  if (isStaffAdmin) {
    navItems = [
      { label: 'Home', path: '/' },
      { label: 'Admin Dashboard', path: '/admin' },
      { label: 'Movies Master', path: '/admin/movies' },
      { label: 'Show Scheduler', path: '/admin/shows' },
      { label: 'Bookings Ledger', path: '/admin/bookings' },
      { label: 'Reports & Revenue', path: '/admin/reports' },
      { label: 'Coupons Engine', path: '/admin/coupons' },
      { label: 'Audi Screens', path: '/admin/screens' },
      { label: 'Staff Directory', path: '/admin/users' },
    ];
  } else if (isStaffManager) {
    navItems = [
      { label: 'Home', path: '/' },
      { label: 'Operations Hub', path: '/manager' },
      { label: "Today's Shows", path: '/manager?tab=SHOWS' },
      { label: 'Audi Occupancy', path: '/manager?tab=OCCUPANCY' },
      { label: 'Gate Turnstile', path: '/manager?tab=SCANNER' },
      { label: 'Live F&B Orders', path: '/manager?tab=CONCESSIONS' },
      { label: 'Seat Lock Tool', path: '/manager?tab=SEATHOLD' },
    ];
  } else {
    navItems = [
      { label: 'Home', path: '/' },
      { label: 'Movies', path: '/movies' },
      { label: 'Theatres', path: '/theatres' },
      { label: 'Offers', path: '/offers' },
      { label: 'Experiences', path: '/experiences' },
      { label: 'Support & FAQs', path: '/contact' },
    ];
  }

  const logoRedirectPath = isStaffAdmin ? '/admin' : isStaffManager ? '/manager' : '/';

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 font-display ${
          isScrolled
            ? 'bg-zinc-950/90 backdrop-blur-md shadow-xl border-b border-white/10 py-3'
            : 'bg-gradient-to-b from-black/80 to-transparent py-4'
        }`}
      >
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link to={logoRedirectPath} className="flex items-center space-x-2 z-50">
              <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center text-white shadow-lg shadow-primary/30">
                <Film className="w-5 h-5" />
              </div>
              <span className="text-2xl font-display font-black text-white tracking-wide">
                Cine<span className="text-primary">Go</span>
              </span>
              {isStaffAdmin && (
                <span className="ml-2 px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30 uppercase">
                  Admin
                </span>
              )}
              {isStaffManager && (
                <span className="ml-2 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 uppercase">
                  Manager
                </span>
              )}
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-5 lg:space-x-7">
              {navItems.map((item) => {
                const isActive = routerLocation.pathname === item.path;
                return (
                  <Link
                    key={item.label}
                    to={item.path}
                    className={`font-medium text-xs lg:text-sm relative group transition-colors ${
                      isActive ? 'text-white font-bold' : 'text-zinc-300 hover:text-white'
                    }`}
                  >
                    {item.label}
                    <span
                      className={`absolute -bottom-1 left-0 h-0.5 bg-primary transition-all duration-300 ${
                        isActive ? 'w-full' : 'w-0 group-hover:w-full'
                      }`}
                    />
                  </Link>
                );
              })}
            </nav>

            {/* Right Action Controls */}
            <div className="hidden md:flex items-center space-x-4">
              {/* Location Selector (Customer Only) */}
              {!isStaffAdmin && !isStaffManager && (
                <button
                  onClick={() => setIsLocationModalOpen(true)}
                  className="flex items-center space-x-1.5 text-xs text-zinc-300 hover:text-white transition-colors bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded-full border border-white/10 cursor-pointer"
                  title="Change active cinema city"
                >
                  <MapPin className="w-3.5 h-3.5 text-primary" />
                  <span className="font-semibold">{selectedLocation.city}</span>
                  <ChevronDown className="w-3 h-3 text-zinc-400" />
                </button>
              )}

              {/* Manager Theatre Tag */}
              {isStaffManager && (
                <span className="flex items-center space-x-1.5 text-xs text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-full border border-emerald-500/20 font-bold">
                  <Building2 className="w-3.5 h-3.5" />
                  <span>PVR Grand Mall</span>
                </span>
              )}

              {/* Admin Central Tag */}
              {isStaffAdmin && (
                <span className="flex items-center space-x-1.5 text-xs text-purple-400 bg-purple-500/10 px-3 py-1.5 rounded-full border border-purple-500/20 font-bold">
                  <Shield className="w-3.5 h-3.5" />
                  <span>System HQ</span>
                </span>
              )}

              {/* Search Shortcut (Customer Only) */}
              {!isStaffAdmin && !isStaffManager && (
                <button
                  onClick={() => navigate('/search')}
                  className="text-zinc-300 hover:text-white transition-colors p-1.5 hover:bg-white/5 rounded-full cursor-pointer"
                  title="Global Search"
                >
                  <Search className="w-4 h-4" />
                </button>
              )}

              {/* Dark / Light Mode Toggle Button */}
              <button
                type="button"
                onClick={toggleTheme}
                className="p-1.5 rounded-full border border-white/10 hover:border-white/20 bg-white/5 hover:bg-white/10 text-zinc-300 hover:text-white transition-all cursor-pointer shadow-sm flex items-center justify-center"
                title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                aria-label="Toggle Dark and Light Mode"
              >
                {isDark ? (
                  <Sun className="w-4 h-4 text-amber-400 transition-transform hover:rotate-45" />
                ) : (
                  <Moon className="w-4 h-4 text-indigo-500 transition-transform hover:-rotate-12" />
                )}
              </button>

              {/* Authentication Button or User Avatar */}
              {isAuthenticated && user ? (
                <div className="relative" ref={userMenuRef}>
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center space-x-2 bg-primary/20 hover:bg-primary/30 border border-primary/40 rounded-full py-1.5 px-3 text-xs font-semibold text-white transition-all cursor-pointer"
                  >
                    {user.avatar === 'nature' || user.email?.includes('ragaruthra') ? (
                      <div className="w-5 h-5 rounded-full overflow-hidden bg-emerald-800 flex items-center justify-center border border-emerald-500/40">
                        <svg viewBox="0 0 100 100" className="w-full h-full">
                          <circle cx="50" cy="50" r="50" fill="#2d6a4f" />
                          <circle cx="28" cy="70" r="22" fill="#40916c" />
                          <circle cx="68" cy="72" r="26" fill="#1b4332" />
                          <circle cx="50" cy="40" r="20" fill="#52b788" />
                        </svg>
                      </div>
                    ) : user.avatar === 'teal' || user.email?.includes('rudhresh') ? (
                      <div className="w-5 h-5 rounded-full bg-[#00897b] flex items-center justify-center text-[10px] font-bold text-white shadow-sm">
                        R
                      </div>
                    ) : (
                      <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center text-[10px] font-bold">
                        {user.name.charAt(0)}
                      </div>
                    )}
                    <span>{user.name.split(' ')[0]}</span>
                    <ChevronDown className="w-3 h-3 text-zinc-400" />
                  </button>

                  {/* Dropdown Menu */}
                  <AnimatePresence>
                    {isUserMenuOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute right-0 mt-2 w-60 bg-zinc-950 border border-white/10 rounded-2xl shadow-2xl p-2 z-50 text-xs space-y-1"
                      >
                        <div className="px-3 py-2 border-b border-white/10 mb-1">
                          <p className="font-bold text-white truncate">{user.name}</p>
                          <p className="text-[10px] text-zinc-400 truncate">{user.email || user.phone}</p>
                          <span
                            className={`inline-block mt-1 text-[9px] font-bold px-2 py-0.5 rounded-full uppercase ${
                              isStaffAdmin
                                ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                                : isStaffManager
                                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                                : 'bg-primary/20 text-primary'
                            }`}
                          >
                            {isStaffAdmin ? 'System Administrator' : isStaffManager ? 'Theatre Operations Manager' : 'Customer'}
                          </span>
                        </div>

                        {/* --- 1. ADMIN EXCLUSIVE LINKS --- */}
                        {isStaffAdmin && (
                          <>
                            <Link
                              to="/admin"
                              onClick={() => setIsUserMenuOpen(false)}
                              className="flex items-center space-x-2.5 px-3 py-2 rounded-xl text-purple-400 hover:bg-purple-500/10 transition-colors font-bold"
                            >
                              <Shield className="w-4 h-4" />
                              <span>Admin Console</span>
                            </Link>
                            <Link
                              to="/admin/movies"
                              onClick={() => setIsUserMenuOpen(false)}
                              className="flex items-center space-x-2.5 px-3 py-2 rounded-xl text-zinc-300 hover:text-white hover:bg-white/5 transition-colors"
                            >
                              <Film className="w-4 h-4 text-primary" />
                              <span>Manage Movie Catalogue</span>
                            </Link>
                            <Link
                              to="/admin/reports"
                              onClick={() => setIsUserMenuOpen(false)}
                              className="flex items-center space-x-2.5 px-3 py-2 rounded-xl text-zinc-300 hover:text-white hover:bg-white/5 transition-colors"
                            >
                              <Gift className="w-4 h-4 text-emerald-400" />
                              <span>Financial Reports & PDF</span>
                            </Link>
                            <Link
                              to="/admin/coupons"
                              onClick={() => setIsUserMenuOpen(false)}
                              className="flex items-center space-x-2.5 px-3 py-2 rounded-xl text-zinc-300 hover:text-white hover:bg-white/5 transition-colors"
                            >
                              <Tag className="w-4 h-4 text-amber-400" />
                              <span>Coupons & Promotions</span>
                            </Link>
                          </>
                        )}

                        {/* --- 2. THEATRE MANAGER EXCLUSIVE LINKS --- */}
                        {isStaffManager && (
                          <>
                            <Link
                              to="/manager"
                              onClick={() => setIsUserMenuOpen(false)}
                              className="flex items-center space-x-2.5 px-3 py-2 rounded-xl text-emerald-400 hover:bg-emerald-500/10 transition-colors font-bold"
                            >
                              <Building2 className="w-4 h-4" />
                              <span>Operations Hub</span>
                            </Link>
                            <Link
                              to="/manager?tab=SCANNER"
                              onClick={() => setIsUserMenuOpen(false)}
                              className="flex items-center space-x-2.5 px-3 py-2 rounded-xl text-zinc-300 hover:text-white hover:bg-white/5 transition-colors"
                            >
                              <Ticket className="w-4 h-4 text-primary" />
                              <span>Gate Turnstile Scanner</span>
                            </Link>
                            <Link
                              to="/manager?tab=OCCUPANCY"
                              onClick={() => setIsUserMenuOpen(false)}
                              className="flex items-center space-x-2.5 px-3 py-2 rounded-xl text-zinc-300 hover:text-white hover:bg-white/5 transition-colors"
                            >
                              <Building2 className="w-4 h-4 text-blue-400" />
                              <span>Audi Occupancy Telemetry</span>
                            </Link>
                            <Link
                              to="/manager?tab=CONCESSIONS"
                              onClick={() => setIsUserMenuOpen(false)}
                              className="flex items-center space-x-2.5 px-3 py-2 rounded-xl text-zinc-300 hover:text-white hover:bg-white/5 transition-colors"
                            >
                              <Popcorn className="w-4 h-4 text-amber-400" />
                              <span>Live F&B Kitchen Orders</span>
                            </Link>
                          </>
                        )}

                        {/* --- 3. CUSTOMER EXCLUSIVE LINKS --- */}
                        {!isStaffAdmin && !isStaffManager && (
                          <>
                            <Link
                              to="/profile"
                              onClick={() => setIsUserMenuOpen(false)}
                              className="flex items-center space-x-2.5 px-3 py-2 rounded-xl text-zinc-300 hover:text-white hover:bg-white/5 transition-colors"
                            >
                              <User className="w-4 h-4 text-zinc-400" />
                              <span>My Profile</span>
                            </Link>
                            <Link
                              to="/bookings"
                              onClick={() => setIsUserMenuOpen(false)}
                              className="flex items-center space-x-2.5 px-3 py-2 rounded-xl text-zinc-300 hover:text-white hover:bg-white/5 transition-colors"
                            >
                              <Ticket className="w-4 h-4 text-primary" />
                              <span>My Bookings</span>
                            </Link>
                            <Link
                              to="/favorites"
                              onClick={() => setIsUserMenuOpen(false)}
                              className="flex items-center space-x-2.5 px-3 py-2 rounded-xl text-zinc-300 hover:text-white hover:bg-white/5 transition-colors"
                            >
                              <Heart className="w-4 h-4 text-rose-400" />
                              <span>Saved Favorites</span>
                            </Link>
                            <Link
                              to="/notifications"
                              onClick={() => setIsUserMenuOpen(false)}
                              className="flex items-center space-x-2.5 px-3 py-2 rounded-xl text-zinc-300 hover:text-white hover:bg-white/5 transition-colors"
                            >
                              <Bell className="w-4 h-4 text-amber-400" />
                              <span>Notifications</span>
                            </Link>
                          </>
                        )}

                        <div className="border-t border-white/5 pt-1 mt-1">
                          <button
                            onClick={() => {
                              logout();
                              setIsUserMenuOpen(false);
                              navigate('/');
                            }}
                            className="w-full flex items-center space-x-2.5 px-3 py-2 rounded-xl text-red-400 hover:bg-red-500/10 transition-colors text-left cursor-pointer"
                          >
                            <LogOut className="w-4 h-4" />
                            <span>Sign Out</span>
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <button
                  onClick={() => setIsLoginModalOpen(true)}
                  className="flex items-center space-x-2 bg-primary hover:bg-red-700 text-white rounded-full py-1.5 px-4 text-xs font-bold transition-all shadow-md shadow-primary/20 cursor-pointer"
                >
                  <User className="w-3.5 h-3.5" />
                  <span>Sign In</span>
                </button>
              )}
            </div>

            {/* Mobile Menu Hamburger */}
            <button
              className="md:hidden z-50 text-white p-1"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Slide-in Drawer */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.25 }}
              className="fixed inset-0 z-40 bg-zinc-950 md:hidden pt-24 px-6 flex flex-col justify-between pb-8"
            >
              <div className="space-y-6">
                {/* Mobile City Selector (Customer Only) */}
                {!isStaffAdmin && !isStaffManager ? (
                  <button
                    onClick={() => {
                      setIsLocationModalOpen(true);
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full flex items-center justify-between text-base text-zinc-300 border-b border-white/10 pb-4"
                  >
                    <div className="flex items-center space-x-2">
                      <MapPin className="w-5 h-5 text-primary" />
                      <span>City: <strong>{selectedLocation.city}</strong></span>
                    </div>
                    <span className="text-xs text-primary font-bold">Change</span>
                  </button>
                ) : (
                  <div className="flex items-center space-x-2 text-sm text-zinc-300 border-b border-white/10 pb-3">
                    <Building2 className="w-4 h-4 text-emerald-400" />
                    <span>
                      {isStaffAdmin ? 'Central Operations Headquarters' : 'PVR Grand Mall, Velachery'}
                    </span>
                  </div>
                )}

                {/* Mobile Navigation Links */}
                <nav className="flex flex-col space-y-4">
                  {navItems.map((item) => {
                    const isActive = routerLocation.pathname === item.path;
                    return (
                      <Link
                        key={item.label}
                        to={item.path}
                        className={`text-base font-semibold transition-colors flex items-center justify-between ${
                          isActive ? 'text-primary font-bold' : 'text-white hover:text-primary'
                        }`}
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <span>{item.label}</span>
                        {isActive && <span className="w-1.5 h-1.5 rounded-full bg-primary" />}
                      </Link>
                    );
                  })}
                </nav>
                {/* Mobile Theme Toggle */}
                <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                  <span className="text-xs font-semibold text-zinc-400">Display Theme</span>
                  <button
                    type="button"
                    onClick={toggleTheme}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-bold text-white transition-all cursor-pointer"
                  >
                    {isDark ? (
                      <>
                        <Sun className="w-3.5 h-3.5 text-amber-400" />
                        <span>Dark Theme</span>
                      </>
                    ) : (
                      <>
                        <Moon className="w-3.5 h-3.5 text-indigo-400" />
                        <span>Light Theme</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Bottom Mobile Auth */}
              <div className="pt-6 border-t border-white/10">
                {isAuthenticated && user ? (
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3 text-sm text-zinc-300">
                      <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center font-bold text-white">
                        {user.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-bold text-white">{user.name}</p>
                        <p className="text-xs text-zinc-400">{user.email || user.phone}</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      {isStaffAdmin && (
                        <Link
                          to="/admin"
                          onClick={() => setIsMobileMenuOpen(false)}
                          className="p-2.5 rounded-xl bg-purple-500/20 text-purple-300 text-center font-semibold"
                        >
                          Admin Console
                        </Link>
                      )}
                      {isStaffManager && (
                        <Link
                          to="/manager"
                          onClick={() => setIsMobileMenuOpen(false)}
                          className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-300 text-center font-semibold"
                        >
                          Manager Portal
                        </Link>
                      )}
                      {!isStaffAdmin && !isStaffManager && (
                        <Link
                          to="/bookings"
                          onClick={() => setIsMobileMenuOpen(false)}
                          className="p-2.5 rounded-xl bg-white/5 text-center font-semibold text-white"
                        >
                          My Bookings
                        </Link>
                      )}
                      <button
                        onClick={() => {
                          logout();
                          setIsMobileMenuOpen(false);
                          navigate('/');
                        }}
                        className="p-2.5 rounded-xl bg-red-500/10 text-red-400 text-center font-semibold cursor-pointer"
                      >
                        Sign Out
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => {
                      setIsLoginModalOpen(true);
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full flex items-center justify-center space-x-2 bg-primary text-white rounded-xl py-3 font-bold text-sm shadow-lg shadow-primary/30"
                  >
                    <User className="w-4 h-4" />
                    <span>Sign In to CineGo</span>
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Modals */}
      <LoginModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} />
      <LocationModal />
    </>
  );
};
