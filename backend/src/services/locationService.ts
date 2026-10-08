import { locationRepository } from '../repositories/locationRepository.js';
import { Location } from '../types/index.js';

export class LocationService {
  async getAllLocations(): Promise<Location[]> {
    return locationRepository.getAllLocations();
  }

  async getLocationById(id: string): Promise<Location | null> {
    return locationRepository.getLocationById(id);
  }

  async getNearbyLocations(city: string): Promise<Location[]> {
    return locationRepository.getNearbyLocations(city);
  }
}

export const locationService = new LocationService();
