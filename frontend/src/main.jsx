import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { store } from "./store/index.js";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";
// 1. Nhập TanStack Query vào đây
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
//import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

import "./index.css";
import App from "./App.jsx";

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
// 2. Khởi tạo QueryClient ở môi trường gốc
const queryClient = new QueryClient();

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID} locale="en">
      <Provider store={store}>
        {/* 3. Bọc QueryClientProvider ôm lấy BrowserRouter */}
        <QueryClientProvider client={queryClient}>
          <BrowserRouter>
            <App />
          </BrowserRouter>
          {/*<ReactQueryDevtools initialIsOpen={false} />*/}
        </QueryClientProvider>
      </Provider>
    </GoogleOAuthProvider>
  </StrictMode>
);