import React from 'react';
import { Eye, Search, Download, ChevronLeft, ChevronRight, Filter,Plus } from 'lucide-react';
import Sidebar from '../../components/layout/Sidebar'; // Đảm bảo import đúng Sidebar vừa tạo
//import hook
import{useFeedbacks} from "../../hooks/feedback/useFeedback";
import { Link,useParams } from 'react-router-dom';

const FeedbackList = () => {
  const eventId = useParams().eventId; // Giả sử bạn truyền eventId qua URL như /organizer/feedbacklist/:eventId
  const { data: feedbacks, isLoading, isError } = useFeedbacks(eventId); // Sử dụng hook để lấy feedbacks

  if (isLoading) {
    return <div className="flex min-h-screen bg-[#f8f7f2] font-sans">Loading...</div>;
  }

  if (isError) {
    return <div className="flex min-h-screen bg-[#f8f7f2] font-sans">Error loading feedbacks</div>;
  }
// nếu api mượt mà không lỗi thì sẽ trả về giao diện chính, còn nếu lỗi sẽ trả về thông báo lỗi, nếu đang load sẽ trả về loading
const eventName= feedbacks?.eventName || " Unknown Event"; // Giả sử API trả về eventName, nếu không có thì dùng "Unknown Event" làm mặc định
const feedbackItems = feedbacks?.feedbacks || []; // Giả sử API trả về mảng feedbacks trong trường items, nếu không có thì dùng mảng rỗng làm mặc định
  return (
    <div className="flex min-h-screen bg-[#f8f7f2] font-sans">
      {/* 1. Sidebar bên trái */}
      <Sidebar />

      {/* 2. Nội dung chính bên phải */}
      <div className="flex-1 ml-64 p-10"> {/* ml-64 để tránh Sidebar đè lên */}
        
        {/* --- HEADER ĐỘNG --- */}
        <div className="flex justify-between items-end mb-8">
          <div>
            <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight mb-2">Attendee Feedback</h1>
            {/* Hiển thị Tên sự kiện lấy từ Database */}
            <p className="text-gray-500 font-medium italic">
              Showing all responses for <span className="text-gray-800 not-italic font-bold">{eventName}</span>
            </p>
          </div>
          
          <div className="flex gap-3">
            <button className="bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 px-5 py-2.5 rounded-lg flex items-center gap-2 text-sm font-bold shadow-sm transition-all">
               <Download size={18} /> Export Data
            </button>
            {/* Nút tạo form, truyền luôn eventId sang trang Builder để biết đang tạo form cho sự kiện nào */}
            <Link 
              to={`/admin/events/${eventId}/feedback/builder`} 
              className="bg-[#8c9db3] hover:bg-[#7a8ca3] text-white px-5 py-2.5 rounded-lg flex items-center gap-2 text-sm font-bold shadow-md transition-all"
            >
               <Plus size={18} strokeWidth={2.5} /> Create Form
            </Link>
          </div>
        </div>

        {/* --- BỘ LỌC TÌM KIẾM --- */}
        <div className="bg-white p-2 rounded-2xl shadow-sm mb-6 flex items-center justify-between border border-gray-100">
          <div className="flex items-center px-4 py-2 flex-1 gap-3">
            <Search className="text-gray-300" size={20} />
            <input 
              type="text" 
              placeholder="Search by name, email or content..." 
              className="w-full outline-none text-gray-700 placeholder-gray-400 text-sm font-medium h-full"
            />
          </div>
        </div>

        {/* --- BẢNG DỮ LIỆU ĐỘNG --- */}
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
              
              {/* Kiểm tra nếu không có feedback nào */}
              {feedbackItems.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center py-10 text-gray-400 font-medium">
                    No feedbacks received yet for this event.
                  </td>
                </tr>
              ) : (
                /* Map dữ liệu từ Backend */
                feedbackItems.map((item) => (
                  <tr key={item.feedbackId} className="hover:bg-gray-50/80 transition-colors group cursor-pointer">
                    <td className="px-8 py-5 text-sm text-gray-500 font-semibold whitespace-nowrap">
                      {new Date(item.createdAt).toLocaleString()}
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-4">
                        <img 
                          src={item.userAvatar || `https://ui-avatars.com/api/?name=${item.userName}&background=random`} 
                          className="w-10 h-10 rounded-full object-cover border border-gray-100 shadow-sm" 
                          alt="" 
                        />
                        <div>
                          <p className="text-sm font-bold text-gray-900">{item.userName}</p>
                          <p className="text-xs text-gray-400 font-medium">{item.userEmail}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex gap-1 text-sm">
                        {[...Array(5)].map((_, i) => (
                          <span key={i} className={`${i < item.rating ? 'text-yellow-400' : 'text-gray-200'} text-base`}>★</span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <span className="text-[11px] font-bold uppercase italic tracking-wider text-[#8c9db3]">
                        {item.ticketName || 'General'}
                      </span>
                    </td>
                    <td className="px-6 py-5 text-center">
                      <Link to={`/admin/feedback/detail/${item.feedbackId}`} className="inline-block text-gray-300 hover:text-[#8c9db3] p-2 rounded-full hover:bg-gray-100 transition-all">
                        <Eye size={20} />
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          {/* Pagination */}
          <div className="px-8 py-6 border-t border-gray-50 flex justify-between items-center bg-white">
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
              Total Responses: {feedbackItems.length}
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default FeedbackList;