import { Router } from 'express';
import { movieController } from '../controllers/movieController.js';

const router = Router();

router.get('/', movieController.getAllMovies);
router.get('/search', movieController.searchMovies);
router.get('/:id', movieController.getMovieById);

export default router;
