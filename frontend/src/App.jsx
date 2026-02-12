import React from "react";
import {Routes, Route} from "react-router-dom";
import {AdminDashboard} from "./pages/admin/AdminDashboard.jsx";
import {AccountManagement} from "./pages/admin/AccountManagement.jsx";

function App() {
  return (
      <Routes>
          {/* Admin Pages */}
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/accounts" element={<AccountManagement />} />
      </Routes>
  );
}

export default App;
