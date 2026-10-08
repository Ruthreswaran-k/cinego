import React, { useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  Calendar,
  Clock,
  Film,
  MapPin,
  ChevronDown,
  Heart,
  Smartphone,
  Utensils,
  AlertCircle,
  Info
} from 'lucide-react';
import { useLocation } from '@/context/LocationContext';
import { ALL_THEATRES } from './Theatres';
import { ALL_MOVIES, Movie, findMovieByIdOrTitle, getNowShowingMovies } from '@/data/moviesData';
import { getShowsByMovieId, validateShowtime } from '@/data/showsData';
import { cleanScreenDisplay } from '@/utils/format';
import toast from 'react-hot-toast';

export const ShowSelection: React.FC = () => {
  const [searchParams] = useSearchParams();
  const movieParam = searchParams.get('movie') || 'MOV001';
  const theatreId = searchParams.get('theatre');
  const { selectedLocation, formatDistance } = useLocation();
  const [selectedDateIdx, setSelectedDateIdx] = useState(0);
  const [priceFilter, setPriceFilter] = useState<string>('All');
  const [timeFilter, setTimeFilter] = useState<string>('All');
  const [favoriteTheatres, setFavoriteTheatres] = useState<string[]>([]);

  // Look up selected movie from single source of truth
  const selectedMovie: Movie =
    findMovieByIdOrTitle(movieParam) || getNowShowingMovies()[0] || ALL_MOVIES[0];

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
      dayNum: String(d.getDate()).padStart(2, '0'),
      dayName: d.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase(),
      monthName: d.toLocaleDateString('en-US', { month: 'short' }).toUpperCase(),
    };
  });

  const activeDate = dateOptions[selectedDateIdx].isoDate;
  const isDateValid = validateShowtime(selectedMovie.releaseDate, activeDate);

  // Get raw shows for this movie on the chosen date
  const rawShows = getShowsByMovieId(selectedMovie.movieId, activeDate);

  // Apply Price & Time Filters
  const showsOnDate = rawShows.filter((s) => {
    if (priceFilter === '0-200' && s.price > 200) return false;
    if (priceFilter === '201-300' && (s.price <= 200 || s.price > 300)) return false;
    if (priceFilter === '301+' && s.price <= 300) return false;

    if (timeFilter !== 'All') {
      const match = s.showTime.match(/(\d+):(\d+)\s*(AM|PM)/i);
      if (match) {
        let hour = parseInt(match[1], 10);
        const meridian = match[3].toUpperCase();
        if (meridian === 'PM' && hour !== 12) hour += 12;
        if (meridian === 'AM' && hour === 12) hour = 0;

        if (timeFilter === 'Morning' && hour >= 12) return false;
        if (timeFilter === 'Afternoon' && (hour < 12 || hour >= 16)) return false;
        if (timeFilter === 'Evening' && (hour < 16 || hour >= 20)) return false;
        if (timeFilter === 'Night' && hour < 20) return false;
      }
    }
    return true;
  });

  // Cinemas in city
  const cityTheatres = ALL_THEATRES.filter((t) => {
    if (theatreId) return t.id === theatreId;
    return (
      t.city.toLowerCase() === selectedLocation.city.toLowerCase() ||
      (selectedLocation.city.toLowerCase() === 'puducherry' && t.city.toLowerCase() === 'pondicherry') ||
      (selectedLocation.city.toLowerCase() === 'pondicherry' && t.city.toLowerCase() === 'puducherry')
    );
  });
  const displayTheatres = cityTheatres.length > 0 ? cityTheatres : ALL_THEATRES.slice(0, 4);

  return (
    <div className="min-h-screen bg-dark text-white font-display pt-32 sm:pt-36 md:pt-40 pb-20">
      {/* 1. BookMyShow Movie Title & Meta Header */}
      <div className="bg-zinc-950/90 border-b border-white/10 backdrop-blur-md sticky top-20 z-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                  {selectedMovie.title}
                </h1>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-white/10 border border-white/10 font-bold text-zinc-300">
                  {selectedMovie.certificate}
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-2 mt-2 text-xs text-zinc-400">
                <span className="px-2 py-0.5 rounded-full border border-white/15 text-zinc-300">
                  {selectedMovie.language}
                </span>
                <span className="px-2 py-0.5 rounded-full border border-white/15 text-zinc-300">
                  Movie runtime: {Math.floor(selectedMovie.durationMin / 60)}h {selectedMovie.durationMin % 60}m
                </span>
                {(selectedMovie.genre || []).slice(0, 2).map((g: string) => (
                  <span key={g} className="px-2 py-0.5 rounded-full border border-white/15 text-zinc-300">
                    {g}
                  </span>
                ))}
                <span className="text-zinc-500">•</span>
                <span className="text-zinc-400 flex items-center gap-1">
                  ⭐ <strong className="text-white">{selectedMovie.seedRating}</strong>/5
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs text-zinc-400 bg-zinc-900/80 px-3 py-1.5 rounded-lg border border-white/10 self-start sm:self-auto">
              <MapPin className="w-3.5 h-3.5 text-primary flex-shrink-0" />
              <span>
                Cinemas in <strong className="text-white">{selectedLocation.city}</strong>
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 space-y-6">
        {/* 2. BookMyShow Date Carousel & Filter Row */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-white/10 pb-4">
          {/* 7-Day Date Selector Bar */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {dateOptions.map((opt, i) => {
              const isSelected = selectedDateIdx === i;
              const dateAllowed = validateShowtime(selectedMovie.releaseDate, opt.isoDate);

              return (
                <button
                  key={opt.isoDate}
                  onClick={() => setSelectedDateIdx(i)}
                  className={`flex-shrink-0 flex flex-col items-center justify-center w-14 sm:w-16 py-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                    isSelected
                      ? 'border-primary bg-primary text-white shadow-md font-bold'
                      : dateAllowed
                      ? 'border-white/10 bg-zinc-900/40 text-zinc-400 hover:border-white/30 hover:text-white'
                      : 'border-white/5 bg-zinc-950/40 text-zinc-600 opacity-60'
                  }`}
                >
                  <span className="text-[10px] tracking-wider font-semibold opacity-90">{opt.dayName}</span>
                  <span className="text-base sm:text-lg font-extrabold leading-tight">{opt.dayNum}</span>
                  <span className="text-[9px] font-semibold opacity-80">{opt.monthName}</span>
                  {!dateAllowed && (
                    <span className="text-[8px] text-amber-400 font-bold mt-0.5">Wait</span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Filter Chips / Dropdowns */}
          <div className="flex items-center gap-2.5 flex-wrap">
            <span className="text-xs px-3 py-1.5 rounded-lg border border-white/10 bg-zinc-900 text-zinc-300 font-medium">
              {selectedMovie.language} - 2D
            </span>
            <div className="relative">
              <select
                value={priceFilter}
                onChange={(e) => setPriceFilter(e.target.value)}
                className="appearance-none bg-zinc-900 border border-white/10 text-zinc-300 rounded-lg px-3 py-1.5 pr-7 text-xs focus:outline-none focus:border-primary cursor-pointer"
              >
                <option value="All">Price Range</option>
                <option value="0-200">₹0 - ₹200</option>
                <option value="201-300">₹201 - ₹300</option>
                <option value="301+">₹301+</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-zinc-500 absolute right-2 top-2.5 pointer-events-none" />
            </div>
            <div className="relative">
              <select
                value={timeFilter}
                onChange={(e) => setTimeFilter(e.target.value)}
                className="appearance-none bg-zinc-900 border border-white/10 text-zinc-300 rounded-lg px-3 py-1.5 pr-7 text-xs focus:outline-none focus:border-primary cursor-pointer"
              >
                <option value="All">Preferred Time</option>
                <option value="Morning">Morning (Before 12 PM)</option>
                <option value="Afternoon">Afternoon (12 PM - 4 PM)</option>
                <option value="Evening">Evening (4 PM - 8 PM)</option>
                <option value="Night">Night (After 8 PM)</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-zinc-500 absolute right-2 top-2.5 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* 3. Subtitle / Legend Row */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs text-zinc-400 py-1 gap-2">
          <div className="flex items-center gap-2 text-zinc-400">
            <span>💬 Indicates subtitle language, if available</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 font-semibold text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span> AVAILABLE
            </span>
            <span className="flex items-center gap-1.5 font-semibold text-amber-400">
              <span className="w-2 h-2 rounded-full bg-amber-500"></span> FAST FILLING
            </span>
          </div>
        </div>

        {/* 4. Release Date Restriction Alert */}
        {!isDateValid && (
          <div className="glass-card rounded-2xl p-6 border border-amber-500/30 bg-amber-500/10 flex items-center gap-4 text-amber-200">
            <AlertCircle className="w-6 h-6 flex-shrink-0 text-amber-400" />
            <div>
              <p className="font-bold text-sm">Release Date Restriction</p>
              <p className="text-xs text-amber-300/80">
                {selectedMovie.title} has not released on {activeDate}. Official premiere date is {selectedMovie.releaseDate}.
              </p>
            </div>
          </div>
        )}

        {/* 5. Authentic BookMyShow Theatre List Rows */}
        {isDateValid && (
          <div className="divide-y divide-white/10 border-t border-white/10">
            {displayTheatres.length === 0 ? (
              <div className="py-12 text-center text-zinc-400 space-y-2">
                <p className="text-base font-semibold">No theatres configured in {selectedLocation.city} currently.</p>
                <p className="text-xs text-zinc-500">Try switching your location to Puducherry, Chennai, or Coimbatore.</p>
              </div>
            ) : (
              displayTheatres.map((theatre) => {
                const showsHere = showsOnDate.filter((s) => s.theatreId === theatre.id);
                const isFav = favoriteTheatres.includes(theatre.id);

                return (
                  <div key={theatre.id} className="py-5 flex flex-col md:flex-row md:items-start justify-between gap-4">
                    {/* Left: Theatre Details */}
                    <div className="w-full md:w-1/3 space-y-1.5">
                      <div className="flex items-center justify-between md:justify-start gap-2">
                        <div className="flex items-center gap-2">
                          <h3 className="text-base font-bold text-white hover:text-primary transition-colors flex items-center gap-1.5 cursor-pointer">
                            {theatre.name}
                            <span
                              title={`${theatre.locationArea}, ${theatre.address} • ${formatDistance(
                                theatre.latitude,
                                theatre.longitude
                              )} away`}
                              className="text-zinc-500 hover:text-zinc-300 text-xs cursor-pointer"
                            >
                              ⓘ
                            </span>
                          </h3>
                        </div>
                        <button
                          onClick={() => {
                            setFavoriteTheatres((prev) =>
                              prev.includes(theatre.id) ? prev.filter((id) => id !== theatre.id) : [...prev, theatre.id]
                            );
                            toast.success(isFav ? `Removed from favorites` : `Saved ${theatre.name} to favorites`);
                          }}
                          className="md:hidden text-zinc-400 hover:text-rose-500 transition-colors p-1"
                        >
                          <Heart className={`w-4 h-4 ${isFav ? 'fill-rose-500 text-rose-500' : ''}`} />
                        </button>
                      </div>

                      <div className="flex flex-wrap items-center gap-2 text-xs text-zinc-400">
                        <span className="text-emerald-400 font-medium">Cancellation available</span>
                        <span>&bull;</span>
                        <span className="flex items-center gap-1 text-zinc-400">
                          <Smartphone className="w-3 h-3" /> M-Ticket
                        </span>
                        <span>&bull;</span>
                        <span className="flex items-center gap-1 text-zinc-400">
                          <Utensils className="w-3 h-3" /> F&B Available
                        </span>
                        <span>&bull;</span>
                        <span className="text-zinc-400">
                          {formatDistance(theatre.latitude, theatre.longitude)} away
                        </span>
                      </div>
                    </div>

                    {/* Right: Showtimes Buttons + Heart Icon */}
                    <div className="flex-1 flex items-center justify-between gap-4">
                      {showsHere.length > 0 ? (
                        <div className="flex flex-wrap gap-3">
                          {showsHere.map((s) => {
                            const isFastFilling = s.status === 'FILLING_FAST' || s.availableSeats <= 12;

                            return (
                              <Link
                                key={s.showId}
                                to={`/seats/${s.showId}`}
                                title={`₹${s.price} • ${s.availableSeats} seats left • ${s.screenName}`}
                                className={`group flex flex-col items-center justify-center px-4 py-2 rounded-lg bg-zinc-900/90 transition-all min-w-[96px] text-center border cursor-pointer hover:scale-105 shadow-sm ${
                                  isFastFilling
                                    ? 'border-amber-500/80 hover:border-amber-400 hover:bg-amber-500/15 text-amber-400'
                                    : 'border-emerald-500/80 hover:border-emerald-400 hover:bg-emerald-500/15 text-emerald-400'
                                }`}
                              >
                                <span className="text-xs sm:text-sm font-extrabold text-white group-hover:text-primary transition-colors tracking-wide">
                                  {s.showTime}
                                </span>
                                <span className="text-[9px] font-bold uppercase tracking-wider text-zinc-400 mt-0.5">
                                  {cleanScreenDisplay(s.format, s.screenName)}
                                </span>
                              </Link>
                            );
                          })}
                        </div>
                      ) : (
                        <div className="text-xs text-zinc-500 italic py-2">
                          No active screenings matching selected filters at {theatre.name} on this date.
                        </div>
                      )}

                      <button
                        onClick={() => {
                          setFavoriteTheatres((prev) =>
                            prev.includes(theatre.id) ? prev.filter((id) => id !== theatre.id) : [...prev, theatre.id]
                          );
                          toast.success(isFav ? `Removed from favorites` : `Saved ${theatre.name} to favorites`);
                        }}
                        className="hidden md:block text-zinc-500 hover:text-rose-500 transition-colors p-2 cursor-pointer flex-shrink-0"
                        title={isFav ? 'Remove from favorites' : 'Add to favorites'}
                      >
                        <Heart className={`w-5 h-5 ${isFav ? 'fill-rose-500 text-rose-500' : ''}`} />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}
      </div>
    </div>
  );
};
