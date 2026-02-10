import { NavLink } from "react-router-dom";

const NAV_ITEMS = [
    { label: "Discover", href: "/" },
    { label: "Events", href: "/events" },
    { label: "Recruitments", href: "/recruitments" },
];

const NavMenu = () => {
    return (
        <nav className="hidden md:flex items-center gap-8">
            {NAV_ITEMS.map((item) => (
                <NavLink
                    key={item.label}
                    to={item.href}
                    className="text-sm font-semibold text-gray-600 hover:text-primary transition-colors"
                >
                    {item.label}
                </NavLink>
            ))}
        </nav>
    );
};

export default NavMenu;