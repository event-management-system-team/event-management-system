
import React from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import { 
  LayoutDashboard, 
  CalendarDays,
  Users, 
  FileText, 
  MessageSquare, 
  HelpCircle,
  Settings, 
  LogOut 
} from 'lucide-react';

// ==========================================
// COMPONENT PHỤ: Nút bấm trên Menu
// ==========================================
const NavItem = ({ to, icon, label, isActive }) => {
  return (
    <Link 
      to={to} 
      className={`flex items-center gap-3 px-4 py-3 mb-1 rounded-xl font-medium transition-all duration-200
        ${isActive 
          ? 'bg-[#3b4758] text-white shadow-lg pointer-events-none' // Trạng thái Active: Nền xám xanh, chữ trắng, khóa click
          : 'text-gray-400 hover:bg-gray-800 hover:text-white'      // Trạng thái Bình thường
        }`}
    >
      <span className={isActive ? 'text-gray-100' : 'text-gray-400'}>{icon}</span>
      <span>{label}</span>
    </Link>
  );
};

// ==========================================
// COMPONENT CHÍNH: Sidebar
// ==========================================
const Sidebar = () => {
  const location = useLocation(); // Lấy đường dẫn hiện tại để biết đang ở trang nào
  const { eventId } = useParams(); // Lấy ID sự kiện từ thanh URL (nếu có)

  // Hàm kiểm tra trang đang đứng để bật trạng thái Active
  const isDashboardActive = location.pathname.includes('/dashboard');
  const isMyEventsActive = location.pathname.includes('/my-events');
  // Hỗ trợ cả 2 link '/staff' hoặc '/recruitment'
  const isStaffActive = location.pathname.includes('/staff') || location.pathname.includes('/recruitment'); 
  const isAppActive = location.pathname.includes('/applications');
  const isFeedbackActive = location.pathname.includes('/feedback');

  // Xử lý link Feedback an toàn: Nếu đang ở trong 1 sự kiện có ID thì dùng ID đó, nếu không thì truyền tạm ID = 1
  const feedbackLink = eventId ? `/organizer/feedback/feedbacklist/${eventId}` : `/organizer/feedbacklist/1`;

  return (
    <aside className="w-64 h-screen bg-[#1e293b] flex flex-col text-gray-300 fixed left-0 top-0 z-50 font-sans shadow-xl border-r border-gray-800">
      
      {/* 1. Phần Logo */}
      <div className="p-6 flex items-center gap-3">
        <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center text-white font-bold text-xs shadow-md">
          EH
        </div>
        <div>
          <h1 className="text-white font-bold text-xl tracking-tight">Event<span className="text-blue-400">Hub</span></h1>
          <p className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold">Organizer</p>
        </div>
      </div>

      {/* 2. User Profile (FPT Software) */}
      <div className="mx-4 mb-6 p-3 bg-[#2d3a4f] rounded-xl flex items-center gap-3 border border-gray-700 shadow-sm">
        <img
          src="https://ui-avatars.com/api/?name=FPT+Software&background=random"
          alt="User"
          className="w-10 h-10 rounded-full object-cover border border-gray-500"
        />
        <div className="overflow-hidden">
          <h3 className="text-white text-sm font-bold truncate">FPT Software</h3>
          <p className="text-[11px] text-gray-400 truncate">Senior Organizer</p>
        </div>
      </div>

      {/* 3. Phần Menu chính (tự cuộn nếu quá dài) */}
      <nav className="flex-1 px-4 overflow-y-auto scrollbar-hide space-y-1">
        <p className="px-4 text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-3 mt-1">
          Main Menu
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
        <NavItem 
          to="/organizer/staff" 
          icon={<Users size={20} />} 
          label="Staff Management" 
          isActive={isStaffActive} 
        />
        <NavItem 
          to="/organizer/applications" 
          icon={<FileText size={20} />} 
          label="Applications" 
          isActive={isAppActive} 
        />
        <NavItem 
          to={feedbackLink} 
          icon={<MessageSquare size={20} />} 
          label="Feedback & Rating" 
          isActive={isFeedbackActive} 
        />
      </nav>

      
      <div className="p-4 mt-auto border-t border-gray-700/50 bg-[#1a2333]">
        <div className="space-y-1">
          <Link to="/help" className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm text-gray-400 hover:text-white hover:bg-gray-800 transition-colors">
            <HelpCircle size={18} />
            <span>Help Center</span>
          </Link>
          
          <Link to="/profile" className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm text-gray-400 hover:text-white hover:bg-gray-800 transition-colors">
            <Settings size={18} />
            <span>Settings</span>
          </Link>
          
          <button 
            onClick={() => alert("Chức năng đăng xuất xử lý ở App.jsx")}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors"
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
