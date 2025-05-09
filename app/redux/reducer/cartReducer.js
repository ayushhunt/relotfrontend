import { ADD_ITEM_TO_CART, REMOVE_ITEM_FROM_CART, UPDATE_CART_ITEM_QUANTITY, SET_CART_ITEMS } from '../types';

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
      console.log("Current cart items:", state.items);
      console.log("Action payload:", action.payload);
      
      // Use _id instead of id for comparison
      const existingItemIndex = state.items.findIndex(
        item => item._id === action.payload._id
      );
      
      console.log("Adding item to cart:", action.payload);
      
      if (existingItemIndex >= 0) {
        // If item exists, increase its quantity
        const updatedItems = state.items.map(item =>
          item._id === action.payload._id
            ? { ...item, quantity: (item.quantity || 1) + 1 }
            : item
        );
        return {
          ...state,
          items: updatedItems,
        };
      } else {
        // If item doesn't exist, add it with quantity 1
        return {
          ...state,
          items: [...state.items, { ...action.payload, quantity: 1 }],
        };
      }

    case REMOVE_ITEM_FROM_CART:
      return {
        ...state,
        items: state.items.filter(item => item._id !== action.payload),
      };

    case UPDATE_CART_ITEM_QUANTITY:
      return {
        ...state,
        items: state.items.map(item =>
          item._id === action.payload.itemId
            ? { ...item, quantity: parseInt(action.payload.quantity) }
            : item
        ),
      };

    default:
      return state;
  }
};

export default cartReducer;