import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Trash2, Film, MapPin, Star, ArrowRight } from 'lucide-react';
import { Button } from '@/components/common/Button';
import toast from 'react-hot-toast';

interface FavoriteMovie {
  id: string;
  title: string;
  genre: string;
  rating: number;
  duration: number;
  language: string;
  certificate: string;
  posterGradient: string;
}

interface FavoriteTheatre {
  id: string;
  name: string;
  location: string;
  rating: number;
  amenities: string[];
}

const INITIAL_MOVIES: FavoriteMovie[] = [
  { id: 'MOV001', title: 'Baththa', genre: 'Action, Drama', rating: 7.8, duration: 142, language: 'Tamil', certificate: 'UA', posterGradient: 'from-red-900 to-black' },
  { id: 'MOV002', title: 'Yezhu Kadal Yezhu Malai', genre: 'Drama, Mystery', rating: 8.0, duration: 150, language: 'Tamil', certificate: 'UA', posterGradient: 'from-purple-900 to-black' },
  { id: 'MOV025', title: 'Digger', genre: 'Action, Thriller', rating: 7.8, duration: 110, language: 'English', certificate: 'UA', posterGradient: 'from-blue-900 to-black' },
];

const INITIAL_THEATRES: FavoriteTheatre[] = [
  { id: '201', name: 'PVR Grand Mall', location: 'Velachery, Chennai', rating: 4.3, amenities: ['Dolby Atmos', '4K Laser', 'Food Court', 'Parking'] },
  { id: '203', name: 'AGS Cinemas T.Nagar', location: 'T.Nagar, Chennai', rating: 4.2, amenities: ['IMAX', 'Dolby Atmos', 'Recliner Seating'] },
];

export const Favorites: React.FC = () => {
  const [tab, setTab] = useState<'MOVIES' | 'THEATRES'>('MOVIES');
  const [movies, setMovies] = useState(INITIAL_MOVIES);
  const [theatres, setTheatres] = useState(INITIAL_THEATRES);

  const removeMovie = (id: string, title: string) => {
    setMovies(prev => prev.filter(m => m.id !== id));
    toast.success(`Removed "${title}" from favorites`);
  };

  const removeTheatre = (id: string, name: string) => {
    setTheatres(prev => prev.filter(t => t.id !== id));
    toast.success(`Removed "${name}" from favorites`);
  };

  return (
    <div className="min-h-screen bg-dark text-white pt-32 sm:pt-36 md:pt-40 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 pb-6 border-b border-white/10">
          <div>
            <div className="flex items-center space-x-2 text-primary font-medium text-sm mb-1 uppercase tracking-wider">
              <Heart className="w-4 h-4 fill-primary" />
              <span>Saved Experiences</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-display font-bold">My Favorites</h1>
            <p className="text-zinc-400 mt-1">Keep track of your top movies and preferred local theatres for instant bookings.</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex space-x-2 mb-8 bg-zinc-900/60 p-1.5 rounded-2xl w-fit border border-white/5">
          <button
            onClick={() => setTab('MOVIES')}
            className={`px-6 py-2.5 rounded-xl text-sm font-semibold transition-all ${
              tab === 'MOVIES' ? 'bg-primary text-white shadow-lg shadow-primary/30' : 'text-zinc-400 hover:text-white'
            }`}
          >
            Favorite Movies ({movies.length})
          </button>
          <button
            onClick={() => setTab('THEATRES')}
            className={`px-6 py-2.5 rounded-xl text-sm font-semibold transition-all ${
              tab === 'THEATRES' ? 'bg-primary text-white shadow-lg shadow-primary/30' : 'text-zinc-400 hover:text-white'
            }`}
          >
            Saved Theatres ({theatres.length})
          </button>
        </div>

        {/* Content */}
        {tab === 'MOVIES' ? (
          movies.length === 0 ? (
            <div className="glass-card rounded-2xl p-12 text-center max-w-md mx-auto">
              <Film className="w-12 h-12 text-zinc-600 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-white mb-1">No favorite movies saved</h3>
              <p className="text-zinc-400 text-sm mb-6">Tap the heart icon on any movie to bookmark it here.</p>
              <Link to="/movies">
                <Button variant="outline" size="sm">Browse Movies</Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {movies.map(m => (
                <div key={m.id} className="glass-card rounded-2xl overflow-hidden border border-white/10 group hover:border-primary/40 transition-all flex flex-col justify-between">
                  <div>
                    <div className={`h-48 bg-gradient-to-br ${m.posterGradient} p-4 flex flex-col justify-between relative`}>
                      <div className="flex justify-between items-center">
                        <span className="text-xs bg-white/20 backdrop-blur px-2 py-0.5 rounded font-bold text-white">
                          {m.certificate}
                        </span>
                        <button
                          onClick={() => removeMovie(m.id, m.title)}
                          className="w-8 h-8 rounded-full bg-black/60 hover:bg-red-500/80 transition-colors flex items-center justify-center text-white"
                          title="Remove from favorites"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <div>
                        <span className="text-xs text-primary font-bold tracking-wider uppercase">{m.genre}</span>
                        <h3 className="text-xl font-bold font-display text-white mt-0.5">{m.title}</h3>
                      </div>
                    </div>
                    <div className="p-4 space-y-2">
                      <div className="flex items-center justify-between text-xs text-zinc-400">
                        <span className="flex items-center text-amber-400 font-bold">
                          <Star className="w-3.5 h-3.5 fill-current mr-1" /> {m.rating}
                        </span>
                        <span>{m.duration} mins</span>
                        <span>{m.language}</span>
                      </div>
                    </div>
                  </div>
                  <div className="p-4 pt-0">
                    <Link to={`/movies/${m.id}`}>
                      <Button variant="primary" size="sm" className="w-full rounded-xl">
                        Book Tickets
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )
        ) : (
          theatres.length === 0 ? (
            <div className="glass-card rounded-2xl p-12 text-center max-w-md mx-auto">
              <MapPin className="w-12 h-12 text-zinc-600 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-white mb-1">No theatres saved</h3>
              <p className="text-zinc-400 text-sm mb-6">Save your favorite cinemas for one-click showtime lookups.</p>
              <Link to="/theatres">
                <Button variant="outline" size="sm">Explore Theatres</Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {theatres.map(t => (
                <div key={t.id} className="glass-card rounded-2xl p-6 border border-white/10 hover:border-primary/40 transition-all flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="text-xl font-bold font-display text-white">{t.name}</h3>
                        <p className="text-sm text-zinc-400 flex items-center mt-1">
                          <MapPin className="w-3.5 h-3.5 text-primary mr-1" /> {t.location}
                        </p>
                      </div>
                      <button
                        onClick={() => removeTheatre(t.id, t.name)}
                        className="w-8 h-8 rounded-full bg-white/5 hover:bg-red-500/80 transition-colors flex items-center justify-center text-zinc-400 hover:text-white"
                        title="Remove"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2 my-4">
                      {t.amenities.map(a => (
                        <span key={a} className="text-xs px-2.5 py-1 rounded-lg bg-white/5 text-zinc-300 border border-white/5">
                          {a}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                    <div className="flex items-center text-amber-400 font-bold text-sm">
                      <Star className="w-4 h-4 fill-current mr-1" /> {t.rating} / 5.0
                    </div>
                    <Link to={`/theatres/${t.id}`}>
                      <Button variant="outline" size="sm" className="rounded-xl">
                        View Shows <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )
        )}
      </div>
    </div>
  );
};
