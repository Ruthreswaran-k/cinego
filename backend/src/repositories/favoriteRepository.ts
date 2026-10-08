export class FavoriteRepository {
  async addFavorite(customerId: string, movieId: string): Promise<void> {
    throw new Error('Not implemented yet');
  }
  async removeFavorite(id: string): Promise<void> {
    throw new Error('Not implemented yet');
  }
  async getFavorites(customerId: string): Promise<any[]> {
    throw new Error('Not implemented yet');
  }
}
export const favoriteRepository = new FavoriteRepository();
