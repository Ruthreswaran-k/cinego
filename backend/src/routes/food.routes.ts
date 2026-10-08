import { Router } from 'express';
import { foodController } from '../controllers/foodController.js';
import { authenticate } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { z } from 'zod';

const router = Router();

const orderSchema = z.object({
  body: z.object({
    bookingId: z.string(),
    items: z.array(z.object({
      foodId: z.string(),
      quantity: z.number().positive(),
      price: z.number().positive()
    })).min(1)
  })
});

router.get('/menu', foodController.getMenu);
router.post('/order', authenticate, validate(orderSchema), foodController.orderFood);

export default router;
