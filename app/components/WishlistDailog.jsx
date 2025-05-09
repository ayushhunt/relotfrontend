"use client";
import { useState } from "react";
import api from "../lib/api";
import { Heart } from "lucide-react";
import { useSelector } from "react-redux";
import { connect, useDispatch } from "react-redux";
import { clearWish } from "../redux/reducer/wishSlice";

function WishlistDailog({ clearWholeWish }) {
  const wishList = useSelector((state) => state.wish.wishlist) || [];
  const [products, setProducts] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  const dispatch = useDispatch();

  const deleteFromList = async (itemId) => {
    try {
      const res = await api.delete(`v1/wish/remove/${itemId}`);
      const updatedProducts = wishList.filter(
        (item) => item.productId !== itemId
      );

      setProducts(updatedProducts);

      dispatch(setWish(updatedProducts));
      console.log("Item deleted:", res.data);
    } catch (error) {
      console.log("Cannot delete items");
    }
  };

  const ClearWishList = async () => {
    clearWholeWish(clearWish());
    try {
      const res = await api.delete("/v1/wish/clear");
      debugger;

      dispatch(setWish([]));
      console.log("Items deleted:", res.data);
    } catch (error) {
      console.log("Error in ClearWishList", error);
    }
  };

  return (
    <div className="relative">
      {/* Wishlist Button/Icon */}

      <button onClick={() => setIsOpen(!isOpen)} className="relative">
        <Heart className="h-6 w-6" />
        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-1 rounded-full">
          {Object.keys(wishList).length}
        </span>
      </button>

      {/* Wishlist Dropdown Panel */}
      {isOpen && (
        <div className="absolute top-12 right-0 z-50 w-96 bg-white border border-gray-300 rounded-lg shadow-lg p-4">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-lg font-semibold">Your Wishlist</h2>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-600 text-xl"
            >
              ❌
            </button>
          </div>

          <div className="text-right mb-2">
            <button
              onClick={() => ClearWishList()}
              className="bg-red-500 text-white text-sm px-3 py-1 rounded hover:bg-red-600"
            >
              Clear All
            </button>
          </div>

          <div className="max-h-64 overflow-y-auto space-y-3">
            {Object.values(wishList).length === 0 ? (
              <p className="text-sm text-gray-500">Your wishlist is empty.</p>
            ) : (
              Object.values(wishList).map((item) => (
                <div
                  key={item.productId}
                  className="border p-3 rounded bg-gray-100 flex items-start gap-3"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded"
                  />
                  <div className="flex-1">
                    <h3 className="font-medium text-sm">{item.name}</h3>
                    <p className="text-xs text-gray-600">
                      ${item.price.toFixed(2)}
                    </p>
                  </div>
                  <button
                    onClick={() => deleteFromList(item.productId)}
                    className="text-red-600 hover:text-red-800 text-sm"
                  >
                    ✕
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
const mapDispatchToProps = (dispatch) => {
  return {
    clearWholeWish: () => dispatch(clearWish()),
  };
};

export default connect(null, mapDispatchToProps)(WishlistDailog);
