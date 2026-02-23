import { Route, Routes } from "react-router-dom"
import PublicRoutes from "./PublicRoutes"


const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/*" element={<PublicRoutes />} />


            <Route path="*" element={<div>404-Page Not Found</div>} />
        </Routes>
    )
}

export default AppRoutes