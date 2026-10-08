import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Star, Clock, Globe, Calendar, MapPin, Film, Bell, Check, Sparkles, AlertCircle, Heart, Info, ChevronDown, Smartphone, Utensils, Gift, Tag, ChevronRight } from 'lucide-react';
import { Button } from '@/components/common/Button';
import { useLocation } from '@/context/LocationContext';
import { ALL_MOVIES, Movie, findMovieByIdOrTitle } from '@/data/moviesData';
import { getMovieCreditDetails } from '@/data/castCrewData';
import { getShowsByMovieId, validateShowtime } from '@/data/showsData';
import { ALL_THEATRES } from './Theatres';
import { SupportAndFaq } from '@/components/common/SupportAndFaq';
import toast from 'react-hot-toast';
import { cleanScreenDisplay } from '@/utils/format';

export const MovieDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { selectedLocation, formatDistance } = useLocation();
  const [selectedDateIdx, setSelectedDateIdx] = useState(0);
  const [isNotified, setIsNotified] = useState(false);
  const [favoriteTheatres, setFavoriteTheatres] = useState<string[]>([]);
  const [priceFilter, setPriceFilter] = useState<string>('All');
  const [timeFilter, setTimeFilter] = useState<string>('All');

  // Match movie from single source of truth
  const movie: Movie = findMovieByIdOrTitle(id || '') || ALL_MOVIES[0];
  const credits = getMovieCreditDetails(
    movie.movieId,
    movie.title,
    movie.cast,
    movie.shortDescription,
    movie.language
  );

  const handleNotifyMe = () => {
    setIsNotified(true);
    toast.success(`You'll be alerted when tickets open for ${movie.title}!`);
  };

  // Generate 7 upcoming dates starting from today (2026-10-05)
  const baseDate = new Date('2026-10-05T00:00:00');
  const dateOptions = Array.from({ length: 7 }).map((_, idx) => {
    const d = new Date(baseDate);
    d.setDate(baseDate.getDate() + idx);
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    const isoDate = `${yyyy}-${mm}-${dd}`;
    const dayName = d.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase();
    const dayNum = dd;
    const monthName = d.toLocaleDateString('en-US', { month: 'short' }).toUpperCase();
    return { isoDate, dayName, dayNum, monthName };
  });

  const activeDate = dateOptions[selectedDateIdx]?.isoDate || '2026-10-05';
  const isDateValidForMovie = validateShowtime(movie.releaseDate, activeDate);

  // Retrieve shows for this movie on the active date
  const movieShows = getShowsByMovieId(movie.movieId, activeDate);

  // Theatres in current city
  const cityTheatres = ALL_THEATRES.filter(
    (t) =>
      t.city.toLowerCase() === selectedLocation.city.toLowerCase() ||
      (selectedLocation.city.toLowerCase() === 'puducherry' && t.city.toLowerCase() === 'pondicherry') ||
      (selectedLocation.city.toLowerCase() === 'pondicherry' && t.city.toLowerCase() === 'puducherry')
  );

  return (
    <div className="min-h-screen bg-dark text-white font-display pb-20">
      {/* Marquee Backdrop Hero */}
      <div className="relative min-h-[55vh] border-b border-white/10 flex items-end pt-24 pb-12 overflow-hidden">
        {/* Cinematic Backdrop Image */}
        <img
          src={movie.backdropUrl}
          alt={movie.title}
          className="absolute inset-0 w-full h-full object-cover object-center filter brightness-[0.35]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-dark via-dark/80 to-transparent" />

        <div className="container mx-auto px-4 md:px-8 relative z-10">
          <div className="flex flex-col md:flex-row items-start md:items-end gap-8">
            {/* Poster Card */}
            <div className="w-52 sm:w-64 aspect-[2/3] rounded-2xl bg-zinc-950 border-2 border-white/15 shadow-2xl flex-shrink-0 overflow-hidden relative shadow-primary/30 group">
              <img
                src={movie.posterUrl}
                alt={movie.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30" />
              <span className="absolute top-3 left-3 text-[10px] uppercase font-bold text-white bg-primary px-2.5 py-0.5 rounded-md shadow">
                {movie.industry}
              </span>
              <span className="absolute top-3 right-3 text-[10px] font-bold text-white bg-black/60 backdrop-blur px-2.5 py-0.5 rounded-md border border-white/10">
                {movie.certificate}
              </span>
              <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                <span className="text-amber-400 font-bold text-xs flex items-center bg-black/70 px-2 py-0.5 rounded-full">
                  <Star className="w-3.5 h-3.5 fill-current mr-1 text-amber-400" /> ⭐ {movie.seedRating}
                </span>
                <span className="text-[10px] font-mono font-bold text-zinc-300">
                  {movie.durationMin}m
                </span>
              </div>
            </div>

            {/* Movie Info */}
            <div className="space-y-4 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                    movie.status === 'RUNNING'
                      ? 'bg-emerald-500/20 border border-emerald-500/40 text-emerald-400'
                      : 'bg-amber-500/20 border border-amber-500/40 text-amber-400'
                  }`}
                >
                  {movie.status === 'RUNNING' ? 'Now Showing' : 'Coming Soon'}
                </span>
                <span className="px-2.5 py-0.5 rounded-lg bg-white/10 border border-white/10 text-white text-xs font-mono">
                  {movie.language}
                </span>
                <span className="px-2.5 py-0.5 rounded-lg bg-white/10 border border-white/10 text-white text-xs font-mono">
                  {movie.genreString}
                </span>
              </div>

              <h1 className="text-4xl md:text-6xl font-black tracking-tight text-white">{movie.title}</h1>

              <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-zinc-300">
                <span className="flex items-center text-amber-400 font-bold">
                  Rating: ⭐ {movie.seedRating}
                </span>
                <span className="flex items-center">
                  <Clock className="w-4 h-4 mr-1 text-primary" /> {Math.floor(movie.durationMin / 60)}h{' '}
                  {movie.durationMin % 60}m
                </span>
                <span className="flex items-center">
                  <Globe className="w-4 h-4 mr-1 text-primary" /> {movie.language} ({movie.industry})
                </span>
                <span className="flex items-center">
                  <Calendar className="w-4 h-4 mr-1 text-primary" /> Release Date: {movie.releaseDate}
                </span>
              </div>

              <p className="text-zinc-300 text-sm sm:text-base max-w-3xl leading-relaxed">
                {movie.shortDescription}
              </p>

              <div className="pt-2 text-xs text-zinc-400 space-y-1">
                <p>
                  <strong className="text-white">Cast:</strong> {movie.castString}
                </p>
                <p>
                  <strong className="text-white">Audio / Subtitles:</strong> {movie.showLanguages}
                </p>
              </div>

              {/* Action Buttons: Book Now (Running) vs Notify Me (Upcoming) */}
              <div className="pt-4 flex flex-wrap items-center gap-4">
                {movie.status === 'RUNNING' ? (
                  <a href="#theatre-showtimes">
                    <Button size="lg" variant="primary" className="rounded-xl px-10 text-base shadow-lg shadow-primary/30">
                      Book Tickets Now
                    </Button>
                  </a>
                ) : (
                  <Button
                    size="lg"
                    variant={isNotified ? 'secondary' : 'primary'}
                    onClick={handleNotifyMe}
                    className="rounded-xl px-8 text-sm flex items-center gap-2 shadow-lg"
                  >
                    {isNotified ? (
                      <>
                        <Check className="w-4 h-4 text-emerald-400" /> Alert Enabled for {movie.releaseDate}
                      </>
                    ) : (
                      <>
                        <Bell className="w-4 h-4" /> Notify Me on Premiere ({movie.releaseDate})
                      </>
                    )}
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* BOOKMYSHOW-STYLE DETAILS SECTIONS (ABOUT, OFFERS, CAST, CREW) */}
      {/* ======================================================== */}
      <div className="container mx-auto px-4 md:px-8 mt-12 space-y-12">
        {/* 1. ABOUT THE MOVIE */}
        <div className="space-y-4 max-w-5xl">
          <h2 className="text-2xl font-black text-white">About the movie</h2>
          <p className="text-zinc-300 text-sm sm:text-base leading-relaxed">
            {credits.about}
          </p>
          <div className="flex flex-wrap gap-2 pt-1">
            <span className="text-xs px-3 py-1 rounded-full bg-white/5 border border-white/10 text-zinc-300">
              Runtime: {Math.floor(movie.durationMin / 60)}h {movie.durationMin % 60}m
            </span>
            <span className="text-xs px-3 py-1 rounded-full bg-white/5 border border-white/10 text-zinc-300 font-semibold">
              Certificate: {movie.certificate || 'UA'}
            </span>
            <span className="text-xs px-3 py-1 rounded-full bg-white/5 border border-white/10 text-zinc-300">
              Languages: {movie.showLanguages || movie.language}
            </span>
            {movie.genre.map((g) => (
              <span key={g} className="text-xs px-3 py-1 rounded-full bg-white/5 border border-white/10 text-zinc-300">
                {g}
              </span>
            ))}
          </div>
        </div>

        {/* 2. TOP OFFERS FOR YOU (BookMyShow Style Horizontal Cards) */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-black text-white">Top offers for you</h2>
            <Link to="/offers" className="text-xs text-primary hover:underline font-bold flex items-center gap-1">
              View All 22+ Offers <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Link
              to="/offers"
              className="p-4 rounded-2xl bg-amber-500/5 hover:bg-amber-500/10 border-2 border-dashed border-amber-500/40 transition-all flex items-start gap-3.5 group cursor-pointer"
            >
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Gift className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <span className="text-xs font-bold text-white group-hover:text-amber-400 transition-colors block">
                  Enjoy B1G1 Ticket Free!* with Axis Bank MY ZONE
                </span>
                <span className="text-[11px] text-zinc-400 block">
                  Tap to view details & promo codes
                </span>
              </div>
            </Link>

            <Link
              to="/offers"
              className="p-4 rounded-2xl bg-amber-500/5 hover:bg-amber-500/10 border-2 border-dashed border-amber-500/40 transition-all flex items-start gap-3.5 group cursor-pointer"
            >
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Tag className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <span className="text-xs font-bold text-white group-hover:text-amber-400 transition-colors block">
                  Get up to ₹1,000 off per month on ICICI Gemstone
                </span>
                <span className="text-[11px] text-zinc-400 block">
                  Tap to view details & promo codes
                </span>
              </div>
            </Link>

            <Link
              to="/offers"
              className="p-4 rounded-2xl bg-amber-500/5 hover:bg-amber-500/10 border-2 border-dashed border-amber-500/40 transition-all flex items-start gap-3.5 group cursor-pointer"
            >
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Sparkles className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <span className="text-xs font-bold text-white group-hover:text-amber-400 transition-colors block">
                  Flat 20% Instant Discount with HDFC Bank Millennia
                </span>
                <span className="text-[11px] text-zinc-400 block">
                  Tap to view details & promo codes
                </span>
              </div>
            </Link>
          </div>
        </div>

        {/* 3. CAST (BookMyShow Style Headshot Portrait Cards) */}
        <div className="space-y-4">
          <h2 className="text-2xl font-black text-white">Cast</h2>
          <div className="flex gap-5 overflow-x-auto pb-4 scrollbar-none">
            {credits.cast.map((member, idx) => (
              <div key={idx} className="flex flex-col items-center text-center flex-shrink-0 w-28 sm:w-32 group">
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden border-2 border-white/10 group-hover:border-primary transition-all shadow-lg bg-zinc-900">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <span className="font-bold text-xs sm:text-sm text-white mt-2.5 line-clamp-1 group-hover:text-primary transition-colors">
                  {member.name}
                </span>
                <span className="text-[11px] text-zinc-400 mt-0.5">
                  {member.role}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* 4. CREW (BookMyShow Style Headshot Portrait Cards) */}
        <div className="space-y-4 border-b border-white/10 pb-10">
          <h2 className="text-2xl font-black text-white">Crew</h2>
          <div className="flex gap-5 overflow-x-auto pb-4 scrollbar-none">
            {credits.crew.map((member, idx) => (
              <div key={idx} className="flex flex-col items-center text-center flex-shrink-0 w-28 sm:w-32 group">
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden border-2 border-white/10 group-hover:border-emerald-500 transition-all shadow-lg bg-zinc-900">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <span className="font-bold text-xs sm:text-sm text-white mt-2.5 line-clamp-1 group-hover:text-emerald-400 transition-colors">
                  {member.name}
                </span>
                <span className="text-[11px] text-zinc-400 mt-0.5">
                  {member.role}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* BookMyShow Style Showtimes & Cinemas Section */}
      <div id="theatre-showtimes" className="container mx-auto px-4 md:px-8 mt-12 space-y-6">
        {/* 1. Header with Movie Title and Metadata Pills (Matching reference screenshot) */}
        <div className="border-b border-white/10 pb-4">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            {movie.title} - ({movie.language})
          </h2>
          <div className="flex flex-wrap items-center gap-2 mt-2.5">
            <span className="text-xs px-3 py-1 rounded-full bg-white/5 border border-white/10 text-zinc-300">
              Movie runtime: {Math.floor(movie.durationMin / 60)}h {movie.durationMin % 60}m
            </span>
            <span className="text-xs px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-zinc-300 font-semibold">
              {movie.certificate || 'UA13+'}
            </span>
            {movie.genre.map((g) => (
              <span key={g} className="text-xs px-3 py-1 rounded-full bg-white/5 border border-white/10 text-zinc-300">
                {g}
              </span>
            ))}
          </div>
        </div>

        {/* 2. 7-Day Date Selector + Filter Controls Bar (Matching reference screenshot) */}
        <div className="border-t border-b border-white/10 py-3 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Left: 7-Day Date Selector */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {dateOptions.map((opt, idx) => {
              const isSelected = selectedDateIdx === idx;
              const dateAllowed = validateShowtime(movie.releaseDate, opt.isoDate);
              return (
                <button
                  key={opt.isoDate}
                  onClick={() => dateAllowed && setSelectedDateIdx(idx)}
                  disabled={!dateAllowed}
                  className={`px-3.5 py-2 rounded-xl text-center transition-all flex flex-col items-center justify-center min-w-[58px] cursor-pointer ${
                    isSelected
                      ? 'bg-primary text-white shadow-lg shadow-primary/25 font-bold scale-105'
                      : dateAllowed
                      ? 'hover:bg-white/5 text-zinc-400 hover:text-white border border-transparent hover:border-white/10'
                      : 'text-zinc-600 opacity-40 cursor-not-allowed'
                  }`}
                >
                  <span className="text-[10px] uppercase font-bold tracking-wider">{opt.dayName}</span>
                  <span className="text-lg font-black my-0.5">{opt.dayNum}</span>
                  <span className="text-[9px] uppercase tracking-wider">{opt.monthName}</span>
                </button>
              );
            })}
          </div>

          {/* Right: Quick Filter Chips */}
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="px-3 py-1.5 rounded-lg border border-primary text-primary font-bold bg-primary/10">
              {movie.language} - 2D
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

        {/* 3. Subtitle / Legend Row (Matching reference screenshot) */}
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

        {/* Validation Warning if Date < Release Date */}
        {!isDateValidForMovie && (
          <div className="glass-card rounded-2xl p-6 border border-amber-500/30 bg-amber-500/10 flex items-center gap-4 text-amber-200">
            <AlertCircle className="w-6 h-6 flex-shrink-0 text-amber-400" />
            <div>
              <p className="font-bold text-sm">Movie not yet released on {activeDate}</p>
              <p className="text-xs text-amber-300/80">
                {movie.title} officially premieres on {movie.releaseDate}. Advance bookings open strictly on or after its premiere date.
              </p>
            </div>
          </div>
        )}

        {/* 4. Theatres and Shows List (Clean BookMyShow list rows) */}
        {isDateValidForMovie && movie.status === 'RUNNING' && (
          <div className="divide-y divide-white/10 border-t border-white/10">
            {cityTheatres.length === 0 ? (
              <div className="py-12 text-center text-zinc-400 space-y-2">
                <p className="text-base font-semibold">No theatres configured in {selectedLocation.city} currently.</p>
                <p className="text-xs text-zinc-500">Try switching your location to Puducherry, Chennai, or Coimbatore.</p>
              </div>
            ) : (
              cityTheatres.map((theatre) => {
                const showsAtTheatre = movieShows.filter((s) => s.theatreId === theatre.id);
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
                      </div>
                    </div>

                    {/* Right: Showtimes Buttons + Heart Icon */}
                    <div className="flex-1 flex items-center justify-between gap-4">
                      {showsAtTheatre.length > 0 ? (
                        <div className="flex flex-wrap gap-3">
                          {showsAtTheatre.map((s) => {
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
                          No active screenings scheduled at {theatre.name} on this date.
                        </div>
                      )}

                      <button
                        onClick={() => {
                          setFavoriteTheatres((prev) =>
                            prev.includes(theatre.id) ? prev.filter((id) => id !== theatre.id) : [...prev, theatre.id]
                          );
                          toast.success(isFav ? `Removed from favorites` : `Saved ${theatre.name} to favorites`);
                        }}
                        className="hidden md:block text-zinc-500 hover:text-rose-500 transition-colors p-2 cursor-pointer"
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

        {/* If Upcoming Movie */}
        {movie.status === 'UPCOMING' && (
          <div className="glass-card rounded-2xl p-12 text-center text-zinc-400 space-y-4 border border-white/10">
            <Film className="w-12 h-12 text-primary mx-auto opacity-75" />
            <h3 className="text-xl font-bold text-white">Tickets Opening Soon for {movie.title}</h3>
            <p className="text-sm text-zinc-400 max-w-md mx-auto">
              This film is scheduled for theatrical premiere on <strong>{movie.releaseDate}</strong>. Click 'Notify Me' above to get an instant notification when bookings go live.
            </p>
          </div>
        )}

        {/* 24/7 Dedicated Support Concierge & FAQ Section (Helpline: 9597314692) */}
        <div className="pt-10 border-t border-white/10">
          <SupportAndFaq />
        </div>
      </div>
    </div>
  );
};
