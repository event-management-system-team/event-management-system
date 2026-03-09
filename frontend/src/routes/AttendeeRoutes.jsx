import { Route, Routes } from "react-router-dom";
import ProtectedRoute from "../components/common/ProtectedRoute";

import ApplicationForm from "../pages/attendee/ApplicationForm";
import MyApplication from "../pages/attendee/MyApplication";
import MyTickets from "../pages/attendee/MyTickets";
import TicketDetail from "../pages/attendee/TicketDetail";
import MainLayout from "../components/layout/MainLayout";
import CheckoutPage from "../pages/attendee/CheckoutPage";
import PaymentSuccessPage from "../pages/attendee/PaymentSuccessPage";
import PaymentFailedPage from "../pages/attendee/PaymentFailedPage";
import ProfilePage from "../pages/profile/ProfilePage";
import SubmitFeedback from "../pages/attendee/SubmitFeedback";


const AttendeeRoutes = () => {
    return (

        <Routes>
            <Route element={<MainLayout />}>
                <Route element={<ProtectedRoute allowedRoles={["ATTENDEE"]} />}>

                    <Route path="recruitments/:eventSlug/apply-staff" element={<ApplicationForm />} />
                    <Route path="applications" element={<MyApplication />} />
                    <Route path="my-tickets" element={<MyTickets />} />
                    <Route path="tickets/:orderCode" element={<TicketDetail />} />
                    <Route path="checkout" element={<CheckoutPage />} />
                    <Route path="payment/success" element={<PaymentSuccessPage />} />
                    <Route path="payment/failed" element={<PaymentFailedPage />} />
                    <Route path="me" element={<ProfilePage />} />
                    <Route path="submit-feedback/:eventId" element={<SubmitFeedback />} />
                </Route>
            </Route>
        </Routes>
    );
};

export default AttendeeRoutes;
