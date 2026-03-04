import { ArrowLeftRight, Briefcase, CalendarDays, FolderOpen, LogOut } from 'lucide-react'
import Logo from '../Logo'
import { Dropdown } from 'antd';
import { useDispatch } from 'react-redux';
import { NavLink, useNavigate } from 'react-router';
import { logoutUser } from "../../../store/slices/auth.slice";

const MenuSidebar = () => {

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleSwitchMode = () => {
        console.log("Chuyển về Attendee Mode...");
        // Logic navigate về trang Attendee
    };

    const handleLogout = () => {
        dispatch(logoutUser());

        navigate("/login");
    };

    const menuItems = [
        {
            key: '1',
            label: 'Attendee Mode',
            icon: <ArrowLeftRight size={16} className="text-[#4ECDC4]" />,
            onClick: handleSwitchMode,
        },
        {
            type: 'divider',
        },
        {
            key: '2',
            label: 'Logout',
            icon: <LogOut size={16} />,
            danger: true,
            onClick: handleLogout,
        },
    ];

    const navItems = [
        {
            title: 'Workplace',
            icon: Briefcase,
            path: '/staff',
            end: true,
        },
        {
            title: 'My Schedule',
            icon: CalendarDays,
            path: '/staff/my-schedule',
        },
        {
            title: 'Resources',
            icon: FolderOpen,
            path: '/staff/resource',
        },
    ];


    return (
        <aside className="w-[280px] bg-[#2C3E50] text-white flex flex-col h-full shrink-0 z-50 shadow-2xl border-r border-white/10">
            <div className="flex flex-col h-full justify-between">

                <div className="bg-slate-500/50 backdrop-blur-md border border-white/30 px-2 py-1 mr-18 ml-4 mt-5 shrink-0 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.2)] mb-4 transition-transform hover:-translate-y-1 hover:shadow-[0_15px_40px_rgb(0,0,0,0.3)] duration-300">
                    <div className="scale-100 origin-left ml-1">
                        <Logo />
                    </div>
                </div>
                <hr className="border-white/10 mb-6" />

                <div className="p-5 flex flex-col gap-8 flex-1">
                    <nav className="space-y-2">
                        {navItems.map((item) => {
                            const Icon = item.icon
                            return (
                                <NavLink
                                    key={item.title}
                                    to={item.path}
                                    end={item.end}
                                    className={({ isActive }) =>
                                        `flex items-center gap-3 px-4 py-3 rounded-xl whitespace-nowrap border-2 transition-all duration-300 ease-in-out ${isActive
                                            ? "bg-white/20 text-white border-white/20 shadow-lg"
                                            : "text-white/70 hover:bg-white/10 hover:text-white border-transparent"
                                        } font-medium`
                                    }
                                >
                                    <Icon size={20} className="shrink-0" />
                                    {item.title}
                                </NavLink>
                            )
                        })}
                    </nav>
                </div>

                <div className="p-5 mt-auto">
                    <hr className="border-white/10 mb-6" />
                    <Dropdown
                        menu={{ items: menuItems }}
                        trigger={['click']}
                        placement="top"

                    >
                        <div className="rounded-2xl p-2 flex items-center gap-3 cursor-pointer hover:bg-white/10 transition-colors whitespace-nowrap">
                            <div className="size-10 rounded-full border-2 border-white/30 overflow-hidden shrink-0">
                                <img alt="Profile" className="w-full h-full object-cover" src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=100" />
                            </div>
                            <div className="overflow-hidden">
                                <p className="text-sm font-bold text-white truncate">Alex Johnson</p>
                                <div className="flex items-center gap-1.5">
                                    <div className="size-1.5 bg-[#4ECDC4] rounded-full animate-pulse"></div>
                                    <p className="text-[10px] text-white/60 uppercase tracking-wider font-bold">Online</p>
                                </div>
                            </div>
                        </div>
                    </Dropdown>

                </div>
            </div>
        </aside>
    )
}

export default MenuSidebar
