import React from 'react';
import { Eye, Search, Download, ChevronLeft, ChevronRight, Filter } from 'lucide-react';
import Sidebar from '../components/layout/Sidebar'; // Đảm bảo import đúng Sidebar vừa tạo

const FeedbackList = () => {
  // DỮ LIỆU GIẢ (Mock Data) - Giống hệt trong ảnh bạn gửi
  const feedbacks = [
    { id: 1, date: "Oct 12, 14:30", name: "Sarah Jenkins", email: "sarah.j@example.com", avatar: "https://i.pravatar.cc/150?img=5", rating: 5, ticket: "VIP ACCESS" },
    { id: 2, date: "Oct 11, 09:15", name: "Marcus Lee", email: "marcus.lee@fpt.com", avatar: "https://i.pravatar.cc/150?img=11", rating: 4, ticket: "REGULAR" },
    { id: 3, date: "Oct 10, 18:20", name: "Emma Watson", email: "emma.w@gmail.com", avatar: "https://i.pravatar.cc/150?img=9", rating: 4, ticket: "REGULAR" },
    { id: 4, date: "Oct 09, 10:05", name: "David Beckham", email: "david.b@outlook.com", avatar: null, rating: 5, ticket: "VIP ACCESS" },
    { id: 5, date: "Oct 08, 16:45", name: "Alex Nguyen", email: "alex.n@vng.com.vn", avatar: "https://i.pravatar.cc/150?img=12", rating: 4, ticket: "REGULAR" },
    { id: 6, date: "Oct 07, 14:00", name: "John Doe", email: "john.doe@gmail.com", avatar: null, rating: 5, ticket: "REGULAR" },
    { id: 7, date: "Oct 06, 09:30", name: "Alice Smith", email: "alice.s@yahoo.com", avatar: "https://i.pravatar.cc/150?img=1", rating: 3, ticket: "VIP ACCESS" },
  ];

  return (
    <div className="flex min-h-screen bg-[#f8f7f2] font-sans">
      {/* 1. Sidebar bên trái */}
      <Sidebar />

      {/* 2. Nội dung chính bên phải */}
      <div className="flex-1 ml-64 p-10"> {/* ml-64 để tránh Sidebar đè lên */}
        
        {/* Header Title */}
        <div className="flex justify-between items-end mb-8">
          <div>
            <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight mb-2">Attendee Feedback</h1>
            <p className="text-gray-500 font-medium italic">Showing all responses for <span className="text-gray-800 not-italic font-bold">BridgeFest 2025</span></p>
          </div>

{/* Bọc 2 nút vào một div có flex và gap */}
<div className="flex items-center gap-3 justify-end">
  <Link 
    to="/organizer/feedback/createform" 
    className="bg-[#8c9db3] hover:bg-[#7a8ca3] text-white px-5 py-2.5 rounded-lg flex items-center gap-2 text-sm font-bold shadow-md transition-all"
  >
    <Plus size={18} strokeWidth={2.5} /> Create Feedback Form
  </Link>
  
  <Link 
    to="/organizer/feedback/createform" 
    className="bg-[#8c9db3] hover:bg-[#7a8ca3] text-white px-5 py-2.5 rounded-lg flex items-center gap-2 text-sm font-bold shadow-md transition-all"
  >
    {/* Gợi ý: Nếu là nút Update, bạn có thể đổi icon <Plus> thành <Edit> hoặc <Pen> cho hợp lý nhé */}
    <Plus size={18} strokeWidth={2.5} /> Update Feedback Form
  </Link>
</div>
        </div>

        {/* Filter Bar (Thanh tìm kiếm) */}
        <div className="bg-white p-2 rounded-2xl shadow-sm mb-6 flex items-center justify-between border border-gray-100">
          <div className="flex items-center px-4 py-2 flex-1 gap-3">
            <Search className="text-gray-300" size={20} />
            <input 
              type="text" 
              placeholder="Search by name, email or content..." 
              className="w-full outline-none text-gray-700 placeholder-gray-400 text-sm font-medium h-full"
            />
          </div>
          <div className="flex gap-2 pr-2">
            {/* Nút lọc giả */}
            <div className="px-5 py-2.5 bg-gray-50 rounded-xl text-sm font-bold text-gray-700 cursor-pointer hover:bg-gray-100 flex items-center gap-2">
              All Ratings <span className="text-[10px] ml-1 opacity-50">▼</span>
            </div>
            <div className="px-5 py-2.5 bg-white rounded-xl text-sm font-bold text-gray-700 cursor-pointer hover:bg-gray-50 flex items-center gap-2 border border-transparent hover:border-gray-200">
              All Ticket <span className="text-[10px] ml-1 opacity-50">▼</span>
            </div>
          </div>
        </div>

        {/* Bảng Dữ liệu (Table) */}
        <div className="bg-white rounded-2xl shadow-[0_4px_20px_-10px_rgba(0,0,0,0.05)] overflow-hidden min-h-[500px] flex flex-col justify-between">
          <table className="w-full">
            <thead className="bg-white">
              <tr className="border-b border-gray-100">
                <th className="px-8 py-6 text-[11px] font-bold text-gray-400 uppercase tracking-widest text-left">Date & Time</th>
                <th className="px-6 py-6 text-[11px] font-bold text-gray-400 uppercase tracking-widest text-left">Attendee</th>
                <th className="px-6 py-6 text-[11px] font-bold text-gray-400 uppercase tracking-widest text-left">Rating</th>
                <th className="px-6 py-6 text-[11px] font-bold text-gray-400 uppercase tracking-widest text-left">Ticket</th>
                <th className="px-6 py-6 text-[11px] font-bold text-gray-400 uppercase tracking-widest text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {feedbacks.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50/80 transition-colors group cursor-pointer">
                  {/* Cột 1: Ngày giờ */}
                  <td className="px-8 py-5 text-sm text-gray-500 font-semibold whitespace-nowrap">
                    {item.date}
                  </td>
                  
                  {/* Cột 2: Thông tin người dùng */}
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-4">
                      <img 
                        src={item.avatar || `https://ui-avatars.com/api/?name=${item.name}&background=random`} 
                        className="w-10 h-10 rounded-full object-cover border border-gray-100 shadow-sm" 
                        alt="" 
                      />
                      <div>
                        <p className="text-sm font-bold text-gray-900">{item.name}</p>
                        <p className="text-xs text-gray-400 font-medium">{item.email}</p>
                      </div>
                    </div>
                  </td>

                  {/* Cột 3: Đánh giá sao */}
                  <td className="px-6 py-5">
                    <div className="flex gap-1 text-sm">
                      {[...Array(5)].map((_, i) => (
                        <span key={i} className={`${i < item.rating ? 'text-yellow-400' : 'text-gray-200'} text-base`}>
                          ★
                        </span>
                      ))}
                    </div>
                  </td>

                  {/* Cột 4: Loại vé */}
                  <td className="px-6 py-5">
                    <span className={`text-[11px] font-bold uppercase italic tracking-wider ${
                      item.ticket === 'VIP ACCESS' ? 'text-[#8c9db3]' : 'text-gray-300'
                    }`}>
                      {item.ticket}
                    </span>
                  </td>

                  {/* Cột 5: Hành động */}
                  <td className="px-6 py-5 text-center">
                  <Link to={`/organizer/feedback/${item.id}`} className="inline-block text-gray-300 hover:text-[#8c9db3] hover:bg-[#8c9db3]/10 p-2 rounded-full transition-all">
                      <Eye size={20} />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination Footer */}
          <div className="px-8 py-6 border-t border-gray-50 flex justify-between items-center bg-white">
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
              Showing 7 of 256 Registrations
            </p>
            <div className="flex items-center gap-2">
               <button className="w-8 h-8 flex items-center justify-center rounded-full text-gray-300 hover:bg-gray-100 hover:text-gray-600 transition-colors"><ChevronLeft size={16}/></button>
               <button className="w-8 h-8 flex items-center justify-center rounded-full bg-[#8c9db3] text-white text-xs font-bold shadow-md shadow-gray-200">1</button>
               <button className="w-8 h-8 flex items-center justify-center rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-600 text-xs font-bold transition-colors">2</button>
               <button className="w-8 h-8 flex items-center justify-center rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-600 text-xs font-bold transition-colors">3</button>
               <button className="w-8 h-8 flex items-center justify-center rounded-full text-gray-300 hover:bg-gray-100 hover:text-gray-600 transition-colors"><ChevronRight size={16}/></button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default FeedbackList;