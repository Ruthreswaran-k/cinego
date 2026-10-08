import { Request, Response, NextFunction } from 'express';
import { movieService } from '../services/movieService.js';

export class MovieController {
  async getAllMovies(req: Request, res: Response, next: NextFunction) {
    try {
      const movies = await movieService.getAllMovies();
      res.status(200).json({ success: true, data: movies });
    } catch (error) {
      next(error);
    }
  }

  async getMovieById(req: Request, res: Response, next: NextFunction) {
    try {
      const movie = await movieService.getMovieById(req.params.id);
      res.status(200).json({ success: true, data: movie });
    } catch (error) {
      next(error);
    }
  }

  async searchMovies(req: Request, res: Response, next: NextFunction) {
    try {
      const { q } = req.query;
      const movies = await movieService.searchMovies(q as string);
      res.status(200).json({ success: true, data: movies });
    } catch (error) {
      next(error);
    }
  }
}

export const movieController = new MovieController();
