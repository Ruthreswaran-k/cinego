import { Router } from 'express';
import { managerController } from '../controllers/managerController.js';
import { authenticate } from '../middleware/auth.js';
import { authorize } from '../middleware/authorize.js';
import { UserRole } from '../types/index.js';

const router = Router();

// Apply auth and manager authorization to all manager routes
router.use(authenticate, authorize(UserRole.THEATRE_MANAGER));

router.get('/dashboard', (req, res) => res.send('Manager Dashboard'));
router.get('/bookings', (req, res) => res.send('Manager Bookings'));

export default router;
