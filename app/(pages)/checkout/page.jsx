'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import api from '../../lib/api';
import AddressDialog from '../../components/Address';


const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};


export default function CheckoutPage() {
  const { user, loading } = useAuth();
  const cartItems = useSelector((state) => state.cart.items);
  const [step, setStep] = useState(1);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('');

  const totalAmount = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  useEffect(() => {
    if (!loading && !user) return;
  }, [loading, user]);

  const handleAddressSelect = (address) => {
    console.log('Selected Address:', address);
    setSelectedAddress(address);
  };

  const handlePayment = async () => {
    if (!selectedAddress || !paymentMethod) {
      toast.error('Please select address and payment method');
      return;
    }

  const isRazorpayLoaded = await loadRazorpayScript();
  if (!isRazorpayLoaded) {
    toast.error('Razorpay SDK failed to load. Are you online?');
    return;
  }


    try {
      const { data } = await api.post('/v1/initiatecheckout', {
        shippingAddress: selectedAddress,
        paymentMethod,
      });

      const { orderId,razorpayOrderId, amount, currency, key } = data.data;

      const options = {
        key,
        amount,
        currency,
        order_id: razorpayOrderId,
        name: 'Your Store',
        description: 'Order Payment',
        handler: async function (response) {
          const verifyRes = await api.post('/v1/verifypayment', {
            orderId,
            razorpay_order_id:razorpayOrderId,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
          });

          if (verifyRes.data.success) {
            toast.success('Payment Successful!');
            setStep(5);
          } else {
            toast.error('Payment Verification Failed');
          }
        },
        prefill: {
          name: user.name,
          email: user.email,
        },
        theme: {
          color: '#6366f1',
        },
      };

      const razor = new window.Razorpay(options);
      razor.open();
    } catch (err) {
      console.error(err);
      toast.error('Payment Failed!');
    }
  };

  const steps = ['Authentication', 'Address', 'Order Summary', 'Payment', 'Success'];

  const getStatusIcon = (currentStep) => {
    if (step > currentStep) return '✅';
    if (step === currentStep) return '✍️';
    return '⭕';
  };

  const StepHeader = () => (
    <div className="flex justify-between items-center bg-white p-4 rounded shadow mb-6">
      {steps.map((label, index) => (
        <div key={index} className="flex flex-col items-center text-sm font-medium">
          <div>{getStatusIcon(index + 1)}</div>
          <div className={step === index + 1 ? 'text-indigo-600' : 'text-gray-500'}>
            {label}
          </div>
        </div>
      ))}
    </div>
  );

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="p-6 bg-white rounded shadow">
            <h2 className="text-xl font-semibold mb-4">Step 1: Authentication</h2>
            {user ? (
              <>
                <p>Welcome, {user.name}</p>
                <button
                  className="mt-4 bg-indigo-600 text-white px-4 py-2 rounded"
                  onClick={() => setStep(2)}
                >
                  Continue to Address
                </button>
              </>
            ) : (
              <p>Redirecting to login...</p>
            )}
          </div>
        );
      case 2:
        return (
          <div className="p-6 bg-white rounded shadow">
            <h2 className="text-xl font-semibold mb-4">Step 2: Select Address</h2>
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
              <p className="text-gray-500 mb-4">No address selected</p>
            )}
            <AddressDialog onAddressSelect={handleAddressSelect} selectedAddress={selectedAddress} />
            {selectedAddress && (
              <button
                className="mt-4 bg-indigo-600 text-white px-4 py-2 rounded"
                onClick={() => setStep(3)}
              >
                Continue to Order Summary
              </button>
            )}
          </div>
        );
      case 3:
        return (
          <div className="p-6 bg-white rounded shadow">
            <h2 className="text-xl font-semibold mb-4">Step 3: Order Summary</h2>
            <ul className="mb-4">
              {cartItems.map((item, index) => (
                <li key={index} className="border-b py-2 flex justify-between">
                  <span>{item.name} x {item.quantity}</span>
                  <span>₹{item.price * item.quantity}</span>
                </li>
              ))}
            </ul>
            <p className="font-semibold">Total: ₹{totalAmount}</p>
            <button
              className="mt-4 bg-indigo-600 text-white px-4 py-2 rounded"
              onClick={() => setStep(4)}
            >
              Continue to Payment
            </button>
          </div>
        );
      case 4:
        return (
          <div className="p-6 bg-white rounded shadow">
            <h2 className="text-xl font-semibold mb-4">Step 4: Payment Method</h2>
            <div className="flex flex-col gap-3 mb-4">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="payment"
                  value="razorpay"
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                Razorpay
              </label>
            </div>
            <button
              disabled={!paymentMethod}
              className="bg-green-600 text-white px-4 py-2 rounded disabled:bg-gray-400"
              onClick={handlePayment}
            >
              Pay ₹{totalAmount}
            </button>
          </div>
        );
      case 5:
        return (
          <div className="p-6 bg-white rounded shadow text-center">
            <h2 className="text-2xl font-bold text-green-600">🎉 Payment Successful!</h2>
            <p className="mt-4">Thank you for shopping with us.</p>
          </div>
        );
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-10 px-4">
      <h1 className="text-3xl font-bold mb-6 text-center">Checkout</h1>
      <StepHeader />
      {renderStep()}
    </div>
  );
}
