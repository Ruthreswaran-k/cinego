import { paymentRepository } from '../repositories/paymentRepository.js';
import { Payment } from '../types/index.js';

export class PaymentService {
  async processPayment(bookingId: string, amount: number, method: string, transactionId: string): Promise<string> {
    return paymentRepository.processPayment(bookingId, amount, method, transactionId);
  }

  async getPaymentByBooking(bookingId: string): Promise<Payment | null> {
    return paymentRepository.getPaymentByBooking(bookingId);
  }
}

export const paymentService = new PaymentService();
