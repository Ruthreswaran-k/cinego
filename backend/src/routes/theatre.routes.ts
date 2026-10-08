import { Router } from 'express';
import { theatreController } from '../controllers/theatreController.js';

const router = Router();

router.get('/', theatreController.getTheatres);
router.get('/nearby', theatreController.getNearby);
router.get('/:id', theatreController.getTheatreById);

export default router;
