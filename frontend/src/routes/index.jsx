import { Route, Routes } from "react-router-dom";
import PublicRoutes from "./PublicRoutes";
import AuthRoutes from "./AuthRoutes";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login/*" element={<AuthRoutes />} />
      <Route path="/register/*" element={<AuthRoutes />} />
      <Route path="/*" element={<PublicRoutes />} />
      <Route path="*" element={<div>404-Page Not Found</div>} />
    </Routes>
  );
};

export default AppRoutes;
