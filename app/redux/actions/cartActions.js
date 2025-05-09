import { useSelector } from 'react-redux';
import { ADD_ITEM_TO_CART, REMOVE_ITEM_FROM_CART, UPDATE_CART_ITEM_QUANTITY,SET_CART_ITEMS } from '../types';

export const addItemToCart = (item) => {
  return {
    type: ADD_ITEM_TO_CART,
    payload: item, // The item object to add (e.g., { id, name, price, quantity: 1 })
  };
};

export const removeItemFromCart = (itemId) => {
  return {
    type: REMOVE_ITEM_FROM_CART,
    payload: itemId, // The ID of the item to remove
  };
};

export const updateCartItemQuantity = (itemId, quantity) => {
  return {
    type: UPDATE_CART_ITEM_QUANTITY,
    payload: { itemId, quantity },
  };
};

export const fetchUserCart = () => async (dispatch) => {
  const token = useSelector((state) => state.auth.token);

  if (!token) {
    // User is not authenticated — optional: reset cart
    dispatch({ type: SET_CART_ITEMS, payload: [] });
    return;
  }

  try {
    const res = await fetch('http://localhost:3000/v1/', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();

    const items = data.items.map((item) => ({
      id: item.productId,
      name: item.name,
      price: item.price,
      quantity: item.quantity,
      image: item.image,
    }));
    console.log('Fetched cart items:', items);
    dispatch({ type: SET_CART_ITEMS, payload: items });
  } catch (err) {
    console.error('Error fetching cart:', err);
  }
};
