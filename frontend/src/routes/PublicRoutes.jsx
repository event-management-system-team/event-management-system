import { Route, Routes, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import MainLayout from "../components/layout/MainLayout";
import HomePage from "../pages/public/Home";
import EventsPage from "../pages/public/Events";
import EventDetailPage from "../pages/public/EventDetail";
import RecruitmentsPage from "../pages/public/Recruitments";
import RecruitmentDetailPage from "../pages/public/RecruitmentDetail";
import ProfilePage from "../pages/profile/ProfilePage";
import ProtectedRoute from "../components/common/ProtectedRoute";

// Redirect ORGANIZER/ADMIN về dashboard tương ứng khi họ truy cập public routes
const RoleRedirect = ({ children }) => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  if (isAuthenticated && user) {
    if (user.role === "ORGANIZER") return <Navigate to="/organizer/dashboard" replace />;
    if (user.role === "ADMIN") return <Navigate to="/admin/dashboard" replace />;
  }

  return children;
};

const PublicRoutes = () => {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<RoleRedirect><HomePage /></RoleRedirect>} />
        <Route path="/events" element={<EventsPage />} />
        <Route path="/events/:eventSlug" element={<EventDetailPage />} />
        <Route path="/recruitments" element={<RecruitmentsPage />} />
        <Route
          path="/recruitments/:eventSlug"
          element={<RecruitmentDetailPage />}
        />
      </Route>
    </Routes>
  );
};

export default PublicRoutes;

