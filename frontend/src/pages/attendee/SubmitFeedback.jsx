import React, { useState, useEffect } from 'react';
import { Star, ArrowLeft, CheckCircle2, Loader2, Calendar, Ticket, Lock, Clock, Info } from 'lucide-react'; 
import { Link, useParams } from 'react-router-dom';
import axiosInstance from '../../config/axios';
import { message } from 'antd';

const npsEmojis = ['😡', '😠', '😞', '🙁', '😐', '🙂', '😊', '😀', '😁', '😍'];

const SubmitFeedback = () => {
  const { eventId } = useParams();

  // 1. KHAI BÁO BIẾN formTitle Ở ĐÂY NÀY BẠN
  const [eventInfo, setEventInfo] = useState({ name: 'Loading event...', date: '...' });
  const [formTitle, setFormTitle] = useState('Post-Event Feedback'); 
  const [formSchema, setFormSchema] = useState([]);
  
  // Answer state
  const [rating, setRating] = useState(0); 
  const [answers, setAnswers] = useState({}); 
  
  // UI state
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isFormActive, setIsFormActive] = useState(true); 
  const [isClosed, setIsClosed] = useState(false); 
  const [isNotYetEnded, setIsNotYetEnded] = useState(false); 
  const [isNotStarted, setIsNotStarted] = useState(false);

  // FETCH DATA
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Lấy thông tin Event 
        try {
          const eventRes = await axiosInstance.get(`/events/ids/${eventId}`);
          const eData = eventRes.data;
          
          if(eData) {
            setEventInfo({
              name: eData.eventName || eData.title || eData.name || 'Your Event',
              date: eData.startDate ? new Date(eData.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Ongoing'
            });

            if (eData.endDate && eData.startDate) {
              const eventStartTime = new Date(eData.startDate).getTime();
              const eventEndTime = new Date(eData.endDate).getTime();
              const currentTime = new Date().getTime();
              const fourteenDaysLater = eventEndTime + (14 * 24 * 60 * 60 * 1000);
              
              if (currentTime < eventStartTime) {
                setIsNotStarted(true);
              } else if (currentTime < eventEndTime) {
                setIsNotYetEnded(true);
              } else if (currentTime > fourteenDaysLater) {
                setIsClosed(true);
              }
            }
          }
        } catch (e) {
          console.error("Lấy thông tin event thất bại:", e);
          setEventInfo({ name: 'Your Event', date: 'Ongoing' });
        }

        // Lấy Form Schema
        const formRes = await axiosInstance.get(`/events/${eventId}/forms?type=FEEDBACK`);
        const fData = formRes.data?.data || formRes.data;

        if (!fData || (fData.message && (fData.message.includes("Chưa có form") || fData.message.includes("No form")))) {
           setIsFormActive(false); 
        } else {
          // 2. LẤY FORM_NAME TỪ DATABASE GÁN VÀO ĐÂY
          setFormTitle(fData.form_name || fData.formName || fData.title || fData.name || 'Post-Event Feedback');

          // Check deadline
          if (fData.deadline) {
            if (new Date().getTime() > new Date(fData.deadline).getTime()) {
              setIsClosed(true);
            }
          }

          const activeStatus = fData.active ?? fData.isActive ?? fData.is_active;
          const isActive = activeStatus === true || activeStatus === "true";
           
           if (!isActive) {
             setIsFormActive(false); 
           } else {
             setIsFormActive(true); 
             
              if (fData.formSchema) {
                let schema = fData.formSchema;
                if (typeof schema === 'string') schema = JSON.parse(schema);

                // Handle both formats: direct array [...] or object {"fields": [...]}
                if (!Array.isArray(schema) && schema.fields) {
                  schema = schema.fields;
                }

                if (Array.isArray(schema)) {
                  if (schema.length > 0 && schema[0].type === 'Form_description') {
                    schema = schema.slice(1);
                  }

                  // Normalize: ensure every field has fieldId (seed data uses "id")
                  schema = schema.map(field => ({
                    ...field,
                    fieldId: field.fieldId || field.id || `field_${Math.random()}`
                  }));

                  setFormSchema(schema);
                }
             }
           }
        }
      } catch (error) {
        console.error("Error fetching form schema:", error);
        setIsFormActive(false); 
      } finally {
        setIsLoading(false);
      }
    };

    if (eventId) fetchData();
  }, [eventId]);

  const handleAnswerChange = (fieldId, value, isCheckbox = false) => {
    setAnswers(prev => {
      if (isCheckbox) {
        const currentValues = prev[fieldId] || [];
        if (currentValues.includes(value)) {
          return { ...prev, [fieldId]: currentValues.filter(v => v !== value) };
        } else {
          return { ...prev, [fieldId]: [...currentValues, value] };
        }
      }
      return { ...prev, [fieldId]: value };
    });
  };

  // SUBMIT DATA
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (rating === 0) {
      message.warning("Please provide an overall score before submitting!");
      return;
    }

    setIsSubmitting(true);
    try {
      const feedbackDataArray = formSchema.map(field => {
        let answerValue = answers[field.fieldId];
        
        if (Array.isArray(answerValue)) {
          answerValue = answerValue.join(', ');
        }

        return {
          fieldId: field.fieldId,
          question: field.label, 
          answer: answerValue || ''
        };
      });

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

  // ===================== CÁC MÀN HÌNH TRẠNG THÁI ===================== //

  if (isLoading) return <div className="min-h-screen flex items-center justify-center bg-[#f2ede6]"><Loader2 className="animate-spin text-[#849b9f]" size={40}/></div>;
  
  if (isNotStarted) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 font-sans">
        <div className="bg-white rounded-[32px] shadow-sm max-w-md w-full p-12 text-center">
          <div className="w-20 h-20 bg-purple-50 text-purple-400 rounded-full flex items-center justify-center mx-auto mb-6">
            <Calendar size={40} />
          </div>
          <h2 className="text-2xl font-extrabold text-gray-900 mb-3">Event Not Started</h2>
          <p className="text-gray-500 font-medium mb-10 leading-relaxed">
            <strong>{eventInfo.name}</strong> has not started yet. Feedback will be available after the event concludes.
          </p>
          <Link to="/" className="block w-full py-4 bg-gray-200 hover:bg-gray-300 text-gray-600 rounded-2xl font-bold transition-all">Return to Home</Link>
        </div>
      </div>
    );
  }

  if (isNotYetEnded) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 font-sans">
        <div className="bg-white rounded-[32px] shadow-sm max-w-md w-full p-12 text-center">
          <div className="w-20 h-20 bg-blue-50 text-blue-400 rounded-full flex items-center justify-center mx-auto mb-6">
            <Info size={40} />
          </div>
          <h2 className="text-2xl font-extrabold text-gray-900 mb-3">Event Ongoing</h2>
          <p className="text-gray-500 font-medium mb-10 leading-relaxed">
            The feedback form for <strong>{eventInfo.name}</strong> will be available once the event has ended. Please check back later to share your thoughts!
          </p>
          <Link to="/" className="block w-full py-4 bg-gray-200 hover:bg-gray-300 text-gray-600 rounded-2xl font-bold transition-all">Return to Home</Link>
        </div>
      </div>
    );
  }

  if (isClosed) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 font-sans">
        <div className="bg-white rounded-[32px] shadow-sm max-w-md w-full p-12 text-center">
          <div className="w-20 h-20 bg-orange-50 text-orange-400 rounded-full flex items-center justify-center mx-auto mb-6">
            <Clock size={40} />
          </div>
          <h2 className="text-2xl font-extrabold text-gray-900 mb-3">Feedback Closed</h2>
          <p className="text-gray-500 font-medium mb-10 leading-relaxed">
            The feedback collection period for <strong>{eventInfo.name}</strong> has ended. Thank you for your interest!
          </p>
          <Link to="/" className="block w-full py-4 bg-gray-200 hover:bg-gray-300 text-gray-600 rounded-2xl font-bold transition-all">Return to Home</Link>
        </div>
      </div>
    );
  }

  if (!isFormActive) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 font-sans">
        <div className="bg-white rounded-[32px] shadow-sm max-w-md w-full p-12 text-center">
          <div className="w-20 h-20 bg-gray-100 text-gray-400 rounded-full flex items-center justify-center mx-auto mb-6">
            <Lock size={40} />
          </div>
          <h2 className="text-2xl font-extrabold text-gray-900 mb-3">Feedback Unavailable</h2>
          <p className="text-gray-500 font-medium mb-10 leading-relaxed">The feedback form for <strong>{eventInfo.name}</strong> is not available yet. It might be in draft mode or not published by the organizer.</p>
          <Link to="/" className="block w-full py-4 bg-gray-200 hover:bg-gray-300 text-gray-600 rounded-2xl font-bold transition-all">Return to Home</Link>
        </div>
      </div>
    );
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 font-sans">
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

    if (type.includes('RATING') || type.includes('STAR') || type.includes('NPS')) {
      const currentScore = answers[field.fieldId] || 0;
      
      return (
        <div className="mt-6 mb-4">
          <div className="flex justify-between w-full gap-1 sm:gap-2 mb-4">
            {npsEmojis.map((emoji, idx) => {
              const score = idx + 1;
              const isSelected = currentScore === score;
              
              return (
                <button 
                  key={idx} 
                  type="button" 
                  onClick={() => {
                    setRating(score);
                    handleAnswerChange(field.fieldId, score); 
                  }} 
                  className="flex-1 flex flex-col items-center gap-2 focus:outline-none group"
                >
                  <div className={`text-2xl sm:text-3xl transition-all duration-300 transform ${
                    isSelected 
                      ? 'grayscale-0 opacity-100 scale-125' 
                      : 'grayscale opacity-40 hover:grayscale-0 hover:opacity-100 hover:scale-110'
                  }`}>
                    {emoji}
                  </div>
                  <span className={`text-[11px] sm:text-xs font-bold transition-colors mt-1 ${
                    isSelected ? 'text-[#849b9f]' : 'text-gray-400 group-hover:text-[#849b9f]'
                  }`}>
                    {score}
                  </span>
                </button>
              );
            })}
          </div>
          <div className="flex justify-between text-[10px] sm:text-[11px] font-bold text-gray-400 uppercase tracking-wider px-2 mt-2">
            <span>{field.leftLabel || 'Poor'}</span>
            <span>{field.rightLabel || 'Excellent'}</span>
          </div>
        </div>
      );
    }

    if (type.includes('CHECKBOX') || type.includes('MULTIPLE')) {
      return (
        <div className="flex flex-wrap gap-3 mt-4">
          {field.options?.map((opt, i) => {
            const currentAnswers = answers[field.fieldId] || [];
            const isSelected = currentAnswers.includes(opt);
            return (
              <button 
                key={i} 
                type="button"
                onClick={() => handleAnswerChange(field.fieldId, opt, true)} 
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

    if (type.includes('RADIO') || type.includes('CHOICE')) {
      return (
        <div className="flex flex-wrap gap-3 mt-4">
          {field.options?.map((opt, i) => {
            const isSelected = answers[field.fieldId] === opt;
            return (
              <button 
                key={i} 
                type="button"
                onClick={() => handleAnswerChange(field.fieldId, opt, false)}
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

    if (type.includes('LONG') || type.includes('PARAGRAPH') || type.includes('COMMENT') || type.includes('OPEN_COMMENT')) {
      return (
        <textarea 
          rows="4" 
          required={field.required} 
          placeholder={field.placeholder || "Tell us your thoughts..."} 
          value={answers[field.fieldId] || ''} 
          onChange={(e) => handleAnswerChange(field.fieldId, e.target.value)} 
          className="w-full mt-4 bg-[#f6f5f2] border-transparent rounded-[20px] p-5 text-gray-800 font-medium outline-none focus:ring-2 focus:ring-[#849b9f] focus:bg-white transition-all resize-none placeholder-gray-400"
        ></textarea>
      );
    }

    return (
      <input 
        type="text" 
        required={field.required} 
        placeholder={field.placeholder || "Your answer..."} 
        value={answers[field.fieldId] || ''} 
        onChange={(e) => handleAnswerChange(field.fieldId, e.target.value)} 
        className="w-full mt-4 bg-[#f6f5f2] border-transparent rounded-[20px] p-5 text-gray-800 font-medium outline-none focus:ring-2 focus:ring-[#849b9f] focus:bg-white transition-all placeholder-gray-400" 
      />
    );
  };

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 font-sans">
      <div className="max-w-3xl mx-auto">
        
        <Link to="/" className="inline-flex items-center gap-2 text-gray-400 hover:text-gray-800 font-bold text-sm mb-8 transition-colors">
          <ArrowLeft size={16} /> Back to Event
        </Link>

        <div className="bg-white rounded-[32px] shadow-sm p-8 sm:p-14">
          
          <div className="flex flex-col sm:flex-row justify-between items-start gap-6 border-b border-gray-100 pb-10 mb-10">
            <div>
              <span className="text-[#849b9f] text-[11px] font-extrabold uppercase tracking-widest">{eventInfo.name}</span>
              {/* 3. HIỂN THỊ formTitle TO RÕ RÀNG Ở ĐÂY */}
              <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mt-3 mb-4 tracking-tight leading-tight">{formTitle}</h1>
              <div className="flex items-center gap-2 text-sm font-bold text-gray-400">
                <Calendar size={16} />
                <span>{eventInfo.date}</span>
              </div>
              <div className="mt-4 flex items-start gap-2 text-sm text-orange-600 bg-orange-50 p-3 rounded-xl border border-orange-100">
                <Info size={18} className="mt-0.5 shrink-0" />
                <p><strong>Notice:</strong> Feedback submission is only available for <strong>14 days</strong> after the event ends.</p>
              </div>
            </div>
            <div className="bg-[#f6f5f2] rounded-2xl p-4 flex items-center gap-3 shrink-0">
              <div className="bg-white p-2 rounded-lg text-[#849b9f] shadow-sm"><Ticket size={20}/></div>
              <div>
                <p className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider">Status</p>
                <p className="text-sm font-extrabold text-gray-800">Attended</p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="space-y-12">
              {formSchema.map((field) => {
                const isStarRating = field.type && (field.type.toUpperCase().includes('NPS') || field.type.toUpperCase().includes('STAR'));
                
                return (
                  <div key={field.fieldId} className={isStarRating ? "text-center" : ""}>
                    <label className={`block font-extrabold text-gray-800 ${isStarRating ? 'text-xl mb-2' : 'text-sm mb-3'}`}>
                      {field.label} {field.required && <span className="text-red-500">*</span>}
                    </label>
                    {renderInput(field)}
                  </div>
                );
              })}
            </div>

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