// components/CartPage.js
import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import AddressCard from '../Address';
import QuantityDial from './QuantityDial';



const CartPage =() =>  {
  debugger;
  const dispatch = useDispatch();
  const router = useRouter();
  const items = useSelector((state) => state.cart.items);
  const token = useSelector((state) => state.auth.token);
  const { selectedAddress, addresses } = useSelector((state) => state.user);
  const [showAddresses, setShowAddresses] = useState(false);
  
  // Calculate price details
  const subtotal = items.reduce((total, item) => total + (item.price * item.quantity), 0);
  const discount = items.reduce((total, item) => total + (item.discount || 0) * item.quantity, 0);
  const deliveryCharges = subtotal > 500 ? 0 : 80;
  const protectionFee = items.some(item => item.protectionFee) ? 18 : 0;
  const totalAmount = subtotal - discount + deliveryCharges + protectionFee;
  const totalSavings = discount;
  console.log("Token:", token);
  console.log("Items in Cart:", items);
  const handlePlaceOrder = async () => {
    try {
      // Here you would usually make an API call to create an order
      // Since you mentioned you already have backend code:
      // const response = await fetch('/api/create-order', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ items, address: selectedAddress, totalAmount })
      // });
      
      // For now, let's just redirect to checkout
      router.push('/checkout');
    } catch (error) {
      console.error('Error creating order:', error);
    }
  };

  if (items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto p-6 mt-10 text-center">
        <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
        <button 
          className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
          onClick={() => router.push('/')}
        >
          Continue Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Shopping Cart ({items.length} items)</h1>
      
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left column: Address and Cart Items */}
        <div className="lg:w-2/3">
          {/* Address Section */}
          <div className="bg-white rounded-lg shadow mb-6 p-4">
            {showAddresses ? (
              <>
                <h3 className="font-medium text-lg mb-4">Select Delivery Address</h3>
                <div className="grid gap-4">
                  {addresses.map((address) => (
                    <AddressCard 
                      key={address.id} 
                      address={address} 
                      onSelect={() => {
                        // Here you would dispatch an action to update selected address
                        setShowAddresses(false);
                      }} 
                    />
                  ))}
                </div>
                <button 
                  className="mt-4 text-blue-600 font-medium"
                  onClick={() => setShowAddresses(false)}
                >
                  Cancel
                </button>
              </>
            ) : (
              <>
                <div className="flex justify-between items-start">
                  <h3 className="font-medium">Deliver to:</h3>
                  <button 
                    className="text-blue-600 font-medium"
                    onClick={() => setShowAddresses(true)}
                  >
                    Change
                  </button>
                </div>
                {selectedAddress && (
                  <div className="mt-2">
                    <p className="font-medium">{selectedAddress.name}</p>
                    <p className="text-gray-600 text-sm mt-1">
                      {selectedAddress.street}, {selectedAddress.city}, {selectedAddress.state} - {selectedAddress.pincode}
                    </p>
                  </div>
                )}
              </>
            )}
          </div>
          
          {/* Cart Items */}
          <div className="bg-white rounded-lg shadow">
            {items.map((item) => (
              <div key={item.id} className="p-4 border-b last:border-b-0">
                <div className="flex flex-col sm:flex-row">
                  <div className="sm:w-24 h-24 flex-shrink-0 mb-4 sm:mb-0">
                    <Image
                      src={item.image}
                      alt={item.name}
                      width={96}
                      height={96}
                      className="object-contain"
                    />
                  </div>
                  <div className="flex-grow sm:ml-4">
                    <h3 className="font-medium text-lg">{item.name}</h3>
                    <p className="text-gray-600 text-sm mb-2">{item.description}</p>
                    <div className="flex flex-wrap items-center gap-4 mt-2">
                      <div className="flex items-center">
                        <span className="font-bold text-lg">₹{item.price - (item.discount || 0)}</span>
                        {item.discount > 0 && (
                          <>
                            <span className="text-gray-500 line-through text-sm ml-2">₹{item.price}</span>
                            <span className="text-green-600 text-sm ml-2">
                              {Math.round((item.discount / item.price) * 100)}% off
                            </span>
                          </>
                        )}
                      </div>
                      
                      <QuantityDial
                        quantity={item.quantity}
                        onIncrease={() => dispatch(increaseQuantity(item.id))}
                        onDecrease={() => dispatch(decreaseQuantity(item.id))}
                      />
                      
                      <button className="text-blue-600 hover:underline ml-auto">
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Right column: Price Details */}
        <div className="lg:w-1/3">
          <div className="bg-white rounded-lg shadow p-4 sticky top-4">
            <h3 className="text-lg font-medium border-b pb-2 mb-4">PRICE DETAILS</h3>
            
            <div className="space-y-3">
              <div className="flex justify-between">
                <span>Price ({items.length} items)</span>
                <span>₹{subtotal}</span>
              </div>
              
              <div className="flex justify-between text-green-600">
                <span>Discount</span>
                <span>− ₹{discount}</span>
              </div>
              
              <div className="flex justify-between">
                <span>Delivery Charges</span>
                <span>{deliveryCharges === 0 ? (
                  <span className="text-green-600">Free</span>
                ) : (
                  `₹${deliveryCharges}`
                )}</span>
              </div>
              
              {protectionFee > 0 && (
                <div className="flex justify-between">
                  <span>Protection Fee</span>
                  <span>₹{protectionFee}</span>
                </div>
              )}
              
              <div className="border-t pt-3 mt-2 font-bold flex justify-between">
                <span>Total Amount</span>
                <span>₹{totalAmount}</span>
              </div>
              
              <div className="text-green-600 font-medium">
                You will save ₹{totalSavings} on this order
              </div>
            </div>
            
            <button 
              className="w-full bg-orange-500 hover:bg-orange-600 text-white font-medium py-3 rounded mt-6"
              onClick={handlePlaceOrder}
            >
              PLACE ORDER
            </button>
            
            <div className="mt-6 text-sm text-gray-600">
              <div className="flex items-center gap-2 mb-1">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
                <span>Safe and Secure Payments</span>
              </div>
              <div className="flex items-center gap-2 mb-1">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
                <span>Easy returns</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
                <span>100% Authentic products</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};


export default CartPage;