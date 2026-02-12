import React from "react";
import {Routes, Route} from "react-router-dom";
import {AdminDashboard} from "./pages/admin/AdminDashboard.jsx";

function App() {
  return (
      <Routes>
          <Route path="/admin" element={<AdminDashboard />} />
      </Routes>
  );
}

export default App;
