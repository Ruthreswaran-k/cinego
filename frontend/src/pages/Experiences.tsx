import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  Volume2,
  Maximize2,
  Wind,
  Tv,
  Crown,
  ChevronRight,
  Film,
  MapPin,
  CheckCircle2,
  ArrowRight,
  Eye,
  Sliders
} from 'lucide-react';
import { Button } from '@/components/common/Button';
import { useLocation } from '@/context/LocationContext';
import { ALL_MOVIES } from '@/data/moviesData';

interface CinemaExperience {
  id: string;
  name: string;
  badge: string;
  tagline: string;
  description: string;
  gradient: string;
  accentBorder: string;
  specs: string[];
  features: string[];
  supportedMovieIds: string[];
  bannerUrl: string;
}

const EXPERIENCES_LIST: CinemaExperience[] = [
  {
    id: 'IMAX',
    name: 'IMAX with Laser',
    badge: 'Large Format Flagship',
    tagline: 'Experience movies to the absolute fullest with dual 4K laser projection',
    description:
      'Custom-designed auditorium geometry combined with proprietary dual 4K laser engines delivers stunning brightness, deeper contrast, and up to 26% more picture with expanded aspect ratios.',
    gradient: 'from-blue-600/30 via-indigo-950 to-zinc-950',
    accentBorder: 'border-blue-500/50',
    specs: ['Dual 4K Laser Engines', '12-Channel Precision Sound', '1.90:1 Expanded Ratio', 'Curved Floor-to-Ceiling Screen'],
    features: [
      'Next-generation laser light source offering vivid true-to-life colors',
      'Proprietary sub-bass transducers in seats for seismic resonance',
      'Laser-aligned loudspeaker feeds calibrated daily',
    ],
    supportedMovieIds: ['MOV001', 'MOV002', 'MOV003', 'MOV007'],
    bannerUrl: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=1200&auto=format&fit=crop',
  },
  {
    id: 'DOLBY_ATMOS',
    name: 'Dolby Atmos 64-Channel',
    badge: '3D Spatial Audio',
    tagline: 'Sound that flows around you with breathtaking three-dimensional realism',
    description:
      'Moves audio beyond traditional 5.1/7.1 channels into discrete spatial audio objects that can be placed and moved anywhere in 3D auditorium space, including directly overhead.',
    gradient: 'from-amber-600/30 via-orange-950 to-zinc-950',
    accentBorder: 'border-amber-500/50',
    specs: ['64 Discrete Audio Channels', 'Ceiling-Mounted Height Speakers', 'Realtime Sound Objects', 'Sub-Bass Acoustic Calibration'],
    features: [
      'Overhead spatial audio speakers create full hemispheric dome sound',
      'Dialog clarity optimization ensures crisp actor voice delivery',
      'Dynamic range reproduction from subtle whispers to thunderous rumbles',
    ],
    supportedMovieIds: ['MOV001', 'MOV002', 'MOV004', 'MOV005'],
    bannerUrl: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?q=80&w=1200&auto=format&fit=crop',
  },
  {
    id: '4DX',
    name: '4DX Multi-Sensory Motion',
    badge: 'Kinetic Thrill',
    tagline: 'Don’t just watch the action — live it with motion seats and atmospheric effects',
    description:
      'Revolutionary cinema technology equipping auditoriums with synchronized motion chairs that heave, roll, and pitch alongside 21 environmental physical effects like rain, wind, fog, and lightning.',
    gradient: 'from-red-600/30 via-rose-950 to-zinc-950',
    accentBorder: 'border-rose-500/50',
    specs: ['3-DOF Motion Kinetic Chairs', '21 Environmental FX', 'Rain, Wind & Fog Jets', 'Vibration & Back Ticklers'],
    features: [
      'Synchronized kinetic choreography mapped frame-by-frame with on-screen action',
      'Water on/off switch on every seat for customized comfort',
      'Strobe light effects synchronized to lightning and gunfights',
    ],
    supportedMovieIds: ['MOV002', 'MOV003', 'MOV004', 'MOV006'],
    bannerUrl: 'https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?q=80&w=1200&auto=format&fit=crop',
  },
  {
    id: 'SCREENX',
    name: 'ScreenX 270° Panoramic',
    badge: '270° Peripheral Vision',
    tagline: 'World’s first multi-projection system extending the movie onto side walls',
    description:
      'Breaks through traditional single-screen boundaries by utilizing left and right auditorium walls as synchronized secondary displays, enveloping your peripheral vision in 270 degrees.',
    gradient: 'from-emerald-600/30 via-teal-950 to-zinc-950',
    accentBorder: 'border-emerald-500/50',
    specs: ['Tri-Wall Multi-Projection', '270-Degree Viewing Angle', 'Selective Story Immersion', 'Ultra-Wide Panoramic Sightlines'],
    features: [
      'Expands crucial cinematic sequences into full peripheral view',
      'Specially treated fabric side walls preserve color accuracy',
      'Panoramic flight and open landscape vistas feel boundless',
    ],
    supportedMovieIds: ['MOV001', 'MOV003', 'MOV005'],
    bannerUrl: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=1200&auto=format&fit=crop',
  },
  {
    id: 'VIP_LUXE',
    name: 'VIP Luxe Recliner Loungers',
    badge: 'First-Class Luxury',
    tagline: 'Ultimate cinematic pampering with motorized 180° leather recliners & butler call',
    description:
      'Indulge in supreme cinematic elegance. Ultra-wide plush leather loungers with electronic footrest adjustments, individual swivel tables, privacy partitions, and push-button attendant service.',
    gradient: 'from-purple-600/30 via-violet-950 to-zinc-950',
    accentBorder: 'border-purple-500/50',
    specs: ['Electronic 180° Push-Back', 'Plush Italian Leather', 'Swivel Dining Table', 'Seat Attendant Call Bell'],
    features: [
      'Ergonomic lumbar support with heated seating options',
      'Gourmet hot dining served straight to your seat during intermission',
      'Complimentary sanitized blanket and pillow sets',
    ],
    supportedMovieIds: ['MOV001', 'MOV002', 'MOV003', 'MOV007'],
    bannerUrl: 'https://images.unsplash.com/photo-1595769816263-9b910be24d5f?q=80&w=1200&auto=format&fit=crop',
  },
];

