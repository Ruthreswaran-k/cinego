import React, { useState } from 'react';
import { Film, Search, Filter, RotateCcw } from 'lucide-react';
import { MovieCard } from '@/components/movie/MovieCard';
import { ALL_MOVIES, Movie } from '@/data/moviesData';

export const Movies: React.FC = () => {
  const [selectedGenre, setSelectedGenre] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL'); // ALL, Tamil, Malayalam, English, Kollywood, Mollywood, Hollywood
  const [statusTab, setStatusTab] = useState<'RUNNING' | 'UPCOMING'>('RUNNING');
  const [minRating, setMinRating] = useState<number>(0);
  const [search, setSearch] = useState('');

  const genresList = [
    'Action',
    'Adventure',
    'Animation',
    'Biography',
    'Comedy',
    'Crime',
    'Drama',
    'Family',
    'Fantasy',
    'Horror',
    'Mystery',
    'Romance',
    'Sci-Fi',
    'Thriller',
  ];

  const filteredMovies = ALL_MOVIES.filter((m: Movie) => {
    // 1. Status Filter
    const matchesStatus = m.status === statusTab;

    // 2. Language / Industry Filter
    let matchesCategory = true;
    if (selectedCategory === 'Tamil') matchesCategory = m.language === 'Tamil';
    else if (selectedCategory === 'Malayalam') matchesCategory = m.language === 'Malayalam';
    else if (selectedCategory === 'English') matchesCategory = m.language === 'English';
    else if (selectedCategory === 'Kollywood') matchesCategory = m.industry === 'Kollywood';
    else if (selectedCategory === 'Mollywood') matchesCategory = m.industry === 'Mollywood';
    else if (selectedCategory === 'Hollywood') matchesCategory = m.industry === 'Hollywood';

    // 3. Genre Filter
    const matchesGenre = selectedGenre ? m.genre.includes(selectedGenre) : true;

    // 4. Rating Filter
    const matchesRating = minRating > 0 ? m.seedRating >= minRating : true;

    // 5. Search Filter
    const query = search.trim().toLowerCase();
    const matchesSearch = query
      ? m.title.toLowerCase().includes(query) ||
        m.genreString.toLowerCase().includes(query) ||
        m.language.toLowerCase().includes(query) ||
        m.industry.toLowerCase().includes(query) ||
        m.castString.toLowerCase().includes(query) ||
        m.shortDescription.toLowerCase().includes(query)
      : true;

    return matchesStatus && matchesCategory && matchesGenre && matchesRating && matchesSearch;
  });

  const runningCount = ALL_MOVIES.filter((m) => m.status === 'RUNNING').length;
  const upcomingCount = ALL_MOVIES.filter((m) => m.status === 'UPCOMING').length;

  const resetFilters = () => {
    setSelectedGenre('');
    setSelectedCategory('ALL');
    setMinRating(0);
    setSearch('');
  };

  const hasActiveFilters = selectedGenre || selectedCategory !== 'ALL' || minRating > 0 || search;

  return (
    <div className="min-h-screen bg-transparent text-white px-4 sm:px-6 md:px-10 font-display pt-32 sm:pt-36 md:pt-40 pb-20">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-6">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold flex items-center tracking-tight">
              <Film className="w-8 h-8 text-primary mr-3" /> Movie Catalogue
            </h1>
            <p className="text-zinc-400 text-xs sm:text-sm mt-1">
              Explore films currently screening in theatres and upcoming premiere titles across Kollywood, Mollywood, and Hollywood.
            </p>
          </div>

          <div className="relative w-full md:w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search title, actor, genre..."
              className="w-full bg-zinc-900 border border-white/10 rounded-full py-2.5 pl-10 pr-4 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-primary transition-colors"
            />
          </div>
        </div>

        {/* Filter Controls Bar */}
        <div className="glass-card rounded-2xl p-4 border border-white/10 flex flex-col lg:flex-row items-center justify-between gap-4">
          {/* Status Tabs */}
          <div className="flex bg-zinc-900 p-1 rounded-xl border border-white/10 w-full lg:w-auto">
            <button
              onClick={() => setStatusTab('RUNNING')}
              className={`flex-1 lg:flex-initial px-5 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                statusTab === 'RUNNING'
                  ? 'bg-primary text-white shadow-md shadow-primary/30'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              Now Showing ({runningCount})
            </button>
            <button
              onClick={() => setStatusTab('UPCOMING')}
              className={`flex-1 lg:flex-initial px-5 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                statusTab === 'UPCOMING'
                  ? 'bg-primary text-white shadow-md shadow-primary/30'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              Coming Soon ({upcomingCount})
            </button>
          </div>

          {/* Dropdown Filters */}
          <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto justify-start lg:justify-end">
            <div className="flex items-center space-x-1.5 text-xs text-zinc-400 mr-1">
              <Filter className="w-3.5 h-3.5 text-primary" />
              <span>Filters:</span>
            </div>

            {/* Language / Industry Selector */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-zinc-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-primary cursor-pointer"
            >
              <option value="ALL">All Languages & Industries</option>
              <optgroup label="By Language">
                <option value="Tamil">Tamil</option>
                <option value="Malayalam">Malayalam</option>
                <option value="English">English</option>
              </optgroup>
              <optgroup label="By Industry">
                <option value="Kollywood">Kollywood (Tamil)</option>
                <option value="Mollywood">Mollywood (Malayalam)</option>
                <option value="Hollywood">Hollywood (English)</option>
              </optgroup>
            </select>

            {/* Genre Selector */}
            <select
              value={selectedGenre}
              onChange={(e) => setSelectedGenre(e.target.value)}
              className="bg-zinc-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-primary cursor-pointer"
            >
              <option value="">All Genres</option>
              {genresList.map((g) => (
                <option key={g} value={g}>
                  {g}
                </option>
              ))}
            </select>

            {/* Rating Selector */}
            <select
              value={minRating}
              onChange={(e) => setMinRating(Number(e.target.value))}
              className="bg-zinc-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-primary cursor-pointer"
            >
              <option value={0}>All Ratings</option>
              <option value={8.0}>⭐ 8.0+ Rating</option>
              <option value={7.5}>⭐ 7.5+ Rating</option>
              <option value={7.0}>⭐ 7.0+ Rating</option>
            </select>

            {/* Reset Button */}
            {hasActiveFilters && (
              <button
                onClick={resetFilters}
                className="flex items-center gap-1 text-xs text-primary font-bold hover:underline px-2 py-2 cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" /> Reset
              </button>
            )}
          </div>
        </div>

        {/* Quick Industry Pills */}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <span className="text-xs text-zinc-500 mr-2">Quick Filter:</span>
          {[
            { label: 'All', value: 'ALL' },
            { label: 'Kollywood (Tamil)', value: 'Kollywood' },
            { label: 'Mollywood (Malayalam)', value: 'Mollywood' },
            { label: 'Hollywood (English)', value: 'Hollywood' },
          ].map((pill) => (
            <button
              key={pill.value}
              onClick={() => setSelectedCategory(pill.value)}
              className={`px-3 py-1 rounded-full text-xs transition-colors cursor-pointer ${
                selectedCategory === pill.value
                  ? 'bg-white/20 text-white font-semibold border border-white/30'
                  : 'bg-zinc-900/60 text-zinc-400 hover:text-white border border-white/5'
              }`}
            >
              {pill.label}
            </button>
          ))}
        </div>

        {/* Movies Grid */}
        {filteredMovies.length === 0 ? (
          <div className="glass-card rounded-2xl p-12 text-center max-w-md mx-auto">
            <Film className="w-12 h-12 text-zinc-600 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-white mb-1">No movies match your filters</h3>
            <p className="text-zinc-400 text-xs">Try selecting a different genre, industry, or clearing your search term.</p>
            <button
              onClick={resetFilters}
              className="mt-4 px-4 py-2 bg-primary/20 text-primary hover:bg-primary/30 rounded-xl text-xs font-semibold cursor-pointer"
            >
              Clear All Filters
            </button>
          </div>
        ) : (
          <div>
            <div className="flex justify-between items-center mb-4 text-xs text-zinc-400">
              <span>Showing {filteredMovies.length} {statusTab === 'RUNNING' ? 'running' : 'upcoming'} titles</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {filteredMovies.map((movie) => (
                <div key={movie.movieId} className="flex justify-center">
                  <MovieCard movie={movie} />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
