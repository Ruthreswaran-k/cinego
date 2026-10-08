import React, { useState } from 'react';
import { MapPin, Navigation, Search, Check, Sparkles } from 'lucide-react';
import { useLocation, SUPPORTED_CITIES, CityLocation } from '@/context/LocationContext';
import { Modal } from '@/components/common/Modal';
import { Button } from '@/components/common/Button';

export const LocationModal: React.FC = () => {
  const {
    selectedLocation,
    setSelectedLocation,
    isLocationModalOpen,
    setIsLocationModalOpen,
    detectLocation,
    isDetecting,
  } = useLocation();

  const [search, setSearch] = useState('');

  const filteredCities = SUPPORTED_CITIES.filter(
    (c) =>
      c.city.toLowerCase().includes(search.toLowerCase()) ||
      c.state.toLowerCase().includes(search.toLowerCase())
  );

  const handleSelect = (city: CityLocation) => {
    setSelectedLocation(city);
    setIsLocationModalOpen(false);
  };

  return (
    <Modal isOpen={isLocationModalOpen} onClose={() => setIsLocationModalOpen(false)}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div>
            <h2 className="text-xl font-bold font-display text-white flex items-center">
              <MapPin className="w-5 h-5 text-primary mr-2" /> Select Your City
            </h2>
            <p className="text-xs text-zinc-400 mt-1">
              Cinema showtimes and distances in km will adapt to your selected area.
            </p>
          </div>
        </div>

        {/* GPS Auto-Detect Button */}
        <div className="p-4 rounded-xl bg-primary/10 border border-primary/30 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white shadow-lg shadow-primary/40">
              <Navigation className={`w-5 h-5 ${isDetecting ? 'animate-spin' : ''}`} />
            </div>
            <div>
              <p className="font-bold text-sm text-white">Auto-Detect My Location</p>
              <p className="text-xs text-zinc-300">Uses GPS coordinates to calculate exact km to cinemas</p>
            </div>
          </div>
          <Button
            size="sm"
            variant="primary"
            disabled={isDetecting}
            onClick={() => detectLocation()}
            className="rounded-xl text-xs px-4"
          >
            {isDetecting ? 'Detecting...' : 'Detect'}
          </Button>
        </div>

        {/* City Search Bar */}
        <div className="relative">
          <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search for your city or district..."
            className="w-full bg-zinc-900 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-primary"
          />
        </div>

        {/* Popular Cities Grid */}
        <div>
          <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-3">
            Popular Cities
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            {filteredCities.map((city) => {
              const isSelected = selectedLocation.id === city.id;
              return (
                <button
                  key={city.id}
                  onClick={() => handleSelect(city)}
                  className={`p-3 rounded-xl border text-left transition-all flex items-center justify-between group ${
                    isSelected
                      ? 'bg-primary/20 border-primary text-white font-bold shadow-md shadow-primary/20'
                      : 'bg-zinc-900/60 border-white/5 text-zinc-300 hover:text-white hover:bg-white/5 hover:border-white/20'
                  }`}
                >
                  <div>
                    <span className="text-sm block">{city.city}</span>
                    <span className="text-[10px] text-zinc-500 block">{city.state}</span>
                  </div>
                  {isSelected && <Check className="w-4 h-4 text-primary" />}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </Modal>
  );
};
