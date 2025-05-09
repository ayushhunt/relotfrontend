'use client';
import { useState } from 'react';

const dummyAddresses = [
  {
    id: 1,
    name: "John Doe",
    street: "123 Main Street",
    city: "New York",
    state: "NY",
    zipCode: "10001",
    phone: "123-456-7890",
    type: "Home"
  },
  {
    id: 2,
    name: "John Doe",
    street: "456 Work Avenue",
    city: "New York",
    state: "NY",
    zipCode: "10002",
    phone: "123-456-7890",
    type: "Office"
  }
];

const AddressDialog = ({ onAddressSelect, selectedAddress }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState(selectedAddress?.id || null);

  const handleSelect = () => {
    const address = dummyAddresses.find(addr => addr.id === selected);
    onAddressSelect(address);
    setIsOpen(false);
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
      >
        {selectedAddress ? 'Change Address' : 'Select Address'}
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50">
          {/* Backdrop with blur effect */}
          <div 
            className="absolute inset-0 backdrop-blur-sm bg-black/30"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Dialog Content */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[500px]">
            <div className="bg-white/80 backdrop-blur-md rounded-lg p-6 shadow-xl border border-gray-200">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Select Delivery Address</h2>
                <button 
                  onClick={() => setIsOpen(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-4">
                {dummyAddresses.map((address) => (
                  <label
                    key={address.id}
                    className={`block p-4 border rounded-lg cursor-pointer hover:border-red-600 transition-colors bg-white ${
                      selected === address.id ? 'border-red-600' : 'border-gray-200'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <input
                        type="radio"
                        name="address"
                        value={address.id}
                        checked={selected === address.id}
                        onChange={() => setSelected(address.id)}
                        className="mt-1"
                      />
                      <div className="flex-grow">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-semibold">{address.name}</p>
                            <p className="text-sm text-gray-600">{address.street}</p>
                            <p className="text-sm text-gray-600">
                              {address.city}, {address.state} {address.zipCode}
                            </p>
                            <p className="text-sm text-gray-600">Phone: {address.phone}</p>
                          </div>
                          <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded">
                            {address.type}
                          </span>
                        </div>
                      </div>
                    </div>
                  </label>
                ))}
              </div>

              <div className="mt-6 flex justify-end gap-3">
                <button
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 bg-white"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSelect}
                  disabled={!selected}
                  className={`px-4 py-2 rounded-md text-white ${
                    selected 
                      ? 'bg-red-600 hover:bg-red-700' 
                      : 'bg-gray-300 cursor-not-allowed'
                  }`}
                >
                  Deliver to this Address
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AddressDialog;