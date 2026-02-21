<<<<<<< Updated upstream
import { BrowserRouter, Routes, Route } from 'react-router-dom';
// ... các import khác
import FeedbackList from './pages/FeedbackList';

=======

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
>>>>>>> Stashed changes
function App() {
  const dispatch = useDispatch();

  const onSubmit = async () => {
    await dispatch(logoutUser());
  };

  return (
<<<<<<< Updated upstream
    <BrowserRouter>
      <Routes>
        {/* ... các route cũ */}
        
        {/* Thêm route cho Feedback - Chỉ Admin/Organizer mới vào được */}
        <Route path="/admin/feedback" element={<FeedbackList />} />
        
        {/* Nếu có eventId cụ thể thì dùng: */}
        {/* <Route path="/admin/events/:eventId/feedback" element={<FeedbackList />} /> */}

      </Routes>
    </BrowserRouter>
=======
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/organizer/feedback/list" element={<FeedbackList />} />
      <Route path="/organizer/feedback/createform" element={<FeedbackForm />} />
      <Route path="/organizer/feedback/:id" element={<FeedbackDetail />} />
      <Route path="/user/submit-feedback" element={<SubmitFeedback />} />
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
>>>>>>> Stashed changes
  );
}
export default App;