import React from "react";
import {Routes, Route} from "react-router-dom";
import RegisterPage from "./pages/auth/RegisterPage";
import LoginPage from "./pages/auth/LoginPage";
import ProtectedRoute from "./components/common/ProtectedRoute";

import {logoutUser} from "./store/slices/auth.slice";
import {useDispatch} from "react-redux";
import {AdminDashboard} from "./pages/admin/AdminDashboard.jsx";
import {AccountManagement} from "./pages/admin/AccountManagement.jsx";
import {AccountDetail} from "./pages/admin/AccountDetail.jsx";
import {EventManagement} from "./pages/admin/EventManagement.jsx";
import {EventDetail} from "./pages/admin/EventDetail.jsx";
import {EventAnalytics} from "./pages/admin/EventAnalytics.jsx";

function App() {
    const dispatch = useDispatch();

    const onSubmit = async () => {
        await dispatch(logoutUser());
    };

    return (
        <Routes>
            <Route path="/login" element={<LoginPage/>}/>
            <Route path="/register" element={<RegisterPage/>}/>
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

            {/* Admin Pages */}
            <Route path="/admin" element={<AdminDashboard/>}/>
            <Route path="/admin/accounts" element={<AccountManagement/>}/>
            <Route path="/admin/accounts/account-detail/:id" element={<AccountDetail/>}/>
            <Route path="/admin/events" element={<EventManagement/>}/>
            <Route path="/admin/events/event-detail/:id" element={<EventDetail/>}/>
            <Route path="/admin/analytics" element={<EventAnalytics/>}/>
        </Routes>
    );
}

export default App;
