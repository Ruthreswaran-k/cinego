import React, { useState } from 'react';
import { MonitorPlay, Building2, Layers, CheckCircle2, AlertCircle, Plus, Settings, DollarSign, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/common/Button';
import toast from 'react-hot-toast';

interface ScreenConfig {
  id: number;
  theatreName: string;
  city: string;
  screenName: string;
  format: string;
  totalSeats: number;
  premiumRows: string;
  regularRows: string;
  reclinerRows: string;
  basePrice: number;
  status: 'ACTIVE' | 'MAINTENANCE';
}

const DEFAULT_SCREENS: ScreenConfig[] = [
  {
    id: 301,
    theatreName: 'PVR INOX, White Town',
    city: 'Puducherry',
    screenName: 'Screen 1',
    format: 'Dolby Atmos 7.1',
    totalSeats: 85,
    premiumRows: 'A, B, C (₹280)',
    regularRows: 'D, E, F, G (₹200)',
    reclinerRows: 'J (₹380)',
    basePrice: 200,
    status: 'ACTIVE',
  },
  {
    id: 302,
    theatreName: 'PVR INOX, White Town',
    city: 'Puducherry',
    screenName: 'Audi 2',
    format: '2D Digital 4K',
    totalSeats: 85,
    premiumRows: 'A, B, C (₹260)',
    regularRows: 'D, E, F, G (₹180)',
    reclinerRows: 'J (₹350)',
    basePrice: 180,
    status: 'ACTIVE',
  },
  {
    id: 303,
    theatreName: 'PVR Grand Mall',
    city: 'Chennai',
    screenName: 'Screen 1 - P[XL]',
    format: 'Dolby Atmos Giant Screen',
    totalSeats: 85,
    premiumRows: 'A, B, C (₹320)',
    regularRows: 'D, E, F, G (₹240)',
    reclinerRows: 'J (₹420)',
    basePrice: 240,
    status: 'ACTIVE',
  },
  {
    id: 304,
    theatreName: 'PVR Grand Mall',
    city: 'Chennai',
    screenName: 'Audi 3',
    format: 'IMAX Laser 3D',
    totalSeats: 85,
    premiumRows: 'A, B, C (₹380)',
    regularRows: 'D, E, F, G (₹300)',
    reclinerRows: 'J (₹480)',
    basePrice: 300,
    status: 'ACTIVE',
  },
  {
    id: 305,
    theatreName: 'INOX Brookefields',
    city: 'Coimbatore',
    screenName: 'Audi 1',
    format: 'Dolby 7.1',
    totalSeats: 85,
    premiumRows: 'A, B, C (₹280)',
    regularRows: 'D, E, F, G (₹200)',
    reclinerRows: 'J (₹380)',
    basePrice: 200,
    status: 'ACTIVE',
  },
  {
    id: 306,
    theatreName: 'AGS Cinemas T.Nagar',
    city: 'Chennai',
    screenName: 'Screen 3',
    format: '4K Projection',
    totalSeats: 85,
    premiumRows: 'A, B, C (₹250)',
    regularRows: 'D, E, F, G (₹190)',
    reclinerRows: 'J (₹320)',
    basePrice: 190,
    status: 'MAINTENANCE',
  },
];

export const AdminScreens: React.FC = () => {
  const [screens, setScreens] = useState<ScreenConfig[]>(DEFAULT_SCREENS);
  const [selectedScreen, setSelectedScreen] = useState<ScreenConfig | null>(null);
  const [editingPrice, setEditingPrice] = useState<number>(200);

  const handleToggleScreenStatus = (id: number) => {
    setScreens((prev) =>
      prev.map((s) => {
        if (s.id === id) {
          const next = s.status === 'ACTIVE' ? 'MAINTENANCE' : 'ACTIVE';
          toast.success(`${s.theatreName} - ${s.screenName} marked as ${next}`);
          return { ...s, status: next };
        }
        return s;
      })
    );
  };

  const handleSavePrice = () => {
    if (!selectedScreen) return;
    setScreens((prev) =>
      prev.map((s) => (s.id === selectedScreen.id ? { ...s, basePrice: Number(editingPrice) } : s))
    );
    toast.success(`Base price for ${selectedScreen.screenName} updated to ₹${editingPrice}`);
    setSelectedScreen(null);
  };

  return (
    <div className="space-y-8 font-display">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-primary font-bold text-xs uppercase tracking-wider mb-1">
            <MonitorPlay className="w-4 h-4" />
            <span>Auditorium & Sound Infrastructure</span>
          </div>
          <h1 className="text-3xl font-bold text-white">Cinema Screens & Multiplex Configuration</h1>
          <p className="text-zinc-400 text-sm mt-1">
            Manage partner theatre auditoriums, projection & audio formats, seating tiers, and default base price rules.
          </p>
        </div>
      </div>

      {/* Screen Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {screens.map((screen) => (
          <div
            key={screen.id}
            className="glass-card rounded-2xl p-6 border border-white/10 flex flex-col justify-between hover:border-white/20 transition-all space-y-4"
          >
            <div>
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-white/10 text-zinc-300">
                    Audi #{screen.id}
                  </span>
                  <h3 className="text-lg font-bold text-white mt-1.5">{screen.screenName}</h3>
                  <p className="text-xs text-zinc-400 flex items-center">
                    <Building2 className="w-3.5 h-3.5 mr-1 text-primary" />
                    {screen.theatreName} ({screen.city})
                  </p>
                </div>

                <button
                  onClick={() => handleToggleScreenStatus(screen.id)}
                  className={`text-[10px] px-2.5 py-1 rounded-full font-bold flex items-center cursor-pointer transition-all ${
                    screen.status === 'ACTIVE'
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                      : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                  }`}
                >
                  {screen.status === 'ACTIVE' ? (
                    <CheckCircle2 className="w-3 h-3 mr-1" />
                  ) : (
                    <AlertCircle className="w-3 h-3 mr-1" />
                  )}
                  {screen.status}
                </button>
              </div>

              <div className="mt-4 pt-3 border-t border-white/5 space-y-2 text-xs text-zinc-300">
                <div className="flex justify-between">
                  <span className="text-zinc-500">Audio/Format:</span>
                  <span className="font-semibold text-white">{screen.format}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500">Capacity:</span>
                  <span className="font-mono font-bold">{screen.totalSeats} Physical Seats</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500">Base Ticket Price:</span>
                  <span className="font-mono font-bold text-emerald-400">₹{screen.basePrice}</span>
                </div>
              </div>

              <div className="mt-3 p-3 rounded-xl bg-zinc-900/60 border border-white/5 text-[11px] space-y-1 text-zinc-400">
                <p>
                  <strong className="text-amber-400">Premium:</strong> {screen.premiumRows}
                </p>
                <p>
                  <strong className="text-zinc-300">Executive:</strong> {screen.regularRows}
                </p>
                <p>
                  <strong className="text-purple-400">Recliner:</strong> {screen.reclinerRows}
                </p>
              </div>
            </div>

            <div className="pt-2 border-t border-white/5 flex items-center justify-between">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSelectedScreen(screen);
                  setEditingPrice(screen.basePrice);
                }}
                className="w-full text-xs rounded-xl flex items-center justify-center"
              >
                <Settings className="w-3.5 h-3.5 mr-1.5" /> Adjust Pricing Rules
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Pricing Modal */}
      {selectedScreen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="glass-card rounded-2xl max-w-md w-full p-6 border border-white/20 animate-scale-in space-y-4">
            <h3 className="text-lg font-bold text-white">
              Pricing Configuration: {selectedScreen.screenName}
            </h3>
            <p className="text-xs text-zinc-400">
              {selectedScreen.theatreName} &bull; {selectedScreen.format}
            </p>

            <div className="space-y-3 pt-2">
              <div>
                <label className="text-xs text-zinc-400 block mb-1">Standard Base Price (₹)</label>
                <input
                  type="number"
                  value={editingPrice}
                  onChange={(e) => setEditingPrice(Number(e.target.value))}
                  className="w-full bg-zinc-900 border border-white/10 rounded-xl px-3 py-2 text-white font-mono focus:outline-none focus:border-primary"
                />
              </div>

              <div className="p-3 rounded-xl bg-zinc-900 text-xs text-zinc-400 space-y-1">
                <p>Derived Seating Tiers:</p>
                <p>&bull; Executive: <strong>₹{editingPrice}</strong></p>
                <p>&bull; Premium (Rows A-C): <strong>₹{editingPrice + 80}</strong></p>
                <p>&bull; Luxury Recliner (Row J): <strong>₹{editingPrice + 180}</strong></p>
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-3 border-t border-white/10">
              <Button variant="ghost" onClick={() => setSelectedScreen(null)}>
                Cancel
              </Button>
              <Button variant="primary" onClick={handleSavePrice}>
                Update Pricing
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
