import React, { createContext, useContext, useState, useEffect } from 'react';

export interface CityLocation {
  id: string;
  city: string;
  state: string;
  latitude: number;
  longitude: number;
  isPopular: boolean;
}

export const SUPPORTED_CITIES: CityLocation[] = [
  { id: '1', city: 'Chennai', state: 'Tamil Nadu', latitude: 13.0827, longitude: 80.2707, isPopular: true },
  { id: '2', city: 'Coimbatore', state: 'Tamil Nadu', latitude: 11.0168, longitude: 76.9558, isPopular: true },
  { id: '3', city: 'Madurai', state: 'Tamil Nadu', latitude: 9.9252, longitude: 78.1198, isPopular: false },
  { id: '4', city: 'Puducherry', state: 'Puducherry', latitude: 11.9416, longitude: 79.8083, isPopular: true },
  { id: '5', city: 'Bengaluru', state: 'Karnataka', latitude: 12.9716, longitude: 77.5946, isPopular: true },
  { id: '6', city: 'Hyderabad', state: 'Telangana', latitude: 17.3850, longitude: 78.4867, isPopular: true },
  { id: '7', city: 'Mumbai', state: 'Maharashtra', latitude: 19.0760, longitude: 72.8777, isPopular: true },
  { id: '8', city: 'Kochi', state: 'Kerala', latitude: 9.9312, longitude: 76.2673, isPopular: false },
  { id: '9', city: 'Delhi NCR', state: 'Delhi', latitude: 28.6139, longitude: 77.2090, isPopular: true },
  { id: '10', city: 'Karaikal', state: 'Puducherry', latitude: 10.9254, longitude: 79.8380, isPopular: true },
  { id: '11', city: 'Nagapattinam', state: 'Tamil Nadu', latitude: 10.7672, longitude: 79.8449, isPopular: true },
];

interface UserCoords {
  latitude: number;
  longitude: number;
}

interface LocationContextType {
  selectedLocation: CityLocation;
  setSelectedLocation: (l: CityLocation) => void;
  userCoords: UserCoords | null;
  detectLocation: () => Promise<void>;
  isDetecting: boolean;
  getDistanceKm: (targetLat: number, targetLng: number) => number;
  formatDistance: (targetLat: number, targetLng: number) => string;
  isLocationModalOpen: boolean;
  setIsLocationModalOpen: (open: boolean) => void;
}

const LocationContext = createContext<LocationContextType>({} as LocationContextType);

// Haversine formula to compute distance between two GPS coordinates in kilometers
function calculateHaversineKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}

export const LocationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [selectedLocation, setSelectedLocationState] = useState<CityLocation>(() => {
    const saved = localStorage.getItem('cinego_location');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {}
    }
    return SUPPORTED_CITIES[0]; // Default: Chennai
  });

  const [userCoords, setUserCoords] = useState<UserCoords | null>(() => {
    const saved = localStorage.getItem('cinego_user_coords');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {}
    }
    // Default fallback coords match selected city
    return { latitude: SUPPORTED_CITIES[0].latitude, longitude: SUPPORTED_CITIES[0].longitude };
  });

  const [isDetecting, setIsDetecting] = useState(false);
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);

  const setSelectedLocation = (loc: CityLocation) => {
    setSelectedLocationState(loc);
    localStorage.setItem('cinego_location', JSON.stringify(loc));
    // Set fallback coords near city center with small offset
    const coords = { latitude: loc.latitude, longitude: loc.longitude };
    setUserCoords(coords);
    localStorage.setItem('cinego_user_coords', JSON.stringify(coords));
  };

  const detectLocation = async () => {
    if (!navigator.geolocation) {
      return;
    }
    setIsDetecting(true);
    return new Promise<void>((resolve) => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const coords = { latitude, longitude };
          setUserCoords(coords);
          localStorage.setItem('cinego_user_coords', JSON.stringify(coords));

          // Find the closest city among supported cities
          let closest = SUPPORTED_CITIES[0];
          let minDistance = Infinity;

          for (const city of SUPPORTED_CITIES) {
            const dist = calculateHaversineKm(latitude, longitude, city.latitude, city.longitude);
            if (dist < minDistance) {
              minDistance = dist;
              closest = city;
            }
          }

          setSelectedLocationState(closest);
          localStorage.setItem('cinego_location', JSON.stringify(closest));
          setIsDetecting(false);
          setIsLocationModalOpen(false);
          resolve();
        },
        () => {
          // If permission is denied, keep current city
          setIsDetecting(false);
          resolve();
        },
        { timeout: 10000, enableHighAccuracy: true }
      );
    });
  };

  const getDistanceKm = (targetLat: number, targetLng: number): number => {
    const originLat = userCoords?.latitude ?? selectedLocation.latitude;
    const originLng = userCoords?.longitude ?? selectedLocation.longitude;
    return calculateHaversineKm(originLat, originLng, targetLat, targetLng);
  };

  const formatDistance = (targetLat: number, targetLng: number): string => {
    const km = getDistanceKm(targetLat, targetLng);
    return `${km.toFixed(1)} km`;
  };

  return (
    <LocationContext.Provider
      value={{
        selectedLocation,
        setSelectedLocation,
        userCoords,
        detectLocation,
        isDetecting,
        getDistanceKm,
        formatDistance,
        isLocationModalOpen,
        setIsLocationModalOpen,
      }}
    >
      {children}
    </LocationContext.Provider>
  );
};

export const useLocation = () => useContext(LocationContext);
