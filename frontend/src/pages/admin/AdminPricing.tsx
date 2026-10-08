import React, { useState } from 'react';
import { 
  Shield, 
  Coins, 
  Sliders, 
  Percent, 
  AlertTriangle, 
  CheckCircle2, 
  TrendingUp, 
  Building2, 
  Lock, 
  Info, 
  FileText, 
  RefreshCw,
  SlidersHorizontal,
  XCircle,
  Eye,
  ArrowRight
} from 'lucide-react';
import toast from 'react-hot-toast';

interface PricingException {
  id: string;
  theatreName: string;
  screenName: string;
  seatClass: string;
  proposedPrice: number;
  ruleViolated: 'CEILING_BREACH' | 'FLOOR_BREACH' | 'SURGE_ANOMALY';
  excessAmount: number;
  submittedAt: string;
  status: 'PENDING' | 'APPROVED' | 'OVERRIDDEN' | 'SUSPENDED';
}

const INITIAL_EXCEPTIONS: PricingException[] = [
  {
    id: 'PRC-EX-101',
    theatreName: 'Rohini Silver Screens, Chennai',
    screenName: 'Main Screen 1 (Dolby Atmos)',
    seatClass: 'Recliner VIP Lounge',
    proposedPrice: 550,
    ruleViolated: 'CEILING_BREACH',
    excessAmount: 50,
    submittedAt: 'Today, 09:15 AM',
    status: 'PENDING',
  },
  {
    id: 'PRC-EX-102',
    theatreName: 'AGS Cinemas, T.Nagar',
    screenName: 'Audi 3 (Digital 2D)',
    seatClass: 'Morning Regular (Early Bird)',
    proposedPrice: 50,
    ruleViolated: 'FLOOR_BREACH',
    excessAmount: -10,
    submittedAt: 'Yesterday, 04:30 PM',
    status: 'PENDING',
  },
  {
    id: 'PRC-EX-103',
    theatreName: 'SPI Palazzo, Pondicherry',
    screenName: 'IMAX Laser 4K',
    seatClass: 'Weekend Prime Recliner',
    proposedPrice: 480,
    ruleViolated: 'SURGE_ANOMALY',
    excessAmount: 0,
    submittedAt: '02 Oct 2026',
    status: 'APPROVED',
  },
];

