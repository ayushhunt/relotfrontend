import { ADD_ITEM_TO_CART, REMOVE_ITEM_FROM_CART, UPDATE_CART_ITEM_QUANTITY,SET_CART_ITEMS } from '../types';

const initialState = {
  items: [], // Array to hold cart items
};

const cartReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_CART_ITEMS:
      return {
        ...state,
        items: action.payload,
      };
    case ADD_ITEM_TO_CART:
      // Check if the item already exists in the cart
      const existingItemIndex = state.items.findIndex(item => item.id === action.payload.id);

      if (existingItemIndex >= 0) {
        // If it exists, increase the quantity
        const updatedItems = state.items.map(item =>
          item.id === action.payload.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
        return {
          ...state,
          items: updatedItems,
        };
      } else {
        // If it doesn't exist, add it to the cart
        return {
          ...state,
          items: [...state.items, { ...action.payload, quantity: 1 }],
        };
      }

    case REMOVE_ITEM_FROM_CART:
      return {
        ...state,
        items: state.items.filter(item => item.id !== action.payload),
      };

    case UPDATE_CART_ITEM_QUANTITY:
      return {
        ...state,
        items: state.items.map(item =>
          item.id === action.payload.itemId
            ? { ...item, quantity: parseInt(action.payload.quantity) } // Ensure quantity is a number
            : item
        ),
      };

    default:
      return state;
  }
};

export default cartReducer;