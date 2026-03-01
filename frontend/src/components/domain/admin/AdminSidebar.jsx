import {
    BarChart3,
    Calendar,
    CalendarCog,
    LayoutDashboard,
    LogOut,
    Settings,
    UserCircle
} from "lucide-react";
import {Button} from "./Button.jsx";
import {Link} from "react-router";
import {NavLink} from "react-router-dom";

export function AdminSidebar() {
    return (
        <aside className="w-50 bg-[#8aa8b2] text-white flex flex-col ">
            {/* Logo */}
            <div className="p-6 pb-8 border-b border-[#6f8f99]">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#5A738A] rounded-lg flex items-center justify-center">
                        <Calendar className="w-5 h-5 text-white"/>
                    </div>
                    <div>
                        <div className="font-semibold text-white">EventHub</div>
                        <div className="text-sm text-gray-300">Admin</div>
                    </div>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-3 pt-6">
                <NavLink
                    to="/admin" end
                    className={({ isActive }) =>
                        isActive
                            ? 'w-full'
                            : 'w-full'
                    }
                >
                    {({ isActive }) => (
                        <Button
                            variant="ghost"
                            className={`w-full justify-start mb-1 py-5 rounded-3xl  ${
                                isActive
                                    ? 'bg-[#6f8f99] hover:bg-[#728f9a] text-white'
                                    : 'text-gray-100 hover:text-white hover:bg-[#6f8f99]'
                            }`}
                        >
                            <LayoutDashboard className="mr-3 h-4 w-4" />
                            Dashboard
                        </Button>
                    )}
                </NavLink>

                <NavLink
                    to="/admin/accounts"
                    className={({ isActive }) =>
                        isActive
                            ? 'w-full'
                            : 'w-full'
                    }
                >
                    {({ isActive }) => (
                        <Button
                            variant="ghost"
                            className={`w-full justify-start mb-1 py-5 rounded-3xl  ${
                                isActive
                                    ? 'bg-[#6f8f99] hover:bg-[#728f9a] text-white'
                                    : 'text-gray-100 hover:text-white hover:bg-[#6f8f99]'
                            }`}
                        >
                            <UserCircle className="mr-3 h-4 w-4"/>
                            Accounts
                        </Button>
                    )}
                </NavLink>

                <NavLink
                    to="/admin/events"
                    className={({ isActive }) =>
                        isActive
                            ? 'w-full'
                            : 'w-full'
                    }
                >
                    {({ isActive }) => (
                        <Button
                            variant="ghost"
                            className={`w-full justify-start mb-1 py-5 rounded-3xl  ${
                                isActive
                                    ? 'bg-[#6f8f99] hover:bg-[#728f9a] text-white'
                                    : 'text-gray-100 hover:text-white hover:bg-[#6f8f99]'
                            }`}
                        >
                            <CalendarCog className="mr-3 h-4 w-4"/>
                            Events
                        </Button>
                    )}
                </NavLink>

                <NavLink
                    to="/admin/analytics"
                    className={({ isActive }) =>
                        isActive
                            ? 'w-full'
                            : 'w-full'
                    }
                >
                    {({ isActive }) => (
                        <Button
                            variant="ghost"
                            className={`w-full justify-start mb-1 py-5 rounded-3xl  ${
                                isActive
                                    ? 'bg-[#6f8f99] hover:bg-[#728f9a] text-white'
                                    : 'text-gray-100 hover:text-white hover:bg-[#6f8f99]'
                            }`}
                        >
                            <BarChart3 className="mr-3 h-4 w-4"/>
                            Event Analytics
                        </Button>
                    )}
                </NavLink>

                <NavLink
                    to="/admin/settings"
                    className={({ isActive }) =>
                        isActive
                            ? 'w-full'
                            : 'w-full'
                    }
                >
                    {({ isActive }) => (
                        <Button
                            variant="ghost"
                            className={`w-full justify-start mb-1 py-5 rounded-3xl  ${
                                isActive
                                    ? 'bg-[#6f8f99] hover:bg-[#728f9a] text-white'
                                    : 'text-gray-100 hover:text-white hover:bg-[#6f8f99]'
                            }`}
                        >
                            <Settings className="mr-3 h-4 w-4"/>
                            Settings
                        </Button>
                    )}
                </NavLink>
            </nav>

            {/* Sign Out */}
            <div className="p-6 border-t border-[#6f8f99]">
                <Button variant="ghost"
                        className="w-full justify-start text-gray-300 hover:text-white hover:bg-[#6f8f99] p-2">
                    <LogOut className="mr-2 h-4 w-4"/>
                    Sign Out
                </Button>
            </div>
        </aside>
    )
}