import { Route, Routes } from "react-router-dom";
import ProtectedRoute from "../components/common/ProtectedRoute";

import FeedbackList from "../pages/organizer/FeedbackList";
import FeedbackBuilder from "../pages/organizer/FeedbackBuilder";
import FeedbackDetail from "../pages/organizer/FeedbackDetail";
import RecruitmentList from "../pages/organizer/RecruitmentList";
import RecruitmentBuilder from "../pages/organizer/RecruitmentBuilder";
import ApplicationList from "../pages/organizer/ApplicationList";
import RecruitmentDetail from "../pages/organizer/RecruitmentDetail";

const OrganizerRoutes = () => {
  return (
    <Routes>
      <Route element={<ProtectedRoute allowedRoles={["ORGANIZER"]} />}>
      <Route path="/feedback/feedbacklist/:eventId" element={<FeedbackList />} />
      <Route path="/feedback/createform/:eventId" element={<FeedbackBuilder />} />
      <Route path="/feedback/:feedbackId" element={<FeedbackDetail />} />
      <Route path="/recruitmentlist/:eventId" element={<RecruitmentList />} />
      <Route path="/recruitmentcreate/:eventId" element={<RecruitmentBuilder />} />
      <Route path="/applications/:recruitmentId" element={<ApplicationList />} />
      <Route path="/recruitments/:recruitmentId" element={<RecruitmentDetail />} />
      </Route>
    </Routes>
  );
};

export default OrganizerRoutes;
