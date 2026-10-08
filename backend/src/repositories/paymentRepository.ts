import { executeQuery, executeProcedure } from '../config/database.js';
import { Payment } from '../types/index.js';
import oracledb from 'oracledb';

export class PaymentRepository {
  async processPayment(bookingId: string, amount: number, paymentMethod: string, transactionId: string): Promise<string> {
    const result = await executeProcedure('PROCESS_PAYMENT', {
      p_booking_id: bookingId,
      p_amount: amount,
      p_payment_method: paymentMethod,
      p_transaction_id: transactionId,
      p_payment_id: { dir: oracledb.BIND_OUT, type: oracledb.STRING }
    });
    return (result.outBinds as any).p_payment_id;
  }

  async getPaymentByBooking(bookingId: string): Promise<Payment | null> {
    const sql = `
      SELECT id, booking_id as "bookingId", amount, payment_method as "paymentMethod", 
             transaction_id as "transactionId", status, payment_time as "paymentTime"
      FROM payments WHERE booking_id = :bookingId
    `;
    const result = await executeQuery(sql, { bookingId });
    if (result.rows && result.rows.length > 0) {
      return result.rows[0] as Payment;
    }
    return null;
  }
}

export const paymentRepository = new PaymentRepository();
