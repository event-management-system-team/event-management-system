import { Outlet } from "react-router-dom";
import Header from "../common/Attendee/Header";

const MainLayout = () => {
    return (
        <div className="flex flex-col min-h-screen bg-[#F1F0E8]">
            <Header />

            <main className="flex-1">
                <Outlet />
            </main>

            {/* 3. Tạm thời mình chưa làm Footer, có thể để trống hoặc thêm sau */}
            <footer className="p-6 text-center text-gray-500 text-sm">
                © 2024 EventHub Platform
            </footer>
        </div>
    );
};

export default MainLayout;