import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  CalendarDays,
  Users,
  MessageSquare,
  Briefcase,
  Lock,
  BarChart3,
  BarChart2,
  UserCheck,
  ClipboardList,
  Menu,
  X,
} from 'lucide-react';
import Logo from '../common/Logo';
import OrganizerDropdown from '../domain/organizer/OrganizerDropdown';

const extractEventId = (pathname) => {
  const patterns = [
    /\/organizer\/events\/([^/]+)/,
    /\/organizer\/feedback\/feedbacklist\/([^/]+)/,
    /\/organizer\/feedback\/createform\/([^/]+)/,
    /\/organizer\/feedback\/analytics\/([^/]+)/,
    /\/organizer\/recruitmentlist\/([^/]+)/,
    /\/organizer\/recruitmentcreate\/([^/]+)/,
    /\/organizer\/recruitment-post\/([^/]+)/,
    /\/organizer\/edit-event\/([^/]+)/,
    /\/organizer\/applications\/event\/([^/]+)/,
  ];
  for (const pattern of patterns) {
    const m = pathname.match(pattern);
    if (m) {
      sessionStorage.setItem("sidebar_eventId", m[1]);
      return m[1];
    }
  }
  const subPagePatterns = [
    /\/organizer\/applications\/([^/]+)/,
    /\/organizer\/recruitments\/([^/]+)/,
    /\/organizer\/feedback\/([^/]+)/,
  ];
  const isSubPage = subPagePatterns.some((p) => p.test(pathname));
  if (isSubPage) {
    return sessionStorage.getItem("sidebar_eventId") || null;
  }
  sessionStorage.removeItem("sidebar_eventId");
  return null;
};

// ── DisabledNavItem (event tools when no event is selected) ─────────────
const DisabledNavItem = ({ icon: Icon, label }) => (
  <div
    className="flex items-center gap-3 px-4 py-3 rounded-xl whitespace-nowrap border-2 border-transparent text-white/30 cursor-not-allowed select-none font-medium"
    title="Hãy vào một Event trước để dùng tính năng này"
  >
    <Icon size={20} className="shrink-0" />
    <span>{label}</span>
    <Lock size={12} className="ml-auto shrink-0" />
  </div>
);

// ── ActiveNavLink style (same as admin/staff) ──────────────────────────
const navLinkClass = ({ isActive }) =>
  `flex items-center gap-3 px-4 py-3 rounded-xl whitespace-nowrap border-2 transition-all duration-300 ease-in-out ${
    isActive
      ? "bg-white/20 text-white border-white/20 shadow-lg"
      : "text-white/70 hover:bg-white/10 hover:text-white border-transparent"
  } font-medium`;

