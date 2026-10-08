import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Ticket, Calendar, Clock, MapPin, AlertCircle, RefreshCw, XCircle, CheckCircle2, ChevronRight, Eye } from 'lucide-react';
import { Button } from '@/components/common/Button';
import toast from 'react-hot-toast';

interface BookingRecord {
  id: string;
  showId?: string;
  movieTitle: string;
  posterGradient: string;
  theatreName: string;
  screenName: string;
  showDate: string;
  showTime: string;
  seats: string[];
  totalAmount: number;
  status: 'CONFIRMED' | 'COMPLETED' | 'CANCELLED';
  bookingDate: string;
  customerEmail?: string;
}

const MOCK_BOOKINGS: BookingRecord[] = [
  {
    id: '5001',
    showId: '501',
    movieTitle: 'Baththa',
    posterGradient: 'from-red-900 to-black',
    theatreName: 'PVR INOX, White Town',
    screenName: 'Screen 1 - Dolby Atmos',
    showDate: '2026-10-06',
    showTime: '07:30 PM',
    seats: ['A4', 'A5'],
    totalAmount: 620,
    status: 'CONFIRMED',
    bookingDate: '2026-10-04'
  },
  {
    id: '5002',
    showId: '502',
    movieTitle: 'Yezhu Kadal Yezhu Malai',
    posterGradient: 'from-purple-900 to-black',
    theatreName: 'CinemaVerse, Lawspet',
    screenName: 'Audi 1 - 2D',
    showDate: '2026-10-02',
    showTime: '01:30 PM',
    seats: ['C7'],
    totalAmount: 280,
    status: 'COMPLETED',
    bookingDate: '2026-09-30'
  },
  {
    id: '5003',
    showId: '503',
    movieTitle: 'Digger',
    posterGradient: 'from-blue-900 to-black',
    theatreName: 'PVR Grand Mall',
    screenName: 'Audi 3 - Dolby Atmos',
    showDate: '2026-10-04',
    showTime: '10:30 AM',
    seats: ['D10', 'D11'],
    totalAmount: 560,
    status: 'COMPLETED',
    bookingDate: '2026-10-02'
  },
  {
    id: '5004',
    showId: '504',
    movieTitle: 'The Third Murder',
    posterGradient: 'from-amber-900 to-black',
    theatreName: 'AGS Cinemas T.Nagar',
    screenName: 'Screen 3',
    showDate: '2026-09-28',
    showTime: '10:30 AM',
    seats: ['F10', 'F11'],
    totalAmount: 760,
    status: 'CANCELLED',
    bookingDate: '2026-09-25'
  }
];

