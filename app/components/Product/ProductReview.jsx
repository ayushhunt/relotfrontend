// components/product/ProductReviews.jsx
'use client';

import { useState, useEffect } from 'react';
import { Star, User } from 'lucide-react';
import { getProductReviews } from '../../lib/products/products';

export default function ProductReviews({ productId }) {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [averageRating, setAverageRating] = useState(0);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setLoading(true);
        const response = await getProductReviews(productId);
        if (response.success && response.data) {
          setReviews(response.data);
          
          // Calculate average rating
          if (response.data.length > 0) {
            const total = response.data.reduce((acc, review) => acc + review.rating, 0);
            setAverageRating(total / response.data.length);
          }
        }
      } catch (error) {
        console.error('Failed to fetch reviews', error);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [productId]);

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2].map((i) => (
          <div key={i} className="bg-gray-100 animate-pulse rounded-lg p-4 h-32"></div>
        ))}
      </div>
    );
  }

  if (reviews.length === 0) {
    return (
      <div className="bg-gray-50 rounded-lg p-6 text-center">
        <p className="text-gray-500">No reviews yet. Be the first to review this product!</p>
      </div>
    );
  }

  return (
    <div>
      {/* Review Summary */}
      <div className="bg-gray-50 rounded-lg p-6 mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h3 className="text-xl font-bold">Customer Reviews</h3>
            <div className="flex items-center mt-2">
              <div className="flex">
                {Array(5).fill(0).map((_, i) => (
                  <Star 
                    key={i}
                    size={20}
                    className={i < Math.round(averageRating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}
                  />
                ))}
              </div>
              <span className="ml-2 text-sm text-gray-600">
                Based on {reviews.length} {reviews.length === 1 ? 'review' : 'reviews'}
              </span>
            </div>
          </div>
          <div className="mt-4 md:mt-0">
            <span className="text-3xl font-bold">{averageRating.toFixed(1)}</span>
            <span className="text-gray-600 ml-1">out of 5</span>
          </div>
        </div>
      </div>

      {/* Individual Reviews */}
      <div className="space-y-6">
        {reviews.map((review) => (
          <div key={review.id} className="border-b pb-6 border-gray-200 last:border-0">
            <div className="flex justify-between items-start">
              <div className="flex items-center">
                <div className="bg-blue-100 text-blue-600 p-2 rounded-full">
                  <User size={20} />
                </div>
                <div className="ml-3">
                  <p className="font-medium">{review.user?.name || 'Anonymous'}</p>
                  <div className="flex items-center mt-1">
                    {Array(5).fill(0).map((_, i) => (
                      <Star 
                        key={i}
                        size={16}
                        className={i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}
                      />
                    ))}
                  </div>
                </div>
              </div>
              <div className="text-sm text-gray-500">
                {new Date(review.createdAt).toLocaleDateString()}
              </div>
            </div>
            <div className="mt-3">
              {review.title && (
                <h4 className="font-medium mb-1">{review.title}</h4>
              )}
              <p className="text-gray-600">{review.comment}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}