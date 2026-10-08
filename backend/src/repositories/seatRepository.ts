import { executeQuery, executeProcedure } from '../config/database.js';
import { Seat, ShowSeat, SeatStatus } from '../types/index.js';
import oracledb from 'oracledb';

export class SeatRepository {
  async getAvailableSeats(showId: string): Promise<ShowSeat[]> {
    const sql = `
      SELECT id, show_id as "showId", seat_id as "seatId", status, price, locked_until as "lockedUntil"
      FROM show_seats
      WHERE show_id = :showId AND status = 'AVAILABLE'
    `;
    const result = await executeQuery(sql, { showId });
    return (result.rows || []) as ShowSeat[];
  }

  async lockSeat(showId: string, seatId: string, customerId: string): Promise<void> {
    await executeProcedure('LOCK_SEAT', {
      p_show_id: showId,
      p_seat_id: seatId,
      p_customer_id: customerId
    });
  }

  async unlockExpiredSeats(): Promise<void> {
    await executeProcedure('UNLOCK_EXPIRED_SEATS');
  }
}

export const seatRepository = new SeatRepository();
