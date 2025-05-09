// lib/api/products.js
export async function getProductById(id) {
    try {
      const response = await fetch(`http://localhost:3001/v1/products/${id}`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching product:", error);
      throw error;
    }
}
  
  export async function getRelatedProducts(productId, category) {
    console.log("hello")
    try {
      const token = localStorage.getItem('token'); // Replace 'authToken' with your actual key

    // 2. Check if the token exists
    if (!token) {
      console.error("Authentication token not found in local storage.");
      // Handle the case where the token is missing, e.g., redirect to login
      return null; // Or throw an error
    }
      const response = await fetch(`http://localhost:3001/v1/rec/similar/${productId}`,{
        method: 'GET', 
        headers: {
          'Content-Type': 'application/json',
          'authorization': `Bearer ${token}`, // standard for token auth
        }
      }
      );
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching related products:", error);
      throw error;
    }
  }
  
  // lib/api/reviews.js
  export async function getProductReviews(productId) {
    try {
      const response = await fetch(`/api/reviews?productId=${productId}`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching reviews:", error);
      throw error;
    }
  }
  
  export async function createProductReview(productId, reviewData) {
    try {
      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productId,
          ...reviewData
        }),
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error creating review:", error);
      throw error;
    }
  }
  
  // lib/api/cart.js
  export async function addToCart(productId, quantity = 1) {
    try {
      const response = await fetch('/api/cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productId,
          quantity
        }),
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error adding to cart:", error);
      throw error;
    }
  }
  
  // lib/api/wishlist.js
  export async function addToWishlist(productId) {
    try {
      const response = await fetch('/api/wishlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productId,
        }),
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error adding to wishlist:", error);
      throw error;
    }
  }