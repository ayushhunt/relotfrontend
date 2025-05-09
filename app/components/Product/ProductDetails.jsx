// components/product/ProductDetails.jsx
'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Heart, ShoppingCart, Star } from 'lucide-react';
import { addItemToCart } from '../../redux/actions/cartActions';
import { addToWishlist } from '../../lib/wishlist';
import { toast } from 'react-hot-toast';
import { connect } from 'react-redux';


function ProductDetails({ product,addItem }) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  
  const handleAddToCart = async (e) => {
    e.stopPropagation();
    const cartItem = {
      _id: product._id,
      name: product.name,
      price: product.price,
      image: product.images?.[0],
      quantity: 1
    };
    addItem(cartItem);
    toast.success('Added to cart!');
  };
  
  const handleAddToWishlist = async () => {
    try {
      await addToWishlist(product.id);
      toast.success(`${product.name} added to wishlist!`);
    } catch (error) {
      toast.error('Failed to add to wishlist');
      console.error(error);
    }
  };
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* Product Images */}
      <div className="space-y-4">
        <div className="aspect-square relative rounded-lg overflow-hidden border">
          {product.images && product.images.length > 0 ? (
            <Image 
              src={product.images[selectedImage]}
              alt={product.name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
            />
          ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
              <p className="text-gray-400">No image available</p>
            </div>
          )}
        </div>
        
        {/* Thumbnail Images */}
        {product.images && product.images.length > 1 && (
          <div className="flex space-x-2 overflow-x-auto">
            {product.images.map((image, index) => (
              <div 
                key={index}
                className={`cursor-pointer border-2 rounded w-20 h-20 relative ${
                  selectedImage === index ? 'border-blue-500' : 'border-transparent'
                }`}
                onClick={() => setSelectedImage(index)}
              >
                <Image
                  src={image}
                  alt={`${product.name} thumbnail ${index + 1}`}
                  fill
                  className="object-cover rounded"
                />
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Product Info */}
      <div className="space-y-4">
        <h1 className="text-3xl font-bold">{product.name}</h1>
        
        <div className="flex items-center space-x-2">
          <div className="flex items-center">
            {Array(5).fill(0).map((_, i) => (
              <Star 
                key={i}
                size={18}
                className={i < Math.round(product.ratings || 0) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}
              />
            ))}
          </div>
          <span className="text-sm text-gray-500">({product.ratings || 0} ratings)</span>
        </div>
        
        <div className="text-2xl font-bold text-blue-600">${product.price.toFixed(2)}</div>
        
        <div className="py-4">
          <h3 className="font-semibold text-lg mb-2">Description</h3>
          <p className="text-gray-600">{product.description}</p>
        </div>
        
        <div className="flex items-center space-x-2">
          <span className="font-medium">Category:</span>
          <span className="text-gray-600">{product.category}</span>
        </div>
        
        <div className="flex items-center space-x-2">
          <span className="font-medium">Availability:</span>
          <span className={product.stock > 0 ? "text-green-600" : "text-red-600"}>
            {product.stock > 0 ? `In Stock (${product.stock} available)` : "Out of Stock"}
          </span>
        </div>
        
        {/* Quantity Selector */}
        <div className="flex items-center space-x-4 pt-4">
          <span className="font-medium">Quantity:</span>
          <div className="flex border rounded">
            <button 
              className="px-3 py-1 border-r"
              onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
              disabled={quantity <= 1}
            >
              -
            </button>
            <input
              type="number"
              min="1"
              max={product.stock}
              value={quantity}
              onChange={(e) => setQuantity(Math.min(product.stock, Math.max(1, parseInt(e.target.value) || 1)))}
              className="w-16 text-center focus:outline-none"
            />
            <button 
              className="px-3 py-1 border-l"
              onClick={() => setQuantity(prev => Math.min(product.stock, prev + 1))}
              disabled={quantity >= product.stock}
            >
              +
            </button>
          </div>
        </div>
        
        {/* Action Buttons */}
        <div className="flex flex-wrap gap-4 pt-6">
          <button
            onClick={handleAddToCart}
            disabled={product.stock <= 0}
            className={`flex items-center justify-center px-6 py-3 rounded-md text-white font-medium space-x-2 w-full md:w-auto
              ${product.stock > 0 ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-400 cursor-not-allowed'}`}
          >
            <ShoppingCart size={20} />
            <span>Add to Cart</span>
          </button>
          
          <button
            onClick={handleAddToWishlist}
            className="flex items-center justify-center px-6 py-3 rounded-md bg-white border border-gray-300 font-medium space-x-2 hover:bg-gray-50 w-full md:w-auto"
          >
            <Heart size={20} />
            <span>Add to Wishlist</span>
          </button>
        </div>
      </div>
    </div>
  );
}


const mapDispatchToProps = (dispatch) => {
  return {
    addItem: (item) => dispatch(addItemToCart(item)),
  };
};

export default connect(null, mapDispatchToProps)(ProductDetails);