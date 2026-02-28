import { useState } from "react";
import { NavLink } from "react-router-dom";
import { Menu, X } from "lucide-react"; // Import icon menu và dấu X

const NAV_ITEMS = [
    { label: "Discover", href: "/" },
    { label: "Events", href: "/events" },
    { label: "Recruitments", href: "/recruitments" },
];

const NavMenu = () => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = () => setIsOpen(!isOpen);

    const closeMenu = () => setIsOpen(false);

    return (
        <>
            <nav className="hidden md:flex items-center gap-8">
                {NAV_ITEMS.map((item) => (
                    <NavLink
                        key={item.label}
                        to={item.href}
                        className={({ isActive }) =>
                            `text-sm font-semibold transition-colors ${isActive ? "text-primary" : "text-gray-600 hover:text-primary"
                            }`
                        }
                    >
                        {item.label}
                    </NavLink>
                ))}
            </nav>

            <button
                className="md:hidden p-2 text-gray-600 hover:text-primary transition-colors cursor-pointer"
                onClick={toggleMenu}
                aria-label="Toggle menu"
            >
                {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            {isOpen && (
                <div className="absolute top-full left-0 w-full bg-white shadow-xl border-t border-gray-100 py-4 flex flex-col md:hidden z-50 animate-in slide-in-from-top-2 duration-200">
                    {NAV_ITEMS.map((item) => (
                        <NavLink
                            key={item.label}
                            to={item.href}
                            onClick={closeMenu}
                            className={({ isActive }) =>
                                `text-base font-semibold px-6 py-3 transition-colors ${isActive
                                    ? "text-primary bg-primary/5 border-l-4 border-primary"
                                    : "text-gray-600 hover:text-primary hover:bg-gray-50 border-l-4 border-transparent"
                                }`
                            }
                        >
                            {item.label}
                        </NavLink>
                    ))}
                </div>
            )}
        </>
    );
};

export default NavMenu;