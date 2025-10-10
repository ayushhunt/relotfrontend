"use client";
import { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  ShoppingCart,
  X,
  Plus,
  Minus,
  Trash2,
  Eye,
  Loader,
} from "lucide-react";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  setCartItems,
  setCartTotal,
  updateCartItemQuantity,
  removeItemFromCart,
  clearCart,
} from "../../redux/actions/cartActions";
import {
  getCart,
  updateCartItem,
  removeCartItem,
  clearCart as clearAPICart,
} from "../../lib/cart";

export default function CartDialog() {
  const dispatch = useDispatch();
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [syncingWithAPI, setSyncingWithAPI] = useState(false);

  // ✅ Fixed: Redux state with fallback defaults
  const cartItems = useSelector((state) => state.cart?.items || []);
  const totalAmount = useSelector((state) => state.cart?.totalPrice || 0);

  const router = useRouter();
  const dialogRef = useRef(null);

  // ✅ Enhanced: Fetch cart data with fallback support
  useEffect(() => {
    const fetchCartData = async () => {
      try {
        setSyncingWithAPI(true);
        const response = await getCart();

        if (response.success && response.data) {
          // Success: Update Redux store with API data
          dispatch(setCartItems(response.data.items || []));
          dispatch(setCartTotal(response.data.totalPrice || 0));
        }
      } catch (error) {
        console.error("Failed to fetch cart:", error);

        if (error.response?.status === 401) {
          // User not logged in - keep using Redux state
          console.log("User not authenticated, using local cart state");
        } else {
          // Other API errors - keep using Redux state
          console.log("API error, using local cart state");
        }
      } finally {
        setSyncingWithAPI(false);
      }
    };

    fetchCartData();
  }, [dispatch]);

  // Close dialog when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dialogRef.current && !dialogRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  // ✅ FIXED: Function to get a unique identifier for an item (product + variant)
  const getItemIdentifier = (item) => {
    const productId =
      item.product?._id || item.productId || item.product || item.id;
    return { productId, variantId: item.variantId };
  };

  // ✅ FIXED: Safe function to get product ID from item
  const getProductId = (item) => {
    return (
      item.product?._id ||
      item.productId ||
      item.product ||
      item.id ||
      "unknown"
    );
  };

  // ✅ Enhanced: Update quantity with fallback support - FIXED
  const handleQuantityChange = async (item, change) => {
    const newQuantity = (item.quantity || 1) + change;
    if (newQuantity < 1) return;

    const itemIdentifier = getItemIdentifier(item);

    // Validate productId exists
    if (!itemIdentifier.productId || itemIdentifier.productId === "unknown") {
      toast.error("Unable to update item - invalid product data");
      return;
    }

    // Check stock limit if available
    if (item.maxQuantity && newQuantity > item.maxQuantity) {
      toast.error(`Maximum quantity available: ${item.maxQuantity}`);
      return;
    }

    try {
      setLoading(true);

      // Try to update via API first
      const response = await updateCartItem(
        itemIdentifier.productId,
        newQuantity,
        itemIdentifier.variantId
      );

      if (response.success) {
        // Success: Update Redux store with API response
        dispatch(setCartItems(response.data.items || []));
        dispatch(setCartTotal(response.data.totalPrice || 0));
        toast.success("Quantity updated");
        return;
      }
    } catch (error) {
      console.error("Cart update error:", error);

      if (error.response?.status === 401) {
        // User not logged in - update Redux state only
        dispatch(
          updateCartItemQuantity({
            itemId:
              item.id ||
              `${itemIdentifier.productId}${
                itemIdentifier.variantId ? `-${itemIdentifier.variantId}` : ""
              }`,
            productId: itemIdentifier.productId,
            variantId: itemIdentifier.variantId,
            quantity: newQuantity,
          })
        );
        toast.success("Quantity updated (Sign in to sync across devices)");
        return;
      } else if (error.response?.status === 400) {
        // Handle specific API errors (stock issues, etc.)
        toast.error(
          error.response.data?.message || "Failed to update quantity"
        );
        return;
      } else {
        // Other API errors - use Redux fallback
        dispatch(
          updateCartItemQuantity({
            itemId:
              item.id ||
              `${itemIdentifier.productId}${
                itemIdentifier.variantId ? `-${itemIdentifier.variantId}` : ""
              }`,
            productId: itemIdentifier.productId,
            variantId: itemIdentifier.variantId,
            quantity: newQuantity,
          })
        );
        toast.success("Quantity updated (Saved locally)");
        return;
      }
    } finally {
      setLoading(false);
    }
  };

  // ✅ Enhanced: Remove item with fallback support - FIXED
  const handleRemoveItem = async (item) => {
    const itemIdentifier = getItemIdentifier(item);

    // Validate productId exists
    if (!itemIdentifier.productId || itemIdentifier.productId === "unknown") {
      toast.error("Unable to remove item - invalid product data");
      return;
    }

    try {
      setLoading(true);

      // Try to remove via API first
      const response = await removeCartItem(
        itemIdentifier.productId,
        itemIdentifier.variantId
      );

      if (response.success) {
        // Success: Update Redux store with API response
        dispatch(setCartItems(response.data.items || []));
        dispatch(setCartTotal(response.data.totalPrice || 0));
        toast.success("Item removed from cart");
        return;
      }
    } catch (error) {
      console.error("Cart remove error:", error);

      if (error.response?.status === 401) {
        // User not logged in - remove from Redux only
        dispatch(
          removeItemFromCart({
            itemId:
              item.id ||
              `${itemIdentifier.productId}${
                itemIdentifier.variantId ? `-${itemIdentifier.variantId}` : ""
              }`,
            productId: itemIdentifier.productId,
            variantId: itemIdentifier.variantId,
          })
        );
        toast.success("Item removed (Sign in to sync across devices)");
        return;
      } else if (error.response?.status === 404) {
        // Item not found in API - remove from Redux anyway
        dispatch(
          removeItemFromCart({
            itemId:
              item.id ||
              `${itemIdentifier.productId}${
                itemIdentifier.variantId ? `-${itemIdentifier.variantId}` : ""
              }`,
            productId: itemIdentifier.productId,
            variantId: itemIdentifier.variantId,
          })
        );
        toast.success("Item removed from cart");
        return;
      } else {
        // Other API errors - use Redux fallback
        dispatch(
          removeItemFromCart({
            itemId:
              item.id ||
              `${itemIdentifier.productId}${
                itemIdentifier.variantId ? `-${itemIdentifier.variantId}` : ""
              }`,
            productId: itemIdentifier.productId,
            variantId: itemIdentifier.variantId,
          })
        );
        toast.success("Item removed (Saved locally)");
        return;
      }
    } finally {
      setLoading(false);
    }
  };

  // ✅ Enhanced: Clear cart with fallback support
  const handleClearCart = async () => {
    try {
      setLoading(true);

      // Try to clear API cart first
      const response = await clearAPICart();

      if (response.success) {
        // Success: Clear Redux state
        dispatch(clearCart());
        toast.success("Cart cleared");
        return;
      }
    } catch (error) {
      console.error("Clear cart error:", error);

      if (error.response?.status === 401) {
        // User not logged in - clear Redux only
        dispatch(clearCart());
        toast.success("Cart cleared (Sign in to sync across devices)");
        return;
      } else {
        // Other API errors - still clear Redux (local fallback)
        dispatch(clearCart());
        toast.success("Cart cleared (Saved locally)");
        return;
      }
    } finally {
      setLoading(false);
    }
  };

  // Navigation handlers
  const handleCheckout = () => {
    if (cartItems.length === 0) {
      toast.error("Your cart is empty");
      return;
    }
    setIsOpen(false);
    router.push("/checkout");
  };

  const handleViewCart = () => {
    setIsOpen(false);
    router.push("/viewcart");
  };

  const handleProductClick = (item) => {
    setIsOpen(false);
    const productId = getProductId(item);
    if (productId && productId !== "unknown") {
      router.push(`/products/${productId}`);
    } else {
      toast.error("Unable to navigate - invalid product data");
    }
  };

  const handleContinueShopping = () => {
    setIsOpen(false);
    router.push("/products");
  };

  // ✅ FIXED: Helper function to calculate final price with discount
  const getFinalPrice = (item) => {
    if (item.finalPrice) return item.finalPrice;

    const basePrice = item.price || 0;
    const discount = item.discount || 0;

    if (discount > 0) {
      return basePrice * (1 - discount / 100);
    }

    return basePrice;
  };

  // ✅ FIXED: Update totals calculation to use final prices with safe fallbacks
  const totalSavings = (cartItems || []).reduce((sum, item) => {
    const originalPrice = item.price || 0;
    const finalPrice = getFinalPrice(item);
    const discount = originalPrice - finalPrice;
    return sum + discount * (item.quantity || 1);
  }, 0);

  const totalItems = (cartItems || []).reduce(
    (sum, item) => sum + (item.quantity || 1),
    0
  );

  // ✅ FIXED: Filter out invalid items before rendering with safe fallbacks
  const validCartItems = (cartItems || []).filter((item) => {
    const productId = getProductId(item);
    return productId && productId !== "unknown" && item.name;
  });

  return (
    <>
      {/* Cart Icon Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative flex items-center p-2 hover:bg-gray-50 rounded-full transition-colors"
      >
        <div className="relative">
          <ShoppingCart className="h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8 text-black" />
          {validCartItems.length > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
              {validCartItems.length}
            </span>
          )}
        </div>
        {/* ✅ Fixed: Display total price with safe fallback */}
        {validCartItems.length > 0 && (
          <span className="ml-2 text-black font-semibold text-sm md:text-base hidden sm:inline">
            ₹{(totalAmount || 0).toFixed(2)}
          </span>
        )}
      </button>

      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar Cart */}
      <div
        ref={dialogRef}
        className={`fixed top-0 right-0 h-full bg-white shadow-xl z-[60] transform transition-transform duration-300 ease-in-out
          w-full sm:w-[400px] md:w-[450px] lg:w-[500px]
          ${isOpen ? "translate-x-0" : "translate-x-full"}`}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white z-10 border-b border-gray-100">
          <div className="flex items-center justify-between p-4 md:p-6">
            <div className="flex items-center gap-3">
              <h2 className="text-lg md:text-xl font-semibold text-gray-900">
                Shopping Cart
              </h2>
              {syncingWithAPI && (
                <Loader className="h-4 w-4 animate-spin text-red-600" />
              )}
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 hover:bg-gray-50 rounded-full text-gray-500 hover:text-gray-700 transition-colors"
            >
              <X className="h-5 w-5 md:h-6 md:w-6" />
            </button>
          </div>

          {/* Item count and clear button */}
          {validCartItems.length > 0 && (
            <div className="px-4 md:px-6 pb-4 flex items-center justify-between">
              <span className="text-sm text-gray-600">
                {totalItems} {totalItems === 1 ? "item" : "items"} in cart
              </span>
              <button
                onClick={handleClearCart}
                disabled={loading}
                className="text-sm text-red-600 hover:text-red-700 font-medium disabled:opacity-50 hover:underline"
              >
                Clear Cart
              </button>
            </div>
          )}
        </div>

        {/* Cart Items */}
        <div className="h-[calc(100vh-200px)] overflow-y-auto">
          {loading && !syncingWithAPI ? (
            <div className="h-full flex items-center justify-center">
              <Loader className="h-6 w-6 animate-spin text-red-600" />
            </div>
          ) : validCartItems.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center p-4 text-center">
              <ShoppingCart className="h-16 w-16 mb-4 text-gray-300" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Your cart is empty
              </h3>
              <p className="text-sm text-gray-500 mb-4">
                Add some items to get started
              </p>
              <button
                onClick={handleContinueShopping}
                className="px-6 py-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors text-sm font-medium"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            <div className="p-4 md:p-6 space-y-4">
              {/* ✅ FIXED: Use validCartItems and safe key generation */}
              {validCartItems.map((item, index) => {
                const productId = getProductId(item);
                const finalPrice = getFinalPrice(item);
                const hasDiscount =
                  item.discount > 0 && finalPrice < (item.price || 0);

                return (
                  <div
                    key={`${productId}-${
                      item.variantId || "no-variant"
                    }-${index}`}
                    className="flex gap-4 p-4 bg-white rounded-lg border border-gray-100 hover:border-gray-200 hover:shadow-sm transition-all"
                  >
                    {/* Product Image */}
                    <div
                      className="relative w-20 h-20 md:w-24 md:h-24 flex-shrink-0 cursor-pointer group"
                      onClick={() => handleProductClick(item)}
                    >
                      <Image
                        src={
                          item.image || item.images?.[0] || "/placeholder.png"
                        }
                        alt={item.name || "Product"}
                        fill
                        className="object-cover rounded-md group-hover:opacity-75 transition-opacity"
                        sizes="(max-width: 768px) 80px, 96px"
                        unoptimized
                      />
                      {/* Stock indicator */}
                      {item.inStock === false && (
                        <div className="absolute inset-0 bg-red-500/20 rounded-md flex items-center justify-center">
                          <span className="text-xs font-medium text-red-600 bg-white px-2 py-1 rounded">
                            Out of Stock
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      {/* Product Name */}
                      <h3
                        className="font-medium text-sm md:text-base text-gray-900 truncate cursor-pointer hover:text-red-600 transition-colors leading-tight"
                        onClick={() => handleProductClick(item)}
                        title={item.name || "Product"}
                      >
                        {item.name || "Unnamed Product"}
                      </h3>

                      {/* Brand */}
                      {item.brand && (
                        <p className="text-xs text-gray-500 mt-1">
                          {item.brand}
                        </p>
                      )}

                      {/* Variant Details */}
                      {(item.color || item.size || item.sku) && (
                        <div className="mt-1 flex flex-wrap gap-2 text-xs text-gray-500">
                          {item.color && (
                            <span className="bg-gray-100 px-2 py-1 rounded">
                              {item.color}
                            </span>
                          )}
                          {item.size && (
                            <span className="bg-gray-100 px-2 py-1 rounded">
                              Size: {item.size}
                            </span>
                          )}
                          {item.sku && (
                            <span className="bg-gray-100 px-2 py-1 rounded text-xs font-mono">
                              {item.sku}
                            </span>
                          )}
                        </div>
                      )}

                      {/* Price Display */}
                      <div className="mt-2 flex items-center gap-2">
                        <span className="text-sm md:text-base font-semibold text-gray-900">
                          ₹{finalPrice.toFixed(2)}
                        </span>
                        {hasDiscount && (
                          <>
                            <span className="text-xs text-gray-500 line-through">
                              ₹{(item.price || 0).toFixed(2)}
                            </span>
                            <span className="text-xs bg-red-100 text-red-600 px-1.5 py-0.5 rounded font-medium">
                              {item.discount}% OFF
                            </span>
                          </>
                        )}
                      </div>

                      {/* Stock Status */}
                      <div className="mt-2">
                        {item.inStock === false ? (
                          <span className="inline-flex items-center text-xs text-red-600 bg-red-50 px-2 py-1 rounded-full">
                            <span className="w-2 h-2 bg-red-400 rounded-full mr-1"></span>
                            Out of Stock
                          </span>
                        ) : item.maxQuantity &&
                          item.quantity >= item.maxQuantity ? (
                          <span className="inline-flex items-center text-xs text-orange-600 bg-orange-50 px-2 py-1 rounded-full">
                            <span className="w-2 h-2 bg-orange-400 rounded-full mr-1"></span>
                            Max Quantity Reached
                          </span>
                        ) : (
                          <span className="inline-flex items-center text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full">
                            <span className="w-2 h-2 bg-green-400 rounded-full mr-1"></span>
                            In Stock
                          </span>
                        )}
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center bg-gray-100 rounded-lg">
                          <button
                            onClick={() => handleQuantityChange(item, -1)}
                            disabled={loading || (item.quantity || 1) <= 1}
                            className="p-2 hover:bg-gray-200 text-gray-600 rounded-l-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <Minus className="h-3 w-3 md:h-4 md:w-4" />
                          </button>
                          <span className="w-12 text-center text-sm md:text-base text-gray-900 font-medium">
                            {item.quantity || 1}
                          </span>
                          <button
                            onClick={() => handleQuantityChange(item, 1)}
                            disabled={
                              loading ||
                              item.inStock === false ||
                              (item.maxQuantity &&
                                item.quantity >= item.maxQuantity)
                            }
                            className="p-2 hover:bg-gray-200 text-gray-600 rounded-r-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <Plus className="h-3 w-3 md:h-4 md:w-4" />
                          </button>
                        </div>

                        <button
                          onClick={() => handleRemoveItem(item)}
                          disabled={loading}
                          className="p-2 hover:bg-red-50 text-red-500 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <Trash2 className="h-4 w-4 md:h-5 md:w-5" />
                        </button>
                      </div>

                      {/* Item subtotal */}
                      <div className="mt-2 text-right">
                        <span className="text-sm font-medium text-gray-900">
                          Subtotal: ₹
                          {(finalPrice * (item.quantity || 1)).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        {validCartItems.length > 0 && (
          <div className="sticky bottom-0 bg-white border-t border-gray-100 p-4 md:p-6 space-y-4">
            {/* Totals Summary */}
            <div className="space-y-2">
              {totalSavings > 0 && (
                <div className="flex items-center justify-between text-sm text-green-600">
                  <span>Total Savings:</span>
                  <span className="font-medium">
                    ₹{totalSavings.toFixed(2)}
                  </span>
                </div>
              )}
              <div className="flex items-center justify-between text-lg font-semibold text-gray-900">
                <span>Total ({totalItems} items):</span>
                <span>₹{(totalAmount || 0).toFixed(2)}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={handleViewCart}
                className="flex items-center justify-center gap-2 px-4 py-3 text-sm md:text-base text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors font-medium"
              >
                <Eye className="h-4 w-4 md:h-5 md:w-5" />
                View Cart
              </button>
              <button
                onClick={handleCheckout}
                disabled={
                  validCartItems.length === 0 ||
                  loading ||
                  validCartItems.some((item) => item.inStock === false)
                }
                className="flex items-center justify-center gap-2 px-4 py-3 text-sm md:text-base text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
              >
                <ShoppingCart className="h-4 w-4 md:h-5 md:w-5" />
                Checkout
              </button>
            </div>

            {/* Out of stock warning */}
            {validCartItems.some((item) => item.inStock === false) && (
              <div className="text-center">
                <p className="text-xs text-red-600 bg-red-50 px-3 py-2 rounded-lg">
                  Some items are out of stock. Please remove them to proceed.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}
