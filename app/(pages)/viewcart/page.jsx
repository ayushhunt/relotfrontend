'use client';
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import AddressCard from '../../components/Address';
import QuantityDial from '../../components/Cart/QuantityDial';
import { updateCartItemQuantity } from "../../redux/actions/cartActions";
import AddressDialog from "../../components/Address";
import { useState } from "react";

export default function ViewCart() {
  const router = useRouter();
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.items);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const handleAddressSelect = (address) => {
    setSelectedAddress(address);
  };
  console.log("Cart items:", cartItems);


  const handleQuantityChange = (itemId, quantity) => {
    dispatch(updateCartItemQuantity(itemId, quantity));
  };

  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const deliveryCharges = 5.99;
  const processingFee = 2.99;
  const total = calculateSubtotal() + deliveryCharges + processingFee;

  const handlePlaceOrder = async () => {
    router.push('/checkout');
  };

  if (cartItems.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <h1 className="text-2xl font-bold mb-4">Your Cart</h1>
        <p className="text-lg">Your cart is currently empty.</p>
        <button 
          onClick={() => router.push('/products')}
          className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Continue Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Shopping Cart</h1>
      <div className="mb-8">
  <div className="flex justify-between items-center mb-4">
    <h2 className="text-xl font-semibold">Delivery Address</h2>
  </div>
  
  {selectedAddress ? (
    <div className="border rounded-lg p-4 mb-4">
      <div className="flex justify-between">
        <div>
          <p className="font-semibold">{selectedAddress.name}</p>
          <p className="text-sm text-gray-600">{selectedAddress.street}</p>
          <p className="text-sm text-gray-600">
            {selectedAddress.city}, {selectedAddress.state} {selectedAddress.zipCode}
          </p>
          <p className="text-sm text-gray-600">Phone: {selectedAddress.phone}</p>
        </div>
        <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded">
          {selectedAddress.type}
        </span>
      </div>
    </div>
  ) : (
    <div className="text-gray-500 mb-4">No address selected</div>
  )}
  
  <AddressDialog 
    onAddressSelect={handleAddressSelect}
    selectedAddress={selectedAddress}
  />
</div>
      {/* Cart Items and Summary */}
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Cart Items */}
        <div className="flex-grow">
          <div className="space-y-4">
            {cartItems.map((item) => (
              <div key={item._id} className="flex gap-4 p-4 border rounded-lg">
                <div className="relative w-24 h-24">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover rounded"
                  />
                </div>
                <div className="flex-grow">
                  <h3 className="font-semibold">{item.name}</h3>
                  <p className="text-gray-600">Product ID: {item._id}</p>
                  <div className="mt-2 flex items-center justify-between">
                    <div className="font-semibold">₹{item.price}</div>
                    <QuantityDial
                      quantity={item.quantity}
                      onIncrease={() => handleQuantityChange(item._id, item.quantity + 1)}
                      onDecrease={() => handleQuantityChange(item._id, item.quantity - 1)}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:w-80">
          <div className="border rounded-lg p-4 sticky top-4">
            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
            <div className="space-y-2 mb-4">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>₹{calculateSubtotal().toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery Charges</span>
                <span>₹{deliveryCharges}</span>
              </div>
              <div className="flex justify-between">
                <span>Processing Fee</span>
                <span>₹{processingFee}</span>
              </div>
              <div className="border-t pt-2 font-semibold">
                <div className="flex justify-between">
                  <span>Total</span>
                  <span>₹{total.toFixed(2)}</span>
                </div>
              </div>
            </div>
            <button
              onClick={handlePlaceOrder}
              className="w-full bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 transition-colors"
            >
              Place Order
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}