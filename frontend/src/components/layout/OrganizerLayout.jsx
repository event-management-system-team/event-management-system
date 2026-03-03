import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";

const OrganizerLayout = () => {
    return (
        <div className="flex h-screen bg-[#F5F3EE]">
            {/* Sidebar */}
            <Sidebar />

            {/* Main Content */}
            <main className="flex-1 ml-64 overflow-auto">
                <Outlet />
            </main>
        </div>
    );
};

export default OrganizerLayout;
