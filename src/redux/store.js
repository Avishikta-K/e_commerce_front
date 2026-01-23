import { configureStore } from '@reduxjs/toolkit';
import cartReducer from './cartSlice';
import orderReducer from './orderSlice'; // Import the new slice

export const store = configureStore({
  reducer: {
    cart: cartReducer,
    orders: orderReducer, // Add it here
  },
});