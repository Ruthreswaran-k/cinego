import { Router } from 'express';
import { locationController } from '../controllers/locationController.js';

const router = Router();

router.get('/', locationController.getAllLocations);
router.get('/nearby', locationController.getNearbyLocations);

export default router;
