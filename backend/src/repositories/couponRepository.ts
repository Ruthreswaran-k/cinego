export class CouponRepository {
  async applyCoupon(code: string, amount: number): Promise<number> {
    throw new Error('Not implemented yet');
  }
  async getAllCoupons(): Promise<any[]> {
    throw new Error('Not implemented yet');
  }
  async getCouponByCode(code: string): Promise<any> {
    throw new Error('Not implemented yet');
  }
}
export const couponRepository = new CouponRepository();
