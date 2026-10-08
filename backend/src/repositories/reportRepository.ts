export class ReportRepository {
  async getBookingReport(): Promise<any> {
    throw new Error('Not implemented yet');
  }
  async getRevenueReport(): Promise<any> {
    throw new Error('Not implemented yet');
  }
}
export const reportRepository = new ReportRepository();
