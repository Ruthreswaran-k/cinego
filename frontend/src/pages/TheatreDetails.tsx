import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MapPin, Star, Calendar, Clock, ArrowRight, ShieldCheck, Navigation, Film } from 'lucide-react';
import { useLocation } from '@/context/LocationContext';
import { Button } from '@/components/common/Button';
import { ALL_THEATRES } from './Theatres';
import { getShowsByTheatreId, DEMO_SHOWS, ShowRecord } from '@/data/showsData';
import { findMovieByIdOrTitle } from '@/data/moviesData';

export const TheatreDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { formatDistance } = useLocation();
  const [selectedDateIdx, setSelectedDateIdx] = useState(0);

  const theatre = ALL_THEATRES.find((t) => t.id === id) || ALL_THEATRES[0];
  const kmDistance = formatDistance(theatre.latitude, theatre.longitude);

  // Generate 7-day calendar starting today (2026-10-05)
  const baseDate = new Date('2026-10-05T00:00:00');
  const dateOptions = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date(baseDate);
    d.setDate(baseDate.getDate() + i);
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    return {
      isoDate: `${yyyy}-${mm}-${dd}`,
      dayNum: d.getDate(),
      dayName: i === 0 ? 'Today' : i === 1 ? 'Tomorrow' : d.toLocaleDateString('en-US', { weekday: 'short' }),
      monthName: d.toLocaleDateString('en-US', { month: 'short' }),
    };
  });

  const selectedDateStr = dateOptions[selectedDateIdx].isoDate;

  // Retrieve valid showtimes at this theatre
  let shows: ShowRecord[] = getShowsByTheatreId(theatre.id, selectedDateStr);
  if (shows.length === 0) {
    // If no shows on specific date, look for any shows at this theatre
    shows = getShowsByTheatreId(theatre.id);
  }
  if (shows.length === 0) {
    // Fallback to first available shows in DEMO_SHOWS
    shows = DEMO_SHOWS.slice(0, 4);
  }

  return (
    <div className="min-h-screen bg-dark text-white pt-32 sm:pt-36 md:pt-40 pb-20 px-4 sm:px-6 lg:px-8 font-display">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Theatre Hero */}
        <div className="glass-card rounded-3xl p-8 border border-white/10 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="flex items-center space-x-2 text-primary text-xs font-bold uppercase tracking-wider mb-2">
                <MapPin className="w-4 h-4" />
                <span>{theatre.city} Cinema Destination</span>
              </div>
              <h1 className="text-3xl sm:text-5xl font-bold text-white">{theatre.name}</h1>
              <p className="text-zinc-400 text-sm mt-2 flex items-center max-w-xl">
                {theatre.address}
              </p>
              <div className="flex flex-wrap items-center gap-4 mt-4 text-xs text-zinc-300">
                <span className="flex items-center text-amber-400 font-bold bg-amber-400/10 px-3 py-1 rounded-full border border-amber-400/20">
                  <Star className="w-3.5 h-3.5 fill-current mr-1.5" /> {theatre.rating} Rating
                </span>
                <span className="flex items-center text-emerald-400 font-bold bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                  <Navigation className="w-3.5 h-3.5 mr-1.5" /> {kmDistance} from your location
                </span>
                <span className="flex items-center text-zinc-400">
                  <Film className="w-3.5 h-3.5 mr-1.5 text-primary" /> {theatre.screens} Auditoriums
                </span>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 md:max-w-xs">
              {theatre.amenities.map((a: string) => (
                <span
                  key={a}
                  className="text-xs px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-zinc-300 flex items-center"
                >
                  <ShieldCheck className="w-3.5 h-3.5 mr-1.5 text-primary" /> {a}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Date Selector Tabs (Next 7 Days) */}
        <div>
          <p className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-3">Select Date</p>
          <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-none">
            {dateOptions.map((opt, i) => {
              const isSelected = selectedDateIdx === i;
              return (
                <button
                  key={opt.isoDate}
                  onClick={() => setSelectedDateIdx(i)}
                  className={`flex-shrink-0 flex flex-col items-center justify-center w-20 py-3 rounded-2xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'border-primary bg-primary text-white shadow-lg shadow-primary/30 font-bold scale-105'
                      : 'border-white/10 bg-zinc-900/60 text-zinc-400 hover:text-white hover:border-white/30'
                  }`}
                >
                  <span className="text-[10px] uppercase font-semibold">{opt.dayName}</span>
                  <span className="text-xl font-bold mt-0.5">{opt.dayNum}</span>
                  <span className="text-[10px] text-zinc-300">{opt.monthName}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Showtime Grid */}
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <h2 className="text-2xl font-bold flex items-center">
              <Calendar className="w-6 h-6 text-primary mr-2" /> Screenings & Showtimes
            </h2>
            <span className="text-xs text-zinc-400">{shows.length} shows scheduled</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {shows.map((show) => {
              const movieMeta = findMovieByIdOrTitle(show.movieId);
              return (
                <div
                  key={show.showId}
                  className="glass-card rounded-2xl p-6 border border-white/10 hover:border-primary/40 transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <span className="text-xs text-primary font-bold tracking-wider uppercase">
                          {show.screenName}
                        </span>
                        <h3 className="text-2xl font-bold text-white mt-0.5">{show.movieTitle}</h3>
                        <p className="text-xs text-zinc-400 mt-0.5">
                          {show.language} • {movieMeta?.genreString || 'Action, Drama'} •{' '}
                          {movieMeta ? `${movieMeta.durationMin}m` : '140m'}
                        </p>
                      </div>
                      <span className="text-xs px-2.5 py-1 rounded-lg font-bold bg-white/10 text-white">
                        {show.format}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 my-4 text-sm text-zinc-300">
                      <span className="flex items-center text-white font-black text-base bg-zinc-900 px-3 py-1.5 rounded-xl border border-white/10">
                        <Clock className="w-4 h-4 mr-1.5 text-primary" /> {show.showTime}
                      </span>
                      <span className="text-zinc-400 text-xs">
                        Admission:{' '}
                        <strong className="text-white text-sm">₹{show.price}</strong>
                      </span>
                      {show.status === 'ALMOST_FULL' || show.availableSeats <= 8 ? (
                        <span className="inline-flex items-center text-[10px] font-bold text-rose-400 bg-rose-500/10 px-2.5 py-1 rounded-lg border border-rose-500/20">
                          <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mr-1.5 animate-pulse" />
                          Almost Full ({show.availableSeats} seats left)
                        </span>
                      ) : show.status === 'FILLING_FAST' || (show.availableSeats > 8 && show.availableSeats <= 22) ? (
                        <span className="inline-flex items-center text-[10px] font-bold text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-lg border border-amber-500/20">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mr-1.5 animate-pulse" />
                          Filling Fast ({show.availableSeats} seats left)
                        </span>
                      ) : (
                        <span className="inline-flex items-center text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5" />
                          Available ({show.availableSeats} seats)
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                    <span className="text-xs text-zinc-500 font-mono">Show #{show.showId}</span>
                    <Link to={`/seats/${show.showId}`}>
                      <Button variant="primary" size="sm" className="rounded-xl px-5 text-xs font-semibold">
                        Select Seats <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                      </Button>
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