export const BookingHistory: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'UPCOMING' | 'COMPLETED' | 'CANCELLED'>('UPCOMING');
  
  const [bookings, setBookings] = useState<BookingRecord[]>(() => {
    try {
      const saved = localStorage.getItem('cinego_customer_bookings');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const userBookingIds = new Set(parsed.map((b: any) => String(b.id)));
          const filteredMocks = MOCK_BOOKINGS.filter((m) => !userBookingIds.has(String(m.id)));
          return [...parsed, ...filteredMocks];
        }
      }
    } catch {}
    return MOCK_BOOKINGS;
  });

  const [cancellingId, setCancellingId] = useState<string | null>(null);

  // Sync bookings in real-time across tabs / checkout
  useEffect(() => {
    const handleSync = () => {
      try {
        const saved = localStorage.getItem('cinego_customer_bookings');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) {
            const userBookingIds = new Set(parsed.map((b: any) => String(b.id)));
            const filteredMocks = MOCK_BOOKINGS.filter((m) => !userBookingIds.has(String(m.id)));
            setBookings([...parsed, ...filteredMocks]);
          }
        }
      } catch {}
    };

    window.addEventListener('storage', handleSync);
    window.addEventListener('cinego_bookings_updated', handleSync);
    return () => {
      window.removeEventListener('storage', handleSync);
      window.removeEventListener('cinego_bookings_updated', handleSync);
    };
  }, []);

  const filteredBookings = bookings.filter(b => {
    if (activeTab === 'UPCOMING') return b.status === 'CONFIRMED';
    if (activeTab === 'COMPLETED') return b.status === 'COMPLETED';
    return b.status === 'CANCELLED';
  });

  const handleCancel = (id: string) => {
    const target = bookings.find((b) => String(b.id) === String(id));
    const updated = bookings.map((b) => (String(b.id) === String(id) ? { ...b, status: 'CANCELLED' as const } : b));
    setBookings(updated);

    // Persist to localStorage
    try {
      const saved = JSON.parse(localStorage.getItem('cinego_customer_bookings') || '[]');
      if (Array.isArray(saved)) {
        const updatedSaved = saved.map((b: any) => (String(b.id) === String(id) ? { ...b, status: 'CANCELLED' } : b));
        localStorage.setItem('cinego_customer_bookings', JSON.stringify(updatedSaved));
      }
    } catch {}

    // Free up booked seats
    if (target && target.showId && target.seats) {
      try {
        const showKey = `cinego_booked_seats_${target.showId}`;
        const existingSeats: string[] = JSON.parse(localStorage.getItem(showKey) || '[]');
        const freedSeats = existingSeats.filter((s) => !target.seats.includes(s));
        localStorage.setItem(showKey, JSON.stringify(freedSeats));
      } catch {}
    }

    setCancellingId(null);
    window.dispatchEvent(new Event('cinego_bookings_updated'));
    toast.success(`Booking #${id} cancelled successfully. Seats released and refund initiated!`);
  };

  return (
    <div className="min-h-screen bg-dark text-white pt-32 sm:pt-36 md:pt-40 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 pb-6 border-b border-white/10">
          <div>
            <div className="flex items-center space-x-2 text-primary font-medium text-sm mb-1 uppercase tracking-wider">
              <Ticket className="w-4 h-4" />
              <span>Customer Portal</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-display font-bold">My Movie Bookings</h1>
            <p className="text-zinc-400 mt-1">Review past admissions, access active e-tickets, or process cancellation refunds.</p>
          </div>
          <div className="mt-4 md:mt-0">
            <Link to="/movies">
              <Button variant="primary" className="rounded-xl">
                Explore More Shows
              </Button>
            </Link>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex space-x-2 mb-8 bg-zinc-900/60 p-1.5 rounded-2xl w-fit border border-white/5">
          {(['UPCOMING', 'COMPLETED', 'CANCELLED'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                activeTab === tab
                  ? 'bg-primary text-white shadow-lg shadow-primary/30'
                  : 'text-zinc-400 hover:text-white hover:bg-white/5'
              }`}
            >
              {tab.charAt(0) + tab.slice(1).toLowerCase()}
            </button>
          ))}
        </div>

        {/* Booking List */}
        {filteredBookings.length === 0 ? (
          <div className="glass-card rounded-2xl p-12 text-center max-w-md mx-auto">
            <Ticket className="w-12 h-12 text-zinc-600 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-white mb-1">No {activeTab.toLowerCase()} bookings</h3>
            <p className="text-zinc-400 text-sm mb-6">Looks like you don't have any reservations under this category.</p>
            <Link to="/movies">
              <Button variant="outline" size="sm">Book a Movie</Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredBookings.map(b => (
              <div
                key={b.id}
                className="glass-card rounded-2xl p-6 border border-white/10 hover:border-white/20 transition-all flex flex-col md:flex-row md:items-center justify-between gap-6"
              >
                <div className="flex items-start space-x-5">
                  <div className={`w-20 h-28 rounded-xl bg-gradient-to-br ${b.posterGradient} flex-shrink-0 flex items-center justify-center p-2 text-center text-xs font-bold text-white/50 border border-white/10`}>
                    {b.movieTitle}
                  </div>
                  <div>
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="text-xs px-2.5 py-0.5 rounded-full font-mono font-bold bg-white/10 text-zinc-300">
                        #{b.id}
                      </span>
                      {b.status === 'CONFIRMED' && (
                        <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center">
                          <CheckCircle2 className="w-3 h-3 mr-1" /> Confirmed
                        </span>
                      )}
                      {b.status === 'COMPLETED' && (
                        <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-zinc-500/10 text-zinc-400 border border-zinc-500/20">
                          Watched
                        </span>
                      )}
                      {b.status === 'CANCELLED' && (
                        <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-red-500/10 text-red-400 border border-red-500/20 flex items-center">
                          <XCircle className="w-3 h-3 mr-1" /> Cancelled & Refunded
                        </span>
                      )}
                    </div>
                    <h2 className="text-2xl font-bold font-display text-white">{b.movieTitle}</h2>
                    <p className="text-sm text-zinc-400 flex items-center mt-1">
                      <MapPin className="w-3.5 h-3.5 mr-1 text-primary" />
                      {b.theatreName} • {b.screenName}
                    </p>
                    <div className="flex flex-wrap items-center gap-4 mt-3 text-xs text-zinc-300">
                      <span className="flex items-center">
                        <Calendar className="w-3.5 h-3.5 mr-1 text-zinc-500" />
                        {b.showDate}
                      </span>
                      <span className="flex items-center">
                        <Clock className="w-3.5 h-3.5 mr-1 text-zinc-500" />
                        {b.showTime}
                      </span>
                      <span className="font-semibold text-primary">
                        Seats: {b.seats.join(', ')}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col md:items-end justify-between border-t md:border-t-0 pt-4 md:pt-0 border-white/5">
                  <div className="text-left md:text-right mb-4">
                    <p className="text-xs text-zinc-400">Total Paid</p>
                    <p className="text-2xl font-display font-bold text-white">₹{b.totalAmount}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Link to={`/ticket/${b.id}`}>
                      <Button variant="outline" size="sm" className="rounded-xl text-xs">
                        <Eye className="w-3.5 h-3.5 mr-1.5" /> View E-Ticket
                      </Button>
                    </Link>
                    {b.status === 'CONFIRMED' && (
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => setCancellingId(b.id)}
                        className="rounded-xl text-xs"
                      >
                        Cancel
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Cancellation Confirmation Dialog */}
        {cancellingId && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="glass-card rounded-2xl max-w-md w-full p-6 border border-white/20 animate-scale-in">
              <div className="w-12 h-12 rounded-full bg-red-500/20 text-red-400 flex items-center justify-center mb-4">
                <AlertCircle className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold font-display text-white mb-2">Cancel Reservation #{cancellingId}?</h3>
              <p className="text-sm text-zinc-300 mb-4 leading-relaxed">
                Are you sure you want to cancel this booking? Your seats will be released back to the seating inventory and a refund will be initiated to your original payment method.
              </p>
              <div className="flex justify-end space-x-3">
                <Button variant="ghost" onClick={() => setCancellingId(null)}>
                  Keep Booking
                </Button>
                <Button variant="danger" onClick={() => handleCancel(cancellingId)}>
                  Confirm Cancellation
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Customer Reassurance Footer */}
        <div className="mt-12 p-4 rounded-xl bg-zinc-900/40 border border-white/5 flex items-center space-x-3 text-xs text-zinc-400">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          <span>Tickets purchased on CineGo can be presented directly at the theatre entrance barcode turnstiles.</span>
        </div>
      </div>
    </div>
  );
};
