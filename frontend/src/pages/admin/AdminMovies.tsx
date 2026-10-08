import React, { useState } from 'react';
import { Film, Plus, Edit, Trash2, Search, CheckCircle2, XCircle, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/common/Button';
import toast from 'react-hot-toast';

import { ALL_MOVIES } from '@/data/moviesData';

interface MovieRow {
  id: number;
  movieId?: string;
  title: string;
  language: string;
  genre: string;
  duration: number;
  rating: number;
  status: 'RUNNING' | 'UPCOMING' | 'CANCELLED';
  format: string;
}

const INITIAL_MOVIES: MovieRow[] = ALL_MOVIES.map((m, idx) => ({
  id: idx + 101,
  movieId: m.movieId,
  title: m.title,
  language: m.language,
  genre: m.genreString,
  duration: m.durationMin,
  rating: m.seedRating,
  status: m.status,
  format: '2D',
}));

export const AdminMovies: React.FC = () => {
  const [movies, setMovies] = useState<MovieRow[]>(INITIAL_MOVIES);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);

  // New movie form state
  const [newMovie, setNewMovie] = useState({
    id: 111,
    title: '',
    language: 'Tamil',
    genre: 'Action',
    duration: 150,
    format: '2D',
  });

  const handleAddMovie = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMovie.title.trim()) {
      toast.error('Title is required');
      return;
    }

    const created: MovieRow = {
      id: newMovie.id,
      title: newMovie.title,
      language: newMovie.language,
      genre: newMovie.genre,
      duration: Number(newMovie.duration),
      rating: 0,
      status: 'RUNNING',
      format: newMovie.format,
    };

    setMovies(prev => [created, ...prev]);
    setIsAddModalOpen(false);
    toast.success(`Movie "${newMovie.title}" added to catalogue successfully!`);
    setNewMovie(prev => ({ ...prev, id: prev.id + 1, title: '' }));
  };

  const handleRemoveMovie = (id: number) => {
    const target = movies.find(m => m.id === id);
    setMovies(prev => prev.map(m => m.id === id ? { ...m, status: 'CANCELLED' } : m));
    setDeleteConfirmId(null);
    toast.success(`Movie "${target?.title || id}" removed from active cinema schedules.`);
  };

  const handleToggleStatus = (id: number) => {
    setMovies(prev =>
      prev.map(m => {
        if (m.id === id) {
          const next = m.status === 'RUNNING' ? 'UPCOMING' : 'RUNNING';
          toast.success(`Movie "${m.title}" status updated to ${next}`);
          return { ...m, status: next };
        }
        return m;
      })
    );
  };

  const filtered = movies.filter(m =>
    m.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.genre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.language.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-white">Movie Catalogue Management</h1>
          <p className="text-zinc-400 text-sm mt-1">
            Directly mapped to PL/SQL procedures <code className="text-primary font-mono font-bold">ADD_MOVIE</code>, <code className="text-primary font-mono font-bold">UPDATE_MOVIE</code>, and <code className="text-primary font-mono font-bold">REMOVE_MOVIE</code>.
          </p>
        </div>
        <Button variant="primary" onClick={() => setIsAddModalOpen(true)} className="rounded-xl flex items-center">
          <Plus className="w-4 h-4 mr-2" /> Add New Movie
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="glass-card rounded-2xl p-4 border border-white/10 flex items-center">
        <Search className="w-5 h-5 text-zinc-400 mr-3" />
        <input
          type="text"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          placeholder="Filter catalogue by title, language or genre..."
          className="bg-transparent border-none text-white w-full focus:outline-none placeholder-zinc-500 text-sm"
        />
      </div>

      {/* Movies Table */}
      <div className="glass-card rounded-2xl border border-white/10 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-zinc-300">
            <thead className="bg-zinc-900/90 text-xs uppercase text-zinc-400 border-b border-white/10">
              <tr>
                <th className="px-6 py-4">ID</th>
                <th className="px-6 py-4">Movie Title</th>
                <th className="px-6 py-4">Language</th>
                <th className="px-6 py-4">Genre</th>
                <th className="px-6 py-4">Duration</th>
                <th className="px-6 py-4">Format</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filtered.map(m => (
                <tr key={m.id} className="hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4 font-mono font-bold text-zinc-400">{m.id}</td>
                  <td className="px-6 py-4 font-bold text-white flex items-center">
                    <Film className="w-4 h-4 mr-2 text-primary" /> {m.title}
                  </td>
                  <td className="px-6 py-4">{m.language}</td>
                  <td className="px-6 py-4">{m.genre}</td>
                  <td className="px-6 py-4">{m.duration}m</td>
                  <td className="px-6 py-4 font-mono text-xs">{m.format}</td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleToggleStatus(m.id)}
                      title="Click to toggle status"
                      className={`text-xs px-2.5 py-0.5 rounded-full font-bold cursor-pointer transition-transform hover:scale-105 ${
                        m.status === 'RUNNING'
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          : m.status === 'UPCOMING'
                          ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                          : 'bg-red-500/10 text-red-400 border border-red-500/20'
                      }`}
                    >
                      {m.status}
                    </button>
                  </td>
                  <td className="px-6 py-4 text-right space-x-2">
                    <button
                      onClick={() => handleToggleStatus(m.id)}
                      className="text-zinc-400 hover:text-white p-1"
                      title="Update Status"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    {m.status !== 'CANCELLED' && (
                      <button
                        onClick={() => setDeleteConfirmId(m.id)}
                        className="text-zinc-400 hover:text-red-400 p-1"
                        title="Remove Movie"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Movie Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="glass-card rounded-2xl max-w-lg w-full p-6 border border-white/20 animate-scale-in">
            <h2 className="text-xl font-bold font-display text-white mb-4 flex items-center">
              <Film className="w-5 h-5 text-primary mr-2" /> Add Movie (ADD_MOVIE Procedure)
            </h2>
            <form onSubmit={handleAddMovie} className="space-y-4 text-sm">
              <div>
                <label className="block text-zinc-400 text-xs mb-1 font-semibold">Movie ID (Auto/Sequence)</label>
                <input
                  type="number"
                  value={newMovie.id}
                  disabled
                  className="w-full bg-zinc-900 border border-white/10 rounded-xl px-4 py-2.5 text-zinc-500 cursor-not-allowed"
                />
              </div>
              <div>
                <label className="block text-zinc-400 text-xs mb-1 font-semibold">Title</label>
                <input
                  type="text"
                  required
                  placeholder="Enter movie title"
                  value={newMovie.title}
                  onChange={e => setNewMovie({ ...newMovie, title: e.target.value })}
                  className="w-full bg-zinc-900 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-primary"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-zinc-400 text-xs mb-1 font-semibold">Language</label>
                  <select
                    value={newMovie.language}
                    onChange={e => setNewMovie({ ...newMovie, language: e.target.value })}
                    className="w-full bg-zinc-900 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-primary"
                  >
                    <option value="Tamil">Tamil</option>
                    <option value="Hindi">Hindi</option>
                    <option value="English">English</option>
                    <option value="Telugu">Telugu</option>
                  </select>
                </div>
                <div>
                  <label className="block text-zinc-400 text-xs mb-1 font-semibold">Genre</label>
                  <input
                    type="text"
                    required
                    value={newMovie.genre}
                    onChange={e => setNewMovie({ ...newMovie, genre: e.target.value })}
                    className="w-full bg-zinc-900 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-primary"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-zinc-400 text-xs mb-1 font-semibold">Duration (Minutes)</label>
                  <input
                    type="number"
                    min="60"
                    max="300"
                    value={newMovie.duration}
                    onChange={e => setNewMovie({ ...newMovie, duration: Number(e.target.value) })}
                    className="w-full bg-zinc-900 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block text-zinc-400 text-xs mb-1 font-semibold">Format</label>
                  <select
                    value={newMovie.format}
                    onChange={e => setNewMovie({ ...newMovie, format: e.target.value })}
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
                <Button variant="ghost" type="button" onClick={() => setIsAddModalOpen(false)}>
                  Cancel
                </Button>
                <Button variant="primary" type="submit">
                  Execute ADD_MOVIE
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="glass-card rounded-2xl max-w-md w-full p-6 border border-white/20 animate-scale-in">
            <div className="w-12 h-12 rounded-full bg-red-500/20 text-red-400 flex items-center justify-center mb-4">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold font-display text-white mb-2">Confirm Movie Removal</h3>
            <p className="text-sm text-zinc-300 mb-4">
              This calls Oracle procedure <code className="text-primary font-mono font-bold">REMOVE_MOVIE({deleteConfirmId})</code> to soft-delete the record and prevent future showtime scheduling.
            </p>
            <div className="flex justify-end space-x-3">
              <Button variant="ghost" onClick={() => setDeleteConfirmId(null)}>
                Cancel
              </Button>
              <Button variant="danger" onClick={() => handleRemoveMovie(deleteConfirmId)}>
                Execute REMOVE_MOVIE
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
