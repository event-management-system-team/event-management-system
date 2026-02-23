import React from "react";
import { Routes, Route } from "react-router-dom";
import RegisterPage from "./pages/auth/RegisterPage";
import LoginPage from "./pages/auth/LoginPage";
import ProtectedRoute from "./components/common/ProtectedRoute";
import { logoutUser } from "./store/slices/auth.slice";
import { useDispatch } from "react-redux";
import FeedbackList from "./pages/organizer/FeedbackList";
import FeedbackForm from "./pages/organizer/FeedbackBuilder";
import FeedbackDetail from "./pages/organizer/FeedbackDetail";
import SubmitFeedback from "./pages/user/SubmitFeedback";
import { ProfileCard } from "./components/domain/profile/ProfileCard";


function App() {
  const dispatch = useDispatch();

  const onSubmit = async () => {
    await dispatch(logoutUser());
  };

  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/organizer/feedback/list" element={<FeedbackList />} />
      <Route path="/organizer/feedback/createform" element={<FeedbackForm />} />
      <Route path="/organizer/feedback/:id" element={<FeedbackDetail />} />
      <Route path="/user/submit-feedback" element={<SubmitFeedback />} />
      <Route path="/profile" element={<ProfileCard />} />
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
    </Routes> 

  );
}
export default App;