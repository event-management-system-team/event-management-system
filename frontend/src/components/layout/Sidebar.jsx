import React from 'react';
import { LayoutDashboard, LogOut, Calendar } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = () => {
    const location = useLocation();

    const navItems = [
        { icon: Calendar, label: 'Create New Event', path: '/create-event' },
    ];

    return (
        <aside className="w-64 bg-[#1A202C] text-white flex flex-col h-screen fixed left-0 top-0 border-r border-gray-800">
            {/* Logo */}
            <div className="p-6 flex items-center space-x-2">
                <div className="w-8 h-8 bg-blue-500 rounded-md flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-white" />
                </div>
                <div>
                    <h1 className="text-xl font-bold tracking-tight">EventHub <span className="text-xs font-normal text-gray-400 italic">Organizer</span></h1>
                </div>
            </div>

            {/* User Profile */}
            <div className="px-4 mb-6">
                <div className="bg-[#2D3748] rounded-xl p-3 flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-yellow-200 to-blue-300"></div> {/* Placeholder for avatar */}
                    <div>
                        <p className="text-sm font-medium">Alex Rivera</p>
                        <p className="text-xs text-gray-400">Senior Manager</p>
                    </div>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-4 space-y-2">
                {navItems.map((item, index) => {
                    const isActive = location.pathname.startsWith(item.path) || location.pathname === '/';
                    return (
                        <Link
                            key={index}
                            to={item.path}
                            className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${isActive
                                ? 'bg-gradient-to-r from-teal-500/20 to-teal-500/10 text-teal-400 border border-teal-500/20'
                                : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                                }`}
                        >
                            <item.icon className="w-5 h-5" />
                            <span className="font-medium">{item.label}</span>
                        </Link>
                    );
                })}
            </nav>

            {/* Logout */}
            <div className="p-4 border-t border-gray-800">
                <button className="flex items-center space-x-3 px-4 py-2 text-gray-400 hover:text-white transition-colors w-full">
                    <LogOut className="w-5 h-5" />
                    <span>Logout</span>
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
