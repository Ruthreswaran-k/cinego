import { Theatre } from '../types/index.js';

export class TheatreRepository {
  async getTheatresByMovieAndLocation(movieId: string, locationId: string): Promise<Theatre[]> {
    throw new Error('Not implemented yet');
  }

  async getTheatreById(id: string): Promise<Theatre | null> {
    throw new Error('Not implemented yet');
  }

  async getNearbyTheatres(city: string): Promise<Theatre[]> {
    throw new Error('Not implemented yet');
  }

  async getTheatresByManager(managerId: string): Promise<Theatre[]> {
    throw new Error('Not implemented yet');
  }
}

export const theatreRepository = new TheatreRepository();
