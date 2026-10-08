import React, { useState, useMemo, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Search as SearchIcon, Film, MapPin, Star, Clock, X, ArrowRight, Tag, Sparkles } from 'lucide-react';
import { Button } from '@/components/common/Button';
import { ALL_THEATRES } from './Theatres';
import { ALL_MOVIES, Movie } from '@/data/moviesData';

const POPULAR_SEARCHES = [
  'Baththa',
  'Jailer 2',
  'Yezhu Kadal Yezhu Malai',
  'Digger',
  'The Third Murder',
  'Torpedo',
  'Street Fighter',
  'Demonte Colony 3',
  'Bison Kaalamaadan',
  'Tamil',
  'Malayalam',
  'English',
  'Kollywood',
  'Mollywood',
  'Hollywood',
  'Puducherry',
  'Chennai',
  'Coimbatore',
  'Karaikal',
  'Nagapattinam',
];

export const Search: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const urlQuery = searchParams.get('q') || '';
  const [query, setQuery] = useState(urlQuery);

  // Sync state if url changes
  useEffect(() => {
    setQuery(urlQuery);
  }, [urlQuery]);

  const handleUpdateQuery = (newQuery: string) => {
    setQuery(newQuery);
    if (newQuery.trim()) {
      setSearchParams({ q: newQuery.trim() });
    } else {
      setSearchParams({});
    }
  };

  const trimmed = query.trim().toLowerCase();

  const filteredMovies = useMemo(() => {
    if (!trimmed) return ALL_MOVIES;
    return ALL_MOVIES.filter(
      (m: Movie) =>
        m.title.toLowerCase().includes(trimmed) ||
        m.genreString.toLowerCase().includes(trimmed) ||
        m.language.toLowerCase().includes(trimmed) ||
        m.industry.toLowerCase().includes(trimmed) ||
        m.castString.toLowerCase().includes(trimmed) ||
        m.shortDescription.toLowerCase().includes(trimmed)
    );
  }, [trimmed]);

  const filteredTheatres = useMemo(() => {
    if (!trimmed) return ALL_THEATRES;
    return ALL_THEATRES.filter(
      (t) =>
        t.name.toLowerCase().includes(trimmed) ||
        t.locationArea.toLowerCase().includes(trimmed) ||
        t.city.toLowerCase().includes(trimmed) ||
        t.address.toLowerCase().includes(trimmed) ||
        t.amenities.some((a) => a.toLowerCase().includes(trimmed))
    );
  }, [trimmed]);

  return (
    <div className="min-h-screen bg-dark text-white pt-32 sm:pt-36 md:pt-40 pb-20 px-4 sm:px-6 lg:px-8 font-display">
      <div className="max-w-6xl mx-auto">
        {/* Search Bar Input */}
        <div className="relative mb-10">
          <div className="glass-card rounded-2xl p-2.5 flex items-center border border-white/10 shadow-2xl focus-within:border-primary transition-all">
            <SearchIcon className="w-5 h-5 text-zinc-400 ml-3 mr-3 flex-shrink-0" />
            <input
              type="text"
              value={query}
              onChange={(e) => handleUpdateQuery(e.target.value)}
              placeholder="Search movies, actors, industries (Kollywood, Mollywood, Hollywood), cinemas..."
              className="bg-transparent text-white text-base w-full focus:outline-none placeholder-zinc-500 font-sans"
              autoFocus
            />
            {query && (
              <button
                onClick={() => handleUpdateQuery('')}
                className="p-2 text-zinc-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Quick Filter Tag Pills */}
          <div className="flex items-center gap-2 mt-4 overflow-x-auto pb-2 scrollbar-none">
            <span className="text-xs text-zinc-400 flex items-center mr-1 flex-shrink-0">
              <Sparkles className="w-3.5 h-3.5 text-primary mr-1" /> Trending Searches:
            </span>
            {POPULAR_SEARCHES.map((tag) => (
              <button
                key={tag}
                onClick={() => handleUpdateQuery(tag)}
                className={`text-xs px-3 py-1.5 rounded-full border transition-all whitespace-nowrap cursor-pointer ${
                  query.toLowerCase() === tag.toLowerCase()
                    ? 'bg-primary border-primary text-white font-bold'
                    : 'bg-white/5 border-white/10 text-zinc-300 hover:bg-white/10'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* Search Results Summary */}
        <div className="space-y-12">
          {/* Movies Section */}
          <section>
            <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-6">
              <h2 className="text-xl sm:text-2xl font-bold flex items-center">
                <Film className="w-6 h-6 text-primary mr-2.5" />
                Movies
                <span className="ml-3 text-xs bg-white/10 text-zinc-300 px-2.5 py-0.5 rounded-full font-mono">
                  {filteredMovies.length}
                </span>
              </h2>
              {filteredMovies.length > 0 && (
                <span className="text-xs text-zinc-400">
                  Showing matching Kollywood, Mollywood & Hollywood titles
                </span>
              )}
            </div>

            {filteredMovies.length === 0 ? (
              <div className="glass-card rounded-2xl p-8 text-center text-zinc-400">
                <p>No movies found matching "{query}"</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredMovies.slice(0, 9).map((m) => (
                  <Link
                    key={m.movieId}
                    to={`/movies/${m.movieId}`}
                    className="glass-card rounded-2xl p-4 border border-white/10 hover:border-primary/50 transition-all flex gap-4 group"
                  >
                    <div className="w-20 h-28 rounded-xl overflow-hidden flex-shrink-0 relative">
                      <img
                        src={m.posterUrl}
                        alt={m.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                      <span className="absolute top-1 left-1 bg-black/70 text-[9px] px-1 py-0.5 rounded text-white font-bold">
                        {m.industry}
                      </span>
                    </div>

                    <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
                      <div>
                        <div className="flex items-center justify-between gap-1">
                          <h3 className="font-bold text-white group-hover:text-primary transition-colors truncate">
                            {m.title}
                          </h3>
                          <span
                            className={`text-[9px] px-1.5 py-0.5 rounded uppercase font-bold ${
                              m.status === 'RUNNING'
                                ? 'bg-emerald-500/20 text-emerald-400'
                                : 'bg-amber-500/20 text-amber-400'
                            }`}
                          >
                            {m.status === 'RUNNING' ? 'Running' : 'Upcoming'}
                          </span>
                        </div>
                        <p className="text-xs text-zinc-400 truncate mt-0.5">{m.genreString}</p>
                        <p className="text-xs text-zinc-500 truncate mt-0.5">Cast: {m.castString}</p>
                      </div>

                      <div className="flex items-center justify-between text-xs pt-2 border-t border-white/5">
                        <span className="text-amber-400 font-bold flex items-center">
                          <Star className="w-3.5 h-3.5 fill-current mr-1" /> ⭐ {m.seedRating}
                        </span>
                        <span className="text-zinc-400 flex items-center">
                          <Clock className="w-3.5 h-3.5 mr-1" /> {m.durationMin}m
                        </span>
                        <span className="text-zinc-400">{m.language}</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </section>

          {/* Theatres Section */}
          <section>
            <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-6">
              <h2 className="text-xl sm:text-2xl font-bold flex items-center">
                <MapPin className="w-6 h-6 text-primary mr-2.5" />
                Theatres & Cinema Halls
                <span className="ml-3 text-xs bg-white/10 text-zinc-300 px-2.5 py-0.5 rounded-full font-mono">
                  {filteredTheatres.length}
                </span>
              </h2>
            </div>

            {filteredTheatres.length === 0 ? (
              <div className="glass-card rounded-2xl p-8 text-center text-zinc-400">
                <p>No theatres found matching "{query}"</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredTheatres.slice(0, 6).map((t) => (
                  <Link
                    key={t.id}
                    to={`/theatres/${t.id}`}
                    className="glass-card rounded-2xl p-5 border border-white/10 hover:border-primary/50 transition-all flex flex-col justify-between group"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="font-bold text-white group-hover:text-primary transition-colors text-base">
                          {t.name}
                        </h3>
                        <span className="text-amber-400 font-bold text-xs flex items-center bg-amber-400/10 px-2 py-0.5 rounded-full">
                          <Star className="w-3 h-3 fill-current mr-1" /> {t.rating}
                        </span>
                      </div>
                      <p className="text-xs text-zinc-400 mt-1 flex items-center">
                        <MapPin className="w-3 h-3 text-primary mr-1" /> {t.locationArea}, {t.city}
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-xs text-zinc-400">
                      <span>{t.screens} Screens</span>
                      <span className="text-primary font-semibold flex items-center group-hover:translate-x-1 transition-transform">
                        View Shows <ArrowRight className="w-3.5 h-3.5 ml-1" />
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
};