export const AdminPricing: React.FC = () => {
  // Platform-wide governance rules state
  const [minPriceFloor, setMinPriceFloor] = useState<number>(60);
  const [maxPriceCeiling, setMaxPriceCeiling] = useState<number>(500);
  const [convenienceFee, setConvenienceFee] = useState<number>(30);
  const [gstTaxRate, setGstTaxRate] = useState<number>(18);
  const [isDynamicSurgeEnabled, setIsDynamicSurgeEnabled] = useState<boolean>(true);
  const [surgeOccupancyThreshold, setSurgeOccupancyThreshold] = useState<number>(80);
  const [maxSurgePercent, setMaxSurgePercent] = useState<number>(15);
  const [autoCapEnabled, setAutoCapEnabled] = useState<boolean>(true);

  // Exceptions queue
  const [exceptions, setExceptions] = useState<PricingException[]>(INITIAL_EXCEPTIONS);

  const handleApproveException = (id: string, theatre: string) => {
    setExceptions(prev => prev.map(item => item.id === id ? { ...item, status: 'APPROVED' } : item));
    toast.success(`Exception granted for ${theatre}. Rate card published.`);
  };

  const handleOverrideException = (id: string, theatre: string) => {
    setExceptions(prev => prev.map(item => item.id === id ? { ...item, status: 'OVERRIDDEN', proposedPrice: maxPriceCeiling } : item));
    toast.success(`Overridden: Rate for ${theatre} capped strictly at ₹${maxPriceCeiling}.`);
  };

  const handleSuspendTheatre = (id: string, theatre: string) => {
    setExceptions(prev => prev.map(item => item.id === id ? { ...item, status: 'SUSPENDED' } : item));
    toast.error(`Suspended custom pricing for ${theatre}. Reverted to standard catalog baseline.`);
  };

  const handleSavePlatformRules = (e: React.FormEvent) => {
    e.preventDefault();
    if (minPriceFloor >= maxPriceCeiling) {
      toast.error('Price floor cannot be equal to or higher than price ceiling');
      return;
    }
    toast.success('CinemaBook platform-wide pricing rules successfully updated and broadcast to all theatres!');
  };

  return (
    <div className="space-y-8 font-display">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-primary text-xs font-bold uppercase tracking-wider mb-1">
            <Coins className="w-4 h-4" />
            <span>Platform Governance & Safeguards</span>
          </div>
          <h1 className="text-3xl font-display font-bold text-white">Platform Pricing Policy & Rules</h1>
          <p className="text-zinc-400 text-sm mt-1 max-w-2xl leading-relaxed">
            CinemaBook Admin controls platform-wide pricing boundaries: minimum floors, maximum caps, convenience fees, tax models, dynamic surge policies, and exceptional rate card auditing.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <span className="text-xs px-3.5 py-1.5 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20 font-bold flex items-center">
            <Shield className="w-3.5 h-3.5 mr-1.5 text-purple-400" />
            CBIC & Anti-Gouging Compliance Active
          </span>
        </div>
      </div>

      {/* Real-world Architecture Explainer Banner */}
      <div className="glass-card rounded-3xl p-6 border border-purple-500/20 bg-gradient-to-r from-purple-950/20 via-zinc-900/60 to-zinc-950/80">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-400 flex-shrink-0">
            <SlidersHorizontal className="w-6 h-6" />
          </div>
          <div className="space-y-2">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              Pricing Responsibility Separation in Real-World Systems
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-zinc-300">
              <div className="p-3.5 rounded-xl bg-zinc-900/80 border border-white/5 space-y-1">
                <span className="font-bold text-emerald-400 flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5" /> Theatre Manager / Owner Decides:
                </span>
                <p className="text-zinc-400 leading-relaxed text-[11px]">
                  Sets base price per screen, seat class rates (Regular, Premium, Executive, Recliner), morning discounts, and weekend/holiday surcharges based on local demand.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-zinc-900/80 border border-white/5 space-y-1">
                <span className="font-bold text-purple-400 flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5" /> CinemaBook Admin Controls:
                </span>
                <p className="text-zinc-400 leading-relaxed text-[11px]">
                  Governs system-wide boundaries (Floor ₹60, Ceiling ₹500), ₹30 convenience fee, 18% GST rules, dynamic surge algorithms, and overrides abnormal pricing requests.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Governance Form */}
      <form onSubmit={handleSavePlatformRules} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Platform Boundary Rules */}
        <div className="lg:col-span-7 space-y-6">
          <div className="glass-card rounded-3xl p-6 border border-white/10 space-y-5">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Lock className="w-5 h-5 text-amber-400" />
              1. Platform Price Floor & Ceiling Boundaries
            </h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              No cinema partner can price tickets below the floor (prevents unfair undercutting) or above the ceiling (prevents consumer price-gouging during major releases).
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Price Floor */}
              <div className="p-4 rounded-2xl bg-zinc-900/90 border border-white/10 space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-zinc-300">Minimum Allowed Price (Floor)</span>
                  <span className="text-emerald-400 font-mono font-bold text-sm">₹{minPriceFloor}</span>
                </div>
                <p className="text-[10.5px] text-zinc-500">
                  Tickets priced under ₹{minPriceFloor} are blocked automatically by the database API.
                </p>
                <div className="flex items-center gap-2 pt-1">
                  <span className="text-xs text-zinc-400 font-bold">₹</span>
                  <input
                    type="number"
                    min={40}
                    max={150}
                    value={minPriceFloor}
                    onChange={(e) => setMinPriceFloor(Number(e.target.value))}
                    className="w-full bg-zinc-950 border border-white/20 rounded-xl px-3 py-2 text-sm font-bold text-white font-mono focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              {/* Price Ceiling */}
              <div className="p-4 rounded-2xl bg-zinc-900/90 border border-white/10 space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-zinc-300">Maximum Allowed Price (Ceiling)</span>
                  <span className="text-primary font-mono font-bold text-sm">₹{maxPriceCeiling}</span>
                </div>
                <p className="text-[10.5px] text-zinc-500">
                  Standard cap across 2D/3D screenings. Recliners requiring &gt;₹{maxPriceCeiling} need audit approval.
                </p>
                <div className="flex items-center gap-2 pt-1">
                  <span className="text-xs text-zinc-400 font-bold">₹</span>
                  <input
                    type="number"
                    min={200}
                    max={1000}
                    value={maxPriceCeiling}
                    onChange={(e) => setMaxPriceCeiling(Number(e.target.value))}
                    className="w-full bg-zinc-950 border border-white/20 rounded-xl px-3 py-2 text-sm font-bold text-white font-mono focus:outline-none focus:border-primary"
                  />
                </div>
              </div>
            </div>

            {/* Auto-Capping Toggle */}
            <div className="p-4 rounded-2xl bg-zinc-900 border border-white/5 flex items-center justify-between gap-4">
              <div>
                <span className="text-xs font-bold text-white block">Automatic Hard-Cap Enforcement</span>
                <span className="text-[11px] text-zinc-400">
                  If theatre sets pricing above ₹{maxPriceCeiling}, automatically clamp customer price to ₹{maxPriceCeiling}.
                </span>
              </div>
              <button
                type="button"
                onClick={() => setAutoCapEnabled(!autoCapEnabled)}
                className={`w-12 h-6 rounded-full transition-all relative cursor-pointer ${autoCapEnabled ? 'bg-primary' : 'bg-zinc-700'}`}
              >
                <span className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-all ${autoCapEnabled ? 'right-1' : 'left-1'}`} />
              </button>
            </div>
          </div>

          {/* Platform Convenience Fee & Tax Model */}
          <div className="glass-card rounded-3xl p-6 border border-white/10 space-y-5">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Percent className="w-5 h-5 text-emerald-400" />
              2. Convenience Fee & GST Tax Configuration
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Convenience Fee */}
              <div className="p-4 rounded-2xl bg-zinc-900/90 border border-white/10 space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-zinc-300">Platform Convenience Fee / Seat</span>
                  <span className="text-emerald-400 font-mono font-bold text-sm">₹{convenienceFee}</span>
                </div>
                <p className="text-[10.5px] text-zinc-500">
                  Flat platform fee retained by CineGo per booked ticket (₹25 tech fee + ₹5 banking levy).
                </p>
                <div className="flex items-center gap-2 pt-1">
                  <span className="text-xs text-zinc-400 font-bold">₹</span>
                  <input
                    type="number"
                    min={10}
                    max={60}
                    value={convenienceFee}
                    onChange={(e) => setConvenienceFee(Number(e.target.value))}
                    className="w-full bg-zinc-950 border border-white/20 rounded-xl px-3 py-2 text-sm font-bold text-white font-mono focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              {/* GST Tax Rate */}
              <div className="p-4 rounded-2xl bg-zinc-900/90 border border-white/10 space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-zinc-300">Cinema Admission GST Rate</span>
                  <span className="text-amber-400 font-mono font-bold text-sm">{gstTaxRate}%</span>
                </div>
                <p className="text-[10.5px] text-zinc-500">
                  Split into 9% CGST (Central) and 9% SGST (State) according to CBIC notifications.
                </p>
                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="number"
                    min={12}
                    max={28}
                    value={gstTaxRate}
                    onChange={(e) => setGstTaxRate(Number(e.target.value))}
                    className="w-full bg-zinc-950 border border-white/20 rounded-xl px-3 py-2 text-sm font-bold text-white font-mono focus:outline-none focus:border-amber-500"
                  />
                  <span className="text-xs text-zinc-400 font-bold">%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Dynamic Pricing & Surge Algorithms */}
          <div className="glass-card rounded-3xl p-6 border border-white/10 space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-blue-400" />
                  3. Dynamic Surge Pricing Engine
                </h3>
                <p className="text-xs text-zinc-400">
                  Automatically adjust seat rates when auditorium occupancy exceeds peak thresholds.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsDynamicSurgeEnabled(!isDynamicSurgeEnabled)}
                className={`w-12 h-6 rounded-full transition-all relative cursor-pointer ${isDynamicSurgeEnabled ? 'bg-blue-600' : 'bg-zinc-700'}`}
              >
                <span className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-all ${isDynamicSurgeEnabled ? 'right-1' : 'left-1'}`} />
              </button>
            </div>

            {isDynamicSurgeEnabled && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="p-3.5 rounded-2xl bg-zinc-900 border border-white/5 space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-zinc-300 font-semibold">Occupancy Surge Trigger</span>
                    <span className="text-blue-400 font-mono font-bold">&gt; {surgeOccupancyThreshold}% Full</span>
                  </div>
                  <input
                    type="range"
                    min={60}
                    max={95}
                    step={5}
                    value={surgeOccupancyThreshold}
                    onChange={(e) => setSurgeOccupancyThreshold(Number(e.target.value))}
                    className="w-full accent-blue-500 cursor-pointer"
                  />
                  <span className="text-[10px] text-zinc-500 block">Surge activates when screen reaches 80% occupancy.</span>
                </div>

                <div className="p-3.5 rounded-2xl bg-zinc-900 border border-white/5 space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-zinc-300 font-semibold">Maximum Surge Multiplier</span>
                    <span className="text-emerald-400 font-mono font-bold">Up to +{maxSurgePercent}%</span>
                  </div>
                  <input
                    type="range"
                    min={5}
                    max={25}
                    step={5}
                    value={maxSurgePercent}
                    onChange={(e) => setMaxSurgePercent(Number(e.target.value))}
                    className="w-full accent-emerald-500 cursor-pointer"
                  />
                  <span className="text-[10px] text-zinc-500 block">Dynamic lift capped so prices never breach ₹{maxPriceCeiling}.</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Exceptional Pricing Queue & Save */}
        <div className="lg:col-span-5 space-y-6">
          {/* Action Button */}
          <button
            type="submit"
            className="w-full py-4 rounded-2xl bg-primary hover:bg-red-700 text-white font-bold text-sm shadow-xl shadow-primary/30 flex items-center justify-center transition-all cursor-pointer"
          >
            <Shield className="w-5 h-5 mr-2" />
            Apply & Broadcast Platform Pricing Rules
          </button>

          {/* Unusual Pricing Approval Queue */}
          <div className="glass-card rounded-3xl p-6 border border-white/10 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div>
                <h4 className="text-base font-bold text-white flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-400" />
                  Unusual Pricing Auditing Queue
                </h4>
                <p className="text-xs text-zinc-400">
                  Rate cards flagged for violating platform bounds or surge thresholds.
                </p>
              </div>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-400/10 text-amber-400 font-bold border border-amber-400/20">
                {exceptions.filter(e => e.status === 'PENDING').length} Pending
              </span>
            </div>

            <div className="space-y-3">
              {exceptions.map((ex) => (
                <div key={ex.id} className="p-4 rounded-2xl bg-zinc-900/90 border border-white/10 space-y-3">
                  <div className="flex justify-between items-start gap-2">
                    <div>
                      <span className="text-xs font-bold text-white block">{ex.theatreName}</span>
                      <span className="text-[11px] text-zinc-400">{ex.screenName} &bull; {ex.seatClass}</span>
                    </div>
                    <span className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase font-mono ${
                      ex.status === 'PENDING' ? 'bg-amber-400/10 text-amber-400 border border-amber-400/20' :
                      ex.status === 'APPROVED' ? 'bg-emerald-400/10 text-emerald-400 border border-emerald-400/20' :
                      ex.status === 'OVERRIDDEN' ? 'bg-blue-400/10 text-blue-400 border border-blue-400/20' :
                      'bg-red-400/10 text-red-400 border border-red-400/20'
                    }`}>
                      {ex.status}
                    </span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-black/40 border border-white/5 flex items-center justify-between text-xs font-mono">
                    <span className="text-zinc-400">Requested Rate:</span>
                    <span className="text-white font-bold text-sm">₹{ex.proposedPrice}</span>
                    <span className={`text-[11px] font-bold ${ex.excessAmount > 0 ? 'text-primary' : 'text-amber-400'}`}>
                      ({ex.excessAmount > 0 ? `+₹${ex.excessAmount} over cap` : `${ex.excessAmount} below floor`})
                    </span>
                  </div>

                  {ex.status === 'PENDING' && (
                    <div className="grid grid-cols-3 gap-2 pt-1 text-[11px] font-bold">
                      <button
                        type="button"
                        onClick={() => handleApproveException(ex.id, ex.theatreName)}
                        className="py-1.5 px-2 rounded-lg bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-400 border border-emerald-500/30 transition-all cursor-pointer"
                      >
                        Approve
                      </button>
                      <button
                        type="button"
                        onClick={() => handleOverrideException(ex.id, ex.theatreName)}
                        className="py-1.5 px-2 rounded-lg bg-blue-500/15 hover:bg-blue-500/25 text-blue-400 border border-blue-500/30 transition-all cursor-pointer"
                      >
                        Cap at ₹{maxPriceCeiling}
                      </button>
                      <button
                        type="button"
                        onClick={() => handleSuspendTheatre(ex.id, ex.theatreName)}
                        className="py-1.5 px-2 rounded-lg bg-red-500/15 hover:bg-red-500/25 text-red-400 border border-red-500/30 transition-all cursor-pointer"
                      >
                        Suspend
                      </button>
                    </div>
                  )}

                  {ex.status !== 'PENDING' && (
                    <div className="text-[10px] text-zinc-500 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                      <span>Resolution audited by Chief Administrator</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Current Live Breakdown Preview */}
          <div className="p-5 rounded-3xl bg-zinc-900/90 border border-white/10 space-y-3">
            <span className="text-xs font-bold text-zinc-300 uppercase tracking-wider block">
              Sample ₹200 Ticket Customer Invoice:
            </span>
            <div className="space-y-1.5 text-xs text-zinc-400">
              <div className="flex justify-between">
                <span>Theatre Base Ticket Price:</span>
                <span className="text-white font-mono">₹200.00</span>
              </div>
              <div className="flex justify-between">
                <span>CinemaBook Platform Convenience Fee:</span>
                <span className="text-white font-mono">₹{convenienceFee}.00</span>
              </div>
              <div className="flex justify-between">
                <span>GST ({gstTaxRate}% on Ticket & Fee):</span>
                <span className="text-white font-mono">₹{((200 + convenienceFee) * (gstTaxRate / 100)).toFixed(2)}</span>
              </div>
              <div className="pt-2 border-t border-white/10 flex justify-between font-bold text-emerald-400 text-sm">
                <span>Final Customer Bill:</span>
                <span className="font-mono">₹{(200 + convenienceFee + (200 + convenienceFee) * (gstTaxRate / 100)).toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};
