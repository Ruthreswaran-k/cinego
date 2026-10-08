export class ReviewRepository {
  async addReview(review: any): Promise<void> {
    throw new Error('Not implemented yet');
  }
  async getReviewsByMovie(movieId: string): Promise<any[]> {
    throw new Error('Not implemented yet');
  }
  async getReviewsByCustomer(customerId: string): Promise<any[]> {
    throw new Error('Not implemented yet');
  }
}
export const reviewRepository = new ReviewRepository();
