import React from 'react';
import { LayoutDashboard, FileText, Users, MessageSquare, HelpCircle, CalendarDays } from 'lucide-react';
import { Link } from 'react-router-dom';

const Sidebar = () => {
    return (
        <div className="w-64 bg-[#1e293b] min-h-screen flex flex-col text-gray-300 fixed left-0 top-0 z-50 font-sans">
            {/* 1. Logo */}
            <div className="p-6 flex items-center gap-3">
                <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center text-white font-bold text-xs">
                    EH
                </div>
                <div>
                    <h1 className="text-white font-bold text-lg tracking-tight">EventHub</h1>
                    <p className="text-[10px] uppercase tracking-wider text-gray-500">Organizer</p>
                </div>
            </div>

            {/* 2. User Profile (FPT Software) */}
            <div className="mx-4 mb-8 p-3 bg-[#2d3a4f] rounded-xl flex items-center gap-3 border border-gray-700 shadow-sm">
                <img
                    src="https://ui-avatars.com/api/?name=FPT+Software&background=random"
                    alt="User"
                    className="w-10 h-10 rounded-full object-cover border border-gray-500"
                />
                <div className="overflow-hidden">
                    <h3 className="text-white text-sm font-bold truncate">FPT Software</h3>
                    <p className="text-[11px] text-gray-400 truncate">Senior Organizer</p>
                </div>
            </div>

            {/* 3. Menu Items */}
            <nav className="flex-1 px-4 space-y-1">
                <NavItem icon={<LayoutDashboard size={20} />} label="Dashboard" to="/organizer/dashboard" />
                <NavItem icon={<CalendarDays size={20} />} label="My Events" to="/organizer/my-events" active />
                <NavItem icon={<FileText size={20} />} label="Application List" to="/organizer/applications" />
                <NavItem icon={<Users size={20} />} label="Staff Management" to="/organizer/staff" />
                <NavItem icon={<MessageSquare size={20} />} label="Feedback List" to="/organizer/feedback" />
            </nav>

            {/* 4. Footer */}
            <div className="p-6 mt-auto">
                <div className="flex items-center gap-3 text-sm text-gray-400 hover:text-white cursor-pointer transition-colors">
                    <HelpCircle size={20} />
                    <span>Help Center</span>
                </div>
            </div>
        </div>
    );
};

const NavItem = ({ icon, label, active, to = '#' }) => (
    <Link to={to} className={`flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer transition-all duration-200 ${active
        ? 'bg-[#3b4758] text-white font-medium shadow-lg'
        : 'hover:bg-gray-800 hover:text-white'
        }`}>
        <span className={active ? 'text-gray-100' : 'text-gray-400'}>{icon}</span>
        <span>{label}</span>
    </Link>
);

export default Sidebar;