// ── Sidebar ────────────────────────────────────────────────────────────
const Sidebar = () => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => setIsOpen(!isOpen);

  const eventId = extractEventId(location.pathname);

  // Active states
  const isFeedbackActive = location.pathname.includes("/feedback");
  const isAnalyticsActive = location.pathname.includes("/feedback/analytics");
  const isRecruitmentActive = location.pathname.includes("/recruitment");
  const isApplicationsPageActive = location.pathname.includes("/applications");
  const isAttendeesActive = location.pathname.includes("/attendees");
  const isStaffActive = location.pathname.includes("/staff");

  // Event-specific links
  const eventDashboardLink = eventId ? `/organizer/events/${eventId}` : null;
  const attendeesLink = eventId ? `/organizer/events/${eventId}/attendees` : null;
  const feedbackLink = eventId ? `/organizer/feedback/feedbacklist/${eventId}` : null;
  const analyticsLink = eventId ? `/organizer/feedback/analytics/${eventId}` : null;
  const recruitmentLink = eventId ? `/organizer/recruitmentlist/${eventId}` : null;
  const applicationsLink = eventId ? `/organizer/applications/event/${eventId}` : null;
  const staffLink = eventId ? `/organizer/events/${eventId}/staff` : null;

  const isEventDashboardActive = eventId
    ? location.pathname === `/organizer/events/${eventId}`
    : false;

  // Overview nav items
  const overviewItems = [
    { title: "Dashboard", icon: LayoutDashboard, path: "/organizer/dashboard", end: true },
    { title: "My Events", icon: CalendarDays, path: "/organizer/my-events", end: true },
  ];

  // Event tool items
  const eventToolItems = [
    { title: "Event Dashboard", icon: BarChart3, link: eventDashboardLink, isActive: isEventDashboardActive },
    { title: "Attendees", icon: UserCheck, link: attendeesLink, isActive: isAttendeesActive },
    { title: "Feedback", icon: MessageSquare, link: feedbackLink, isActive: isFeedbackActive && !isAnalyticsActive },
    { title: "Feedback Analytics", icon: BarChart2, link: analyticsLink, isActive: isAnalyticsActive },
    { title: "Recruitment", icon: Briefcase, link: recruitmentLink, isActive: isRecruitmentActive },
    { title: "Application List", icon: ClipboardList, link: applicationsLink, isActive: isApplicationsPageActive },
    { title: "Staff Management", icon: Users, link: staffLink, isActive: isStaffActive },
  ];

  return (
    <>
      {/* Mobile hamburger button */}
      {!isOpen && (
        <button
          onClick={toggleSidebar}
          className="lg:hidden fixed top-4 left-4 z-[60] p-2 bg-[#2C3E50] text-white rounded-xl shadow-lg"
        >
          <Menu size={24} />
        </button>
      )}

      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[55] lg:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:static inset-y-0 left-0 z-[60]
          w-[280px] bg-[#2C3E50] text-white flex flex-col h-full shrink-0
          shadow-2xl border-r border-white/10 transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
      >
        <div className="flex flex-col h-full justify-between relative">
          {/* Mobile close button */}
          <button
            onClick={toggleSidebar}
            className="lg:hidden absolute top-4 right-4 text-white/50 hover:text-white"
          >
            <X size={24} />
          </button>

          {/* Logo */}
          <div className="bg-slate-500/50 backdrop-blur-md border border-white/30 px-2 py-1 mr-18 ml-4 mt-5 shrink-0 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.2)] mb-4 transition-transform hover:-translate-y-1 hover:shadow-[0_15px_40px_rgb(0,0,0,0.3)] duration-300">
            <div className="scale-100 origin-left ml-1">
              <Logo />
            </div>
          </div>
          <hr className="border-white/10 mb-6" />

          {/* Navigation */}
          <div className="p-5 flex flex-col gap-4 flex-1 overflow-y-auto">
            {/* Overview */}
            <nav className="space-y-2">
              <p className="px-4 text-[10px] font-bold text-white/40 uppercase tracking-widest mb-2">
                Overview
              </p>
              {overviewItems.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.title}
                    to={item.path}
                    end={item.end}
                    onClick={() => setIsOpen(false)}
                    className={navLinkClass}
                  >
                    <Icon size={20} className="shrink-0" />
                    {item.title}
                  </NavLink>
                );
              })}
            </nav>

            {/* Event Tools */}
            <nav className="space-y-2 mt-2">
              <p className="px-4 text-[10px] font-bold text-white/40 uppercase tracking-widest mb-2">
                Event Tools
                {!eventId && (
                  <span className="ml-1 normal-case text-white/20 font-normal text-[9px]">
                    — chọn event trước
                  </span>
                )}
              </p>
              {eventToolItems.map((item) => {
                const Icon = item.icon;
                if (!item.link) {
                  return <DisabledNavItem key={item.title} icon={Icon} label={item.title} />;
                }
                return (
                  <NavLink
                    key={item.title}
                    to={item.link}
                    onClick={() => setIsOpen(false)}
                    className={({ isActive: routerActive }) => {
                      // Use our custom isActive logic for event tools
                      const active = item.isActive || routerActive;
                      return `flex items-center gap-3 px-4 py-3 rounded-xl whitespace-nowrap border-2 transition-all duration-300 ease-in-out ${
                        active
                          ? "bg-white/20 text-white border-white/20 shadow-lg"
                          : "text-white/70 hover:bg-white/10 hover:text-white border-transparent"
                      } font-medium`;
                    }}
                  >
                    <Icon size={20} className="shrink-0" />
                    {item.title}
                  </NavLink>
                );
              })}
            </nav>
          </div>

          {/* User dropdown */}
          <OrganizerDropdown setIsOpen={setIsOpen} />
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
