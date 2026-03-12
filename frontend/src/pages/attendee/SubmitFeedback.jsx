import React, { useState, useEffect } from 'react';
import { Star, ArrowLeft, CheckCircle2, Loader2, Calendar, Ticket } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import axiosInstance from '../../config/axios';
import { message } from 'antd';

const SubmitFeedback = () => {
  const { eventId } = useParams();

  // Static data state
  const [eventInfo, setEventInfo] = useState({ name: 'Loading event...', date: '...' });
  const [formSchema, setFormSchema] = useState([]);
  
  // Answer state
  const [rating, setRating] = useState(0); 
  const [answers, setAnswers] = useState({}); 
  
  // UI state
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // 1. FETCH DATA
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Lấy thông tin Event 
        try {
          const eventRes = await axiosInstance.get(`/events/ids/${eventId}`);
          // Bắt trường hợp Backend bọc data trong response.data.data
          const eData = eventRes.data?.data || eventRes.data;
          
          if(eData) {
            setEventInfo({
              name: eData.eventName || eData.title || eData.name || 'Your Event',
              date: eData.startDate ? new Date(eData.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Ongoing'
            });
          }
        } catch (e) {
          console.error("Lấy thông tin event thất bại:", e);
          setEventInfo({ name: 'Your Event', date: 'Ongoing' });
        }

        // Lấy Form Schema
        const formRes = await axiosInstance.get(`/events/${eventId}/forms?type=FEEDBACK`);
        const fData = formRes.data?.data || formRes.data;

        if (fData && fData.formSchema) {
          let schema = fData.formSchema;
          if (typeof schema === 'string') schema = JSON.parse(schema);

          if (schema.length > 0 && schema[0].type === 'Form_description') {
            setFormSchema(schema.slice(1));
          } else {
            setFormSchema(schema);
          }
        }
      } catch (error) {
        console.error("Error fetching form schema:", error);
        message.error("Failed to load feedback form!");
      } finally {
        setIsLoading(false);
      }
    };

    if (eventId) fetchData();
  }, [eventId]);

  const handleAnswerChange = (fieldId, value) => {
    setAnswers(prev => ({ ...prev, [fieldId]: value }));
  };

  // 2. SUBMIT DATA
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (rating === 0) {
      message.warning("Please provide an overall star rating!");
      return;
    }

    setIsSubmitting(true);
    try {
      const feedbackDataArray = formSchema.map(field => ({
        field_id: field.field_id,
        question: field.question,
        answer: answers[field.field_id] || ''
      }));

      const payload = {
        rating: rating, 
        comment: answers['general_comment'] || 'Submitted via Custom Form', 
        feedbackData: feedbackDataArray
      };

      await axiosInstance.post(`/feedbacks/events/${eventId}`, payload);
      setIsSubmitted(true);
    } catch (error) {
      console.error("Submit error:", error);
      const errorMsg = error.response?.data?.message || error.response?.data || "Backend could not process this request!";
      message.error("Error: " + errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  // UI LOADING & SUCCESS
  if (isLoading) return <div className="min-h-screen flex items-center justify-center bg-[#f2ede6]"><Loader2 className="animate-spin text-[#849b9f]" size={40}/></div>;
  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-[#f2ede6] flex items-center justify-center p-6 font-sans">
        <div className="bg-white rounded-[32px] shadow-sm max-w-md w-full p-12 text-center">
          <div className="w-20 h-20 bg-[#eef5f3] text-[#849b9f] rounded-full flex items-center justify-center mx-auto mb-6"><CheckCircle2 size={40} /></div>
          <h2 className="text-2xl font-extrabold text-gray-900 mb-3">Thank you!</h2>
          <p className="text-gray-500 font-medium mb-10 leading-relaxed">Your feedback helps us make <strong>{eventInfo.name}</strong> even better next time.</p>
          <Link to="/" className="block w-full py-4 bg-[#849b9f] hover:bg-[#6c8286] text-white rounded-2xl font-bold transition-all">Back to Home</Link>
        </div>
      </div>
    );
  }

  // DYNAMIC INPUT RENDERER
  const renderInput = (field) => {
    const type = field.type ? field.type.toUpperCase() : 'TEXT';

    // 1. STAR RATING (NPS) - Phong cách phẳng, căn giữa nếu là câu đầu tiên
    if (type.includes('RATING') || type.includes('STAR') || type.includes('NPS')) {
      return (
        <div className="flex gap-2 sm:gap-4 mt-4 justify-center">
          {[1, 2, 3, 4, 5].map((star) => (
            <button key={star} type="button" 
              onClick={() => {
                setRating(star); // Gắn rating tổng
                handleAnswerChange(field.field_id, star); 
              }} 
              className="focus:outline-none transform transition-transform hover:scale-110 active:scale-95"
            >
              <Star size={44} className={`transition-colors duration-200 ${ star <= (answers[field.field_id] || 0) ? 'text-[#ffc107] fill-[#ffc107]' : 'text-gray-200 fill-gray-200'}`} />
            </button>
          ))}
        </div>
      );
    }

    // 2. MULTIPLE CHOICE - Thay radio bằng các nút bấm (Chips) mềm mại
    if (type.includes('MULTIPLE') || type.includes('RADIO') || type.includes('CHOICE')) {
      return (
        <div className="flex flex-wrap gap-3 mt-4">
          {field.options?.map((opt, i) => {
            const isSelected = answers[field.field_id] === opt;
            return (
              <button 
                key={i} 
                type="button"
                onClick={() => handleAnswerChange(field.field_id, opt)}
                className={`px-5 py-3 rounded-2xl text-sm font-bold transition-all duration-200 ${
                  isSelected 
                  ? 'bg-[#849b9f] text-white shadow-md transform -translate-y-0.5' 
                  : 'bg-[#f6f5f2] text-gray-600 hover:bg-gray-200'
                }`}
              >
                {opt}
              </button>
            )
          })}
        </div>
      );
    }

    // 3. LONG TEXT (Textarea) - Nền xám be, bo góc lớn, không viền
    if (type.includes('LONG') || type.includes('PARAGRAPH') || type.includes('COMMENT')) {
      return (
        <textarea 
          rows="4" 
          required={field.required} 
          placeholder={field.placeholder || "Tell us your thoughts..."} 
          value={answers[field.field_id] || ''} 
          onChange={(e) => handleAnswerChange(field.field_id, e.target.value)} 
          className="w-full mt-4 bg-[#f6f5f2] border-transparent rounded-[20px] p-5 text-gray-800 font-medium outline-none focus:ring-2 focus:ring-[#849b9f] focus:bg-white transition-all resize-none placeholder-gray-400"
        ></textarea>
      );
    }

    // 4. FALLBACK (Short Text)
    return (
      <input 
        type="text" 
        required={field.required} 
        placeholder={field.placeholder || "Your answer..."} 
        value={answers[field.field_id] || ''} 
        onChange={(e) => handleAnswerChange(field.field_id, e.target.value)} 
        className="w-full mt-4 bg-[#f6f5f2] border-transparent rounded-[20px] p-5 text-gray-800 font-medium outline-none focus:ring-2 focus:ring-[#849b9f] focus:bg-white transition-all placeholder-gray-400" 
      />
    );
  };

  return (
    <div className="min-h-screen bg-[#f2ede6] py-12 px-4 sm:px-6 font-sans">
      <div className="max-w-3xl mx-auto">
        
        {/* Nút Back mềm mại */}
        <Link to="/" className="inline-flex items-center gap-2 text-gray-400 hover:text-gray-800 font-bold text-sm mb-8 transition-colors">
          <ArrowLeft size={16} /> Back to Event
        </Link>

        {/* THÂN FORM */}
        <div className="bg-white rounded-[32px] shadow-sm p-8 sm:p-14">
          
          {/* Header Sự Kiện (Style mới giống bản mẫu) */}
          <div className="flex flex-col sm:flex-row justify-between items-start gap-6 border-b border-gray-100 pb-10 mb-10">
            <div>
              <span className="text-[#849b9f] text-[11px] font-extrabold uppercase tracking-widest">Post-Event Feedback</span>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mt-3 mb-4 tracking-tight leading-tight">{eventInfo.name}</h1>
              <div className="flex items-center gap-2 text-sm font-bold text-gray-400">
                <Calendar size={16} />
                <span>{eventInfo.date}</span>
              </div>
            </div>
            {/* Tag mô phỏng Ticket ID cho giống mockup */}
            <div className="bg-[#f6f5f2] rounded-2xl p-4 flex items-center gap-3 shrink-0">
              <div className="bg-white p-2 rounded-lg text-[#849b9f] shadow-sm"><Ticket size={20}/></div>
              <div>
                <p className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider">Status</p>
                <p className="text-sm font-extrabold text-gray-800">Attended</p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            
            {/* DANH SÁCH CÂU HỎI */}
            <div className="space-y-12">
              {formSchema.map((field, index) => {
                // Nếu là câu hỏi đánh giá sao, mình bôi đậm và căn giữa cho giống mockup
                const isStarRating = field.type && (field.type.toUpperCase().includes('NPS') || field.type.toUpperCase().includes('STAR'));
                
                return (
                  <div key={field.field_id} className={isStarRating ? "text-center" : ""}>
                    <label className={`block font-extrabold text-gray-800 ${isStarRating ? 'text-xl mb-2' : 'text-sm mb-3'}`}>
                      {field.question} {field.required && <span className="text-red-500">*</span>}
                    </label>
                    {renderInput(field)}
                  </div>
                );
              })}
            </div>

            {/* NÚT SUBMIT LỚN Ở DƯỚI */}
            <div className="mt-14">
              <button 
                type="submit" 
                disabled={rating === 0 || isSubmitting} 
                className={`w-full py-4 rounded-2xl font-bold text-lg flex items-center justify-center gap-2 transition-all ${ 
                  rating > 0 && !isSubmitting 
                  ? 'bg-[#849b9f] hover:bg-[#6c8286] text-white shadow-lg shadow-[#849b9f]/30 hover:-translate-y-1' 
                  : 'bg-[#f6f5f2] text-gray-400 cursor-not-allowed' 
                }`}
              >
                {isSubmitting ? <Loader2 className="animate-spin" size={24}/> : 'Submit Feedback'}
              </button>
              <p className="text-center text-xs font-bold text-gray-400 mt-6">
                Thank you for helping us make our events better!
              </p>
            </div>
            
          </form>
        </div>
      </div>
    </div>
  );
};

export default SubmitFeedback;