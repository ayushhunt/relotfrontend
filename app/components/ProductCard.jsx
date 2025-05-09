// components/ProductCard.jsx
"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { connect, useDispatch } from "react-redux";
import { ShoppingCart, Heart } from "lucide-react";
import toast from "react-hot-toast";
import { addItemToCart } from "../redux/actions/cartActions";
import { AddWish } from '../redux/reducer/wishSlice';
//import { useDispatch } from 'react-redux';

function ProductCard({ product, addItem,AddWishh }) {
  const router = useRouter();

  const handleClick = (e) => {
    if (e.target.closest("button")) return;
    router.push(`/products/${product._id}`);
  };

  const handleAddToCart = (e) => {
    e.stopPropagation();
    addItem(product);
    toast.success('Added to cart!');
  };

  const handleAddToWishlist = (e) => {
    
    e.stopPropagation();
    AddWishh(product);
    toast.success("Added to wishlist!");
  };

  return (
    <div
      className="bg-white rounded-lg overflow-hidden shadow-sm border border-gray-200 transition-shadow hover:shadow-md cursor-pointer relative group"
      onClick={handleClick}
    >
      {/* Action Buttons - Absolute positioned */}
      <div className="absolute top-2 right-2 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity"></div>

      {/* Product image */}
      <div className="relative h-48 bg-gray-100">
        <Image
          src={product.images?.[0] || "/placeholder-product.jpg"}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-contain"
        />
      </div>

      <div className="p-4">
        {/* Product Name */}
        <h3 className="text-sm font-medium text-gray-800 line-clamp-2 mb-2">
          {product.name}
        </h3>

        {/* Category */}
        <p className="text-xs text-gray-500 mb-2 capitalize">
          {product.category}
        </p>

        {/* Price and Stock */}
        <div className="flex justify-between items-center">
          <div className="text-lg font-semibold text-gray-800">
            ₹{product.price.toFixed(2)}
          </div>
          <div className="text-sm text-gray-500">Stock: {product.stock}</div>
        </div>

        {/* Add to Cart Button */}
        <button
          onClick={handleAddToWishlist}
          className="p-2 bg-white rounded-full shadow-md hover:bg-gray-50 transition-colors"
          aria-label="Add to wishlist"
        >
          <Heart className="w-5 h-5 text-gray-600" />
        </button>
        <button
          onClick={handleAddToCart}
          className="mt-3 w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
        >
          <ShoppingCart className="w-5 h-5" />
          <span>Add to Cart</span>
        </button>
      </div>
    </div>
  );
}

const mapDispatchToProps = (dispatch) => {
  return {
    addItem: (item) => dispatch(addItemToCart(item)),
    AddWishh: (item) => dispatch(AddWish(item)),
  };
};

export default connect(null, mapDispatchToProps)(ProductCard);
