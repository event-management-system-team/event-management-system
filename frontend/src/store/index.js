import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/auth.slice";
import categoryReducer from "./slices/category.slice";
import bookingReducer from "./slices/booking.slice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    category: categoryReducer,
    booking: bookingReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});
