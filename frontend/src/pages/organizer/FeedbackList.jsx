import React, { useState, useEffect } from 'react';
import { Eye, Search, Plus, Lock } from 'lucide-react';
import Sidebar from '../../components/layout/Sidebar'; 
import { useFeedbacks } from "../../hooks/useFeedback";
import { Link, useParams } from 'react-router-dom';
import axiosInstance from '../../config/axios'; // Đừng quên import axiosInstance

const FeedbackList = () => {
  const { eventId } = useParams(); 
  const { data: feedbacks, isLoading, isError } = useFeedbacks(eventId); 
  
  // STATE MỚI: Quản lý trạng thái kết thúc của sự kiện
  const [isEventEnded, setIsEventEnded] = useState(false);

  // EFFECT MỚI: Gọi API lấy chi tiết Event để check endDate
  useEffect(() => {
    const checkEventStatus = async () => {
      try {
        const response = await axiosInstance.get(`/events/ids/${eventId}`);
        const eventData = response.data?.data || response.data;
        
        if (eventData && eventData.endDate) {
          // So sánh thời gian hiện tại với ngày kết thúc sự kiện
          const isEnded = new Date().getTime() > new Date(eventData.endDate).getTime();
          setIsEventEnded(isEnded);
        }
      } catch (error) {
        console.error("Lỗi khi kiểm tra thời gian sự kiện:", error);
      }
    };

    if (eventId) {
      checkEventStatus();
    }
  }, [eventId]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen bg-[#f8f7f2] font-sans items-center justify-center">
        <p className="text-gray-500 font-medium animate-pulse">Loading feedbacks...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex min-h-screen bg-[#f8f7f2] font-sans items-center justify-center">
        <p className="text-red-500 font-medium">Error loading feedbacks</p>
      </div>
    );
  }

  const eventName = feedbacks?.eventName || "Unknown Event"; 
  const feedbackItems = feedbacks?.feedbacks || []; 

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-[#f8f7f2] font-sans w-full">
      
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 p-4 sm:p-6 lg:p-10 w-full overflow-x-hidden"> 
        
        {/* --- HEADER --- */}
        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-end gap-4 lg:gap-0 mb-6 lg:mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-gray-900 tracking-tight mb-1 sm:mb-2">Attendee Feedback</h1>
            <p className="text-gray-500 font-medium italic text-xs sm:text-sm">
              Showing all responses for <span className="text-gray-800 not-italic font-bold">{eventName}</span>
            </p>
          </div>
          
          <div className="flex flex-wrap sm:flex-nowrap gap-2 sm:gap-3 w-full lg:w-auto">
            {/* LOGIC MỚI: Ẩn/Hiện nút dựa trên isEventEnded */}
            {!isEventEnded ? (
              <Link 
                to={`/organizer/feedback/createform/${eventId}`} 
                className="flex-1 sm:flex-none justify-center bg-[#8c9db3] hover:bg-[#7a8ca3] text-white px-4 sm:px-5 py-2 sm:py-2.5 rounded-lg flex items-center gap-2 text-xs sm:text-sm font-bold shadow-md transition-all active:scale-95"
              >
                 <Plus size={16} strokeWidth={2.5} className="sm:w-[18px] sm:h-[18px]" /> <span className="whitespace-nowrap">Create Form</span>
              </Link>
            ) : (
              <div className="flex-1 sm:flex-none justify-center bg-red-50 text-red-600 border border-red-100 px-4 sm:px-5 py-2 sm:py-2.5 rounded-lg flex items-center gap-2 text-xs sm:text-sm font-bold shadow-sm cursor-not-allowed">
                 <Lock size={16} strokeWidth={2.5} className="sm:w-[18px] sm:h-[18px]" /> <span className="whitespace-nowrap">Event Ended</span>
              </div>
            )}
          </div>
        </div>

        {/* --- SEARCH BAR --- */}
        <div className="bg-white p-1.5 sm:p-2 rounded-xl sm:rounded-2xl shadow-sm mb-6 flex items-center justify-between border border-gray-100">
          <div className="flex items-center px-3 sm:px-4 py-2 flex-1 gap-2 sm:gap-3">
            <Search className="text-gray-300 w-4 h-4 sm:w-5 sm:h-5" />
            <input 
              type="text" 
              placeholder="Search by name, email or content..." 
              className="w-full outline-none text-gray-700 placeholder-gray-400 text-xs sm:text-sm font-medium h-full bg-transparent"
            />
          </div>
        </div>

        {/* --- DATA TABLE --- */}
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-[0_4px_20px_-10px_rgba(0,0,0,0.05)] overflow-hidden flex flex-col justify-between border border-gray-100 min-h-[400px] sm:min-h-[500px]">
          
          <div className="overflow-x-auto w-full">
            <table className="w-full min-w-[800px]">
              <thead className="bg-white">
                <tr className="border-b border-gray-100">
                  <th className="px-6 lg:px-8 py-4 lg:py-6 text-[10px] lg:text-[11px] font-bold text-gray-400 uppercase tracking-widest text-left whitespace-nowrap">Date & Time</th>
                  <th className="px-4 lg:px-6 py-4 lg:py-6 text-[10px] lg:text-[11px] font-bold text-gray-400 uppercase tracking-widest text-left">Attendee</th>
                  <th className="px-4 lg:px-6 py-4 lg:py-6 text-[10px] lg:text-[11px] font-bold text-gray-400 uppercase tracking-widest text-left">Rating</th>
                  <th className="px-4 lg:px-6 py-4 lg:py-6 text-[10px] lg:text-[11px] font-bold text-gray-400 uppercase tracking-widest text-left">Ticket</th>
                  <th className="px-4 lg:px-6 py-4 lg:py-6 text-[10px] lg:text-[11px] font-bold text-gray-400 uppercase tracking-widest text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                
                {feedbackItems.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="text-center py-16 sm:py-20">
                      <div className="flex flex-col items-center justify-center">
                        <p className="text-gray-400 font-medium text-base sm:text-lg">No feedbacks received yet.</p>
                        <p className="text-gray-300 text-xs sm:text-sm mt-1">Wait for attendees to share their thoughts!</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  feedbackItems.map((item) => (
                    <tr key={item.feedbackId} className="hover:bg-gray-50/80 transition-colors group cursor-pointer">
                      <td className="px-6 lg:px-8 py-4 lg:py-5 text-xs sm:text-sm text-gray-500 font-semibold whitespace-nowrap">
                        {new Date(item.createdAt).toLocaleString()}
                      </td>
                      <td className="px-4 lg:px-6 py-4 lg:py-5">
                        <div className="flex items-center gap-3 sm:gap-4">
                          <img 
                            src={item.userAvatar || `https://ui-avatars.com/api/?name=${item.userName}&background=random`} 
                            className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover border border-gray-100 shadow-sm shrink-0" 
                            alt={item.userName} 
                          />
                          <div className="min-w-0">
                            <p className="text-xs sm:text-sm font-bold text-gray-900 truncate">{item.userName}</p>
                            <p className="text-[10px] sm:text-xs text-gray-400 font-medium truncate">{item.userEmail}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 lg:px-6 py-4 lg:py-5">
                        <div className="flex gap-0.5 sm:gap-1 text-xs sm:text-sm">
                          {[...Array(5)].map((_, i) => (
                            <span key={i} className={`${i < item.rating ? 'text-yellow-400' : 'text-gray-200'} text-sm sm:text-base`}>★</span>
                          ))}
                        </div>
                      </td>
                      <td className="px-4 lg:px-6 py-4 lg:py-5">
                        <span className="inline-block text-[9px] sm:text-[10px] lg:text-[11px] font-bold uppercase italic tracking-wider text-[#8c9db3] bg-[#f8f7f2] px-2 sm:px-3 py-1 rounded-full border border-gray-100 whitespace-nowrap">
                          {item.ticketName || 'General'}
                        </span>
                      </td>
                      <td className="px-4 lg:px-6 py-4 lg:py-5 text-center">
                        <Link to={`/organizer/feedback/${item.feedbackId}`} className="inline-block text-gray-400 hover:text-[#8c9db3] p-1.5 sm:p-2 rounded-full hover:bg-gray-100 transition-all">
                          <Eye size={18} className="sm:w-5 sm:h-5" />
                        </Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          
          <div className="px-4 sm:px-6 lg:px-8 py-4 sm:py-6 border-t border-gray-50 flex justify-between items-center bg-gray-50/50 mt-auto">
            <p className="text-[10px] sm:text-[11px] text-gray-400 font-bold uppercase tracking-widest">
              Total Responses: <span className="text-gray-700">{feedbackItems.length}</span>
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default FeedbackList;