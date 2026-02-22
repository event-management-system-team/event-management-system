import React from "react";
import { Routes, Route } from "react-router-dom";
import RegisterPage from "./pages/auth/RegisterPage";
import LoginPage from "./pages/auth/LoginPage";
import ProtectedRoute from "./components/common/ProtectedRoute";

import { logoutUser } from "./store/slices/auth.slice";
import { useDispatch } from "react-redux";
import { ProfileSection } from "./components/domain/profile/ProfileCard";
function App() {
  const dispatch = useDispatch();

  const onSubmit = async () => {
    await dispatch(logoutUser());
  };

  return (
    /*<Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <div>
              <button onClick={onSubmit}>Logout</button>
            </div>
          </ProtectedRoute>
        }
      />
    </Routes>*/

    <ProfileSection
      avatarUrl="https://upload.wikimedia.org/wikipedia/commons/thumb/6/6a/Cristiano_Ronaldo_WC2022_-_02.jpg/250px-Cristiano_Ronaldo_WC2022_-_02.jpg"
      name="John Doe"
    />
  );
}

export default App;
