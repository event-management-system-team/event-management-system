import { Outlet } from "react-router-dom";
import MenuSidebar from "../domain/admin/MenuSidebar";

const AdminLayout = () => {
    return (
        <div className="flex h-screen overflow-hidden bg-[#E5E1DA] font-sans text-slate-800 relative">
            <MenuSidebar />

            <main className="flex-1 h-full overflow-y-auto relative flex flex-col">
                <Outlet />
            </main>
        </div>
    );
};

export default AdminLayout;