import { Router } from 'express';
import { showController } from '../controllers/showController.js';

const router = Router();

router.get('/', showController.getShows);

export default router;
