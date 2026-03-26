import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, User, Ticket, Mail, Calendar, 
  Download, Trash2, MessageSquare, ListIcon, ThumbsUp 
} from 'lucide-react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import jsPDF from 'jspdf';
import Sidebar from '../../components/layout/Sidebar'; 
import axiosInstance from '../../config/axios';
import { Alert } from '../../components/common/Alert';
import { useAlert } from '../../hooks/useAlert';

const FeedbackDetail = () => {
  const { feedbackId } = useParams();
  const [feedbackData, setFeedbackData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const navigate = useNavigate();
  const { alert, showAlert, closeAlert } = useAlert();

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
    return <div className="flex min-h-screen items-center justify-center bg-[#f8f7f2] font-sans text-gray-500 font-medium">Loading feedback details...</div>;
  }
  if (isError || !feedbackData) {
    return <div className="flex min-h-screen items-center justify-center bg-[#f8f7f2] font-sans text-red-500 font-medium">Error loading feedback detail</div>;
  }

  // Sửa lỗi chính tả an toàn: Bắt cả trường hợp Backend trả về 'feedbackRespone' hoặc 'feedbackResponse'
  const detailData = feedbackData.feedbackResponse?.detail || feedbackData.feedbackRespone?.detail || [];
  const overallRating = feedbackData.feedbackResponse?.overallRating || feedbackData.feedbackRespone?.overallRating || 0;
  
  // Array NPS emoji từ 1-10
  const npsEmojis = ['😡', '😠', '😞', '🙁', '😐', '🙂', '😊', '😀', '😁', '😍'];
  const npsEmoji = overallRating > 0 && overallRating <= 10 ? npsEmojis[overallRating - 1] : '';

  const handleExportPDF = async () => {
    try {
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pageHeight = pdf.internal.pageSize.getHeight();
      let yPosition = 15;

      // ===== HEADER =====
      pdf.setFontSize(18);
      pdf.setFont(undefined, 'bold');
      pdf.text('FEEDBACK REPORT', 15, yPosition);
      
      yPosition += 8;
      pdf.setFontSize(10);
      pdf.setFont(undefined, 'normal');
      pdf.text(`Response #${feedbackId}`, 15, yPosition);
      yPosition += 5;
      pdf.text(`Event: ${feedbackData?.eventName || 'N/A'}`, 15, yPosition);
      yPosition += 5;
      pdf.text(`Submitted: ${feedbackData?.submittedAt || 'N/A'}`, 15, yPosition);

      // Separator
      yPosition += 7;
      pdf.setLineWidth(0.5);
      pdf.line(15, yPosition, 195, yPosition);

      // ===== ATTENDEE INFO SECTION =====
      yPosition += 8;
      pdf.setFontSize(12);
      pdf.setFont(undefined, 'bold');
      pdf.text('ATTENDEE INFORMATION', 15, yPosition);
      
      yPosition += 7;
      pdf.setFontSize(10);
      pdf.setFont(undefined, 'normal');
      const attendeeInfo = [
        ['Full Name:', feedbackData.attendeeInfor?.fullName || 'N/A'],
        ['Email:', feedbackData.attendeeInfor?.email || 'N/A'],
        ['Phone:', feedbackData.attendeeInfor?.phoneNumber || 'N/A'],
        ['Ticket Type:', feedbackData.attendeeInfor?.ticketType || 'ATTENDEE'],
        ['Ticket Code:', feedbackData.attendeeInfor?.ticketCode || 'N/A'],
      ];

      attendeeInfo.forEach(([label, value]) => {
        pdf.setFont(undefined, 'bold');
        pdf.text(label, 15, yPosition);
        pdf.setFont(undefined, 'normal');
        const wrapped = pdf.splitTextToSize(String(value), 140);
        pdf.text(wrapped, 50, yPosition);
        yPosition += wrapped.length > 1 ? wrapped.length * 5 : 5;
      });

      // ===== RATINGS SECTION =====
      yPosition += 5;
      pdf.setFontSize(12);
      pdf.setFont(undefined, 'bold');
      pdf.text('RATINGS & SCORES', 15, yPosition);

      yPosition += 7;
      pdf.setFontSize(10);
      pdf.setFont(undefined, 'normal');
      pdf.text(`NPS Score: ${overallRating}/10`, 15, yPosition);

      // ===== FEEDBACK RESPONSES SECTION =====
      yPosition += 10;
      pdf.setFontSize(12);
      pdf.setFont(undefined, 'bold');
      pdf.text('FEEDBACK RESPONSES', 15, yPosition);

      yPosition += 7;
      pdf.setFontSize(10);

      detailData.forEach((item, index) => {
        if (item.type === 'NPS') return;

        // Check if we need a new page
        if (yPosition > pageHeight - 30) {
          pdf.addPage();
          yPosition = 15;
        }

        // Question
        pdf.setFont(undefined, 'bold');
        const questionWrapped = pdf.splitTextToSize(
          `Q${index + 1}: ${item.question || 'Feedback Question'}`,
          170
        );
        pdf.text(questionWrapped, 15, yPosition);
        yPosition += questionWrapped.length * 5;

        // Answer
        pdf.setFont(undefined, 'normal');
        const answerWrapped = pdf.splitTextToSize(
          item.answer || 'No response provided',
          170
        );
        pdf.text(answerWrapped, 18, yPosition);
        yPosition += answerWrapped.length * 5 + 3;
      });

      // ===== FOOTER =====
      yPosition = pageHeight - 15;
      pdf.setFontSize(8);
      pdf.setFont(undefined, 'normal');
      pdf.text(
        `Generated on ${new Date().toLocaleString()}`,
        15,
        yPosition
      );

      // Download
      const fileName = `Feedback_#${feedbackId}_${new Date().toISOString().slice(0, 10)}.pdf`;
      pdf.save(fileName);
      console.log('✅ PDF exported successfully:', fileName);
      showAlert('success', 'PDF exported successfully!');
    } catch (error) {
      console.error('❌ Error exporting PDF:', error);
      showAlert('error', `Failed to export PDF: ${error.message}`);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this feedback? This action cannot be undone.')) {
      return;
    }

    setIsDeleting(true);
    try {
      const response = await axiosInstance.delete(`/feedbacks/${feedbackId}`);
      if (response.status === 200) {
        showAlert('success', 'Feedback deleted successfully!');
        setTimeout(() => {
          navigate(-1); // Navigate back to feedback list
        }, 1500);
      }
    } catch (error) {
      console.error('Error deleting feedback:', error);
      showAlert('error', `Failed to delete feedback: ${error.response?.data?.message || error.message}`);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-[#f8f7f2] font-sans">
      <Sidebar />

      {/* THÊM lg:h-screen lg:overflow-y-auto ĐỂ THANH CUỘN ĐỘC LẬP VỚI SIDEBAR NẾU CẦN */}
      <div className="flex-1 p-4 sm:p-6 lg:p-10 w-full overflow-x-hidden">
        <Alert type={alert.type} message={alert.message} onClose={closeAlert} />
        
        {/* --- HEADER RESPONSIVE --- */}
        {/* Xếp dọc trên mobile, xếp ngang trên tablet/desktop */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 sm:gap-0 mb-6 lg:mb-8">
          <div className="flex items-start sm:items-center gap-3 sm:gap-4">
            <button onClick={() => navigate(-1)}
              className="shrink-0 w-10 h-10 flex items-center justify-center rounded-full bg-white border border-gray-200 text-gray-500 hover:text-gray-900 hover:bg-gray-50 shadow-sm transition-all" >
              <ArrowLeft size={20} />
            </button>
            <div>
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-gray-900 tracking-tight leading-tight">Feedback Detail</h1>
              <p className="text-gray-500 font-medium text-xs sm:text-sm mt-1">Response #{feedbackId || '001'} • {feedbackData?.eventName}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
            <button 
              onClick={handleDelete}
              disabled={isDeleting}
              className={`flex-1 sm:flex-none justify-center px-4 py-2.5 sm:py-2 bg-white border border-gray-200 rounded-lg text-sm font-bold text-red-500 hover:bg-red-50 flex items-center gap-2 transition-all shadow-sm ${isDeleting ? 'opacity-50 cursor-not-allowed' : ''}`}>
              <Trash2 size={16} /> <span className="hidden sm:inline">{isDeleting ? 'Deleting...' : 'Delete'}</span>
            </button>
            <button 
              onClick={handleExportPDF}
              className="flex-1 sm:flex-none justify-center px-4 py-2.5 sm:py-2 bg-[#8c9db3] hover:bg-[#7a8ca3] text-white rounded-lg text-sm font-bold flex items-center gap-2 shadow-md transition-all">
              <Download size={16} /> Export<span className="hidden sm:inline"> PDF</span>
            </button>
          </div>
        </div>

        {/* --- MAIN CONTENT GRID RESPONSIVE --- */}
        {/* Mobile: 1 cột | Desktop: 3 cột */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          
          {/* CỘT TRÁI: THÔNG TIN KHÁN GIẢ */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-xl lg:rounded-2xl p-5 lg:p-6 shadow-[0_4px_20px_-10px_rgba(0,0,0,0.05)] border border-gray-100">
              <h3 className="text-[10px] lg:text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-5 lg:mb-6">Attendee Profile</h3>
              
              <div className="flex flex-col items-center mb-6 text-center">
                {feedbackData.attendeeInfor?.avatar ? (
                  <img src={feedbackData.attendeeInfor.avatar} alt="Avatar" className="w-20 h-20 lg:w-24 lg:h-24 rounded-full object-cover border-4 border-[#f8f7f2] shadow-sm mb-4" />
                ) : (
                  <div className="w-20 h-20 lg:w-24 lg:h-24 rounded-full bg-gradient-to-br from-[#8c9db3] to-[#6b7d94] flex items-center justify-center border-4 border-[#f8f7f2] shadow-sm mb-4">
                    <User size={32} className="text-white" />
                  </div>
                )}
                <h2 className="text-base lg:text-lg font-bold text-gray-900">{feedbackData.attendeeInfor?.fullName}</h2>
                <span className="inline-block text-[9px] sm:text-[10px] lg:text-[11px] font-bold uppercase italic tracking-wider text-[#8c9db3] bg-[#f8f7f2] px-2 sm:px-3 py-1 rounded-full border border-gray-100 mt-2 whitespace-nowrap">
                  {feedbackData.attendeeInfor?.ticketName || "ATTENDEE"}
                </span>
              </div>

              <div className="space-y-4 pt-5 lg:pt-6 border-t border-gray-100">
                <div className="flex items-center gap-3 text-xs sm:text-sm">
                  <Mail size={16} className="text-gray-400 shrink-0" />
                  <span className="text-gray-600 font-medium break-all">{feedbackData.attendeeInfor?.email}</span>
                </div>
                <div className="flex items-center gap-3 text-xs sm:text-sm">
                  <User size={16} className="text-gray-400 shrink-0" />
                  <span className="text-gray-600 font-medium">{feedbackData.attendeeInfor?.phoneNumber || 'N/A'}</span>
                </div>
                <div className="flex items-center gap-3 text-xs sm:text-sm">
                  <Calendar size={16} className="text-gray-400 shrink-0" />
                  <span className="text-gray-600 font-medium">Submitted: {new Date(feedbackData?.submittedAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          </div>

          {/* CỘT PHẢI: NỘI DUNG FEEDBACK */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl lg:rounded-2xl p-5 sm:p-6 lg:p-8 shadow-[0_4px_20px_-10px_rgba(0,0,0,0.05)] border border-gray-100 h-full">
              <h3 className="text-[10px] lg:text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-6 lg:mb-8">Feedback Responses</h3>

              {/* KHU VỰC ĐIỂM SỐ RESPONSIVE */}
              <div className="mb-8 pb-6 lg:mb-10 lg:pb-8 border-b border-gray-100">
                <div>
                  <p className="text-xs sm:text-sm font-bold text-gray-500 mb-2 sm:mb-3 flex items-center gap-2">
                    <ThumbsUp size={16} className="text-[#8c9db3]" />
                    NPS Score
                  </p>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl sm:text-3xl font-extrabold text-blue-500">{overallRating}</span>
                    <span className="text-gray-400 font-medium text-xs sm:text-sm mt-1 sm:mt-2">/ 10</span>
                    {npsEmoji && <span className="text-2xl sm:text-3xl ml-2">{npsEmoji}</span>}
                  </div>
                </div>
              </div>

              {/* CÁC CÂU HỎI TEXT */}
              <div className="space-y-6 lg:space-y-8">
                {detailData.map((item, index) => {
                  if(item.type === 'NPS') return null;
                  return (
                    <div key={index} >
                      <h4 className="font-bold text-gray-800 text-sm sm:text-base flex items-start gap-2 mb-2 sm:mb-3 leading-snug">
                        {item.type === 'OPEN_COMMENT' ? <MessageSquare size={16} className="text-[#8c9db3] mt-0.5 shrink-0 sm:w-[18px] sm:h-[18px]" /> : <ListIcon size={16} className="text-[#8c9db3] mt-0.5 shrink-0 sm:w-[18px] sm:h-[18px]" />}
                        { item.question || `Câu hỏi đánh giá #${index + 1}` }
                      </h4>
                      <div className="bg-[#f8fbff] border border-[#8c9db3]/30 rounded-lg lg:rounded-xl p-4 lg:p-5 text-sm sm:text-base text-gray-700 leading-relaxed font-medium shadow-sm relative break-words">
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