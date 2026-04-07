import { Link } from 'react-router-dom';
import Logo from './Logo'
import {
    Facebook,
    Globe,
    Mail,
    QrCode
} from 'lucide-react';
import { useTranslation } from "react-i18next";

const DISCOVER_LINKS = (t) => [
    { label: t("find_events"), href: "/events" },
    { label: t("find_jobs"), href: "/recruitments" },
    { label: t("my_tickets"), href: "/attendee/my-tickets" },
    { label: t("my_applications"), href: "/attendee/applications" },
];

const ORGANIZER_LINKS = (t) => [
    { label: t("post_event"), href: "/organizer/create-event" },
    { label: t("post_job"), href: "/organizer/create-job" },
    { label: t("manage_staff"), href: "/organizer/manage-staff" },
    { label: t("organizer_dashboard"), href: "/organizer/dashboard" },
];

const LEGAL_LINKS = (t) => [
    { label: t("privacy_policy"), href: "/privacy" },
    { label: t("terms_of_service"), href: "/terms" },
    { label: t("cookie_settings"), href: "/cookies" },
];

const STYLES = {
    heading: "font-sans font-extrabold text-sm uppercase tracking-widest",
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
    const { t } = useTranslation();
    return (
        <footer className="bg-white py-16 px-6 border-t border-[#d8ddde]">
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">

                {/* 1. Brand Info */}
                <div className="space-y-6">
                    <div className="w-fit">
                        <Logo />
                    </div>
                    <p className="text-gray-500 text-sm leading-relaxed max-w-xs">
                        {t("brand_description")}
                    </p>
                    <div className="flex gap-4">
                        <SocialLink href="#" icon={<Facebook size={20} />} />
                        <SocialLink href="#" icon={<Globe size={20} />} />
                        <SocialLink href="#" icon={<Mail size={20} />} />
                    </div>
                </div>

                {/* 2. Discover Links */}
                <FooterColumn title={t("discover")} links={DISCOVER_LINKS(t)} />

                {/* 3. Organizer Links */}
                <FooterColumn title={t("organizer")} links={ORGANIZER_LINKS(t)} />

                {/* 4. Mobile App */}
                <div className="space-y-6">
                    <h4 className={STYLES.heading}>{t("mobile_experience")}</h4>
                    <p className="text-gray-500 text-sm">{t("scan_to_download")}</p>

                    <div className="flex items-center gap-4 bg-cream p-4 rounded-2xl w-fit border border-[#d8ddde] hover:shadow-md transition-shadow cursor-pointer">
                        <div className="size-16 bg-white p-1 rounded-lg flex items-center justify-center border border-gray-100 shadow-sm">
                            <QrCode size={40} className="text-gray-800" />
                        </div>
                        <div>
                            <span className="block text-[10px] font-bold text-gray-400 uppercase">{t("available_on")}</span>
                            <span className="block font-bold ">{t("app_store_play")}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* COPYRIGHT */}
            <div className="max-w-7xl mx-auto pt-8 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4">
                <p className="text-xs text-gray-400">{t("all_rights_reserved")}</p>
                <div className="flex flex-wrap justify-center gap-6 text-xs text-gray-400 font-bold uppercase tracking-widest">
                    {LEGAL_LINKS(t).map((link) => (
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