import { Router } from 'express';
import { refundController } from '../controllers/refundController.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

router.get('/:bookingId', authenticate, refundController.getRefundStatus);

export default router;
