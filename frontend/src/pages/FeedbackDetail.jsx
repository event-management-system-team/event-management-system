import React from 'react';
import { 
  ArrowLeft, Star, User, Ticket, Mail, Calendar, 
  Download, Trash2, MessageSquare, ThumbsUp 
} from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import Sidebar from '../../components/layout/Sidebar'; // Nhớ check lại đường dẫn Sidebar nhé

const FeedbackDetail = () => {
  // Lấy ID từ trên thanh URL (Ví dụ: /admin/feedback/1)
  const { id } = useParams();

  // Dữ liệu giả (Mock Data) của 1 feedback chi tiết
  const feedbackData = {
    eventName: "BridgeFest 2025",
    submittedAt: "Oct 12, 2025 - 14:30",
    attendee: {
      name: "Sarah Jenkins",
      email: "sarah.j@example.com",
      avatar: "https://i.pravatar.cc/150?img=5",
      ticketType: "VIP ACCESS",
      ticketCode: "VIP-8890-BF25",
      phone: "+84 987 654 321"
    },
    responses: {
      overallRating: 5,
      npsScore: 9,
      favoritePart: "Sân khấu cực kỳ hoành tráng và phần biểu diễn của nghệ sĩ khách mời quá tuyệt vời. Âm thanh ánh sáng 10 điểm không có nhưng!",
      improvement: "Khu vực xếp hàng lấy vòng tay lúc check-in hơi lộn xộn, BTC nên phân luồng rõ ràng hơn cho hạng vé VIP.",
      recommend: "Yes, definitely!"
    }
  };

  return (
    <div className="flex min-h-screen bg-[#f8f7f2] font-sans">
      <Sidebar />

      <div className="flex-1 ml-64 p-10">
        
        {/* --- HEADER --- */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-4">
            <Link to="/organizer/feedback/list" className="w-10 h-10 flex items-center justify-center rounded-full bg-white border border-gray-200 text-gray-500 hover:text-gray-900 hover:bg-gray-50 shadow-sm transition-all">
              <ArrowLeft size={20} />
            </Link>
            <div>
              <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Feedback Detail</h1>
              <p className="text-gray-500 font-medium text-sm mt-1">Response #{id || '001'} • {feedbackData.eventName}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <button className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-bold text-red-500 hover:bg-red-50 flex items-center gap-2 transition-all shadow-sm">
              <Trash2 size={16} /> Delete
            </button>
            <button className="px-4 py-2 bg-[#8c9db3] hover:bg-[#7a8ca3] text-white rounded-lg text-sm font-bold flex items-center gap-2 shadow-md transition-all">
              <Download size={16} /> Export PDF
            </button>
          </div>
        </div>

        {/* --- MAIN CONTENT GRID --- */}
        <div className="grid grid-cols-3 gap-8">
          
          {/* CỘT TRÁI: THÔNG TIN KHÁN GIẢ (1 Phần) */}
          <div className="col-span-1 space-y-6">
            <div className="bg-white rounded-2xl p-6 shadow-[0_4px_20px_-10px_rgba(0,0,0,0.05)] border border-gray-100">
              <h3 className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-6">Attendee Profile</h3>
              
              <div className="flex flex-col items-center mb-6">
                <img src={feedbackData.attendee.avatar} alt="Avatar" className="w-24 h-24 rounded-full object-cover border-4 border-[#f8f7f2] shadow-sm mb-4" />
                <h2 className="text-lg font-bold text-gray-900">{feedbackData.attendee.name}</h2>
                <span className="bg-[#8c9db3]/10 text-[#8c9db3] text-xs font-bold px-3 py-1 rounded-full mt-2 uppercase tracking-wide">
                  {feedbackData.attendee.ticketType}
                </span>
              </div>

              <div className="space-y-4 pt-6 border-t border-gray-100">
                <div className="flex items-center gap-3 text-sm">
                  <Mail size={16} className="text-gray-400" />
                  <span className="text-gray-600 font-medium">{feedbackData.attendee.email}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <User size={16} className="text-gray-400" />
                  <span className="text-gray-600 font-medium">{feedbackData.attendee.phone}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Ticket size={16} className="text-gray-400" />
                  <span className="text-gray-600 font-medium">Code: {feedbackData.attendee.ticketCode}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Calendar size={16} className="text-gray-400" />
                  <span className="text-gray-600 font-medium">Submitted: {feedbackData.submittedAt}</span>
                </div>
              </div>
            </div>
          </div>

          {/* CỘT PHẢI: NỘI DUNG FEEDBACK (2 Phần) */}
          <div className="col-span-2">
            <div className="bg-white rounded-2xl p-8 shadow-[0_4px_20px_-10px_rgba(0,0,0,0.05)] border border-gray-100 h-full">
              <h3 className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-8">Feedback Responses</h3>

              {/* Khu vực Điểm số */}
              <div className="flex gap-8 mb-10 pb-8 border-b border-gray-100">
                <div>
                  <p className="text-sm font-bold text-gray-500 mb-2">Overall Experience</p>
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={28} className={i < feedbackData.responses.overallRating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200'} />
                    ))}
                  </div>
                </div>
                <div className="w-px bg-gray-100"></div>
                <div>
                  <p className="text-sm font-bold text-gray-500 mb-2">Net Promoter Score (NPS)</p>
                  <div className="flex items-center gap-2">
                    <span className="text-3xl font-extrabold text-green-500">{feedbackData.responses.npsScore}</span>
                    <span className="text-gray-400 font-medium text-sm">/ 10</span>
                  </div>
                </div>
              </div>

              {/* Các câu hỏi Text */}
              <div className="space-y-8">
                {/* Câu hỏi 1 */}
                <div>
                  <h4 className="font-bold text-gray-800 flex items-start gap-2 mb-3">
                    <ThumbsUp size={18} className="text-[#8c9db3] mt-0.5" /> 
                    What did you love most about the event?
                  </h4>
                  <div className="bg-[#f8fbff] border border-[#8c9db3]/30 rounded-xl p-5 text-gray-700 leading-relaxed font-medium shadow-sm relative">
                     {/* Icon quote trang trí */}
                     <MessageSquare size={40} className="absolute right-4 bottom-4 text-[#8c9db3] opacity-10" />
                    "{feedbackData.responses.favoritePart}"
                  </div>
                </div>

                {/* Câu hỏi 2 */}
                <div>
                  <h4 className="font-bold text-gray-800 flex items-start gap-2 mb-3">
                    <span className="w-5 h-5 rounded flex items-center justify-center bg-orange-100 text-orange-500 text-xs mt-0.5">!</span>
                    What could we improve for next time?
                  </h4>
                  <div className="bg-orange-50/50 border border-orange-100 rounded-xl p-5 text-gray-700 leading-relaxed font-medium">
                    {feedbackData.responses.improvement}
                  </div>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default FeedbackDetail;