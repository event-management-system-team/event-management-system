import React from 'react';
import Sidebar from './Sidebar';

const Layout = ({ children }) => {
    return (
        <div className="min-h-screen bg-[#F3F4F1]"> {/* Light beige/gray background from screenshot */}
            <Sidebar />
            <main className="ml-64 min-h-screen">
                {children}
            </main>
        </div>
    );
};

export default Layout;
