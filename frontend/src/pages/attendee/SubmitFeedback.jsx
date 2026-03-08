import React, { useState, useEffect } from 'react';
import { Star, Send, ArrowLeft, CheckCircle2, Loader2 } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import axiosInstance from '../../config/axios';
import { message } from 'antd';

const SubmitFeedback = () => {
  const { eventId } = useParams();

  // State quản lý dữ liệu tĩnh
  const [eventInfo, setEventInfo] = useState({ name: 'Đang tải thông tin...', date: '', cover: 'https://images.unsplash.com/photo-1540039155733-d7696c4826c5?q=80&w=1000' });
  const [formSchema, setFormSchema] = useState([]);
  const [formDesc, setFormDesc] = useState('Hãy giúp chúng tôi cải thiện sự kiện cho lần sau bằng cách để lại đánh giá của bạn.');
  
  // State quản lý câu trả lời
  const [rating, setRating] = useState(0); // Vẫn giữ state rating để gửi riêng cho backend
  const [answers, setAnswers] = useState({}); 
  
  // State UI
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // 1. KÉO DỮ LIỆU FORM
  useEffect(() => {
    const fetchData = async () => {
      try {
        try {
          const eventRes = await axiosInstance.get(`/events/${eventId}`);
          if(eventRes.data) {
            setEventInfo({
              name: eventRes.data.eventName || 'Sự kiện của bạn',
              date: eventRes.data.startTime ? new Date(eventRes.data.startTime).toLocaleDateString('vi-VN') : 'Đang diễn ra',
              cover: eventRes.data.coverImageUrl || eventInfo.cover
            });
          }
        } catch (e) {
          setEventInfo({ name: 'Sự kiện của bạn', date: 'Đang diễn ra', cover: eventInfo.cover });
          e.message && message.warning("Không lấy được thông tin sự kiện, sẽ hiển thị thông tin mặc định.");
        }

        const formRes = await axiosInstance.get(`/events/${eventId}/forms?type=FEEDBACK`);
        if (formRes.data && formRes.data.formSchema) {
          let schema = formRes.data.formSchema;
          if (typeof schema === 'string') schema = JSON.parse(schema);

          if (schema.length > 0 && schema[0].type === 'Form_description') {
            setFormDesc(schema[0].content);
            setFormSchema(schema.slice(1));
          } else {
            setFormSchema(schema);
          }
        }
      } catch (error) {
        console.error("Lỗi lấy form schema:", error);
        message.error("Không thể tải form đánh giá!");
      } finally {
        setIsLoading(false);
      }
    };

    if (eventId) fetchData();
  }, [eventId]);

  const handleAnswerChange = (fieldId, value) => {
    setAnswers(prev => ({ ...prev, [fieldId]: value }));
  };

  // 2. GỬI DATA XUỐNG BACKEND
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (rating === 0) {
      message.warning("Vui lòng đánh giá số sao trước khi gửi!");
      return;
    }

    setIsSubmitting(true);
    try {
      const feedbackDataArray = formSchema.map(field => ({
        field_id: field.field_id,
        question: field.question,
        answer: answers[field.field_id] || ''
      }));

      // Payload bám sát DTO ở Backend
      const payload = {
        rating: rating, // Lấy từ câu hỏi RATING động
        comment: answers['general_comment'] || 'Đã gửi qua Custom Form', 
        feedbackData: feedbackDataArray
      };

      await axiosInstance.post(`/feedbacks/events/${eventId}`, payload);
      setIsSubmitted(true);
    } catch (error) {
      console.error("Lỗi submit:", error);
      const errorMsg = error.response?.data?.message || error.response?.data || "Backend chưa xử lý được yêu cầu này!";
      message.error("Lỗi: " + errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  // UI LOADING & SUCCESS (Giữ nguyên)
  if (isLoading) return <div className="min-h-screen flex items-center justify-center bg-[#f4f3ed]"><Loader2 className="animate-spin text-[#8c9db3]" size={40}/></div>;
  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-[#f8f7f2] flex items-center justify-center p-6 font-sans">
        <div className="bg-white rounded-3xl shadow-xl max-w-md w-full p-10 text-center border border-gray-100">
          <div className="w-20 h-20 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6"><CheckCircle2 size={40} /></div>
          <h2 className="text-2xl font-extrabold text-gray-900 mb-3">Cảm ơn bạn!</h2>
          <p className="text-gray-500 font-medium mb-8 leading-relaxed">Đánh giá của bạn cho <strong>{eventInfo.name}</strong> đã được gửi thành công!</p>
          <Link to="/" className="block w-full py-3.5 bg-[#8c9db3] hover:bg-[#7a8ca3] text-white rounded-xl font-bold transition-all shadow-md">Về trang chủ</Link>
        </div>
      </div>
    );
  }

  // HÀM HELPER ĐỂ RENDER ĐÚNG LOẠI INPUT
  const renderInput = (field) => {
    // Ép kiểu chữ IN HOA để so sánh không bị trượt (ví dụ: 'Short_Text', 'text', 'SHORT_TEXT' đều ăn hết)
    const type = field.type ? field.type.toUpperCase() : 'TEXT';

    // 1. Nếu là câu hỏi đánh giá SAO
    if (type.includes('RATING') || type.includes('STAR') || type.includes('NPS')) {
      return (
        <div className="flex gap-4 mt-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <button key={star} type="button" 
              onClick={() => {
                setRating(star); // Cập nhật biến rating gốc cho Backend
                handleAnswerChange(field.field_id, star); // Lưu vào list answers
              }} 
              className="transition-transform hover:scale-110 focus:outline-none"
            >
              <Star size={42} className={`transition-colors duration-200 ${ star <= (answers[field.field_id] || 0) ? 'text-yellow-400 fill-yellow-400 drop-shadow-md' : 'text-gray-200'}`} />
            </button>
          ))}
        </div>
      );
    }

    // 2. Nếu là Trắc nghiệm (Radio)
    if (type.includes('MULTIPLE') || type.includes('RADIO')) {
      return (
        <div className="space-y-3 mt-2">
          {field.options?.map((opt, i) => (
            <label key={i} className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors bg-white">
              <input type="radio" name={`radio_${field.field_id}`} value={opt} required={field.required} checked={answers[field.field_id] === opt} onChange={(e) => handleAnswerChange(field.field_id, e.target.value)} className="w-4 h-4 text-[#8c9db3]" />
              <span className="text-gray-700 font-medium text-sm">{opt}</span>
            </label>
          ))}
        </div>
      );
    }

    // 3. Nếu là Nhập đoạn văn (Textarea)
    if (type.includes('LONG') || type.includes('PARAGRAPH') || type.includes('AREA')) {
      return (
        <textarea rows="3" required={field.required} placeholder={field.placeholder || "Nhập câu trả lời của bạn..."} value={answers[field.field_id] || ''} onChange={(e) => handleAnswerChange(field.field_id, e.target.value)} className="w-full mt-2 border border-gray-200 rounded-xl p-4 text-gray-700 font-medium outline-none focus:border-[#8c9db3] resize-none bg-white focus:bg-gray-50 shadow-sm"></textarea>
      );
    }

    // 4. Mặc định (Fallback): Luôn luôn in ra ô Text ngắn (Chống lỗi mất ô input)
    return (
      <input type="text" required={field.required} placeholder={field.placeholder || "Nhập câu trả lời của bạn..."} value={answers[field.field_id] || ''} onChange={(e) => handleAnswerChange(field.field_id, e.target.value)} className="w-full mt-2 border border-gray-200 rounded-xl p-4 text-gray-700 font-medium outline-none focus:border-[#8c9db3] bg-white focus:bg-gray-50 shadow-sm" />
    );
  };

  return (
    <div className="min-h-screen bg-[#f8f7f2] py-12 px-4 sm:px-6 font-sans">
      <div className="max-w-3xl mx-auto">
        <Link to="/" className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-900 font-bold text-sm mb-6 transition-colors">
          <ArrowLeft size={16} /> Về trang chủ
        </Link>

        <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
          {/* Header Bìa Sự Kiện */}
          <div className="h-48 relative flex items-end p-8">
            <img src={eventInfo.cover} alt="Cover" className="absolute inset-0 w-full h-full object-cover brightness-50" />
            <div className="relative z-10 w-full">
              <h1 className="text-3xl font-extrabold text-white tracking-tight drop-shadow-md">{eventInfo.name}</h1>
              <p className="text-gray-200 font-medium text-sm mt-1 drop-shadow">{eventInfo.date}</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-8 sm:p-12 bg-gray-50/30">
            <div className="mb-10 text-center">
              <h2 className="text-2xl font-extrabold text-gray-900 mb-2">How was your experience?</h2>
              <p className="text-gray-500 font-medium">{formDesc}</p>
            </div>

            {/* DANH SÁCH CÂU HỎI ĐỘNG (Render tự động) */}
            <div className="space-y-8">
              {formSchema.map((field, index) => (
                <div key={field.field_id} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                  <label className="block text-base font-extrabold text-gray-800">
                    {index + 1}. {field.question} {field.required && <span className="text-red-500">*</span>}
                  </label>
                  
                  {/* Gọi hàm xuất Input ở trên */}
                  {renderInput(field)}
                </div>
              ))}
            </div>

            <div className="mt-12 pt-8 border-t border-gray-200 flex justify-end">
              <button type="submit" disabled={rating === 0 || isSubmitting} className={`px-8 py-4 rounded-xl font-bold text-base flex items-center gap-2 transition-all shadow-md ${ rating > 0 && !isSubmitting ? 'bg-[#8c9db3] hover:bg-[#7a8ca3] text-white hover:-translate-y-1' : 'bg-gray-200 text-gray-400 cursor-not-allowed' }`}>
                {isSubmitting ? <Loader2 className="animate-spin" size={18}/> : <><Send size={18} /> Gửi đánh giá</>}
              </button>
            </div>
            
          </form>
        </div>
      </div>
    </div>
  );
};

export default SubmitFeedback;