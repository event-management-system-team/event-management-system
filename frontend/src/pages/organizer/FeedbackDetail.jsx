import React from 'react';
import { 
  ArrowLeft, Star, User, Ticket, Mail, Calendar, 
  Download, Trash2, MessageSquare, ThumbsUp,ListIcon 
} from 'lucide-react';
import { Link, useParams,useNavigate } from 'react-router-dom';
import Sidebar from '../../components/layout/Sidebar'; // Nhớ check lại đường dẫn Sidebar nhé
import { useState,useEffect } from 'react';
import axiosInstance from '../../config/axios';

const FeedbackDetail = () => {
  // Lấy ID từ trên thanh URL (Ví dụ: /admin/feedback/1)
  const { feedbackId } = useParams();
  const [feedbackData, setFeedbackData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isError, setIsError] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchFeedbackDetail = async () => {
      setIsLoading(true);
      setIsError(false);
      try {
        const response = await axiosInstance.get(`/feedbacks/${feedbackId}`);
        if(response.status === 200 && response.data) {
          console.log("🔥 JSON BACKEND TRẢ VỀ:", response.data);
        setFeedbackData(response.data);
        } else {
          setIsError(true);
        }
      } catch (error) {
        console.error("Error fetching feedback detail:", error);
        setIsError(true);
      } finally {
        setIsLoading(false);
      }
    };
      fetchFeedbackDetail();
  }, [feedbackId]);

  if (isLoading) {
    return <div className="flex min-h-screen bg-[#f8f7f2] font-sans">Loading...</div>;
  }
  if (isError || !feedbackData) {
    return <div className="flex min-h-screen bg-[#f8f7f2] font-sans">Error loading feedback detail</div>;
  }
const npsScoreItem = feedbackData.feedbackRespone?.detail?.find(item => item.type === 'NPS');
  const npsScore = npsScoreItem ? npsScoreItem.answer : '--';
  return (
    <div className="flex min-h-screen bg-[#f8f7f2] font-sans">
      <Sidebar />

      <div className="flex-1  p-10">
        
        {/* --- HEADER --- */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate(-1)}
              className="w-10 h-10 flex items-center justify-center rounded-full bg-white border border-gray-200 text-gray-500 hover:text-gray-900 hover:bg-gray-50 shadow-sm transition-all" >
              <ArrowLeft size={20} />
           </button>
            <div>
              <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Feedback Detail</h1>
              <p className="text-gray-500 font-medium text-sm mt-1">Response #{feedbackId || '001'} • {feedbackData?.eventName}</p>
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
              <h3 className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-6">AttendeeInfor Profile</h3>
              
              <div className="flex flex-col items-center mb-6">
                <img src={feedbackData.attendeeInfor?.avatar || '/default-avatar.png'} alt="Avatar" className="w-24 h-24 rounded-full object-cover border-4 border-[#f8f7f2] shadow-sm mb-4" />
                <h2 className="text-lg font-bold text-gray-900">{feedbackData.attendeeInfor?.fullName}</h2>
                <span className="bg-[#8c9db3]/10 text-[#8c9db3] text-xs font-bold px-3 py-1 rounded-full mt-2 uppercase tracking-wide">
                  {feedbackData.attendeeInfor?.ticketType || "ATTENDEE"}
                </span>
              </div>

              <div className="space-y-4 pt-6 border-t border-gray-100">
                <div className="flex items-center gap-3 text-sm">
                  <Mail size={16} className="text-gray-400" />
                  <span className="text-gray-600 font-medium">{feedbackData.attendeeInfor?.email}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <User size={16} className="text-gray-400" />
                  <span className="text-gray-600 font-medium">{feedbackData.attendeeInfor?.phoneNumber}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Ticket size={16} className="text-gray-400" />
                  <span className="text-gray-600 font-medium">Code: {feedbackData.attendeeInfor?.ticketCode}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Calendar size={16} className="text-gray-400" />
                  <span className="text-gray-600 font-medium">Submitted: {feedbackData?.submittedAt}</span>
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
                      <Star key={i} size={28} className={i < feedbackData.feedbackResponse?.overallRating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200'} />
                    ))}
                  </div>
                </div>
                <div className="w-px bg-gray-100"></div>
                <div>
                  <p className="text-sm font-bold text-gray-500 mb-2">Net Promoter Score (NPS)</p>
                  <div className="flex items-center gap-2">
                    <span className="text-3xl font-extrabold text-green-500">{npsScore}</span>
                    <span className="text-gray-400 font-medium text-sm">/ 10</span>
                  </div>
                </div>
              </div>

              {/* Các câu hỏi Text */}
              <div className="space-y-8">
                {feedbackData.feedbackResponse?.detail
                 && feedbackData.feedbackResponse?.detail.map((item, index) => {
                  if(item.type === 'NPS') return null;
                  return (
                    <div key={index} >
                      <h4 className="font-bold text-gray-800 flex items-start gap-2 mb-3">
                        {item.type === 'OPEN_COMMENT' ? <MessageSquare size={18} className="text-[#8c9db3] mt-0.5" /> : <ListIcon size={18} className="text-[#8c9db3] mt-0.5" />}
                        { item.question || `Câu hỏi đánh giá #${index + 1}` }
                      </h4>
                      <div className="bg-[#f8fbff] border border-[#8c9db3]/30 rounded-xl p-5 text-gray-700 leading-relaxed font-medium shadow-sm relative">
                        {/* In câu trả lời ra */}
                        {item.answer || <span className="text-gray-400 italic">Khán giả không trả lời câu hỏi này.</span>}
                      </div>
                      </div>
                  );
                })}
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default FeedbackDetail;