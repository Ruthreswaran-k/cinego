import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Star, Clock, Ticket, Bell, Calendar, Flame } from 'lucide-react';
import { motion } from 'framer-motion';
import { ALL_MOVIES, Movie } from '@/data/moviesData';
import toast from 'react-hot-toast';

export interface MovieCardProps {
  id?: string;
  movieId?: string;
  title?: string;
  genre?: string;
  rating?: number;
  duration?: number;
  language?: string;
  industry?: string;
  certificate?: string;
  posterUrl?: string;
  status?: 'RUNNING' | 'UPCOMING';
  bookingEnabled?: boolean;
  releaseDate?: string;
  isTrending?: boolean;
  movie?: any;
}

const formatDuration = (minutes: number) => {
  if (!minutes) return '2h 10m';
  return `${Math.floor(minutes / 60)}h ${minutes % 60}m`;
};

const formatDate = (dateStr?: string) => {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString('en-US', { day: 'numeric', month: 'short' });
};

export const MovieCard: React.FC<MovieCardProps> = (props) => {
  const m = props.movie;
  const targetId = props.movieId || props.id || m?.movieId || m?.id || '';
  const targetTitle = props.title || m?.title || '';

  // Match movie from single source of truth
  const matched: Movie | undefined = ALL_MOVIES.find(
    (item) =>
      item.movieId === targetId ||
      item.id === targetId ||
      item.title.toLowerCase() === targetTitle.toLowerCase()
  );

  const id = matched?.movieId || targetId || 'MOV001';
  const title = matched?.title || targetTitle || 'Movie Title';
  const poster = props.posterUrl || m?.posterUrl || matched?.posterUrl || 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=600&auto=format&fit=crop&q=80';
  const genre = props.genre || (Array.isArray(m?.genre) ? m.genre.join(', ') : m?.genreString || m?.genre) || matched?.genreString || 'Action';
  const rating = Number(props.rating ?? m?.seedRating ?? m?.rating ?? matched?.seedRating ?? 7.8);
  const duration = Number(props.duration ?? m?.durationMin ?? m?.duration ?? matched?.durationMin ?? 140);
  const language = props.language || m?.language || matched?.language || 'Tamil';
  const certificate = props.certificate || m?.certificate || matched?.certificate || 'UA';
  const status = props.status || m?.status || matched?.status || 'RUNNING';
  const bookingEnabled = props.bookingEnabled ?? m?.bookingEnabled ?? matched?.bookingEnabled ?? (status === 'RUNNING');
  const releaseDate = props.releaseDate || m?.releaseDate || matched?.releaseDate || '2026-10-05';
  const isTrending = props.isTrending || m?.tags?.includes('TRENDING') || matched?.tags?.includes('TRENDING');

  const [imgError, setImgError] = useState(false);
  const [notified, setNotified] = useState(false);

  const handleNotifyMe = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setNotified(true);
    toast.success(`You'll be alerted when tickets open for ${title}!`, { icon: '🔔' });
  };

  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ duration: 0.2 }}
      className="group relative flex-shrink-0 w-60 sm:w-64 rounded-2xl overflow-hidden cursor-pointer shadow-xl border border-white/10 hover:border-primary/50 bg-zinc-950 transition-all flex flex-col"
    >
      <Link to={`/movies/${id}`} className="block w-full flex flex-col h-full">
        {/* Poster Container with 2:3 Aspect Ratio */}
        <div className="relative aspect-[2/3] w-full overflow-hidden bg-zinc-900">
          {!imgError ? (
            <img
              src={poster}
              alt={title}
              onError={() => setImgError(true)}
              className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-zinc-900 to-black flex items-center justify-center p-4 text-center">
              <span className="text-xl font-bold font-display text-white/40">{title}</span>
            </div>
          )}

          {/* Vignette Gradients */}
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-black/60 pointer-events-none" />

          {/* Top Info Badges */}
          <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 z-10">
            <span className="bg-black/75 backdrop-blur-md px-2 py-0.5 rounded-md text-[10px] font-black text-white border border-white/15">
              {certificate}
            </span>
            {isTrending && (
              <span className="bg-rose-600/90 text-white px-2 py-0.5 rounded-md text-[9px] font-bold flex items-center shadow">
                <Flame className="w-2.5 h-2.5 mr-0.5 fill-current" /> Trending
              </span>
            )}
          </div>

          <div className="absolute top-2.5 right-2.5 z-10">
            <span className="bg-black/75 backdrop-blur-md text-amber-400 border border-amber-400/25 px-2 py-0.5 rounded-md text-xs font-black flex items-center shadow">
              <Star className="w-3 h-3 fill-current mr-1 text-amber-400" />
              {rating.toFixed(1)}
            </span>
          </div>

          {/* Bottom Overlay on Poster */}
          <div className="absolute bottom-2.5 left-2.5 right-2.5 z-10 flex items-center justify-between text-[11px] text-zinc-300">
            <span className="bg-black/60 backdrop-blur-sm px-2 py-0.5 rounded text-white font-semibold">
              {language}
            </span>
            <span className="bg-black/60 backdrop-blur-sm px-2 py-0.5 rounded text-zinc-300 font-mono">
              <Clock className="w-3 h-3 inline mr-1 text-primary" />
              {formatDuration(duration)}
            </span>
          </div>
        </div>

        {/* Clean, Legible Card Footer Information */}
        <div className="p-3.5 flex flex-col justify-between flex-1 bg-zinc-950 border-t border-white/5 space-y-2">
          <div>
            <h3 className="font-bold text-white text-base leading-snug group-hover:text-primary transition-colors line-clamp-1">
              {title}
            </h3>
            <p className="text-xs text-zinc-400 line-clamp-1 mt-0.5">
              {genre}
            </p>
          </div>

          {/* Action CTA: Book Tickets or Release Preview */}
          <div className="pt-2 border-t border-white/5">
            {bookingEnabled && status === 'RUNNING' ? (
              <div className="w-full py-2 rounded-xl bg-primary hover:bg-red-600 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-md shadow-primary/20">
                <Ticket className="w-3.5 h-3.5" /> Book Tickets
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <span className="text-amber-400 font-bold text-xs flex items-center">
                  <Calendar className="w-3 h-3 mr-1" /> Releasing {formatDate(releaseDate)}
                </span>
                <button
                  type="button"
                  onClick={handleNotifyMe}
                  className={`text-[10px] px-2.5 py-1 rounded-lg font-bold transition-all ${
                    notified
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      : 'bg-white/10 hover:bg-white/20 text-zinc-200'
                  }`}
                >
                  <Bell className="w-2.5 h-2.5 inline mr-1" />
                  {notified ? 'Alert On' : 'Remind'}
                </button>
              </div>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
};
