import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Clock, ShieldCheck, ArrowRight, Ticket, Film, Info, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';
import { Button } from '@/components/common/Button';
import toast from 'react-hot-toast';
import { getShowById, DEMO_SHOWS } from '@/data/showsData';
import { findMovieByIdOrTitle } from '@/data/moviesData';

export type SeatTier = 'VIP' | 'FIRST_CLASS' | 'SECOND_CLASS' | 'THIRD_CLASS';

interface SelectedSeat {
  id: string;
  row: string;
  number: number;
  tier: SeatTier;
  tierLabel: string;
  price: number;
}

interface TierDefinition {
  id: SeatTier;
  label: string;
  headerText: string;
  price: number;
  rows: string[];
}

const SeatLockCountdown: React.FC<{ initialSeconds?: number }> = ({ initialSeconds = 600 }) => {
  const [sec, setSec] = useState(initialSeconds);
  useEffect(() => {
    const timer = setInterval(() => {
      setSec((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return (
    <div className="flex items-center space-x-2 bg-amber-500/10 border border-amber-500/20 px-3.5 py-1.5 rounded-xl text-amber-400 text-xs font-semibold">
      <Clock className="w-4 h-4" />
      <span>
        Seat Lock: <strong>{m.toString().padStart(2, '0')}:{s.toString().padStart(2, '0')}</strong>
      </span>
    </div>
  );
};

export const SeatSelection: React.FC = () => {
  const { showId } = useParams<{ showId: string }>();
  const navigate = useNavigate();

  const currentShow = getShowById(showId || '501') || DEMO_SHOWS[0];
  const currentMovie = findMovieByIdOrTitle(currentShow.movieId);

  const [selectedSeats, setSelectedSeats] = useState<SelectedSeat[]>([]);
  const [zoomScale, setZoomScale] = useState<number>(1.0);

  // Persistent booked seats for this show (synced across accounts & browser tabs)
  const showKey = `cinego_booked_seats_${currentShow.showId}`;
  const defaultBooked = [
    'A3', 'A4', 'A11',
    'B2', 'B3', 'B12', 'B13',
    'C10', 'C11', 'C14', 'C15',
    'D8', 'D9', 'D10', 'D11', 'D12',
    'E1', 'E2', 'E14', 'E15', 'E16', 'E22',
    'F9', 'F10', 'F11', 'F12',
    'G10', 'G11', 'G12', 'G13',
    'H14', 'H15',
    'L5', 'L6', 'L7', 'L8', 'L9', 'L10', 'L11', 'L12', 'L13', 'L14', 'L15',
    'M22', 'M23',
    'N10', 'N11', 'N12', 'N13',
    'Q14', 'Q15',
  ];

  const [bookedSeatsList, setBookedSeatsList] = useState<string[]>(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(showKey) || '[]');
      if (Array.isArray(saved) && saved.length > 0) {
        return Array.from(new Set([...defaultBooked, ...saved]));
      }
    } catch {}
    return defaultBooked;
  });

  // Sync booked seats if updated in another tab or checkout
  useEffect(() => {
    const syncBookedSeats = () => {
      try {
        const saved = JSON.parse(localStorage.getItem(showKey) || '[]');
        if (Array.isArray(saved)) {
          setBookedSeatsList(Array.from(new Set([...defaultBooked, ...saved])));
        }
      } catch {}
    };

    window.addEventListener('storage', syncBookedSeats);
    window.addEventListener('cinego_bookings_updated', syncBookedSeats);
    return () => {
      window.removeEventListener('storage', syncBookedSeats);
      window.removeEventListener('cinego_bookings_updated', syncBookedSeats);
    };
  }, [showKey]);

  const bookedSet = new Set(bookedSeatsList);

  // Exact pricing requested by user with First Class, Second Class, and Third Class
  // Calibrated to real ticket pricing from reference screenshot (₹140, ₹100, ₹65)
  const tierDefinitions: TierDefinition[] = [
    {
      id: 'VIP',
      label: 'VIP',
      headerText: 'VIP',
      price: 180,
      rows: ['A'],
    },
    {
      id: 'FIRST_CLASS',
      label: 'First Class',
      headerText: '₹140 FIRST CLASS',
      price: 140,
      rows: ['B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K'],
    },
    {
      id: 'SECOND_CLASS',
      label: 'Second Class',
      headerText: '₹100 SECOND CLASS',
      price: 100,
      rows: ['L', 'M', 'N', 'O', 'P', 'Q', 'R'],
    },
    {
      id: 'THIRD_CLASS',
      label: 'Third Class',
      headerText: '₹65 THIRD CLASS',
      price: 65,
      rows: ['S', 'T'],
    },
  ];

  const getTierInfoForRow = (row: string): { tier: SeatTier; tierLabel: string; price: number } => {
    for (const t of tierDefinitions) {
      if (t.rows.includes(row)) {
        return { tier: t.id, tierLabel: t.label, price: t.price };
      }
    }
    return { tier: 'FIRST_CLASS', tierLabel: 'First Class', price: 140 };
  };

  const handleSeatClick = (row: string, num: number) => {
    const id = `${row}${num}`;
    if (bookedSet.has(id)) return;

    setSelectedSeats((prev) => {
      const exists = prev.some((s) => s.id === id);
      if (exists) {
        return prev.filter((s) => s.id !== id);
      }
      if (prev.length >= 10) {
        toast.error('Maximum 10 seats per booking');
        return prev;
      }
      const { tier, tierLabel, price } = getTierInfoForRow(row);
      return [...prev, { id, row, number: num, tier, tierLabel, price }];
    });
  };

  const ticketSubtotal = selectedSeats.reduce((sum, s) => sum + s.price, 0);
  const convenienceFee = selectedSeats.length * 30; // ₹30 per seat
  const totalAmount = ticketSubtotal + convenienceFee;

  const handleProceed = () => {
    if (selectedSeats.length === 0) {
      toast.error('Please select at least 1 seat to proceed');
      return;
    }
    // Save chosen seats in sessionStorage for checkout pipeline
    sessionStorage.setItem(
      'cinego_current_booking',
      JSON.stringify({
        showId: currentShow.showId,
        movieTitle: currentShow.movieTitle,
        movieId: currentShow.movieId,
        theatreName: `${currentShow.theatreName}, ${currentShow.area}`,
        screenName: currentShow.screenName,
        showTime: currentShow.showTime,
        showDate: currentShow.showDate,
        format: currentShow.format,
        seats: selectedSeats.map((s) => s.id),
        selectedSeatsDetails: selectedSeats,
        ticketSubtotal,
        convenienceFee,
        totalAmount,
      })
    );

    // Route to Food Concessions
    navigate(`/food/${currentShow.showId}`);
  };

  // Helper to render individual seat
  const renderSeat = (row: string, num: number) => {
    const id = `${row}${num}`;
    const isBooked = bookedSet.has(id);
    const isSelected = selectedSeats.some((s) => s.id === id);

    return (
      <button
        key={id}
        onClick={() => handleSeatClick(row, num)}
        disabled={isBooked}
        title={`${row}${num} — ${isBooked ? 'Booked' : isSelected ? 'Selected' : 'Available'}`}
        className={`w-5 h-5 sm:w-6 sm:h-6 md:w-6.5 md:h-6.5 rounded-[4px] text-[8px] sm:text-[9px] md:text-[10px] font-semibold transition-all flex items-center justify-center flex-shrink-0 ${
          isSelected
            ? 'bg-emerald-500 text-white font-extrabold border-2 border-emerald-300 shadow-md shadow-emerald-500/40 scale-105'
            : isBooked
            ? 'bg-zinc-700/60 dark:bg-zinc-800 text-zinc-400 border border-zinc-600/40 cursor-not-allowed opacity-75'
            : 'bg-white/95 dark:bg-zinc-900 border-2 border-emerald-500 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500 hover:text-white hover:border-emerald-500 cursor-pointer shadow-sm'
        }`}
      >
        {num}
      </button>
    );
  };

  // Render row blocks (Left 1-4, Center 5-19, Right 20-23)
  const renderRowLayout = (row: string) => {
    // Row A: VIP Layout (Seats 1-7 left/center, 8-14 center/right)
    if (row === 'A') {
      const leftSeats = [1, 2, 3, 4, 5, 6, 7];
      const rightSeats = [8, 9, 10, 11, 12, 13, 14];
      return (
        <div key={row} className="flex items-center justify-center gap-1.5 sm:gap-2.5 min-w-max my-1">
          <span className="w-4 sm:w-5 text-center text-[10px] font-bold text-zinc-400">{row}</span>
          <div className="flex gap-1 sm:gap-1.5">
            {leftSeats.map((n) => renderSeat(row, n))}
          </div>
          <div className="w-10 sm:w-16" />
          <div className="flex gap-1 sm:gap-1.5">
            {rightSeats.map((n) => renderSeat(row, n))}
          </div>
          <span className="w-4 sm:w-5 text-center text-[10px] font-bold text-zinc-400">{row}</span>
        </div>
      );
    }

    // Rows B & C: Staggered tops like reference screenshot
    if (row === 'B' || row === 'C') {
      const leftSeats = [1, 2, 3, 4];
      const rightSeats = [5, 6, 7, 8];
      return (
        <div key={row} className="flex items-center justify-center gap-1.5 sm:gap-2.5 min-w-max my-1">
          <span className="w-4 sm:w-5 text-center text-[10px] font-bold text-zinc-400">{row}</span>
          <div className="flex gap-1 sm:gap-1.5">
            {leftSeats.map((n) => renderSeat(row, n))}
          </div>
          <div className="w-32 sm:w-44 flex items-center justify-center">
            <span className="text-[9px] text-zinc-600 font-mono tracking-widest">&bull; &bull; &bull;</span>
          </div>
          <div className="flex gap-1 sm:gap-1.5">
            {rightSeats.map((n) => renderSeat(row, n))}
          </div>
          <span className="w-4 sm:w-5 text-center text-[10px] font-bold text-zinc-400">{row}</span>
        </div>
      );
    }

    // Row T: Third Class with slightly shortened center
    if (row === 'T') {
      const leftSeats = [1, 2, 3, 4];
      const centerSeats = [5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];
      const rightSeats = [16, 17, 18, 19];
      return (
        <div key={row} className="flex items-center justify-center gap-1.5 sm:gap-2.5 min-w-max my-1">
          <span className="w-4 sm:w-5 text-center text-[10px] font-bold text-zinc-400">{row}</span>
          <div className="flex gap-1 sm:gap-1.5">
            {leftSeats.map((n) => renderSeat(row, n))}
          </div>
          <div className="w-2.5 sm:w-3.5" />
          <div className="flex gap-1 sm:gap-1.5">
            {centerSeats.map((n) => renderSeat(row, n))}
          </div>
          <div className="w-2.5 sm:w-3.5" />
          <div className="flex gap-1 sm:gap-1.5">
            {rightSeats.map((n) => renderSeat(row, n))}
          </div>
          <span className="w-4 sm:w-5 text-center text-[10px] font-bold text-zinc-400">{row}</span>
        </div>
      );
    }

    // Standard 3-block cinema rows (Rows D-K, L-R, S)
    const leftSeats = [1, 2, 3, 4];
    const centerSeats = [5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19];
    const rightSeats = [20, 21, 22, 23];

    return (
      <div key={row} className="flex items-center justify-center gap-1.5 sm:gap-2.5 min-w-max my-1">
        <span className="w-4 sm:w-5 text-center text-[10px] font-bold text-zinc-400">{row}</span>
        <div className="flex gap-1 sm:gap-1.5">
          {leftSeats.map((n) => renderSeat(row, n))}
        </div>
        {/* Aisle */}
        <div className="w-2.5 sm:w-3.5" />
        <div className="flex gap-1 sm:gap-1.5">
          {centerSeats.map((n) => renderSeat(row, n))}
        </div>
        {/* Aisle */}
        <div className="w-2.5 sm:w-3.5" />
        <div className="flex gap-1 sm:gap-1.5">
          {rightSeats.map((n) => renderSeat(row, n))}
        </div>
        <span className="w-4 sm:w-5 text-center text-[10px] font-bold text-zinc-400">{row}</span>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-dark text-white font-display pt-32 sm:pt-36 md:pt-40 pb-28">
      {/* Top Header Bar */}
      <div className="bg-zinc-950/90 border-b border-white/10 p-4 sm:p-5 sticky top-20 z-20 backdrop-blur-md">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-xl sm:text-2xl font-bold text-white tracking-wide">
                {currentShow.movieTitle} &bull; {currentShow.screenName}
              </h1>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-white/10 text-white font-mono font-bold">
                {currentShow.format}
              </span>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-primary/20 text-primary font-bold">
                {currentMovie?.industry || 'Kollywood'}
              </span>
            </div>
            <p className="text-xs text-zinc-400 mt-1">
              {currentShow.theatreName}, {currentShow.area} &bull; {currentShow.showDate}, {currentShow.showTime}
            </p>
          </div>

          <div className="flex items-center space-x-3 self-start sm:self-auto">
            <SeatLockCountdown initialSeconds={600} />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 mt-8 flex flex-col xl:flex-row gap-8">
        {/* Main Seat Layout Area */}
        <div className="flex-1 glass-card p-4 sm:p-6 md:p-8 rounded-3xl border border-white/10 relative overflow-hidden">
          {/* Controls Bar with Zoom */}
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/10">
            <span className="text-xs text-zinc-400 font-semibold uppercase tracking-wider">
              {currentShow.screenName} Seating Layout
            </span>
            <div className="flex items-center gap-1.5 bg-zinc-900/90 px-2.5 py-1 rounded-xl border border-white/10 text-xs shadow-sm">
              <button
                onClick={() => setZoomScale((prev) => Math.max(0.65, Number((prev - 0.1).toFixed(1))))}
                className="p-1 hover:text-white text-zinc-400 hover:bg-white/10 rounded cursor-pointer transition-colors"
                title="Zoom Out"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <span className="text-[11px] font-mono font-bold text-zinc-300 px-1 min-w-[36px] text-center">
                {Math.round(zoomScale * 100)}%
              </span>
              <button
                onClick={() => setZoomScale((prev) => Math.min(1.3, Number((prev + 0.1).toFixed(1))))}
                className="p-1 hover:text-white text-zinc-400 hover:bg-white/10 rounded cursor-pointer transition-colors"
                title="Zoom In"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setZoomScale(1.0)}
                className="p-1 hover:text-white text-zinc-400 hover:bg-white/10 rounded cursor-pointer transition-colors ml-0.5"
                title="Reset Zoom to 100%"
              >
                <RotateCcw className="w-3 h-3" />
              </button>
            </div>
          </div>

          {/* Zoom and Seating Container */}
          <div className="overflow-x-auto pb-6 scrollbar-thin scrollbar-thumb-white/10">
            <div
              style={{
                transform: `scale(${zoomScale})`,
                transformOrigin: 'top center',
                transition: 'transform 0.15s ease-out',
              }}
              className="space-y-5 min-w-fit max-w-full mx-auto py-2"
            >
              {tierDefinitions.map((tier) => (
                <div key={tier.id} className="space-y-2">
                  {/* Class Header with rate banner matching reference photo */}
                  <div className="relative flex items-center justify-center py-1.5 border-b border-white/10">
                    <span className="text-[11px] sm:text-xs font-extrabold uppercase tracking-widest text-zinc-300 bg-zinc-900/90 px-3.5 py-0.5 rounded-full border border-white/15 shadow-sm">
                      {tier.headerText}
                    </span>
                  </div>

                  {/* Rows for this class */}
                  <div className="space-y-1">
                    {tier.rows.map((row) => renderRowLayout(row))}
                  </div>
                </div>
              ))}

              {/* Realistic Cinema Curved Trapezoid Screen at bottom */}
              <div className="flex flex-col items-center pt-6 pb-2">
                <div className="w-3/5 max-w-md h-8 border-t-4 border-sky-400 bg-gradient-to-b from-sky-400/25 to-transparent rounded-b-[40px] shadow-lg shadow-sky-500/20 flex items-center justify-center">
                  <div className="w-2/3 h-1 bg-sky-300/60 rounded-full blur-[1px]"></div>
                </div>
                <span className="text-sky-300 text-[10px] sm:text-xs mt-2.5 tracking-widest font-semibold uppercase flex items-center gap-1.5">
                  All eyes this way please
                </span>
              </div>
            </div>
          </div>

          {/* Seat Status Legend matching screenshot */}
          <div className="flex flex-wrap items-center justify-center gap-6 mt-6 pt-6 border-t border-white/10 text-xs text-zinc-300">
            <div className="flex items-center space-x-2">
              <div className="w-5 h-5 rounded-md border-2 border-emerald-500 bg-white/95 dark:bg-zinc-900"></div>
              <span>Available</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-5 h-5 rounded-md bg-emerald-500 border-2 border-emerald-300"></div>
              <span>Selected</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-5 h-5 rounded-md bg-zinc-700/60 border border-zinc-600/40"></div>
              <span>Sold / Booked</span>
            </div>
          </div>
        </div>

        {/* Sidebar Order Summary */}
        <div className="w-full xl:w-96">
          <div className="glass-card p-6 rounded-3xl border border-white/10 sticky top-36 space-y-6">
            <h2 className="text-xl font-bold text-white border-b border-white/10 pb-3 flex items-center">
              <Ticket className="w-5 h-5 text-primary mr-2" /> Booking Summary
            </h2>

            {/* Selected Seats List */}
            <div>
              <p className="text-xs text-zinc-400 mb-2 font-medium">Selected Seats ({selectedSeats.length})</p>
              {selectedSeats.length === 0 ? (
                <div className="p-4 rounded-2xl bg-zinc-900/60 border border-dashed border-white/10 text-center text-xs text-zinc-500">
                  Click on any available seat above to begin booking
                </div>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {selectedSeats.map((s) => (
                    <span
                      key={s.id}
                      className="text-xs px-2.5 py-1 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 font-bold flex items-center gap-1"
                    >
                      <span>{s.id}</span>
                      <span className="text-[10px] text-zinc-400 font-normal">({s.tierLabel} &bull; ₹{s.price})</span>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Price Calculations */}
            <div className="space-y-2.5 text-xs text-zinc-300 pt-2 border-t border-white/5">
              {/* Grouped by Tier breakdown */}
              {tierDefinitions.map((tier) => {
                const count = selectedSeats.filter((s) => s.tier === tier.id).length;
                if (count === 0) return null;
                return (
                  <div key={tier.id} className="flex justify-between text-zinc-400">
                    <span>
                      {tier.label} ({count} &times; ₹{tier.price})
                    </span>
                    <span className="font-mono text-white">₹{count * tier.price}</span>
                  </div>
                );
              })}

              <div className="flex justify-between pt-1">
                <span className="text-zinc-400">Tickets Subtotal</span>
                <span className="font-mono font-bold text-white">₹{ticketSubtotal}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">Convenience Fee (₹30 &times; {selectedSeats.length})</span>
                <span className="font-mono text-zinc-300">₹{convenienceFee}</span>
              </div>
              <div className="border-t border-white/10 pt-3 flex justify-between items-center text-sm font-bold text-white">
                <span>Total Amount</span>
                <span className="text-xl font-extrabold text-primary font-mono">₹{totalAmount}</span>
              </div>
            </div>

            <Button
              variant="primary"
              size="lg"
              className="w-full rounded-2xl font-bold flex items-center justify-center shadow-lg shadow-primary/20"
              onClick={handleProceed}
              disabled={selectedSeats.length === 0}
            >
              <span>Proceed to Food & Concessions</span>
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>

            <div className="flex items-center justify-center space-x-2 text-[11px] text-zinc-500">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              <span>Real-time instant seat locking enabled</span>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Zoom Control Badge matching the reference screenshot */}
      <div className="fixed bottom-6 right-6 z-30 flex items-center gap-2 bg-blue-600/90 hover:bg-blue-600 text-white px-4 py-2.5 rounded-2xl shadow-2xl backdrop-blur-md transition-all text-xs font-semibold border border-blue-400/40">
        <span className="hidden sm:inline">The layout can be zoomed in/out</span>
        <span className="sm:hidden">Zoom</span>
        <div className="flex items-center gap-1.5 ml-2 pl-2 border-l border-white/20">
          <button
            onClick={() => setZoomScale((prev) => Math.max(0.7, Number((prev - 0.1).toFixed(1))))}
            title="Zoom Out"
            className="p-1 hover:bg-white/20 rounded-lg transition-colors cursor-pointer"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <span className="text-[11px] font-mono font-bold min-w-[36px] text-center">
            {Math.round(zoomScale * 100)}%
          </span>
          <button
            onClick={() => setZoomScale((prev) => Math.min(1.4, Number((prev + 0.1).toFixed(1))))}
            title="Zoom In"
            className="p-1 hover:bg-white/20 rounded-lg transition-colors cursor-pointer"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
          {zoomScale !== 1.0 && (
            <button
              onClick={() => setZoomScale(1.0)}
              title="Reset Zoom"
              className="p-1 hover:bg-white/20 rounded-lg transition-colors cursor-pointer ml-1"
            >
              <RotateCcw className="w-3 h-3 text-white/80" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
