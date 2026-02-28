import { Outlet } from "react-router-dom";
import Header from "../common/Attendee/Header";
import Footer from "../common/Footer";

const MainLayout = () => {
    return (
        <div className="flex flex-col min-h-screen bg-[#F1F0E8]">
            <Header />

            <main className="flex-1">
                <Outlet />
            </main>

            <Footer />
        </div>
    );
};

export default MainLayout;