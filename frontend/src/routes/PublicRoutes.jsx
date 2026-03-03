import { Route, Routes } from "react-router-dom";
import MainLayout from "../components/layout/MainLayout";
import HomePage from "../pages/public/Home";
import EventsPage from "../pages/public/Events";
import EventDetailPage from "../pages/public/EventDetail";
import RecruitmentsPage from "../pages/public/Recruitments";
import RecruitmentDetailPage from "../pages/public/RecruitmentDetail";
import ProfilePage from "../pages/profile/ProfilePage";
import ProtectedRoute from "../components/common/ProtectedRoute";

const PublicRoutes = () => {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/events" element={<EventsPage />} />
        <Route path="/events/:eventSlug" element={<EventDetailPage />} />
        <Route path="/recruitments" element={<RecruitmentsPage />} />
        <Route
          path="/recruitments/:eventSlug"
          element={<RecruitmentDetailPage />}
        />
        <Route 
          path="/me" 
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          } 
        />
      </Route>
    </Routes>
  );
};

export default PublicRoutes;
