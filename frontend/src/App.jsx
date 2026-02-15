import React from "react";
import {Routes, Route} from "react-router-dom";
import RegisterPage from "./pages/auth/RegisterPage";
import LoginPage from "./pages/auth/LoginPage";
import ProtectedRoute from "./components/common/ProtectedRoute";

import {logoutUser} from "./store/slices/auth.slice";
import {useDispatch} from "react-redux";
import {AdminDashboard} from "./pages/admin/AdminDashboard.jsx";
import {AccountManagement} from "./pages/admin/AccountManagement.jsx";
import {EventManagement} from "./pages/admin/EventManagement.jsx";

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
            <Route path="/admin/events" element={<EventManagement/>}/>
        </Routes>
    );
}

export default App;
