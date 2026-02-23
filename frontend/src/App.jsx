import React from "react";
import { Routes, Route } from "react-router-dom"; 
import { useDispatch } from "react-redux";

import RegisterPage from "./pages/auth/RegisterPage";
import LoginPage from "./pages/auth/LoginPage";
import ProtectedRoute from "./components/common/ProtectedRoute";
import { logoutUser } from "./store/slices/auth.slice";

import FeedbackList from "./pages/organizer/FeedbackList";
import FeedbackForm from "./pages/organizer/FeedbackBuilder";
import FeedbackDetail from "./pages/organizer/FeedbackDetail";
import SubmitFeedback from "./pages/user/SubmitFeedback";

import { ProfileCard } from "./components/domain/profile/ProfileCard";
import RecruitmentList from "./pages/organizer/RecruitmentList";
import RecruitmentBuilder from "./pages/organizer/RecruitmentBuilder";
import ApplicationList from "./pages/organizer/ApplicationList";

function App() {
  const dispatch = useDispatch();

  const onSubmit = async () => {
    await dispatch(logoutUser());
  };

  return (
    <Routes>
      {/* CÁC ROUTE PUBLIC (Ai cũng vào được) */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/user/submit-feedback" element={<SubmitFeedback />} />

      {/* CÁC ROUTE PRIVATE (Phải đăng nhập mới được vào) */}
      <Route 
        path="/profile" 
        element={
          <ProtectedRoute>
            <ProfileCard />
          </ProtectedRoute>
        } 
      />
      
      {/* Vì đây là các chức năng của Organizer trong hệ thống, bạn cũng nên bọc ProtectedRoute lại */}
      <Route path="/organizer/feedbacklist/:eventId" element={<ProtectedRoute><FeedbackList /></ProtectedRoute>} />
      <Route path="/organizer/feedback/createform" element={<ProtectedRoute><FeedbackForm /></ProtectedRoute>} />
      <Route path="/organizer/feedback/:id" element={<ProtectedRoute><FeedbackDetail /></ProtectedRoute>} />
      <Route path="/organizer/recruitmentlist" element={<ProtectedRoute><RecruitmentList /></ProtectedRoute>} />
      <Route path="/organizer/recruitmentcreate" element={<ProtectedRoute><RecruitmentBuilder /></ProtectedRoute>} />
      <Route path="/organizer/applications" element={<ProtectedRoute><ApplicationList /></ProtectedRoute>} />

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