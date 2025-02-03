import { configureStore } from '@reduxjs/toolkit';
import flightReducer from '../features/flights/flightSlice';

export const store = configureStore({
  reducer: {
    flights: flightReducer,
  },
});
