import { executeQuery, executeProcedure } from '../config/database.js';
import { Food, FoodOrder } from '../types/index.js';
import oracledb from 'oracledb';

export class FoodRepository {
  async getFoodMenu(): Promise<Food[]> {
    const sql = `SELECT id, name, description, price, image_url as "imageUrl" FROM food_items`;
    const result = await executeQuery(sql);
    return (result.rows || []) as Food[];
  }

  async orderFood(bookingId: string, foodId: string, quantity: number, price: number): Promise<string> {
    const result = await executeProcedure('ORDER_FOOD', {
      p_booking_id: bookingId,
      p_food_id: foodId,
      p_quantity: quantity,
      p_price: price,
      p_order_id: { dir: oracledb.BIND_OUT, type: oracledb.STRING }
    });
    return (result.outBinds as any).p_order_id;
  }

  async getFoodOrdersByBooking(bookingId: string): Promise<FoodOrder[]> {
    const sql = `
      SELECT id, booking_id as "bookingId", food_id as "foodId", quantity, price
      FROM food_orders WHERE booking_id = :bookingId
    `;
    const result = await executeQuery(sql, { bookingId });
    return (result.rows || []) as FoodOrder[];
  }
}

export const foodRepository = new FoodRepository();
