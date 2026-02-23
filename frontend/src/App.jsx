import React from "react";
import { Routes, Route } from "react-router-dom";

import AppRoutes from "./routes";
function App() {
  return (
    <Routes>
      <Route path="/*" element={<AppRoutes />} />
    </Routes>
  );
}

export default App;
