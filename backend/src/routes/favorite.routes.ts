import { Router } from 'express';
import { favoriteController } from '../controllers/favoriteController.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

router.get('/', authenticate, favoriteController.getFavorites);
router.post('/', authenticate, favoriteController.addFavorite);
router.delete('/:id', authenticate, favoriteController.removeFavorite);

export default router;
