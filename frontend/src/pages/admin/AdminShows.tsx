import React, { useState } from 'react';
import { Calendar, Plus, Clock, MapPin, Film, CheckCircle2, Layers } from 'lucide-react';
import { Button } from '@/components/common/Button';
import toast from 'react-hot-toast';

import { DEMO_SHOWS } from '@/data/showsData';
import { ALL_MOVIES, findMovieByIdOrTitle } from '@/data/moviesData';

interface ShowItem {
  id: number;
  movieTitle: string;
  theatreName: string;
  screenName: string;
  date: string;
  time: string;
  basePrice: number;
  format: string;
  totalSeats: number;
}

const INITIAL_SHOWS: ShowItem[] = DEMO_SHOWS.map((s) => ({
  id: Number(s.showId),
  movieTitle: s.movieTitle,
  theatreName: s.theatreName,
  screenName: s.screenName,
  date: s.showDate,
  time: s.showTime,
  basePrice: s.price,
  format: s.format,
  totalSeats: s.totalSeats,
}));

export const AdminShows: React.FC = () => {
  const [shows, setShows] = useState<ShowItem[]>(INITIAL_SHOWS);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    showId: 541,
    movieId: 'MOV001',
    movieTitle: 'Baththa',
    theatreName: 'PVR INOX',
    screenId: 301,
    screenName: 'Screen 1',
    date: '2026-10-08',
    time: '04:30 PM',
    basePrice: 220,
    format: '2D',
  });

  const handleCreateShow = (e: React.FormEvent) => {
    e.preventDefault();

    const newShow: ShowItem = {
      id: formData.showId,
      movieTitle: formData.movieTitle,
      theatreName: formData.theatreName,
      screenName: formData.screenName,
      date: formData.date,
      time: formData.time,
      basePrice: Number(formData.basePrice),
      format: formData.format,
      totalSeats: 85,
    };

    setShows(prev => [newShow, ...prev]);
    setIsModalOpen(false);
    toast.success(
      `Show scheduled for ${formData.movieTitle} at ${formData.theatreName} (${formData.time})! 85 seats initialized.`
    );
    setFormData(prev => ({ ...prev, showId: prev.showId + 1 }));
  };

  return (
    <div className="space-y-8 font-display">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-white">Show Scheduling & Seat Allocator</h1>
          <p className="text-zinc-400 text-sm mt-1">
            Assign movies to auditoriums, schedule screening dates & showtimes, and automatically allocate tiered seating maps.
          </p>
        </div>
        <Button variant="primary" onClick={() => setIsModalOpen(true)} className="rounded-xl flex items-center">
          <Plus className="w-4 h-4 mr-2" /> Schedule New Show
        </Button>
      </div>

      {/* Shows Table */}
      <div className="glass-card rounded-2xl border border-white/10 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-zinc-300">
            <thead className="bg-zinc-900/90 text-xs uppercase text-zinc-400 border-b border-white/10">
              <tr>
                <th className="px-6 py-4">Show ID</th>
                <th className="px-6 py-4">Movie</th>
                <th className="px-6 py-4">Theatre & Screen</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Time</th>
                <th className="px-6 py-4">Base Price</th>
                <th className="px-6 py-4">Format</th>
                <th className="px-6 py-4">Capacity</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {shows.map(s => (
                <tr key={s.id} className="hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4 font-mono font-bold text-zinc-400">#{s.id}</td>
                  <td className="px-6 py-4 font-bold text-white flex items-center">
                    <Film className="w-4 h-4 mr-2 text-primary" /> {s.movieTitle}
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-semibold text-zinc-200">{s.theatreName}</span>
                    <span className="text-xs text-zinc-500 block">{s.screenName}</span>
                  </td>
                  <td className="px-6 py-4 font-mono text-xs">{s.date}</td>
                  <td className="px-6 py-4 font-semibold text-emerald-400 flex items-center">
                    <Clock className="w-3.5 h-3.5 mr-1" /> {s.time}
                  </td>
                  <td className="px-6 py-4 font-bold font-display text-white">₹{s.basePrice}</td>
                  <td className="px-6 py-4">
                    <span className="text-xs px-2.5 py-0.5 rounded-full bg-white/10 text-white font-mono">
                      {s.format}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-zinc-400">
                    <span className="flex items-center text-xs">
                      <Layers className="w-3.5 h-3.5 mr-1 text-primary" /> {s.totalSeats} seats
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal for CREATE_SHOW */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="glass-card rounded-2xl max-w-lg w-full p-6 border border-white/20 animate-scale-in">
            <h2 className="text-xl font-bold font-display text-white mb-2 flex items-center">
              <Calendar className="w-5 h-5 text-primary mr-2" /> CREATE_SHOW Procedure
            </h2>
            <p className="text-xs text-zinc-400 mb-4">
              Creating a show will execute the Oracle PL/SQL block that automatically inserts individual seat inventory into <code className="text-zinc-200">SHOW_SEATS</code> with premium/regular price surcharges.
            </p>
            <form onSubmit={handleCreateShow} className="space-y-4 text-sm">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-zinc-400 text-xs mb-1 font-semibold">Show ID</label>
                  <input
                    type="number"
                    value={formData.showId}
                    disabled
                    className="w-full bg-zinc-900 border border-white/10 rounded-xl px-4 py-2.5 text-zinc-500 cursor-not-allowed"
                  />
                </div>
                <div>
                  <label className="block text-zinc-400 text-xs mb-1 font-semibold">Movie Selection</label>
                  <select
                    value={formData.movieId}
                    onChange={(e) => {
                      const mId = e.target.value;
                      const selected = findMovieByIdOrTitle(mId);
                      setFormData({
                        ...formData,
                        movieId: mId,
                        movieTitle: selected?.title || 'Movie',
                      });
                    }}
                    className="w-full bg-zinc-900 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-primary"
                  >
                    {ALL_MOVIES.map((m) => (
                      <option key={m.movieId} value={m.movieId}>
                        {m.movieId} - {m.title} ({m.language}) [{m.status}]
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-zinc-400 text-xs mb-1 font-semibold">Cinema Theatre</label>
                  <select
                    value={formData.theatreName}
                    onChange={e => setFormData({ ...formData, theatreName: e.target.value })}
                    className="w-full bg-zinc-900 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-primary"
                  >
                    <option value="PVR Grand Mall">PVR Grand Mall</option>
                    <option value="AGS Cinemas T.Nagar">AGS Cinemas T.Nagar</option>
                    <option value="INOX Brookefields">INOX Brookefields</option>
                  </select>
                </div>
                <div>
                  <label className="block text-zinc-400 text-xs mb-1 font-semibold">Screen ID</label>
                  <select
                    value={formData.screenId}
                    onChange={e => setFormData({ ...formData, screenId: Number(e.target.value), screenName: `Screen ${e.target.value}` })}
                    className="w-full bg-zinc-900 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-primary"
                  >
                    <option value={301}>301 (Audi 1 - 2D)</option>
                    <option value={302}>302 (Audi 2 - Dolby)</option>
                    <option value={305}>305 (Audi 1 - IMAX)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-zinc-400 text-xs mb-1 font-semibold">Date</label>
                  <input
                    type="date"
                    required
                    value={formData.date}
                    onChange={e => setFormData({ ...formData, date: e.target.value })}
                    className="w-full bg-zinc-900 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block text-zinc-400 text-xs mb-1 font-semibold">Showtime Slot</label>
                  <select
                    value={formData.time}
                    onChange={e => setFormData({ ...formData, time: e.target.value })}
                    className="w-full bg-zinc-900 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-primary"
                  >
                    <option value="10:30 AM">10:30 AM</option>
                    <option value="01:30 PM">01:30 PM</option>
                    <option value="04:30 PM">04:30 PM</option>
                    <option value="07:30 PM">07:30 PM</option>
                    <option value="10:30 PM">10:30 PM</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-zinc-400 text-xs mb-1 font-semibold">Base Price (₹)</label>
                  <input
                    type="number"
                    min="100"
                    max="1000"
                    value={formData.basePrice}
                    onChange={e => setFormData({ ...formData, basePrice: Number(e.target.value) })}
                    className="w-full bg-zinc-900 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block text-zinc-400 text-xs mb-1 font-semibold">Format</label>
                  <select
                    value={formData.format}
                    onChange={e => setFormData({ ...formData, format: e.target.value })}
                    className="w-full bg-zinc-900 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-primary"
                  >
                    <option value="2D">2D</option>
                    <option value="3D">3D</option>
                    <option value="IMAX">IMAX</option>
                    <option value="Dolby Atmos">Dolby Atmos</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t border-white/10">
                <Button variant="ghost" type="button" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </Button>
                <Button variant="primary" type="submit">
                  Execute CREATE_SHOW
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
