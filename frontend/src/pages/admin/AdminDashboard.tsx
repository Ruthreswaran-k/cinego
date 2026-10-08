import React from 'react';
import { Link } from 'react-router-dom';
import { Film, MonitorPlay, Ticket, DollarSign, Users, TrendingUp, ArrowRight, ShieldCheck, Building2, Coins, Sliders } from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  return (
    <div className="space-y-8">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-white">Platform Administration Hub</h1>
          <p className="text-zinc-400 text-sm mt-1">
            Centralized operations control for movie releases, showtime scheduling, pricing, discounts, and revenue.
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <span className="text-xs px-3 py-1.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold flex items-center">
            <ShieldCheck className="w-3.5 h-3.5 mr-1.5" /> High Availability Infrastructure Active
          </span>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="glass-card p-6 rounded-2xl border border-white/10">
          <p className="text-zinc-400 text-xs font-semibold uppercase tracking-wider">Gross Box Office</p>
          <p className="text-3xl font-display font-bold mt-2 text-emerald-400">₹ 1,842,500</p>
          <span className="text-xs text-emerald-400/80 mt-3 block font-semibold flex items-center">
            <TrendingUp className="w-3.5 h-3.5 mr-1" /> +14.2% platform growth
          </span>
        </div>

        <div className="glass-card p-6 rounded-2xl border border-white/10">
          <p className="text-zinc-400 text-xs font-semibold uppercase tracking-wider">Total Confirmed Bookings</p>
          <p className="text-3xl font-display font-bold mt-2 text-white">5,842</p>
          <span className="text-xs text-zinc-400 mt-3 block">Across all partner cinemas</span>
        </div>

        <div className="glass-card p-6 rounded-2xl border border-white/10">
          <p className="text-zinc-400 text-xs font-semibold uppercase tracking-wider">Catalogue Titles</p>
          <p className="text-3xl font-display font-bold mt-2 text-amber-400">10 Titles</p>
          <span className="text-xs text-zinc-400 mt-3 block">8 Running • 2 Upcoming</span>
        </div>

        <Link to="/admin/theatres" className="glass-card p-6 rounded-2xl border border-white/10 hover:border-emerald-500/40 transition-all block">
          <p className="text-zinc-400 text-xs font-semibold uppercase tracking-wider flex items-center justify-between">
            <span>Cinemas & Theatres</span>
            <span className="text-[10px] text-amber-400 font-bold bg-amber-400/10 px-1.5 py-0.5 rounded border border-amber-400/20">1 Pending Audit</span>
          </p>
          <p className="text-3xl font-display font-bold mt-2 text-blue-400">8 Verified</p>
          <span className="text-xs text-emerald-400 mt-3 block font-semibold flex items-center">
            <ShieldCheck className="w-3.5 h-3.5 mr-1 text-emerald-400" /> 100% Gov License Verified
          </span>
        </Link>
      </div>

      {/* Quick Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Link
          to="/admin/pricing"
          className="glass-card p-5 rounded-2xl border border-amber-500/30 bg-amber-500/5 hover:border-amber-500 transition-all group flex flex-col justify-between"
        >
          <div>
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center mb-3">
              <Coins className="w-5 h-5" />
            </div>
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-base text-white group-hover:text-amber-400 transition-colors">Pricing Governance</h3>
              <span className="text-[10px] text-amber-400 font-bold bg-amber-400/10 px-1.5 py-0.5 rounded border border-amber-400/20">Floor / Ceiling</span>
            </div>
            <p className="text-xs text-zinc-400 mt-1">Platform price floors (₹60), ceilings (₹500), ₹30 fee, 18% GST & overrides.</p>
          </div>
          <span className="text-xs text-amber-400 font-bold flex items-center mt-3">
            Manage Platform Rules <ArrowRight className="w-3.5 h-3.5 ml-1" />
          </span>
        </Link>

        <Link
          to="/admin/theatres"
          className="glass-card p-5 rounded-2xl border border-emerald-500/30 bg-emerald-500/5 hover:border-emerald-500 transition-all group flex flex-col justify-between"
        >
          <div>
            <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-3">
              <Building2 className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-white group-hover:text-emerald-400 transition-colors">Theatre KYC</h3>
            <p className="text-xs text-zinc-400 mt-1">Audit Cinematograph licenses & approve partner cinemas.</p>
          </div>
          <span className="text-xs text-emerald-400 font-bold flex items-center mt-3">
            Audit Queue (1) <ArrowRight className="w-3.5 h-3.5 ml-1" />
          </span>
        </Link>

        <Link
          to="/admin/movies"
          className="glass-card p-5 rounded-2xl border border-white/10 hover:border-primary/40 transition-all group flex flex-col justify-between"
        >
          <div>
            <div className="w-9 h-9 rounded-xl bg-primary/20 text-primary flex items-center justify-center mb-3">
              <Film className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-white group-hover:text-primary transition-colors">Manage Movies</h3>
            <p className="text-xs text-zinc-400 mt-1">Add movies, set runtime, certificate, and poster assets.</p>
          </div>
          <span className="text-xs text-primary font-bold flex items-center mt-3">
            Open Catalogue <ArrowRight className="w-3.5 h-3.5 ml-1" />
          </span>
        </Link>

        <Link
          to="/admin/shows"
          className="glass-card p-5 rounded-2xl border border-white/10 hover:border-emerald-500/40 transition-all group flex flex-col justify-between"
        >
          <div>
            <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-3">
              <MonitorPlay className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-white group-hover:text-emerald-400 transition-colors">Schedule Shows</h3>
            <p className="text-xs text-zinc-400 mt-1">Assign auditoriums and generate tiered seating layouts.</p>
          </div>
          <span className="text-xs text-emerald-400 font-bold flex items-center mt-3">
            Open Scheduler <ArrowRight className="w-3.5 h-3.5 ml-1" />
          </span>
        </Link>

        <Link
          to="/admin/coupons"
          className="glass-card p-5 rounded-2xl border border-white/10 hover:border-amber-500/40 transition-all group flex flex-col justify-between"
        >
          <div>
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center mb-3">
              <DollarSign className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-white group-hover:text-amber-400 transition-colors">Promos & Coupons</h3>
            <p className="text-xs text-zinc-400 mt-1">Configure discount codes, caps, and expiry dates.</p>
          </div>
          <span className="text-xs text-amber-400 font-bold flex items-center mt-3">
            Manage Offers <ArrowRight className="w-3.5 h-3.5 ml-1" />
          </span>
        </Link>

        <Link
          to="/admin/screens"
          className="glass-card p-5 rounded-2xl border border-white/10 hover:border-blue-500/40 transition-all group flex flex-col justify-between"
        >
          <div>
            <div className="w-9 h-9 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center mb-3">
              <MonitorPlay className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-white group-hover:text-blue-400 transition-colors">Screens & Audis</h3>
            <p className="text-xs text-zinc-400 mt-1">Manage projection formats (IMAX, Atmos) and base rates.</p>
          </div>
          <span className="text-xs text-blue-400 font-bold flex items-center mt-3">
            Configure Screens <ArrowRight className="w-3.5 h-3.5 ml-1" />
          </span>
        </Link>

        <Link
          to="/admin/reports"
          className="glass-card p-5 rounded-2xl border border-white/10 hover:border-purple-500/40 transition-all group flex flex-col justify-between"
        >
          <div>
            <div className="w-9 h-9 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center mb-3">
              <TrendingUp className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-white group-hover:text-purple-400 transition-colors">Financial Reports</h3>
            <p className="text-xs text-zinc-400 mt-1">Platform analytics, occupancy rates, and PDF export.</p>
          </div>
          <span className="text-xs text-purple-400 font-bold flex items-center mt-3">
            View Analytics <ArrowRight className="w-3.5 h-3.5 ml-1" />
          </span>
        </Link>
      </div>

      {/* Platform Pricing Governance Safeguards Live Status Card */}
      <div className="glass-card rounded-2xl border border-amber-500/20 p-6 bg-gradient-to-r from-amber-500/5 via-zinc-900/60 to-zinc-950">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
              <Coins className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">CinemaBook Platform Pricing Safeguards</h3>
              <p className="text-xs text-zinc-400">Anti-gouging boundaries enforced on all partner theatre managers</p>
            </div>
          </div>
          <Link
            to="/admin/pricing"
            className="px-4 py-2 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 text-amber-300 text-xs font-bold transition-all flex items-center gap-1.5 w-fit"
          >
            <span>Configure Policy Rules</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 text-xs">
          <div className="p-3 rounded-xl bg-zinc-900/80 border border-white/5 space-y-1">
            <span className="text-zinc-400 uppercase text-[10px] font-bold">Price Floor (Min)</span>
            <p className="text-lg font-black font-mono text-emerald-400">₹60</p>
            <span className="text-[10px] text-zinc-500 block">Blocks predatory undercutting</span>
          </div>

          <div className="p-3 rounded-xl bg-zinc-900/80 border border-white/5 space-y-1">
            <span className="text-zinc-400 uppercase text-[10px] font-bold">Price Ceiling (Max)</span>
            <p className="text-lg font-black font-mono text-primary">₹500</p>
            <span className="text-[10px] text-zinc-500 block">Standard 2D/3D release cap</span>
          </div>

          <div className="p-3 rounded-xl bg-zinc-900/80 border border-white/5 space-y-1">
            <span className="text-zinc-400 uppercase text-[10px] font-bold">Convenience Fee</span>
            <p className="text-lg font-black font-mono text-white">₹30 / seat</p>
            <span className="text-[10px] text-zinc-500 block">₹25 Tech + ₹5 PG levy</span>
          </div>

          <div className="p-3 rounded-xl bg-zinc-900/80 border border-white/5 space-y-1">
            <span className="text-zinc-400 uppercase text-[10px] font-bold">Tax Structure</span>
            <p className="text-lg font-black font-mono text-amber-400">18% GST</p>
            <span className="text-[10px] text-zinc-500 block">9% CGST + 9% SGST</span>
          </div>
        </div>
      </div>

      {/* Recent Admissions Feed */}
      <div className="glass-card rounded-2xl border border-white/10 p-6">
        <div className="flex items-center justify-between mb-6 pb-2 border-b border-white/10">
          <h3 className="text-lg font-bold text-white flex items-center">
            <Ticket className="w-5 h-5 text-primary mr-2" /> Recent Transaction Stream (BOOKINGS Table)
          </h3>
          <Link to="/admin/bookings" className="text-xs text-primary hover:underline font-semibold">
            View All Entries →
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-zinc-300">
            <thead className="bg-zinc-900/60 text-xs uppercase text-zinc-400">
              <tr>
                <th className="py-3 px-4">Booking ID</th>
                <th className="py-3 px-4">Movie</th>
                <th className="py-3 px-4">Show Date</th>
                <th className="py-3 px-4">Amount</th>
                <th className="py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {[
                { id: 5001, movie: 'Baththa', date: '06 Oct 2026', amount: 620, status: 'CONFIRMED' },
                { id: 5002, movie: 'Yezhu Kadal Yezhu Malai', date: '02 Oct 2026', amount: 280, status: 'CONFIRMED' },
                { id: 5003, movie: 'Digger', date: '28 Sep 2026', amount: 760, status: 'CANCELLED' },
                { id: 5004, movie: 'Sigma', date: '02 Oct 2026', amount: 460, status: 'CONFIRMED' },
                { id: 5005, movie: 'The Third Murder', date: '01 Oct 2026', amount: 930, status: 'CONFIRMED' },
              ].map(b => (
                <tr key={b.id} className="hover:bg-white/5 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-bold text-zinc-400">#{b.id}</td>
                  <td className="py-3.5 px-4 font-bold text-white">{b.movie}</td>
                  <td className="py-3.5 px-4 font-mono text-xs">{b.date}</td>
                  <td className="py-3.5 px-4 font-bold font-display text-white">₹{b.amount}</td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`text-xs px-2.5 py-0.5 rounded-full font-bold ${
                        b.status === 'CONFIRMED'
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          : 'bg-red-500/10 text-red-400 border border-red-500/20'
                      }`}
                    >
                      {b.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
