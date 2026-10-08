export class TicketRepository {
  async generateTicket(bookingId: string): Promise<string> {
    throw new Error('Not implemented yet');
  }
  async getTicketByBooking(bookingId: string): Promise<any> {
    throw new Error('Not implemented yet');
  }
}
export const ticketRepository = new TicketRepository();
