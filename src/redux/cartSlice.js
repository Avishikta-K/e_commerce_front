import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  cartItems: [],
  totalQuantity: 0,
  totalPrice: 0,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const newItem = action.payload;
      
      // NOTE: This checks if an item with the same ID already exists.
      // (See "Important Note" below about different colors)
      const existingItem = state.cartItems.find(item => item.id === newItem.id);

      if (existingItem) {
        existingItem.quantity++;
        existingItem.totalPrice += newItem.price;
      } else {
        state.cartItems.push({
          id: newItem.id,
          name: newItem.name,
          price: newItem.price,
          image: newItem.image,
          // --- FIX START: Add these lines so Redux saves them! ---
          color: newItem.color, 
          size: newItem.size,
          // --- FIX END ---
          quantity: 1,
          totalPrice: newItem.price,
        });
      }
      state.totalQuantity++;
      state.totalPrice += newItem.price;
    },
    removeFromCart: (state, action) => {
      const id = action.payload;
      const existingItem = state.cartItems.find(item => item.id === id);

      if (existingItem) {
        state.totalQuantity--;
        state.totalPrice -= existingItem.price;

        if (existingItem.quantity === 1) {
          state.cartItems = state.cartItems.filter(item => item.id !== id);
        } else {
          existingItem.quantity--;
          existingItem.totalPrice -= existingItem.price;
        }
      }
    },
    clearCart: (state) => {
      state.cartItems = [];
      state.totalQuantity = 0;
      state.totalPrice = 0;
    },
  },
});

export const { addToCart, removeFromCart, clearCart } = cartSlice.actions;
export default cartSlice.reducer;