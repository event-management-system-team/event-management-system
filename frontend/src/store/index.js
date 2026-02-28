import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/auth.slice";
import categoryReducer from "./slices/category.slice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    category: categoryReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

