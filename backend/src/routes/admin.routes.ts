import { Router } from 'express';
import { adminController } from '../controllers/adminController.js';
import { authenticate } from '../middleware/auth.js';
import { authorize } from '../middleware/authorize.js';
import { UserRole } from '../types/index.js';

const router = Router();

// Apply auth and admin authorization to all admin routes
router.use(authenticate, authorize(UserRole.ADMIN));

// Stub routes
router.get('/dashboard', (req, res) => res.send('Admin Dashboard'));
// other admin endpoints...

export default router;
