import React, { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  MapPin,
  Search,
  ChevronRight,
  Ticket,
  Sparkles,
  Star,
  Navigation,
  ArrowRight,
  Flame,
  Calendar,
  Film,
  Tag,
  Copy,
  Check,
  Clapperboard,
  Zap,
  Play,
  X,
  Clock,
  Popcorn,
  ThumbsUp,
  Compass,
  CreditCard,
  Smartphone,
  Gift,
  Maximize2,
  Volume2,
  Wind,
  Tv,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/common/Button';
import { MovieCard } from '@/components/movie/MovieCard';
import { useLocation } from '@/context/LocationContext';
import { useAuth } from '@/context/AuthContext';
import { ALL_THEATRES } from './Theatres';
import {
  ALL_MOVIES,
  getNowShowingMovies,
  getUpcomingMovies,
  getTrendingMovies,
  getRecommendedMovies,
  findMovieByIdOrTitle,
  Movie,
} from '@/data/moviesData';
import { getShowsByMovieId } from '@/data/showsData';
import { ALL_OFFERS, OfferCategory } from '@/data/offersData';
import toast from 'react-hot-toast';

export const Home: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { selectedLocation, setIsLocationModalOpen, formatDistance } = useLocation();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState<string>('All');
  const [recommendGenre, setRecommendGenre] = useState<string>('All');
  const [copiedCoupon, setCopiedCoupon] = useState<string | null>(null);
  const [offerTab, setOfferTab] = useState<OfferCategory>('ALL');

  // Quick Trailer / Synopsis Preview Modal State
  const [previewMovie, setPreviewMovie] = useState<Movie | null>(null);

  // Automatically redirect staff to their operational portals
  useEffect(() => {
    if (user?.role === 'ADMIN') {
      navigate('/admin', { replace: true });
    } else if (user?.role === 'MANAGER') {
      navigate('/manager', { replace: true });
    }
  }, [user?.role, navigate]);

  // Featured Hero Movie (Spotlight blockbuster)
  const featuredMovie: Movie = useMemo(() => {
    return ALL_MOVIES.find((m) => m.movieId === 'MOV001') || ALL_MOVIES[0];
  }, []);

  // Now Showing movies
  const nowShowingAll = useMemo(() => getNowShowingMovies(), []);

  // Filtered Now Showing by language chip
  const filteredNowShowing = useMemo(() => {
    if (selectedLanguage === 'All') return nowShowingAll;
    return nowShowingAll.filter((m) => m.language === selectedLanguage);
  }, [nowShowingAll, selectedLanguage]);

  // Dynamic AI-Curated Recommendations based on user's selected genre filter and active city screenings
  const recommendedMovies = useMemo(() => {
    const prefs = {
      languages: selectedLanguage === 'All' ? ['Tamil', 'English', 'Malayalam'] : [selectedLanguage],
      genres: recommendGenre === 'All' ? [] : [recommendGenre],
    };
    let scored = getRecommendedMovies(prefs).filter((m) => m.status === 'RUNNING');
    if (recommendGenre !== 'All') {
      scored = scored.filter((m) => m.genre.some((g) => g.toLowerCase().includes(recommendGenre.toLowerCase())));
    }

    // Prioritize movies with active scheduled screenings in the user's selected city
    const cityNorm = selectedLocation.city.toLowerCase();
    const hasShowsInCity = (movieId: string) => {
      const shows = getShowsByMovieId(movieId, '2026-10-05');
      return shows.some(
        (s) =>
          s.city.toLowerCase() === cityNorm ||
          (cityNorm === 'puducherry' && s.city.toLowerCase() === 'pondicherry') ||
          (cityNorm === 'pondicherry' && s.city.toLowerCase() === 'puducherry')
      );
    };

    scored.sort((a, b) => {
      const aHasShows = hasShowsInCity(a.movieId) ? 1 : 0;
      const bHasShows = hasShowsInCity(b.movieId) ? 1 : 0;
      if (aHasShows !== bHasShows) return bHasShows - aHasShows;
      return 0;
    });

    return scored.slice(0, 8);
  }, [selectedLanguage, recommendGenre, selectedLocation.city]);

  // Trending Top 5 Leaderboard
  const topTrending = useMemo(() => {
    return getTrendingMovies().filter((m) => m.status === 'RUNNING').slice(0, 5);
  }, []);

  // Live Radar: Shows starting today in the user's city
  const liveRadarShows = useMemo(() => {
    const todayStr = '2026-10-05';
    const cityShows: Array<{
      showId: string;
      movie: Movie;
      theatreName: string;
      showTime: string;
      format: string;
      price: number;
      availableSeats: number;
      status: 'AVAILABLE' | 'FILLING_FAST' | 'ALMOST_FULL';
    }> = [];

    // Sample across popular movies
    ['MOV001', 'MOV002', 'MOV003', 'MOV025'].forEach((mId) => {
      const shows = getShowsByMovieId(mId, todayStr);
      shows.forEach((s) => {
        const matchesCity =
          s.city.toLowerCase() === selectedLocation.city.toLowerCase() ||
          (selectedLocation.city.toLowerCase() === 'puducherry' && s.city.toLowerCase() === 'pondicherry') ||
          (selectedLocation.city.toLowerCase() === 'pondicherry' && s.city.toLowerCase() === 'puducherry');

        if (matchesCity && cityShows.length < 4) {
          const m = findMovieByIdOrTitle(s.movieId);
          if (m) {
            cityShows.push({
              showId: s.showId,
              movie: m,
              theatreName: s.theatreName,
              showTime: s.showTime,
              format: s.format,
              price: s.price,
              availableSeats: s.availableSeats,
              status: s.status || 'AVAILABLE',
            });
          }
        }
      });
    });

    return cityShows;
  }, [selectedLocation.city]);

  // Upcoming Movies (Coming Soon)
  const upcomingMovies = useMemo(() => getUpcomingMovies().slice(0, 5), []);

  // Theatres in user's selected city
  const nearbyTheatres = useMemo(() => {
    const matched = ALL_THEATRES.filter(
      (t) =>
        t.city.toLowerCase() === selectedLocation.city.toLowerCase() ||
        (selectedLocation.city.toLowerCase() === 'puducherry' && t.city.toLowerCase() === 'pondicherry') ||
        (selectedLocation.city.toLowerCase() === 'pondicherry' && t.city.toLowerCase() === 'puducherry')
    );
    return matched.length > 0 ? matched.slice(0, 4) : ALL_THEATRES.slice(0, 4);
  }, [selectedLocation]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
    } else {
      navigate('/search');
    }
  };

  const handleCopyCoupon = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCoupon(code);
    toast.success(`Coupon code ${code} copied! Apply at checkout.`);
    setTimeout(() => setCopiedCoupon(null), 3000);
  };

  const showcaseOffers = useMemo(() => {
    if (offerTab === 'ALL') {
      return [
        ALL_OFFERS.find((o) => o.code === 'AXISBOGO')!,
        ALL_OFFERS.find((o) => o.code === 'ICICIBOGO')!,
        ALL_OFFERS.find((o) => o.code === 'HDFCMILLENNIA')!,
        ALL_OFFERS.find((o) => o.code === 'SBIELITE')!,
        ALL_OFFERS.find((o) => o.code === 'PAYTM100')!,
        ALL_OFFERS.find((o) => o.code === 'WELCOME100')!,
      ].filter(Boolean);
    }
    return ALL_OFFERS.filter((o) => o.category === offerTab).slice(0, 6);
  }, [offerTab]);

  return (
    <div className="min-h-screen bg-transparent text-white font-display pt-0 pb-20 relative">
      {/* 1. Classic CineGo Starting Hero Screen with 3D Atmospheric Depth */}
      <section className="relative min-h-[75vh] flex items-center justify-center overflow-hidden pt-20 border-b border-white/10">
        {/* Cinema Seating Ambient Backdrop */}
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-30" />
        
        {/* Hardware-Accelerated Static Radial Glow (0% CPU lag) */}
        <div className="absolute w-[600px] h-[600px] rounded-full bg-[radial-gradient(circle,rgba(229,9,20,0.22)_0%,rgba(244,63,94,0.1)_40%,transparent_70%)] pointer-events-none transform-gpu" />

        <div className="absolute inset-0 bg-gradient-to-t from-[#070709] via-[#070709]/80 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-[#070709]" />

        {/* Centered Hero Content */}
        <div className="relative z-10 container mx-auto px-4 flex flex-col items-center text-center py-12">
          <div className="max-w-3xl">
            {/* Live Season Badge */}
            <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/15 text-xs font-bold text-white mb-6 shadow-md shadow-black/40">
              <Sparkles className="w-3.5 h-3.5 text-primary" />
              <span>October 2026 Season Premieres &bull; Reference Date: Oct 05, 2026</span>
            </div>

            {/* CineGo Headline with 3D Glow */}
            <h1 className="text-5xl sm:text-7xl md:text-8xl font-black mb-4 tracking-tight text-white drop-shadow-[0_10px_35px_rgba(229,9,20,0.4)] font-display">
              Cine<span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-rose-500 to-amber-400">Go</span>
            </h1>
            <p className="text-lg sm:text-2xl font-light text-zinc-200 mb-8 max-w-xl mx-auto drop-shadow-md">
              Your Movies. Your Seats. Your Experience.
            </p>

            {/* Centered Search Pill with City Selector */}
            <form
              onSubmit={handleSearchSubmit}
              className="flex flex-col sm:flex-row items-center bg-zinc-950/95 rounded-2xl sm:rounded-full p-2 border border-white/20 mb-8 max-w-2xl mx-auto shadow-xl gap-2 sm:gap-0 focus-within:border-primary/60 transition-all hover:border-white/30"
            >
              <button
                type="button"
                onClick={() => setIsLocationModalOpen(true)}
                className="flex items-center px-4 py-2.5 text-zinc-300 hover:text-white transition-colors border-b sm:border-b-0 sm:border-r border-white/10 w-full sm:w-auto cursor-pointer"
              >
                <MapPin className="w-4 h-4 mr-2 text-primary flex-shrink-0" />
                <span className="font-bold text-sm whitespace-nowrap">{selectedLocation.city}</span>
              </button>
              <div className="flex-1 flex items-center px-4 py-2 w-full">
                <Search className="w-4 h-4 mr-2.5 text-zinc-400 flex-shrink-0" />
                <input
                  type="text"
                  placeholder="Search Baththa, Jailer 2, Digger..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="bg-transparent border-none text-white text-sm focus:outline-none w-full placeholder-zinc-500"
                />
              </div>
              <Button type="submit" variant="primary" size="md" className="rounded-full px-7 shadow-lg shadow-primary/30 w-full sm:w-auto font-bold">
                Search
              </Button>
            </form>

            {/* Explore All Movies CTA Button */}
            <div className="flex items-center justify-center gap-4">
              <Link to="/movies">
                <Button size="lg" variant="primary" className="rounded-full px-9 py-3.5 text-base font-bold shadow-xl shadow-primary/40 hover:scale-105 hover:shadow-primary/60 transition-all">
                  Explore All Movies &rarr;
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
        {/* 2. FEATURE 1: SMART "RECOMMENDED FOR YOU" (AI/Curated Affinity Engine) */}
        <section className="glass-card rounded-3xl p-6 sm:p-8 border border-white/10 shadow-2xl relative overflow-hidden bg-gradient-to-br from-zinc-950 via-zinc-900/60 to-zinc-950">
          <div className="absolute top-0 right-0 w-80 h-80 bg-primary/10 rounded-full blur-3xl pointer-events-none" />

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6 relative z-10">
            <div>
              <div className="flex items-center space-x-2 text-primary font-bold text-xs uppercase tracking-wider mb-1">
                <Sparkles className="w-4 h-4 text-primary animate-pulse" />
                <span>Personalized Match Algorithm</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-2">
                Recommended For You
              </h2>
              <p className="text-xs text-zinc-400 mt-1 max-w-xl">
                Calculated from critic velocity, regional theatre occupancy, and popular affinity in {selectedLocation.city}.
              </p>
            </div>

            {/* Smart Mood / Genre Tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              {[
                { label: 'All Picks', val: 'All' },
                { label: 'Action', val: 'Action' },
                { label: 'Drama', val: 'Drama' },
                { label: 'Thriller', val: 'Thriller' },
                { label: 'Romance', val: 'Romance' },
              ].map((g) => {
                const isSelected = recommendGenre === g.val;
                return (
                  <button
                    key={g.val}
                    onClick={() => setRecommendGenre(g.val)}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                      isSelected
                        ? 'bg-primary text-white shadow-lg shadow-primary/30 scale-105'
                        : 'bg-white/5 text-zinc-400 hover:text-white border border-white/10 hover:border-white/20'
                    }`}
                  >
                    {g.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Recommended Movie Cards with Match % Badge */}
          <div className="flex space-x-5 overflow-x-auto pb-4 scrollbar-none relative z-10">
            {recommendedMovies.length > 0 ? (
              recommendedMovies.map((movie, idx) => {
                const matchPercent = Math.max(88, 99 - idx * 3);
                return (
                  <div key={movie.movieId} className="relative flex-shrink-0 group">
                    <MovieCard movie={movie} />
                    <span className="absolute top-2 left-2 z-20 pointer-events-none bg-emerald-500 text-black font-black text-[9px] px-2 py-0.5 rounded-md shadow-md uppercase tracking-wider">
                      {matchPercent}% Match
                    </span>
                  </div>
                );
              })
            ) : (
              <div className="p-8 text-center text-zinc-400 w-full">
                No recommended movies found in this specific genre right now. Try selecting &quot;All Picks&quot;.
              </div>
            )}
          </div>
        </section>

        {/* 3. FEATURE 2: LIVE SHOWS RADAR (Screenings starting soon in your city) */}
        {liveRadarShows.length > 0 && (
          <section className="bg-zinc-950/80 rounded-3xl p-6 sm:p-7 border border-white/10 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                  <Zap className="w-5 h-5 fill-current" />
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
                    Live Shows Radar &bull; Starting Soon
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  </h3>
                  <p className="text-xs text-zinc-400">
                    Catch upcoming prime screenings today across {selectedLocation.city}
                  </p>
                </div>
              </div>
              <span className="text-xs text-zinc-400 font-mono">
                Real-time Seat Lock Active
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
              {liveRadarShows.map((s) => (
                <div
                  key={s.showId}
                  className="p-4 rounded-2xl bg-zinc-900 border border-white/10 hover:border-primary/50 transition-all flex flex-col justify-between space-y-3"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-white/10 text-zinc-300">
                        {s.format}
                      </span>
                      <span className="text-xs font-mono font-bold text-emerald-400">
                        ₹{s.price}
                      </span>
                    </div>
                    <h4 className="font-bold text-sm text-white truncate">{s.movie.title}</h4>
                    <p className="text-xs text-zinc-400 truncate flex items-center">
                      <MapPin className="w-3 h-3 mr-1 text-primary flex-shrink-0" />
                      {s.theatreName}
                    </p>
                  </div>

                  <div className="pt-2.5 border-t border-white/5 flex items-center justify-between">
                    <div className="flex flex-col">
                      <span className="text-sm font-black text-white">{s.showTime}</span>
                      <span className="text-[10px] text-zinc-400">{s.availableSeats} seats left</span>
                    </div>
                    <Link to={`/seats/${s.showId}`}>
                      <Button variant="primary" size="sm" className="rounded-xl px-4 text-xs font-bold shadow-md">
                        Book
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 4. NOW SHOWING (Clean, Filterable Section) */}
        <section>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
            <div>
              <div className="flex items-center space-x-2 text-primary font-bold text-xs uppercase tracking-wider mb-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>Now In Cinemas</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white">Popular Screenings</h2>
            </div>

            {/* Language Filter Chips */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
              {['All', 'Tamil', 'English', 'Malayalam'].map((lang) => {
                const isSelected = selectedLanguage === lang;
                return (
                  <button
                    key={lang}
                    onClick={() => setSelectedLanguage(lang)}
                    className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                      isSelected
                        ? 'bg-primary text-white shadow-md shadow-primary/30'
                        : 'bg-zinc-900/90 text-zinc-400 hover:text-white border border-white/10 hover:border-white/20'
                    }`}
                  >
                    {lang}
                  </button>
                );
              })}
              <Link
                to="/movies"
                className="text-xs font-bold text-zinc-400 hover:text-white flex items-center ml-2 whitespace-nowrap"
              >
                Explore All ({nowShowingAll.length}) <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
              </Link>
            </div>
          </div>

          {/* Clean Horizontal Scrollable Movie Cards */}
          <div className="flex space-x-5 overflow-x-auto pb-4 scrollbar-none">
            {filteredNowShowing.map((movie) => (
              <MovieCard key={movie.movieId} movie={movie} />
            ))}
          </div>
        </section>

        {/* 5. FEATURE 3: TOP 5 TRENDING LEADERBOARD */}
        <section className="border-t border-white/10 pt-10">
          <div className="flex items-center justify-between mb-6">
            <div>
              <div className="flex items-center space-x-2 text-rose-500 font-bold text-xs uppercase tracking-wider mb-1">
                <Flame className="w-4 h-4 fill-current" />
                <span>Highest Box Office Velocity</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white">🔥 Top 5 Trending Blockbusters</h2>
            </div>
          </div>

          <div className="flex space-x-6 overflow-x-auto pb-4 scrollbar-none">
            {topTrending.map((movie, idx) => (
              <div key={movie.movieId} className="relative flex-shrink-0 flex items-end">
                {/* Large Stylized Rank Number */}
                <span className="text-7xl sm:text-8xl font-black font-display text-white/15 select-none -mr-6 z-0 drop-shadow-2xl">
                  {idx + 1}
                </span>
                <div className="relative z-10">
                  <MovieCard movie={movie} isTrending />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 6. CINEMAS NEAR YOU (Clean modern list) */}
        <section className="bg-zinc-950/60 rounded-3xl p-6 sm:p-8 border border-white/10 shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <div className="flex items-center space-x-2 text-primary font-bold text-xs uppercase tracking-wider mb-1">
                <Navigation className="w-3.5 h-3.5" />
                <span>Near You in {selectedLocation.city}</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white">Explore Top Cinemas</h2>
            </div>
            <Link
              to="/theatres"
              className="text-xs font-bold text-primary hover:text-red-400 flex items-center"
            >
              All {selectedLocation.city} Cinemas ({nearbyTheatres.length}) <ChevronRight className="w-4 h-4 ml-1" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {nearbyTheatres.map((theatre) => (
              <Link
                key={theatre.id}
                to={`/theatres/${theatre.id}`}
                className="group p-5 rounded-2xl bg-zinc-900/80 border border-white/10 hover:border-primary/50 transition-all flex flex-col justify-between space-y-4 hover:shadow-xl hover:shadow-primary/10"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-400/10 text-amber-400 border border-amber-400/20 flex items-center">
                      <Star className="w-3 h-3 fill-current mr-1" /> {theatre.rating}
                    </span>
                    <span className="text-[11px] font-bold text-emerald-400 font-mono">
                      {formatDistance(theatre.latitude, theatre.longitude)}
                    </span>
                  </div>
                  <h3 className="font-bold text-base text-white group-hover:text-primary transition-colors">
                    {theatre.name}
                  </h3>
                  <p className="text-xs text-zinc-400 flex items-center">
                    <MapPin className="w-3 h-3 mr-1 text-primary flex-shrink-0" />
                    {theatre.locationArea}, {theatre.city}
                  </p>
                </div>

                <div className="pt-3 border-t border-white/5 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1">
                    {theatre.formats.slice(0, 2).map((fmt) => (
                      <span
                        key={fmt}
                        className="text-[9px] px-2 py-0.5 rounded bg-white/5 text-zinc-300 border border-white/10"
                      >
                        {fmt}
                      </span>
                    ))}
                  </div>
                  <span className="text-primary font-bold group-hover:translate-x-1 transition-transform flex items-center">
                    Shows &rarr;
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* 7. UPCOMING RELEASES (Coming Soon Preview) */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <div>
              <div className="flex items-center space-x-2 text-amber-400 font-bold text-xs uppercase tracking-wider mb-1">
                <Calendar className="w-3.5 h-3.5" />
                <span>Premiering Soon</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white">Upcoming Blockbusters</h2>
            </div>
            <Link
              to="/movies?status=UPCOMING"
              className="text-xs font-bold text-primary hover:text-red-400 flex items-center"
            >
              Full Calendar <ChevronRight className="w-4 h-4 ml-1" />
            </Link>
          </div>

          <div className="flex space-x-5 overflow-x-auto pb-4 scrollbar-none">
            {upcomingMovies.map((movie) => (
              <MovieCard key={movie.movieId} movie={movie} />
            ))}
          </div>
        </section>

        {/* 8. PREMIUM CINEMATIC EXPERIENCES & FORMATS */}
        <section className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <div className="flex items-center space-x-2 text-sky-400 font-bold text-xs uppercase tracking-wider mb-1">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Next-Gen Cinema Technologies</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white">Immersive Cinema Experiences</h2>
              <p className="text-xs text-zinc-400 mt-1">
                Elevate your movie outing with cutting-edge visual projection and spatial sound engineering
              </p>
            </div>

            <Link
              to="/experiences"
              className="text-xs font-bold text-primary hover:text-red-400 flex items-center self-start sm:self-auto"
            >
              Explore All Experiences <ChevronRight className="w-4 h-4 ml-1" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* IMAX with Laser */}
            <Link
              to="/experiences"
              className="group rounded-3xl p-5 bg-gradient-to-br from-blue-950/60 via-zinc-950 to-zinc-950 border border-blue-500/30 hover:border-blue-500 transition-all shadow-xl flex flex-col justify-between space-y-4 hover:scale-[1.02]"
            >
              <div className="space-y-2.5">
                <div className="w-10 h-10 rounded-2xl bg-blue-500/20 text-blue-400 border border-blue-500/30 flex items-center justify-center">
                  <Maximize2 className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30">
                  Large Format
                </span>
                <h3 className="text-lg font-black text-white group-hover:text-blue-300 transition-colors">
                  IMAX with Laser
                </h3>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Dual 4K laser engines delivering up to 26% more picture with floor-to-ceiling curved screen immersion.
                </p>
              </div>
              <span className="text-xs font-bold text-blue-400 group-hover:translate-x-1 transition-transform flex items-center">
                Explore IMAX Shows &rarr;
              </span>
            </Link>

            {/* Dolby Atmos */}
            <Link
              to="/experiences"
              className="group rounded-3xl p-5 bg-gradient-to-br from-amber-950/60 via-zinc-950 to-zinc-950 border border-amber-500/30 hover:border-amber-500 transition-all shadow-xl flex flex-col justify-between space-y-4 hover:scale-[1.02]"
            >
              <div className="space-y-2.5">
                <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center">
                  <Volume2 className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  3D Spatial Audio
                </span>
                <h3 className="text-lg font-black text-white group-hover:text-amber-300 transition-colors">
                  Dolby Atmos 64-Ch
                </h3>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  64 discrete channels and overhead speakers moving sound around in 3D hemispheric space.
                </p>
              </div>
              <span className="text-xs font-bold text-amber-400 group-hover:translate-x-1 transition-transform flex items-center">
                Explore Atmos Shows &rarr;
              </span>
            </Link>

            {/* 4DX Multi-Sensory */}
            <Link
              to="/experiences"
              className="group rounded-3xl p-5 bg-gradient-to-br from-rose-950/60 via-zinc-950 to-zinc-950 border border-rose-500/30 hover:border-rose-500 transition-all shadow-xl flex flex-col justify-between space-y-4 hover:scale-[1.02]"
            >
              <div className="space-y-2.5">
                <div className="w-10 h-10 rounded-2xl bg-rose-500/20 text-rose-400 border border-rose-500/30 flex items-center justify-center">
                  <Wind className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30">
                  Kinetic Motion
                </span>
                <h3 className="text-lg font-black text-white group-hover:text-rose-300 transition-colors">
                  4DX Multi-Sensory
                </h3>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Motion-synchronized kinetic seats coupled with 21 environmental physical rain, wind & fog effects.
                </p>
              </div>
              <span className="text-xs font-bold text-rose-400 group-hover:translate-x-1 transition-transform flex items-center">
                Explore 4DX Shows &rarr;
              </span>
            </Link>

            {/* ScreenX 270° */}
            <Link
              to="/experiences"
              className="group rounded-3xl p-5 bg-gradient-to-br from-teal-950/60 via-zinc-950 to-zinc-950 border border-teal-500/30 hover:border-teal-500 transition-all shadow-xl flex flex-col justify-between space-y-4 hover:scale-[1.02]"
            >
              <div className="space-y-2.5">
                <div className="w-10 h-10 rounded-2xl bg-teal-500/20 text-teal-400 border border-teal-500/30 flex items-center justify-center">
                  <Tv className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/30">
                  270° Panoramic
                </span>
                <h3 className="text-lg font-black text-white group-hover:text-teal-300 transition-colors">
                  ScreenX 270°
                </h3>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Panoramic 3-wall projection extending the movie onto the side walls for peripheral immersion.
                </p>
              </div>
              <span className="text-xs font-bold text-teal-400 group-hover:translate-x-1 transition-transform flex items-center">
                Explore ScreenX Shows &rarr;
              </span>
            </Link>
          </div>
        </section>

        {/* 9. CLASSIC EXCLUSIVE BANK OFFERS & PROMOS */}
        <section className="border-t border-white/10 pt-10 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <div className="flex items-center space-x-2 text-rose-400 font-bold text-xs uppercase tracking-wider mb-1">
                <Gift className="w-3.5 h-3.5 text-primary" />
                <span>Partner Privilege & Bank Deals</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white">Exclusive Offers & Bank Discounts</h2>
              <p className="text-xs text-zinc-400 mt-1">
                Save with Buy 1 Get 1 Free, flat cashbacks, and instant savings on Axis, HDFC, ICICI, SBI & wallets
              </p>
            </div>

            <Link
              to="/offers"
              className="text-xs font-bold text-primary hover:text-red-400 flex items-center self-start sm:self-auto"
            >
              View All 22+ Offers <ChevronRight className="w-4 h-4 ml-1" />
            </Link>
          </div>

          {/* Quick Category Switcher Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            <button
              onClick={() => setOfferTab('ALL')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                offerTab === 'ALL'
                  ? 'bg-primary text-white shadow-md shadow-primary/30'
                  : 'bg-zinc-900 text-zinc-400 hover:text-white border border-white/10'
              }`}
            >
              Top Picks
            </button>
            <button
              onClick={() => setOfferTab('BANK_CARDS')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                offerTab === 'BANK_CARDS'
                  ? 'bg-primary text-white shadow-md shadow-primary/30'
                  : 'bg-zinc-900 text-zinc-400 hover:text-white border border-white/10'
              }`}
            >
              <CreditCard className="w-3 h-3" /> Bank Cards (BOGO)
            </button>
            <button
              onClick={() => setOfferTab('UPI_WALLETS')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                offerTab === 'UPI_WALLETS'
                  ? 'bg-primary text-white shadow-md shadow-primary/30'
                  : 'bg-zinc-900 text-zinc-400 hover:text-white border border-white/10'
              }`}
            >
              <Smartphone className="w-3 h-3" /> UPI & Wallets
            </button>
            <button
              onClick={() => setOfferTab('CINEMA_COUPONS')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                offerTab === 'CINEMA_COUPONS'
                  ? 'bg-primary text-white shadow-md shadow-primary/30'
                  : 'bg-zinc-900 text-zinc-400 hover:text-white border border-white/10'
              }`}
            >
              <Tag className="w-3 h-3" /> Cinema Coupons
            </button>
          </div>

          {/* Classic Perforated Voucher Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {showcaseOffers.map((offer) => (
              <div
                key={offer.id}
                className={`rounded-3xl overflow-hidden border ${offer.borderAccent} bg-zinc-950/90 hover:border-primary/80 transition-all duration-300 flex flex-col justify-between shadow-xl group`}
              >
                <div>
                  {/* Top Brand Banner */}
                  <div className={`p-4 bg-gradient-to-br ${offer.gradient} relative overflow-hidden`}>
                    <div className="flex justify-between items-start gap-2">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-black/40 backdrop-blur border border-white/10 text-white">
                          {offer.bankOrIssuer}
                        </span>
                        <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-white/20 text-white">
                          {offer.badge}
                        </span>
                      </div>
                      <span className="text-[11px] font-black font-mono tracking-wider text-amber-300 bg-black/50 px-2 py-0.5 rounded-md border border-amber-300/30">
                        {offer.discountDisplay}
                      </span>
                    </div>

                    <h3 className="text-base font-black text-white mt-3 group-hover:text-amber-200 transition-colors">
                      {offer.title}
                    </h3>
                  </div>

                  {/* Body Content */}
                  <div className="p-4 space-y-2.5">
                    <p className="text-xs text-zinc-300 leading-relaxed font-normal line-clamp-2">
                      {offer.subtitle}
                    </p>

                    <div className="flex items-center gap-2 text-[10px] text-zinc-400 pt-1.5 border-t border-white/5">
                      <span className="px-2 py-0.5 rounded bg-zinc-900 border border-white/10 text-zinc-300">
                        {offer.cardType}
                      </span>
                      <span>Min ₹{offer.minOrder}</span>
                    </div>
                  </div>
                </div>

                {/* Perforated Coupon Bottom */}
                <div className="p-4 pt-0">
                  <div className="border-t border-dashed border-white/20 pt-3 flex items-center justify-between gap-2">
                    <div className="bg-zinc-900 border border-dashed border-white/20 rounded-xl px-2.5 py-1">
                      <span className="text-[8px] uppercase font-bold text-zinc-500 block">Code</span>
                      <span className="font-mono font-black text-xs text-primary tracking-wider">
                        {offer.code}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleCopyCoupon(offer.code)}
                        className="text-xs font-bold px-3 py-1.5 rounded-xl bg-white/10 hover:bg-primary text-white flex items-center gap-1 transition-colors cursor-pointer"
                      >
                        {copiedCoupon === offer.code ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-400" /> Copied
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" /> Copy
                          </>
                        )}
                      </button>

                      <Link to="/movies">
                        <button
                          title="Book tickets using this offer"
                          className="p-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white transition-colors cursor-pointer"
                        >
                          <Film className="w-3.5 h-3.5" />
                        </button>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* QUICK PREVIEW MODAL */}
      <AnimatePresence>
        {previewMovie && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-zinc-950 border border-white/15 rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl relative"
            >
              <div className="relative aspect-video w-full overflow-hidden">
                <img
                  src={previewMovie.backdropUrl}
                  alt={previewMovie.title}
                  className="w-full h-full object-cover filter brightness-[0.6]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-black/60" />
                <button
                  onClick={() => setPreviewMovie(null)}
                  className="absolute top-4 right-4 p-2 rounded-full bg-black/70 hover:bg-black text-white cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
                <div className="absolute bottom-4 left-6 right-6 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-bold uppercase bg-primary px-2.5 py-0.5 rounded text-white">
                      {previewMovie.certificate} &bull; {previewMovie.language}
                    </span>
                    <h3 className="text-2xl sm:text-3xl font-black text-white mt-1">
                      {previewMovie.title}
                    </h3>
                  </div>
                  <span className="text-amber-400 font-black text-sm bg-black/60 px-3 py-1 rounded-full flex items-center border border-amber-400/20">
                    <Star className="w-4 h-4 fill-current mr-1 text-amber-400" />
                    {previewMovie.seedRating}
                  </span>
                </div>
              </div>

              <div className="p-6 space-y-4">
                <div className="flex flex-wrap items-center gap-2 text-xs text-zinc-300">
                  <span className="font-semibold text-white">{previewMovie.genreString}</span>
                  <span>&bull;</span>
                  <span>{previewMovie.durationMin} mins</span>
                  <span>&bull;</span>
                  <span className="text-emerald-400 font-bold">{previewMovie.industry} Cinema</span>
                </div>

                <p className="text-sm text-zinc-300 leading-relaxed">
                  {previewMovie.shortDescription}
                </p>

                <div className="text-xs text-zinc-400 border-t border-white/10 pt-3">
                  <span className="font-bold text-white">Starring: </span>
                  {previewMovie.castString}
                </div>

                <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
                  <button
                    onClick={() => setPreviewMovie(null)}
                    className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-bold text-xs"
                  >
                    Close
                  </button>
                  <Link to={`/movies/${previewMovie.movieId}`}>
                    <Button variant="primary" size="md" className="rounded-xl px-6 font-bold text-xs">
                      View Showtimes & Book Tickets &rarr;
                    </Button>
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
