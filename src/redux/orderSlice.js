import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  history: [], // This will hold all past order objects
};

const orderSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    placeOrder: (state, action) => {
      // action.payload should be the full order object 
      // (id, items, total, date, status, etc.)
      state.history.unshift(action.payload); // Add new order to the top of the list
    },
  },
});

export const { placeOrder } = orderSlice.actions;
export default orderSlice.reducer;