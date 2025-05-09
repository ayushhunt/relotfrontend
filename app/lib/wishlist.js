import api from './api';

export async function addToWishlist(productId) {
  try {
    const response = await api.post('/api/wishlist', {
      productId,
    });
    return response.data;
  } catch (error) {
    console.error("Error adding to wishlist:", error);
    throw error;
  }
}
