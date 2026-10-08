import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Navigation, Star, Search, ArrowRight, SlidersHorizontal, Sparkles, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';
import { useLocation } from '@/context/LocationContext';
import { Button } from '@/components/common/Button';

export interface TheatreData {
  id: string;
  name: string;
  city: string;
  locationArea: string;
  address: string;
  latitude: number;
  longitude: number;
  rating: number;
  screens: number;
  amenities: string[];
  formats: string[];
  showsToday: number;
  verificationStatus?: 'VERIFIED' | 'PENDING' | 'REJECTED';
  licenseNumber?: string;
  gstin?: string;
  fireSafetyNoc?: string;
}

export const ALL_THEATRES: TheatreData[] = [
  // Chennai (13.0827, 80.2707)
  {
    id: '201',
    name: 'PVR Grand Mall',
    city: 'Chennai',
    locationArea: 'Velachery',
    address: 'Grand Mall, Velachery Main Road, Chennai',
    latitude: 12.9815,
    longitude: 80.2180,
    rating: 4.5,
    screens: 5,
    amenities: ['Parking', 'Food Court', 'Dolby Atmos', '4K Projection', 'Wheelchair Access'],
    formats: ['2D', '3D', 'Dolby Atmos'],
    showsToday: 12,
  },
  {
    id: '203',
    name: 'AGS Cinemas T.Nagar',
    city: 'Chennai',
    locationArea: 'T.Nagar',
    address: '24, Bazullah Road, T.Nagar, Chennai',
    latitude: 13.0418,
    longitude: 80.2341,
    rating: 4.3,
    screens: 4,
    amenities: ['IMAX', 'Dolby Atmos', 'Food Court', 'Covered Parking'],
    formats: ['IMAX 2D', '2D'],
    showsToday: 10,
  },
  {
    id: '208',
    name: 'Rohini Silver Screens',
    city: 'Chennai',
    locationArea: 'Koyambedu',
    address: '141, Poonamallee High Road, Koyambedu, Chennai',
    latitude: 13.0694,
    longitude: 80.1948,
    rating: 4.4,
    screens: 6,
    amenities: ['Dolby Atmos', 'Huge Parking', 'Fan Celebrations Hub'],
    formats: ['2D', '3D', 'RGB Laser'],
    showsToday: 14,
  },
  {
    id: '209',
    name: 'SPI Sathyam Cinemas',
    city: 'Chennai',
    locationArea: 'Royapettah',
    address: '8, Thiru-Vi-Ka Road, Royapettah, Chennai',
    latitude: 13.0560,
    longitude: 80.2580,
    rating: 4.9,
    screens: 6,
    amenities: ['Famous Butter Popcorn', 'Dolby Atmos', '4K Projection', 'Valet'],
    formats: ['Dolby Atmos', '2D'],
    showsToday: 16,
  },
  {
    id: '210',
    name: 'Luxe Cinemas (Phoenix Marketcity)',
    city: 'Chennai',
    locationArea: 'Velachery',
    address: 'Phoenix Marketcity, Velachery Road, Chennai',
    latitude: 12.9918,
    longitude: 80.2173,
    rating: 4.7,
    screens: 11,
    amenities: ['IMAX Laser', 'Luxury Recliner', 'Gourmet Concessions'],
    formats: ['IMAX 3D', 'IMAX 2D', 'Dolby Atmos'],
    showsToday: 20,
  },

  // Coimbatore (11.0168, 76.9558)
  {
    id: '202',
    name: 'INOX Brookefields',
    city: 'Coimbatore',
    locationArea: 'R.S. Puram',
    address: 'Brookefields Mall, Dr. Krishnasamy Road, Coimbatore',
    latitude: 11.0080,
    longitude: 76.9602,
    rating: 4.3,
    screens: 6,
    amenities: ['Parking', 'Food Court', 'Dolby 7.1', '3D'],
    formats: ['2D', '3D'],
    showsToday: 8,
  },
  {
    id: '211',
    name: 'Broadway Cinemas',
    city: 'Coimbatore',
    locationArea: 'Avinashi Road',
    address: 'Near KMCH, Avinashi Road, Coimbatore',
    latitude: 11.0505,
    longitude: 77.0322,
    rating: 4.8,
    screens: 9,
    amenities: ['EPIQ Screen', 'IMAX Laser', 'Laser Projection', 'Food Court'],
    formats: ['EPIQ', 'IMAX 2D', 'Dolby Atmos'],
    showsToday: 15,
  },

  // Puducherry / Pondicherry (11.9416, 79.8083)
  {
    id: '217',
    name: 'PVR INOX',
    city: 'Puducherry',
    locationArea: 'White Town',
    address: 'Mission Street, White Town, Puducherry',
    latitude: 11.9355,
    longitude: 79.8315,
    rating: 4.7,
    screens: 4,
    amenities: ['Dolby Atmos', '4K Projection', 'Gourmet Food', 'Valet Parking'],
    formats: ['2D', 'Dolby Atmos'],
    showsToday: 14,
  },
  {
    id: '218',
    name: 'CinemaVerse',
    city: 'Puducherry',
    locationArea: 'Lawspet',
    address: 'Airport Road, Lawspet, Puducherry',
    latitude: 11.9540,
    longitude: 79.8170,
    rating: 4.5,
    screens: 3,
    amenities: ['2D/3D Screens', 'Laser Projection', 'Snack Bar', 'Two Wheeler Parking'],
    formats: ['2D', '3D'],
    showsToday: 10,
  },
  {
    id: '204',
    name: 'SPI Palazzo Pondicherry',
    city: 'Puducherry',
    locationArea: 'ECR',
    address: 'East Coast Road, Lawspet, Puducherry',
    latitude: 11.9610,
    longitude: 79.8220,
    rating: 4.8,
    screens: 5,
    amenities: ['Dolby Atmos', 'Premium Recliner', 'Food Court', 'Valet Parking'],
    formats: ['2D', 'Dolby Atmos'],
    showsToday: 12,
  },
  {
    id: '212',
    name: 'Rathna Theatre',
    city: 'Puducherry',
    locationArea: 'Maraimalai Adigal Salai',
    address: 'Maraimalai Adigal Salai, Near Bus Stand, Puducherry',
    latitude: 11.9310,
    longitude: 79.8180,
    rating: 4.2,
    screens: 2,
    amenities: ['Dolby 7.1', 'Parking', 'Snack Bar', 'Budget Friendly'],
    formats: ['2D'],
    showsToday: 8,
  },
  {
    id: '213',
    name: 'Balaji Theatre 4K Dolby',
    city: 'Puducherry',
    locationArea: 'Kamaraj Salai',
    address: 'Kamaraj Salai, Sithankudi, Puducherry',
    latitude: 11.9440,
    longitude: 79.8140,
    rating: 4.4,
    screens: 2,
    amenities: ['4K RGB Laser', 'Dolby Atmos', 'Parking', 'Snack Counter'],
    formats: ['2D', 'Dolby Atmos'],
    showsToday: 9,
  },

  // Karaikal (10.9254, 79.8380)
  {
    id: '214',
    name: 'GV Cinemas',
    city: 'Karaikal',
    locationArea: 'Bharathiyar Road',
    address: 'Bharathiyar Street, Town Centre, Karaikal, Puducherry',
    latitude: 10.9230,
    longitude: 79.8340,
    rating: 4.5,
    screens: 3,
    amenities: ['4K RGB Laser', 'Dolby Atmos', 'Pushback Seats', 'Snack Bar'],
    formats: ['2D', 'Dolby Atmos'],
    showsToday: 12,
  },

  // Nagapattinam (10.7672, 79.8449)
  {
    id: '215',
    name: 'Shanmuga Theatre 4K Dolby',
    city: 'Nagapattinam',
    locationArea: 'Public Office Road',
    address: 'Public Office Road, Near Railway Station, Nagapattinam',
    latitude: 10.7680,
    longitude: 79.8420,
    rating: 4.4,
    screens: 2,
    amenities: ['Dolby Atmos', '4K Projection', 'A/C Comfort', 'Snack Counter'],
    formats: ['2D', 'Dolby Atmos'],
    showsToday: 8,
  },
  {
    id: '216',
    name: 'Baby Talkies Cinema',
    city: 'Nagapattinam',
    locationArea: 'Neela South Street',
    address: 'Neela South Street, Nagapattinam, Tamil Nadu',
    latitude: 10.7620,
    longitude: 79.8460,
    rating: 4.1,
    screens: 1,
    amenities: ['Air Conditioned', 'Budget Friendly', 'Two Wheeler Parking'],
    formats: ['2D', 'Dolby 7.1'],
    showsToday: 6,
  },
];

