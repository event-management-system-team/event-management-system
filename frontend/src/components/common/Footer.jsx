import { Link } from 'react-router-dom';
import Logo from './Logo'
import {
    Facebook,
    Globe,
    Mail,
    QrCode
} from 'lucide-react';

const DISCOVER_LINKS = [
    { label: "Find Events", href: "/events" },
    { label: "Find Jobs", href: "/recruitments" },
    { label: "My Tickets", href: "/attendee/my-tickets" },
    { label: "My Applications", href: "/attendee/my-applications" },
];

const ORGANIZER_LINKS = [
    { label: "Post an Event", href: "/organizer/create-event" },
    { label: "Post a Job", href: "/organizer/create-job" },
    { label: "Manage Staff", href: "/organizer/manage-staff" },
    { label: "Organizer Dashboard", href: "/organizer/dashboard" },
];

const LEGAL_LINKS = [
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Service", href: "/terms" },
    { label: "Cookie Settings", href: "/cookies" },
];

const STYLES = {
    heading: "font-extrabold text-sm uppercase tracking-widest",
    list: "space-y-2 text-sm font-medium text-gray-500",
    linkHover: "hover:text-primary transition-colors"
};

const SocialLink = ({ href, icon }) => (
    <a
        href={href}
        className="size-10 bg-[#F1F0E8] rounded-full flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-all transform hover:-translate-y-1"
    >
        {icon}
    </a>
);

const FooterColumn = ({ title, links }) => (
    <div className="space-y-6">

        <h4 className={STYLES.heading}>{title}</h4>

        <ul className={STYLES.list}>
            {links.map((link) => (
                <li key={link.label}>
                    <Link className={STYLES.linkHover} to={link.href}>
                        {link.label}
                    </Link>
                </li>
            ))}
        </ul>
    </div>
);
const Footer = () => {
    return (
        <footer className="bg-white py-16 px-6 border-t border-[#d8ddde]">
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">

                {/* 1. Brand Info */}
                <div className="space-y-6">
                    <div className="w-fit">
                        <Logo />
                    </div>
                    <p className="text-gray-500 text-sm leading-relaxed max-w-xs">
                        Connecting event lovers with unforgettable experiences and providing professional opportunities for aspiring staff members.
                    </p>
                    <div className="flex gap-4">
                        <SocialLink href="#" icon={<Facebook size={20} />} />
                        <SocialLink href="#" icon={<Globe size={20} />} />
                        <SocialLink href="#" icon={<Mail size={20} />} />
                    </div>
                </div>

                {/* 2. Discover Links */}
                <FooterColumn title="Discover" links={DISCOVER_LINKS} />

                {/* 3. Organizer Links */}
                <FooterColumn title='Organizer' links={ORGANIZER_LINKS} />

                {/* 4. Mobile App */}
                <div className="space-y-6">
                    <h4 className={STYLES.heading}>Mobile Experience</h4>
                    <p className="text-gray-500 text-sm">Scan to download our app:</p>

                    <div className="flex items-center gap-4 bg-cream p-4 rounded-2xl w-fit border border-[#d8ddde] hover:shadow-md transition-shadow cursor-pointer">
                        <div className="size-16 bg-white p-1 rounded-lg flex items-center justify-center border border-gray-100 shadow-sm">
                            <QrCode size={40} className="text-gray-800" />
                        </div>
                        <div>
                            <span className="block text-[10px] font-bold text-gray-400 uppercase">Available on</span>
                            <span className="block font-bold ">App Store & Play</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* COPYRIGHT */}
            <div className="max-w-7xl mx-auto pt-8 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4">
                <p className="text-xs text-gray-400">© 2026 EventHub Platform. All rights reserved.</p>
                <div className="flex flex-wrap justify-center gap-6 text-xs text-gray-400 font-bold uppercase tracking-widest">
                    {LEGAL_LINKS.map((link) => (
                        <Link key={link.label} className={STYLES.linkHover} to={link.href}>
                            {link.label}
                        </Link>
                    ))}
                </div>
            </div>
        </footer>
    )
}

export default Footer