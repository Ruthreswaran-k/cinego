import { Request, Response, NextFunction } from 'express';
import { paymentService } from '../services/paymentService.js';

export class PaymentController {
  async processPayment(req: Request, res: Response, next: NextFunction) {
    try {
      const { bookingId, amount, method, transactionId } = req.body;
      const paymentId = await paymentService.processPayment(bookingId, amount, method, transactionId);
      res.status(200).json({ success: true, data: { paymentId } });
    } catch (error) {
      next(error);
    }
  }
}

export const paymentController = new PaymentController();
