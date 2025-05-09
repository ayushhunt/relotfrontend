import api from './api';

export async function getProductReviews(productId) {
  try {
    const response = await api.get(`/v1/products/${productId}/reviews`, {
      params: { productId }
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching reviews:", error);
    throw error;
  }
}

export async function createProductReview(productId, reviewData) {
  try {
    const response = await api.post('/v1/reviews', {
      productId,
      ...reviewData,
    });
    return response.data;
  } catch (error) {
    console.error("Error creating review:", error);
    throw error;
  }
}

export const updateProductReview = async (productId, reviewData) => {
  try {
    const response = await api.put(`/v1/reviews/${productId}`, reviewData);
    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    console.error('Error updating review:', error);
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to update review'
    };
  }
};

export const getUserReview = async () => {
  try {
    const response = await api.get("/v1/user/reviews/");
    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    console.error('Error updating review:', error);
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to user review'
    };
  }
};
