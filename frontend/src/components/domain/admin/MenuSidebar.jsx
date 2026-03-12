import { BarChart3, CalendarCog, LayoutDashboard, Menu, UserCircle, X } from 'lucide-react'
import { NavLink } from 'react-router';
import { useState } from 'react';
import Logo from '../../common/Logo';
import AdminDropdown from './AdminDropdown';

const MenuSidebar = () => {

    const [isOpen, setIsOpen] = useState(false);

    const toggleSidebar = () => setIsOpen(!isOpen);

    const navItems = [
        { title: 'Dashboard', icon: LayoutDashboard, path: '/admin', end: true },
        { title: 'Accounts', icon: UserCircle, path: '/admin/accounts', end: true },
        { title: 'Events', icon: CalendarCog, path: '/admin/events', end: true },
        { title: 'Event Analytics', icon: BarChart3, path: '/admin/analytics', end: true },
    ];

    return (
        <>
            {!isOpen && (
                <button
                    onClick={toggleSidebar}
                    className="lg:hidden fixed top-4 left-4 z-[60] p-2 bg-[#2C3E50] text-white rounded-xl shadow-lg"
                >
                    <Menu size={24} />
                </button>
            )}

            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[55] lg:hidden"
                    onClick={toggleSidebar}
                />
            )}

            <aside className={`
                fixed lg:static inset-y-0 left-0 z-[60]
                w-[280px] bg-[#2C3E50] text-white flex flex-col h-full shrink-0 
                shadow-2xl border-r border-white/10 transition-transform duration-300 ease-in-out
                ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
            `}>
                <div className="flex flex-col h-full justify-between relative">

                    <button
                        onClick={toggleSidebar}
                        className="lg:hidden absolute top-4 right-4 text-white/50 hover:text-white"
                    >
                        <X size={24} />
                    </button>

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
                                        onClick={() => setIsOpen(false)}
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

                    <AdminDropdown
                        setIsOpen={setIsOpen} />
                </div>
            </aside>
        </>
    )
}

export default MenuSidebar;