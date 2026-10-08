import { Router } from 'express';
import { couponController } from '../controllers/couponController.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

router.post('/apply', authenticate, couponController.applyCoupon);

export default router;
