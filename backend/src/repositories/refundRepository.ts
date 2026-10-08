export class RefundRepository {
  async getRefundStatus(bookingId: string): Promise<any> {
    throw new Error('Not implemented yet');
  }
}
export const refundRepository = new RefundRepository();
