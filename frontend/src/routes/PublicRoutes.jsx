import { Route, Routes } from "react-router-dom";
import MainLayout from "../components/layout/MainLayout";
import HomePage from "../pages/public/Home";
import EventsPage from "../pages/public/Events";
import EventDetailPage from "../pages/public/EventDetail";
import RecruitmentsPage from "../pages/public/Recriutments";
import RecruitmentDetailPage from "../pages/public/RecruitmentDetail";
import ProfilePage from "../pages/profile/ProfilePage";

const PublicRoutes = () => {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/events" element={<EventsPage />} />
        <Route path="/event-detail/:idEvent" element={<EventDetailPage />} />
        <Route path="/recruitments" element={<RecruitmentsPage />} />
        <Route
          path="/recruitment-detail/:idRecruitment"
          element={<RecruitmentDetailPage />}
        />
        <Route path="/me" element={<ProfilePage />} />
      </Route>
    </Routes>
  );
};

export default PublicRoutes;
