import React from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import { 
  LayoutDashboard, 
  MessageSquare, 
  Users, 
  FileText, 
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
      className={`
        flex items-center gap-3 px-4 py-3 mb-2 rounded-xl font-semibold transition-all duration-200
        ${isActive 
          ? 'bg-[#8c9db3] text-white shadow-md pointer-events-none' // Trạng thái Active: Nền xanh xám, chữ trắng (khóa click để tránh load lại chính nó)
          : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900'    // Trạng thái Bình thường
        }
      `}
    >
      {icon}
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
  const isRecruitmentActive = location.pathname.includes('/recruitment');
  const isAppActive = location.pathname.includes('/applications');
  const isFeedbackActive = location.pathname.includes('/feedback');

  // Xử lý link Feedback an toàn: Nếu đang ở trong 1 sự kiện có ID thì dùng ID đó, nếu không thì truyền tạm ID = 1 (hoặc link tổng)
  const feedbackLink = eventId ? `/organizer/feedback/feedbacklist/${eventId}` : `/organizer/feedbacklist/1`;

  return (
    // Dùng fixed để Sidebar ghim chặt bên trái, h-screen để cao trọn màn hình
    <aside className="w-64 h-screen bg-[#f8f7f2] border-r border-gray-200 fixed left-0 top-0 flex flex-col shadow-sm z-50">
      
      {/* 1. Phần Logo */}
      <div className="p-6 flex items-center gap-3">
        <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">
          Event<span className="text-[#8c9db3]">Hub</span>
        </h2>
      </div>

      {/* 2. Phần Menu chính (tự cuộn nếu quá dài) */}
      <nav className="flex-1 px-4 py-4 overflow-y-auto">
        <div className="space-y-1">
          <p className="px-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3 mt-2">
            Main Menu
          </p>

          <NavItem 
            to="/organizer/dashboard" 
            icon={<LayoutDashboard size={20} />} 
            label="Dashboard" 
            isActive={isDashboardActive} 
          />
          
          <NavItem 
            to="/organizer/recruitmentlist" 
            icon={<Users size={20} />} 
            label="Staff Recruitment" 
            isActive={isRecruitmentActive} 
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
        </div>
      </nav>

      {/* 3. Phần Footer của Sidebar (Cài đặt / Đăng xuất) */}
      <div className="p-4 border-t border-gray-100 bg-gray-50/50">
        <Link 
          to="/profile" 
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-500 hover:bg-[#f8f7f2] hover:text-gray-900 hover:shadow-sm transition-all font-semibold mb-1"
        >
          <Settings size={20} />
          <span>Settings</span>
        </Link>
        <button 
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-50 hover:text-red-600 transition-all font-semibold"
          onClick={() => alert("Chức năng đăng xuất xử lý ở App.jsx")}
        >
          <LogOut size={20} />
          <span>Log out</span>
        </button>
      </div>

    </aside>
  );
};

export default Sidebar;