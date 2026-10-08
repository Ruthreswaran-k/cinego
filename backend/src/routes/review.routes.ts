import { Router } from 'express';
import { reviewController } from '../controllers/reviewController.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

router.get('/movie/:movieId', reviewController.getReviews);
router.post('/', authenticate, reviewController.addReview);

export default router;
