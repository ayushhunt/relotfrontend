import api from './api';

export async function addToCart(productId, quantity = 1) {
  try {
    const response = await api.post('/api/cart', {
      productId,
      quantity,
    });
    return response.data;
  } catch (error) {
    console.error("Error adding to cart:", error);
    throw error;
  }
}
