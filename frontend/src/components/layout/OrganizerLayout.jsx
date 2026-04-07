import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";

const OrganizerLayout = () => {
    return (
        <div className="flex h-screen overflow-hidden bg-[#F1F0E8] font-sans text-slate-800 relative">
            <Sidebar />

            <main className="flex-1 h-full overflow-y-auto relative flex flex-col">
                <Outlet />
            </main>
        </div>
    );
};

export default OrganizerLayout;
