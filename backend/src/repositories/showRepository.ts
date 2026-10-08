import { Show } from '../types/index.js';

export class ShowRepository {
  async getShows(movieId: string, theatreId: string, date: Date): Promise<Show[]> {
    throw new Error('Not implemented yet');
  }

  async getShowById(id: string): Promise<Show | null> {
    throw new Error('Not implemented yet');
  }

  async createShow(show: Omit<Show, 'id'>): Promise<string> {
    throw new Error('Not implemented yet');
  }
}

export const showRepository = new ShowRepository();
