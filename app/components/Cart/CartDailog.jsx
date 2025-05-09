"use client";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import api from "../../lib/api";


export default function CartDialog() {
  const dispatch = useDispatch();
  const [isOpen, setIsOpen] = useState(false);
  const cartItems = useSelector((state) => state.cart.items);
  //const token = useSelector((state) => state.auth.token);
  const router = useRouter();
  //const remTime = useSelector((state) => state.time.remTime);

  const handleSaveCart = async () => {
    console.log("Saving cart items:", cartItems);
    const formattedCart = {
      products: cartItems.map((item) => ({
        productId: item._id || item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity || 1,
        image: item.image || (item.images?.[0] || ''),
      })),
    };
    console.log(formattedCart.products);
    try {
      await api.post("/v1/add", formattedCart);
      toast.success("Cart saved successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong while saving the cart.");
    }
  };

  const handleCheckout = async () => {
    

    try {
      await handleSaveCart();
      setIsOpen(false);
      router.push("/checkout");
    } catch (err) {
      console.error(err);
    }
  };

 
  return (
    <div className="relative">
      {/* Cart Icon Button */}
      <button onClick={() => setIsOpen(!isOpen)} className="relative">
        🛒
        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-1 rounded-full">
          {cartItems.length}
        </span>
      </button>

      {/* Mini Cart Dialog */}
      {isOpen && (
        <div className="absolute top-12 right-0 z-50 w-80 bg-white border border-gray-300 rounded-lg shadow-lg p-4">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-lg font-semibold">Your Cart</h2>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-600 text-xl"
            >
              ❌
            </button>
          </div>

          <div className="max-h-56 overflow-y-auto space-y-3">
            {cartItems.length === 0 ? (
              <p className="text-sm text-gray-500">Your cart is empty.</p>
            ) : (
              cartItems.map((item) => (
                <div key={item._id} className="border p-2 rounded bg-gray-100">
                  <h3 className="font-medium text-sm">{item.name}</h3>
                  <p className="text-xs text-gray-600">{item.description}...</p>
                  <p className="text-sm font-semibold">₹ {item.price}</p>
                </div>
              ))
            )}
          </div>

          <div className="mt-4 flex justify-between gap-2">
            <button
              onClick={handleCheckout}
              className="flex-1 bg-green-600 text-white py-2 rounded hover:bg-green-700 text-sm"
            >
              Checkout
            </button>
            <button
              onClick={handleSaveCart}
              className="flex-1 bg-blue-500 text-white py-2 rounded hover:bg-blue-600 text-sm"
            >
              Save
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
