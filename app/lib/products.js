import api from './api';

export async function getProductById(id) {
  try {
    const response = await api.get(`/v1/products/${id}`, {
      next: { revalidate: 60 }, // Next.js revalidate option if you still want
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching product:", error);
    throw error;
  }
}

export async function getRelatedProducts(productId, category) {
  try {
    const response = await api.get(`/v1/rec/similar/${productId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching related products:", error);
    throw error;
  }
}
