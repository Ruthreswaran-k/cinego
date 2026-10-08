import React, { useState } from 'react';
import { Ticket, Search, CheckCircle2, XCircle, Clock, User, Film, MapPin, Download } from 'lucide-react';
import { Button } from '@/components/common/Button';
import toast from 'react-hot-toast';

interface AdminBookingRecord {
  id: number;
  customerName: string;
  customerEmail: string;
  movieTitle: string;
  theatreName: string;
  showDate: string;
  seats: string;
  amount: number;
  status: 'CONFIRMED' | 'PENDING' | 'CANCELLED';
  createdAt: string;
}

const ALL_BOOKINGS: AdminBookingRecord[] = [
  { id: 5001, customerName: 'Karthik S', customerEmail: 'karthik2026@gmail.com', movieTitle: 'Baththa', theatreName: 'PVR INOX', showDate: '2026-10-06 07:30 PM', seats: 'A4, A5', amount: 620, status: 'CONFIRMED', createdAt: '2026-10-04' },
  { id: 5002, customerName: 'Ravi Kumar', customerEmail: 'ravi@gmail.com', movieTitle: 'Yezhu Kadal Yezhu Malai', theatreName: 'CinemaVerse', showDate: '2026-10-02 01:30 PM', seats: 'C7', amount: 280, status: 'CONFIRMED', createdAt: '2026-09-30' },
  { id: 5003, customerName: 'Priya M', customerEmail: 'priya@gmail.com', movieTitle: 'Digger', theatreName: 'PVR Grand Mall', showDate: '2026-10-04 10:30 AM', seats: 'F10, F11', amount: 760, status: 'CANCELLED', createdAt: '2026-09-25' },
  { id: 5004, customerName: 'Suresh Raina', customerEmail: 'suresh@gmail.com', movieTitle: 'Sigma', theatreName: 'Rohini Silver Screens', showDate: '2026-10-05 04:30 PM', seats: 'B1, B2', amount: 460, status: 'CONFIRMED', createdAt: '2026-10-01' },
  { id: 5005, customerName: 'Anitha Roy', customerEmail: 'anitha@gmail.com', movieTitle: 'The Third Murder', theatreName: 'AGS Cinemas T.Nagar', showDate: '2026-10-05 07:30 PM', seats: 'E5, E6, E7', amount: 930, status: 'CONFIRMED', createdAt: '2026-09-29' },
  { id: 5006, customerName: 'Deepak V', customerEmail: 'deepak@gmail.com', movieTitle: 'Tony', theatreName: 'INOX Brookefields', showDate: '2026-10-05 10:30 AM', seats: 'H12', amount: 410, status: 'PENDING', createdAt: '2026-10-04' },
];

export const AdminBookings: React.FC = () => {
  const [filter, setFilter] = useState<'ALL' | 'CONFIRMED' | 'CANCELLED' | 'PENDING'>('ALL');
  const [query, setQuery] = useState('');

  const filtered = ALL_BOOKINGS.filter(b => {
    const matchesTab = filter === 'ALL' || b.status === filter;
    const matchesQuery =
      b.customerName.toLowerCase().includes(query.toLowerCase()) ||
      b.customerEmail.toLowerCase().includes(query.toLowerCase()) ||
      b.movieTitle.toLowerCase().includes(query.toLowerCase()) ||
      b.id.toString().includes(query);
    return matchesTab && matchesQuery;
  });

  const handleExportCSV = () => {
    const headers = ['Booking ID', 'Customer Name', 'Customer Email', 'Movie Title', 'Theatre', 'Show Date & Time', 'Seats', 'Amount (INR)', 'Status', 'Created Date'];
    const rows = filtered.map(b => [
      b.id,
      `"${b.customerName}"`,
      `"${b.customerEmail}"`,
      `"${b.movieTitle}"`,
      `"${b.theatreName}"`,
      `"${b.showDate}"`,
      `"${b.seats}"`,
      b.amount,
      b.status,
      b.createdAt
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `cinego_bookings_ledger_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success(`Exported ${filtered.length} booking records to CSV!`);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-white">Central Bookings Ledger</h1>
          <p className="text-zinc-400 text-sm mt-1">
            Global ledger of Oracle transactions under <code className="text-primary font-mono font-bold">BOOKINGS</code>, <code className="text-primary font-mono font-bold">TICKETS</code>, and <code className="text-primary font-mono font-bold">PAYMENTS</code>.
          </p>
        </div>
        <Button onClick={handleExportCSV} variant="outline" className="rounded-xl flex items-center text-xs cursor-pointer">
          <Download className="w-4 h-4 mr-2" /> Export to CSV
        </Button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex space-x-2 bg-zinc-900/60 p-1.5 rounded-2xl border border-white/5 w-fit">
          {(['ALL', 'CONFIRMED', 'PENDING', 'CANCELLED'] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                filter === f ? 'bg-primary text-white' : 'text-zinc-400 hover:text-white'
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        <div className="glass-card rounded-2xl p-2.5 px-4 border border-white/10 flex items-center w-full sm:w-80">
          <Search className="w-4 h-4 text-zinc-400 mr-2.5" />
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search booking ID, customer, movie..."
            className="bg-transparent border-none text-white text-xs w-full focus:outline-none placeholder-zinc-500"
          />
        </div>
      </div>

      {/* Bookings Table */}
      <div className="glass-card rounded-2xl border border-white/10 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-zinc-300">
            <thead className="bg-zinc-900/90 text-xs uppercase text-zinc-400 border-b border-white/10">
              <tr>
                <th className="px-6 py-4">Booking ID</th>
                <th className="px-6 py-4">Customer</th>
                <th className="px-6 py-4">Movie</th>
                <th className="px-6 py-4">Cinema Theatre</th>
                <th className="px-6 py-4">Show Schedule</th>
                <th className="px-6 py-4">Seats</th>
                <th className="px-6 py-4">Amount</th>
                <th className="px-6 py-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filtered.map(b => (
                <tr key={b.id} className="hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4 font-mono font-bold text-zinc-400">#{b.id}</td>
                  <td className="px-6 py-4">
                    <span className="font-semibold text-white block">{b.customerName}</span>
                    <span className="text-xs text-zinc-500">{b.customerEmail}</span>
                  </td>
                  <td className="px-6 py-4 font-bold text-white flex items-center">
                    <Film className="w-4 h-4 mr-2 text-primary" /> {b.movieTitle}
                  </td>
                  <td className="px-6 py-4 text-zinc-300">{b.theatreName}</td>
                  <td className="px-6 py-4 font-mono text-xs">{b.showDate}</td>
                  <td className="px-6 py-4 font-bold text-primary text-xs">{b.seats}</td>
                  <td className="px-6 py-4 font-bold font-display text-white">₹{b.amount}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`text-xs px-2.5 py-0.5 rounded-full font-bold flex items-center w-fit ${
                        b.status === 'CONFIRMED'
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          : b.status === 'PENDING'
                          ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                          : 'bg-red-500/10 text-red-400 border border-red-500/20'
                      }`}
                    >
                      {b.status === 'CONFIRMED' && <CheckCircle2 className="w-3 h-3 mr-1" />}
                      {b.status === 'PENDING' && <Clock className="w-3 h-3 mr-1" />}
                      {b.status === 'CANCELLED' && <XCircle className="w-3 h-3 mr-1" />}
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
