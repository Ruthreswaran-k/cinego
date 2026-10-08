import { executeQuery, executeProcedure } from '../config/database.js';
import { Booking, BookingStatus } from '../types/index.js';
import oracledb from 'oracledb';

export class BookingRepository {
  async createBooking(customerId: string, showId: string, seatIds: string[], totalAmount: number): Promise<string> {
    // Note: Since seatIds is an array, we'd typically pass it as a JSON string or varray in PL/SQL.
    // For simplicity here, let's assume the procedure takes a comma-separated string of seat IDs.
    const seatIdsStr = seatIds.join(',');
    
    const result = await executeProcedure('CREATE_BOOKING', {
      p_customer_id: customerId,
      p_show_id: showId,
      p_seat_ids: seatIdsStr,
      p_total_amount: totalAmount,
      p_booking_id: { dir: oracledb.BIND_OUT, type: oracledb.STRING }
    });
    return (result.outBinds as any).p_booking_id;
  }

  async getBookingById(id: string): Promise<Booking | null> {
    const sql = `
      SELECT id, customer_id as "customerId", show_id as "showId", 
             booking_time as "bookingTime", total_amount as "totalAmount", status 
      FROM bookings WHERE id = :id
    `;
    const result = await executeQuery(sql, { id });
    if (result.rows && result.rows.length > 0) {
      return result.rows[0] as Booking;
    }
    return null;
  }

  async getBookingHistory(customerId: string): Promise<Booking[]> {
    const sql = `
      SELECT id, customer_id as "customerId", show_id as "showId", 
             booking_time as "bookingTime", total_amount as "totalAmount", status 
      FROM bookings WHERE customer_id = :customerId
      ORDER BY booking_time DESC
    `;
    const result = await executeQuery(sql, { customerId });
    return (result.rows || []) as Booking[];
  }

  async cancelBooking(id: string): Promise<void> {
    await executeProcedure('CANCEL_BOOKING', {
      p_booking_id: id
    });
  }
}

export const bookingRepository = new BookingRepository();
