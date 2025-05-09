// components/Cart/CartItem.js
import React from 'react';
import { connect } from 'react-redux';
import { removeItemFromCart, updateCartItemQuantity } from '../../redux/actions/cartActions';

const CartItem = ({ item, removeItem, updateQuantity }) => {
  return (
    <li>
      {item.name} - ${item.price} - Quantity:
      <input
        type="number"
        value={item.quantity}
        min="1"
        onChange={(e) => updateQuantity(item.id, e.target.value)}
      />
      <button onClick={() => removeItem(item.id)}>Remove</button>
    </li>
  );
};

const mapDispatchToProps = (dispatch) => {
  return {
    removeItem: (itemId) => dispatch(removeItemFromCart(itemId)),
    updateQuantity: (itemId, quantity) => dispatch(updateCartItemQuantity(itemId, quantity)),
  };
};

export default connect(null, mapDispatchToProps)(CartItem);