export const Experiences: React.FC = () => {
  const { selectedLocation } = useLocation();
  const [activeExpId, setActiveExpId] = useState<string>('IMAX');

  const activeExp = EXPERIENCES_LIST.find((e) => e.id === activeExpId) || EXPERIENCES_LIST[0];

  // Match movies showing in active format
  const matchingMovies = ALL_MOVIES.filter((m) =>
    activeExp.supportedMovieIds.includes(m.movieId)
  );

  return (
    <div className="min-h-screen bg-dark text-white font-display pt-32 sm:pt-36 md:pt-40 pb-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* 1. Hero Showcase Header */}
        <div className="relative rounded-3xl overflow-hidden border border-white/10 bg-gradient-to-r from-zinc-950 via-zinc-900 to-zinc-950 p-6 sm:p-12 shadow-2xl">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[radial-gradient(circle,rgba(229,9,20,0.14)_0%,transparent_70%)] pointer-events-none transform-gpu" />
          <div className="relative z-10 max-w-3xl space-y-4">
            <div className="flex items-center space-x-2 text-primary font-bold text-xs uppercase tracking-wider">
              <Sparkles className="w-4 h-4" />
              <span>Next-Gen Cinematic Formats</span>
            </div>
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight">
              Premium Cinema Experiences
            </h1>
            <p className="text-zinc-300 text-sm sm:text-base leading-relaxed">
              Step beyond standard auditoriums. Explore IMAX with Laser, Dolby Atmos 3D audio, 4DX kinetic motion, and ScreenX panoramic vision available in <strong>{selectedLocation.city}</strong>.
            </p>
          </div>
        </div>

        {/* 2. Format Selector Tabs */}
        <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-none">
          {EXPERIENCES_LIST.map((exp) => {
            const isSelected = activeExpId === exp.id;
            return (
              <button
                key={exp.id}
                onClick={() => setActiveExpId(exp.id)}
                className={`flex items-center gap-2.5 px-5 py-3 rounded-2xl text-xs sm:text-sm font-extrabold transition-all whitespace-nowrap cursor-pointer border ${
                  isSelected
                    ? 'bg-primary text-white border-primary shadow-xl shadow-primary/30 scale-105'
                    : 'bg-zinc-900/90 text-zinc-400 hover:text-white border-white/10 hover:border-white/30'
                }`}
              >
                <span>{exp.name}</span>
              </button>
            );
          })}
        </div>

        {/* 3. Deep-Dive Spotlight Feature Card */}
        <div
          className={`rounded-3xl border ${activeExp.accentBorder} bg-gradient-to-br ${activeExp.gradient} overflow-hidden shadow-2xl transition-all duration-300`}
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 p-6 sm:p-10">
            {/* Left 7 Cols: Specs & Deep Narrative */}
            <div className="lg:col-span-7 space-y-6">
              <div className="space-y-2">
                <span className="text-xs font-black uppercase tracking-widest px-3 py-1 rounded-full bg-black/50 border border-white/20 text-white">
                  {activeExp.badge}
                </span>
                <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight mt-2">
                  {activeExp.name}
                </h2>
                <p className="text-sm sm:text-base text-zinc-300 font-medium">
                  {activeExp.tagline}
                </p>
              </div>

              <p className="text-xs sm:text-sm text-zinc-300/90 leading-relaxed">
                {activeExp.description}
              </p>

              {/* Technical Hardware Specs Chips */}
              <div className="space-y-2.5">
                <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 block">
                  Technical Specifications
                </span>
                <div className="flex flex-wrap gap-2">
                  {activeExp.specs.map((spec) => (
                    <span
                      key={spec}
                      className="text-xs px-3 py-1.5 rounded-xl bg-black/60 border border-white/15 text-zinc-200 font-medium"
                    >
                      {spec}
                    </span>
                  ))}
                </div>
              </div>

              {/* Signature Features Checklist */}
              <div className="space-y-2 pt-2 border-t border-white/10">
                <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 block">
                  Signature Highlights
                </span>
                <ul className="space-y-2 text-xs text-zinc-300">
                  {activeExp.features.map((feat, i) => (
                    <li key={i} className="flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Right 5 Cols: Visual Atmosphere & Movie Linkage */}
            <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
              <div className="relative rounded-2xl overflow-hidden border border-white/15 shadow-xl aspect-video w-full">
                <img
                  src={activeExp.bannerUrl}
                  alt={activeExp.name}
                  className="w-full h-full object-cover filter contrast-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                <span className="absolute bottom-3 left-3 text-xs font-bold text-white bg-black/60 px-2.5 py-1 rounded-lg backdrop-blur">
                  Auditorium Master View
                </span>
              </div>

              {/* Movies in this format */}
              <div className="glass-card p-5 rounded-2xl border border-white/10 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white flex items-center gap-1.5">
                    <Film className="w-3.5 h-3.5 text-primary" />
                    Now Showing in {activeExp.name}
                  </span>
                  <span className="text-[10px] text-zinc-400 font-mono">
                    {matchingMovies.length} Available
                  </span>
                </div>

                <div className="space-y-2">
                  {matchingMovies.slice(0, 3).map((m) => (
                    <Link
                      key={m.movieId}
                      to={`/shows?movie=${m.movieId}`}
                      className="flex items-center justify-between p-2 rounded-xl bg-zinc-900/80 hover:bg-zinc-800 border border-white/5 hover:border-primary/40 transition-all text-xs group"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <img
                          src={m.posterUrl}
                          alt={m.title}
                          className="w-8 h-11 rounded object-cover flex-shrink-0"
                        />
                        <div className="truncate">
                          <p className="font-bold text-white truncate group-hover:text-primary transition-colors">
                            {m.title}
                          </p>
                          <p className="text-[10px] text-zinc-400">
                            {m.language} • {m.durationMin}m
                          </p>
                        </div>
                      </div>
                      <span className="text-primary font-bold text-[11px] group-hover:translate-x-1 transition-transform flex-shrink-0">
                        Shows &rarr;
                      </span>
                    </Link>
                  ))}
                </div>
              </div>

              <Link to="/movies" className="w-full">
                <Button variant="primary" size="lg" className="w-full rounded-2xl font-bold shadow-lg shadow-primary/30">
                  Browse All {activeExp.name} Screenings <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* 4. Comparison Table: Find Your Perfect Format */}
        <div className="glass-card p-6 sm:p-10 rounded-3xl border border-white/10 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-xl sm:text-2xl font-black text-white">Compare Cinema Formats</h3>
              <p className="text-xs text-zinc-400 mt-1">
                Choose the best screen format for your upcoming movie outing
              </p>
            </div>
            <Link to="/theatres" className="text-xs font-bold text-primary hover:text-red-400 flex items-center">
              View All Theatres in {selectedLocation.city} &rarr;
            </Link>
          </div>

          <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-white/10 pb-2">
            <table className="w-full text-left text-xs text-zinc-300 min-w-[640px]">
              <thead className="border-b border-white/10 text-white font-bold uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-3 px-4">Experience</th>
                  <th className="py-3 px-4">Visual Technology</th>
                  <th className="py-3 px-4">Audio Engineering</th>
                  <th className="py-3 px-4">Auditorium Motion</th>
                  <th className="py-3 px-4">Best For</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                <tr className="hover:bg-white/5 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-white flex items-center gap-1.5">
                    <Maximize2 className="w-3.5 h-3.5 text-blue-400" /> IMAX with Laser
                  </td>
                  <td className="py-3.5 px-4">Dual 4K Laser Projection</td>
                  <td className="py-3.5 px-4">12-Channel High Dynamic Audio</td>
                  <td className="py-3.5 px-4">Static Sub-Bass Vibration</td>
                  <td className="py-3.5 px-4 text-emerald-400 font-semibold">Epic Action & Sci-Fi</td>
                </tr>
                <tr className="hover:bg-white/5 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-white flex items-center gap-1.5">
                    <Volume2 className="w-3.5 h-3.5 text-amber-400" /> Dolby Atmos
                  </td>
                  <td className="py-3.5 px-4">Laser / Christie 4K</td>
                  <td className="py-3.5 px-4">64-Channel Spatial 3D Audio</td>
                  <td className="py-3.5 px-4">None (Acoustic Focus)</td>
                  <td className="py-3.5 px-4 text-emerald-400 font-semibold">Musical & Thriller Dramas</td>
                </tr>
                <tr className="hover:bg-white/5 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-white flex items-center gap-1.5">
                    <Wind className="w-3.5 h-3.5 text-rose-400" /> 4DX Multi-Sensory
                  </td>
                  <td className="py-3.5 px-4">High-Frame Digital 3D</td>
                  <td className="py-3.5 px-4">7.1 Surround System</td>
                  <td className="py-3.5 px-4">Kinetic Roll, Pitch, Heave + Rain/Fog</td>
                  <td className="py-3.5 px-4 text-emerald-400 font-semibold">High-Octane Blockbusters</td>
                </tr>
                <tr className="hover:bg-white/5 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-white flex items-center gap-1.5">
                    <Tv className="w-3.5 h-3.5 text-teal-400" /> ScreenX 270°
                  </td>
                  <td className="py-3.5 px-4">3-Wall Tri-Projection</td>
                  <td className="py-3.5 px-4">Dolby 7.1 Surround</td>
                  <td className="py-3.5 px-4">Static Panoramic</td>
                  <td className="py-3.5 px-4 text-emerald-400 font-semibold">Aviation & Open Landscapes</td>
                </tr>
                <tr className="hover:bg-white/5 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-white flex items-center gap-1.5">
                    <Crown className="w-3.5 h-3.5 text-purple-400" /> VIP Luxe Recliner
                  </td>
                  <td className="py-3.5 px-4">Premium 4K RGB Laser</td>
                  <td className="py-3.5 px-4">Dolby Atmos / 7.1</td>
                  <td className="py-3.5 px-4">Motorized 180° Recline</td>
                  <td className="py-3.5 px-4 text-emerald-400 font-semibold">Couples & VIP Comfort</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
