import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../../store/slices/auth.slice";
import {
  LayoutDashboard,
  CalendarDays,
  Users,
  MessageSquare,
  Briefcase,
  Settings,
  LogOut,
  Lock,
  BarChart3,
  UserCheck,
} from "lucide-react";

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
  ];
  for (const pattern of patterns) {
    const m = pathname.match(pattern);
    if (m) return m[1];
  }
  return null;
};

// Trích xuất recruitmentId từ các URL liên quan
const extractRecruitmentId = (pathname) => {
  const patterns = [
    /\/organizer\/recruitments\/([^/]+)/,
    /\/organizer\/applications\/([^/]+)/,
  ];
  for (const pattern of patterns) {
    const m = pathname.match(pattern);
    if (m) return m[1];
  }
  return null;
};

// ── NavItem ────────────────────────────────────────────────────────────────
const NavItem = ({ to, icon, label, isActive }) => (
  <Link
    to={to}
    className={`flex items-center gap-3 px-4 py-3 mb-1 rounded-xl font-medium transition-all duration-200
      ${isActive
        ? "bg-[#3b4758] text-white shadow-lg pointer-events-none"
        : "text-gray-400 hover:bg-gray-800 hover:text-white"
      }`}
  >
    <span className={isActive ? "text-gray-100" : "text-gray-400"}>{icon}</span>
    <span>{label}</span>
  </Link>
);

// ── DisabledNavItem (event tools khi chưa chọn event) ─────────────────────
const DisabledNavItem = ({ icon, label }) => (
  <div
    className="flex items-center gap-3 px-4 py-3 mb-1 rounded-xl font-medium text-gray-600 cursor-not-allowed select-none"
    title="Hãy vào một Event trước để dùng tính năng này"
  >
    <span className="text-gray-600">{icon}</span>
    <span>{label}</span>
    <Lock size={12} className="ml-auto text-gray-700 shrink-0" />
  </div>
);

// ── Sidebar ────────────────────────────────────────────────────────────────
const Sidebar = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const user = useSelector((state) => state.auth?.user);

  const eventId = extractEventId(location.pathname);
  const recruitmentId = extractRecruitmentId(location.pathname);

  const handleLogout = async () => {
    await dispatch(logoutUser());
    navigate("/login");
  };

  // Active states
  const isDashboardActive   = location.pathname.includes("/dashboard");
  const isMyEventsActive    = location.pathname.includes("/my-events");
  const isFeedbackActive    = location.pathname.includes("/feedback");
  const isRecruitmentActive = location.pathname.includes("/recruitment");
  const isStaffActive       = location.pathname.includes("/staff");

  // Event-specific links — chỉ tạo khi có eventId
  const eventDashboardLink  = eventId ? `/organizer/events/${eventId}` : null;
  const attendeesLink       = eventId ? `/organizer/events/${eventId}/attendees` : null;
  const feedbackLink        = eventId ? `/organizer/feedback/feedbacklist/${eventId}` : null;
  const recruitmentLink     = eventId ? `/organizer/recruitmentlist/${eventId}` : null;
  const staffLink           = eventId ? `/organizer/events/${eventId}/staff` : null;
  
  // Active states
  const isEventDashboardActive  = eventId ? location.pathname === `/organizer/events/${eventId}` : false;
  const isAttendeesActive       = location.pathname.includes("/attendees");

  // User display — backend trả snake_case: full_name, avatar_url, email
  const displayName = user?.full_name || user?.fullName || user?.name || user?.email || "Organizer";
  const avatarUrl = user?.avatar_url || user?.avatar
    ? (user.avatar_url || user.avatar)
    : `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=3b4758&color=fff`;

  return (
    <aside className="w-64 h-screen bg-[#1e293b] flex-col text-gray-300 fixed left-0 top-0 z-50 font-sans shadow-xl border-r border-gray-800 hidden lg:flex">

      {/* Logo */}
      <div className="p-6 flex items-center gap-3">
        <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center text-white font-bold text-xs shadow-md">
          EH
        </div>
        <div>
          <h1 className="text-white font-bold text-xl tracking-tight">
            Event<span className="text-blue-400">Hub</span>
          </h1>
          <p className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold">
            Organizer
          </p>
        </div>
      </div>

      {/* User Profile */}
      <div className="mx-4 mb-6 p-3 bg-[#2d3a4f] rounded-xl flex items-center gap-3 border border-gray-700 shadow-sm">
        <img
          src={avatarUrl}
          alt={displayName}
          className="w-10 h-10 rounded-full object-cover border border-gray-500 shrink-0"
        />
        <div className="overflow-hidden">
          <h3 className="text-white text-sm font-bold truncate">{displayName}</h3>
          <p className="text-[11px] text-gray-400 truncate">Organizer</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 overflow-y-auto scrollbar-hide space-y-1">

        {/* ── Overview ── */}
        <p className="px-4 text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2 mt-1">
          Overview
        </p>
        <NavItem
          to="/organizer/dashboard"
          icon={<LayoutDashboard size={20} />}
          label="Dashboard"
          isActive={isDashboardActive}
        />
        <NavItem
          to="/organizer/my-events"
          icon={<CalendarDays size={20} />}
          label="My Events"
          isActive={isMyEventsActive}
        />

        {/* ── Event Tools ── */}
        <p className="px-4 text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2 mt-5">
          Event Tools
          {!eventId && (
            <span className="ml-1 normal-case text-gray-700 font-normal text-[9px]">
              — chọn event trước
            </span>
          )}
        </p>

        {eventDashboardLink ? (
          <NavItem to={eventDashboardLink} icon={<BarChart3 size={20} />} label="Event Dashboard" isActive={isEventDashboardActive} />
        ) : (
          <DisabledNavItem icon={<BarChart3 size={20} />} label="Event Dashboard" />
        )}

        {attendeesLink ? (
          <NavItem to={attendeesLink} icon={<UserCheck size={20} />} label="Attendees" isActive={isAttendeesActive} />
        ) : (
          <DisabledNavItem icon={<UserCheck size={20} />} label="Attendees" />
        )}

        {feedbackLink ? (
          <NavItem to={feedbackLink} icon={<MessageSquare size={20} />} label="Feedback" isActive={isFeedbackActive} />
        ) : (
          <DisabledNavItem icon={<MessageSquare size={20} />} label="Feedback" />
        )}

        {recruitmentLink ? (
          <NavItem to={recruitmentLink} icon={<Briefcase size={20} />} label="Recruitment" isActive={isRecruitmentActive} />
        ) : (
          <DisabledNavItem icon={<Briefcase size={20} />} label="Recruitment" />
        )}

        {staffLink ? (
          <NavItem to={staffLink} icon={<Users size={20} />} label="Staff Management" isActive={isStaffActive} />
        ) : (
          <DisabledNavItem icon={<Users size={20} />} label="Staff Management" />
        )}
      </nav>

      {/* Bottom */}
      <div className="p-4 mt-auto border-t border-gray-700/50 bg-[#1a2333]">
        <div className="space-y-1">
          <Link
            to="/profile"
            className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
          >
            <Settings size={18} />
            <span>Settings</span>
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors cursor-pointer"
          >
            <LogOut size={18} />
            <span>Log Out</span>
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