export const Theatres: React.FC = () => {
  const { selectedLocation, formatDistance, getDistanceKm, setIsLocationModalOpen } = useLocation();
  const [search, setSearch] = useState('');
  const [filterCityOnly, setFilterCityOnly] = useState(true);
  const [sortBy, setSortBy] = useState<'distance' | 'rating' | 'shows'>('distance');

  // Filter theatres
  const filtered = ALL_THEATRES.filter((t) => {
    const cityNorm = selectedLocation.city.toLowerCase();
    const tCityNorm = t.city.toLowerCase();
    const isCityMatch =
      tCityNorm === cityNorm ||
      (cityNorm === 'puducherry' && tCityNorm === 'pondicherry') ||
      (cityNorm === 'pondicherry' && tCityNorm === 'puducherry');

    const matchesCity = filterCityOnly ? isCityMatch : true;
    const matchesSearch =
      t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.locationArea.toLowerCase().includes(search.toLowerCase()) ||
      t.city.toLowerCase().includes(search.toLowerCase()) ||
      t.amenities.some((a) => a.toLowerCase().includes(search.toLowerCase()));
    return matchesCity && matchesSearch;
  });

  // Sort theatres
  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === 'distance') {
      return getDistanceKm(a.latitude, a.longitude) - getDistanceKm(b.latitude, b.longitude);
    }
    if (sortBy === 'rating') {
      return b.rating - a.rating;
    }
    return b.showsToday - a.showsToday;
  });

  return (
    <div className="min-h-screen bg-transparent text-white pt-32 sm:pt-36 md:pt-40 pb-24 px-4 sm:px-6 lg:px-8 font-display">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Classy Header */}
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/10 pb-6">
          <div>
            <div className="flex items-center space-x-2 text-primary text-xs font-bold uppercase tracking-widest mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Cinema Locator & Showtime Explorer</span>
            </div>
            <h1 className="text-3xl md:text-5xl font-extrabold flex items-center gap-3 text-white tracking-tight">
              <MapPin className="w-8 h-8 md:w-10 md:h-10 text-primary flex-shrink-0" />
              Theatres Near You
            </h1>
            <p className="text-zinc-400 text-sm mt-2 max-w-xl">
              Showing top cinemas in <strong className="text-white">{selectedLocation.city}</strong>. Select any theatre to view available screens, formats, and showtimes.
            </p>
          </div>

          <button
            onClick={() => setIsLocationModalOpen(true)}
            className="flex items-center space-x-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl px-5 py-3 text-xs font-bold transition-all self-start md:self-auto cursor-pointer shadow-lg hover:border-primary/40"
          >
            <Navigation className="w-3.5 h-3.5 text-primary" />
            <span>Change City ({selectedLocation.city})</span>
          </button>
        </header>

        {/* Minimalist Classy Filter Bar */}
        <div className="glass-card rounded-2xl p-4 border border-white/10 flex flex-col md:flex-row items-center gap-4 justify-between shadow-lg">
          <div className="relative w-full md:w-96">
            <Search className="w-4 h-4 text-zinc-400 absolute left-4 top-3" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search theatre, area, or amenities..."
              className="w-full bg-zinc-900/90 border border-white/10 rounded-xl pl-11 pr-4 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-primary transition-colors"
            />
          </div>

          <div className="flex items-center space-x-3 w-full md:w-auto justify-between md:justify-end">
            <button
              onClick={() => setFilterCityOnly(!filterCityOnly)}
              className={`text-xs px-3.5 py-2 rounded-xl border transition-all cursor-pointer font-bold ${
                filterCityOnly
                  ? 'bg-primary/20 border-primary text-white'
                  : 'bg-zinc-900 border-white/10 text-zinc-400 hover:text-white'
              }`}
            >
              {filterCityOnly ? `Only ${selectedLocation.city}` : 'All Cities'}
            </button>

            <div className="flex items-center space-x-1 bg-zinc-900/90 p-1 rounded-xl border border-white/10 text-xs">
              <span className="text-zinc-500 px-2 flex items-center">
                <SlidersHorizontal className="w-3 h-3 mr-1" /> Sort:
              </span>
              {(['distance', 'rating', 'shows'] as const).map((s) => (
                <button
                  key={s}
                  onClick={() => setSortBy(s)}
                  className={`px-3 py-1 rounded-lg capitalize transition-all cursor-pointer font-semibold ${
                    sortBy === s ? 'bg-primary text-white shadow-sm' : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  {s === 'distance' ? 'Nearest' : s === 'rating' ? 'Top Rated' : 'Most Shows'}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Classy Theatres List with Framer Motion Staggered Cards */}
        {sorted.length === 0 ? (
          <div className="glass-card rounded-3xl p-12 text-center max-w-md mx-auto border border-white/10 space-y-4">
            <MapPin className="w-12 h-12 text-zinc-600 mx-auto" />
            <h3 className="text-lg font-bold text-white">No cinemas found in {selectedLocation.city}</h3>
            <p className="text-zinc-400 text-xs">
              Try switching to "All Cities" or selecting Puducherry, Chennai, or Coimbatore from the top location selector.
            </p>
            <Button size="sm" onClick={() => setFilterCityOnly(false)}>
              Show All Cities
            </Button>
          </div>
        ) : (
          <div className="grid gap-6">
            {sorted.map((theatre, idx) => {
              const km = formatDistance(theatre.latitude, theatre.longitude);
              return (
                <motion.div
                  key={theatre.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: Math.min(idx * 0.05, 0.4), duration: 0.3 }}
                  className="glass-card p-6 sm:p-7 rounded-2xl border border-white/10 hover:border-primary/50 transition-all flex flex-col md:flex-row gap-6 items-start md:items-center justify-between shadow-xl hover:shadow-2xl hover:shadow-primary/5 group"
                >
                  <div className="space-y-3 flex-1">
                    <div className="flex flex-wrap items-center gap-3">
                      <h2 className="text-2xl font-bold text-white group-hover:text-primary transition-colors tracking-tight">
                        {theatre.name}
                      </h2>
                      <span
                        title={`Cinematograph License Verified: TN-CINE-KYC-AUDITED • GSTIN Verified • Fire Safety Approved`}
                        className="text-[11px] px-2.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 font-bold flex items-center gap-1 shadow-sm"
                      >
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Verified Partner
                      </span>
                      <div className="flex items-center gap-1 text-xs bg-amber-400/10 border border-amber-400/20 px-2.5 py-0.5 rounded-full text-secondary font-bold">
                        <Star className="w-3.5 h-3.5 fill-current" />
                        {theatre.rating}
                      </div>
                      <span className="text-xs px-2.5 py-0.5 rounded-full bg-white/5 border border-white/10 text-zinc-300">
                        {theatre.screens} Screens
                      </span>
                    </div>

                    <p className="text-zinc-400 flex items-center text-xs">
                      <MapPin className="w-4 h-4 mr-1.5 text-primary flex-shrink-0" />
                      {theatre.address}
                    </p>

                    <div className="flex flex-wrap gap-2 pt-1">
                      {theatre.formats.map((f) => (
                        <span
                          key={f}
                          className="text-xs px-2.5 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary font-bold"
                        >
                          {f}
                        </span>
                      ))}
                      {theatre.amenities.map((amenity) => (
                        <span
                          key={amenity}
                          className="text-xs px-2.5 py-1 rounded-full border border-zinc-700/60 bg-white/5 text-zinc-300"
                        >
                          {amenity}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-col items-start md:items-end gap-3 w-full md:w-auto border-t md:border-t-0 pt-4 md:pt-0 border-white/5">
                    <span className="text-xs text-emerald-400 font-bold flex items-center bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                      <Navigation className="w-3.5 h-3.5 mr-1.5" /> ~{km} away
                    </span>
                    <span className="text-xs text-zinc-400">
                      {theatre.showsToday} scheduled screenings today
                    </span>
                    <Link to={`/theatres/${theatre.id}`} className="w-full md:w-auto">
                      <Button
                        variant="primary"
                        size="md"
                        className="w-full md:w-auto rounded-xl px-7 text-xs font-bold flex items-center justify-center shadow-lg shadow-primary/20"
                      >
                        View Shows <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                      </Button>
                    </Link>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
