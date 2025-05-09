// components/QuantityDial.js
import React from 'react';

const QuantityDial = ({ quantity, onIncrease, onDecrease, maxQuantity = 10 }) => {
  return (
    <div className="flex items-center border rounded">
      <button
        className="w-8 h-8 flex items-center justify-center text-gray-600 disabled:text-gray-300 disabled:cursor-not-allowed"
        onClick={onDecrease}
        disabled={quantity <= 1}
        aria-label="Decrease quantity"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12H4"></path>
        </svg>
      </button>
      <div className="w-10 text-center font-medium">{quantity}</div>
      <button
        className="w-8 h-8 flex items-center justify-center text-gray-600 disabled:text-gray-300 disabled:cursor-not-allowed"
        onClick={onIncrease}
        disabled={quantity >= maxQuantity}
        aria-label="Increase quantity"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path>
        </svg>
      </button>
    </div>
  );
};

export default QuantityDial;