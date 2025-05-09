'use client';

import { useState, useEffect } from 'react';
import { Star, Edit } from 'lucide-react';
import { createProductReview, updateProductReview } from '../../lib/review';
import api from '../../lib/api';
import { toast } from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';

export default function AddReview({ productId }) {
  const { checkAuthStatus, user } = useAuth();

  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState('');
  const [userReview, setUserReview] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserReview = async () => {
      const isLoggedIn = await checkAuthStatus();
      console.log('User logged in:', isLoggedIn);
      if (!isLoggedIn) {
        setLoading(false);
        return;
      }

      try {
        const res = await api.get('/v1/user/reviews/', {
          params: { productId },
        });

        const review = res.data;

        if (review && (review.comment || review.rating)) {
          setUserReview(review);
          setRating(review.rating);
          setComment(review.comment);
        } else {
          setUserReview(null);
        }
      } catch (err) {
        console.error('Error fetching user review:', err);
        setUserReview(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUserReview();
  }, [productId]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (rating === 0) return toast.error('Please select a rating');
    if (!comment.trim()) return toast.error('Please write a review');

    try {
      setIsSubmitting(true);
      const payload = { rating, comment };

      const response = isEditing
        ? await updateProductReview(productId, payload)
        : await createProductReview(productId, payload);

      if (response.success) {
        toast.success(`Review ${isEditing ? 'updated' : 'submitted'} successfully!`);
        setUserReview({ rating, comment });
        setIsEditing(false);
      } else {
        toast.error(response.message || 'Something went wrong');
      }
    } catch (error) {
      toast.error('Error submitting review');
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderForm = () => (
    <form onSubmit={handleSubmit} className="bg-gray-50 rounded-lg p-6">
      <h3 className="text-lg font-semibold mb-4">
        {isEditing || !userReview ? 'Add a Review' : 'Edit Your Review'}
      </h3>

      <div className="mb-4">
        <label className="block text-gray-700 mb-2">Your Rating</label>
        <div className="flex">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              className="text-2xl focus:outline-none"
              onClick={() => setRating(star)}
              onMouseEnter={() => setHover(star)}
              onMouseLeave={() => setHover(0)}
            >
              <Star
                size={24}
                className={`${
                  (hover || rating) >= star
                    ? 'fill-yellow-400 text-yellow-400'
                    : 'text-gray-300'
                }`}
              />
            </button>
          ))}
        </div>
      </div>

      <div className="mb-4">
        <label htmlFor="comment" className="block text-gray-700 mb-2">
          Review
        </label>
        <textarea
          id="comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="w-full px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
          rows="4"
          placeholder="Share your experience with this product"
          required
        />
      </div>

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full md:w-auto px-6 py-2 rounded-md text-white font-medium
            ${isSubmitting ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
        >
          {isSubmitting
            ? isEditing
              ? 'Updating...'
              : 'Submitting...'
            : isEditing
            ? 'Update Review'
            : 'Submit Review'}
        </button>

        {isEditing && (
          <button
            type="button"
            onClick={() => {
              setIsEditing(false);
              setRating(userReview.rating);
              setComment(userReview.comment);
            }}
            className="px-6 py-2 rounded-md text-gray-600 font-medium border border-gray-300 hover:bg-gray-50"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );

  if (loading) return <p>Loading...</p>;

  if (!user) return <p className="text-gray-600">Login to add a review.</p>;

  if (!userReview || isEditing) {
    return renderForm();
  }

  return (
    <div className="bg-gray-50 rounded-lg p-6">
      <p className="font-semibold mb-2">Your Review:</p>
      <div className="bg-gray-100 p-4 rounded-lg mb-4">
        <p>{userReview.comment}</p>
        <p className="text-sm text-gray-500 mt-2">Rating: {userReview.rating}/5</p>
      </div>
      <button
        onClick={() => setIsEditing(true)}
        className="flex items-center text-blue-600 hover:text-blue-700"
      >
        <Edit size={16} className="mr-1" />
        Edit Review
      </button>
    </div>
  );
}
