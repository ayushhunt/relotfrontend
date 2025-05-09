"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";

function wishlist({clearWholeWish}) {
  const token = useSelector((state) => state.auth.token);
  const [products, setProducts] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  const deleteFromList = async (itemId) => {
    console.log("Token:", token);
    debugger
    try {
      const res = await axios.delete(
        `http://localhost:3000/v1/wish/remove/${itemId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setProducts((prevProducts) =>
        prevProducts.filter((item) => item.productId !== itemId)
      );
      console.log("Item deleted:", res.data);
    } catch (error) {
      console.log("Cannot delete items");
    }
  };

  const ClearWishList = async () => {
    clearWholeWish(clearWish());
    try {
      const res = await axios.delete("http://localhost:3000/v1/wish/clear", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setProducts((prevProducts) =>
        prevProducts.filter((item) => item.productId !== itemId)
      );
      console.log("Items deleted:", res.data);
    } catch (error) {
      console.log("Error in ClearWishList", error);
    }
  };

  useEffect(() => {
    const fetchProducts = async () => {
      debugger
      try {
        const res = await axios.get(`http://localhost:3000/v1/wish/`, {
          headers: {
            Authorization: `Bearer ${token}`, // <-- Add your token here
          },
        }); // or full URL
        const items = res.data?.data?.items || [];

        // Convert array to object (by product ID)

        setProducts(items);
        console.log(products);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
    console.log(token);
    fetchProducts();
  }, []);

  return (
    // <div className="min-h-screen bg-gray-100 py-10 px-4">
    //   <h1 className="text-3xl font-bold text-center mb-8">Your Wishlist</h1>

    //   <div className="max-w-4xl mx-auto mb-6 text-right">
    //     <button
    //       className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
    //       onClick={() => ClearWishList()}
    //     >
    //       Clear Wishlist
    //     </button>
    //   </div>

    //   <div className="max-w-4xl mx-auto space-y-6">
    //     {Object.values(products).map((item) => (
    //       <div
    //         key={item.productId}
    //         className="flex bg-white rounded-xl shadow-md overflow-hidden"
    //       >
    //         <div className="w-32 h-32 relative shrink-0">
    //           <img
    //             src={item.image}
    //             alt={item.name}
    //             className="w-full h-full object-cover"
    //           />
    //         </div>

    //         <div className="flex-1 p-4 flex flex-col sm:flex-row sm:items-center justify-between">
    //           <div>
    //             <h2 className="text-xl font-semibold">{item.name}</h2>
    //             <p className="text-gray-500 text-sm mt-1">
    //               ${item.price.toFixed(2)}
    //             </p>
    //           </div>

    //           <div className="flex gap-3 mt-4 sm:mt-0">
    //             <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
    //               Add to Cart
    //             </button>
    //             <button
    //               className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
    //               onClick={() => deleteFromList(item.productId)}
    //             >
    //               Remove
    //             </button>
    //           </div>
    //         </div>
    //       </div>
    //     ))}
    //   </div>
    // </div>
    <>
      {/* Wishlist Trigger */}
      <button
        className="text-blue-600 hover:underline"
        onClick={() => setIsOpen(true)}
      >
        Wishlist
      </button>

      {/* Modal Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
          {/* Modal Box */}
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl p-6 relative max-h-[90vh] overflow-y-auto">
            <button
              className="absolute top-4 right-4 text-gray-600 hover:text-gray-800"
              onClick={() => setIsOpen(false)}
            >
              ✕
            </button>

            <h1 className="text-3xl font-bold text-center mb-8">Your Wishlist</h1>

            <div className="text-right mb-4">
              <button
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                onClick={() => ClearWishList()}
              >
                Clear Wishlist
              </button>
            </div>

            <div className="space-y-6">
              {Object.values(products).map((item) => (
                <div
                  key={item.productId}
                  className="flex bg-gray-100 rounded-xl shadow overflow-hidden"
                >
                  <div className="w-32 h-32 relative shrink-0">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="flex-1 p-4 flex flex-col sm:flex-row sm:items-center justify-between">
                    <div>
                      <h2 className="text-xl font-semibold">{item.name}</h2>
                      <p className="text-gray-500 text-sm mt-1">
                        ${item.price.toFixed(2)}
                      </p>
                    </div>

                    <div className="flex gap-3 mt-4 sm:mt-0">
                      <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                        Add to Cart
                      </button>
                      <button
                        className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                        onClick={() => deleteFromList(item.productId)}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

const mapDispatchToProps = (dispatch) => {
  return {
    clearWholeWish: () => dispatch(clearWholeWish()),
  };
};

export default connect(null, mapDispatchToProps)(wishlist);
