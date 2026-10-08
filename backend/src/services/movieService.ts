import { movieRepository } from '../repositories/movieRepository.js';
import { Movie } from '../types/index.js';

export class MovieService {
  async getAllMovies(): Promise<Movie[]> {
    return movieRepository.getAllMovies();
  }

  async getMovieById(id: string): Promise<Movie | null> {
    return movieRepository.getMovieById(id);
  }

  async getMoviesByLocation(locationId: string): Promise<Movie[]> {
    return movieRepository.getMoviesByLocation(locationId);
  }

  async searchMovies(query: string): Promise<Movie[]> {
    return movieRepository.searchMovies(query);
  }
}

export const movieService = new MovieService();
