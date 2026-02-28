import { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { autoRefreshToken } from "./store/slices/auth.slice";

import AppRoutes from "./routes";

function App() {
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    const initAuth = async () => {
      if (!isAuthenticated) {
        try {
          await dispatch(autoRefreshToken()).unwrap();
          console.log("Auto refresh successful");
        } catch {
          console.log("No valid session");
        }
      }
    };

    initAuth();
  }, [dispatch, isAuthenticated]);

  return (
    <Routes>
      <Route path="/*" element={<AppRoutes />} />
    </Routes>
  );
}

export default App;
