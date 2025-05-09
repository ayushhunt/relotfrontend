// components/Cart/Cart.js
import React from 'react';
import { connect } from 'react-redux';
import { removeItemFromCart, updateCartItemQuantity } from '../../redux/actions/cartActions';
import CartItem from './CartItem';

const Cart = ({ cartItems, removeItem, updateQuantity }) => {
  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2);
  };

  return (
    <div>
      <h2>Your Shopping Cart</h2>
      {cartItems.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <ul>
          {cartItems.map(item => (
            <CartItem
              key={item.id}
              item={item}
              onRemove={() => removeItem(item.id)}
              onQuantityChange={(newQuantity) => updateQuantity(item.id, newQuantity)}
            />
          ))}
        </ul>
      )}
      <p>Total: ${calculateTotal()}</p>
      {cartItems.length > 0 && <button>Proceed to Checkout</button>}
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    cartItems: state.cart.items, // Access the 'items' array from the 'cart' reducer
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    removeItem: (itemId) => dispatch(removeItemFromCart(itemId)),
    updateQuantity: (itemId, quantity) => dispatch(updateCartItemQuantity(itemId, quantity)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Cart);