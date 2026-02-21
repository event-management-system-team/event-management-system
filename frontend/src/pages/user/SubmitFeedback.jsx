import React, { useState } from 'react';
import { Star, Send, ArrowLeft, CheckCircle2, Ticket } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';

const SubmitFeedback = () => {
  const { eventId } = useParams(); // Lấy ID sự kiện từ URL

  // Quản lý trạng thái form
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [nps, setNps] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Xử lý khi bấm nút Gửi
  const handleSubmit = (e) => {
    e.preventDefault();
    // Ở đây sau này bạn sẽ gọi API lưu xuống Backend
    setIsSubmitted(true);
  };

  // MÀN HÌNH SAU KHI GỬI THÀNH CÔNG
  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-[#f8f7f2] flex items-center justify-center p-6 font-sans">
        <div className="bg-white rounded-3xl shadow-xl max-w-md w-full p-10 text-center border border-gray-100">
          <div className="w-20 h-20 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 size={40} />
          </div>
          <h2 className="text-2xl font-extrabold text-gray-900 mb-3">Thank You!</h2>
          <p className="text-gray-500 font-medium mb-8 leading-relaxed">
            Your feedback for <strong>BridgeFest 2025</strong> has been successfully submitted. We appreciate your time!
          </p>
          <Link to="/" className="block w-full py-3.5 bg-[#8c9db3] hover:bg-[#7a8ca3] text-white rounded-xl font-bold transition-all shadow-md">
            Back to My Tickets
          </Link>
        </div>
      </div>
    );
  }

  // MÀN HÌNH ĐIỀN FORM
  return (
    <div className="min-h-screen bg-[#f4f3ed] py-12 px-4 sm:px-6 font-sans">
      <div className="max-w-3xl mx-auto">
        
        {/* Nút Back */}
        <Link to="/" className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-900 font-bold text-sm mb-6 transition-colors">
          <ArrowLeft size={16} /> Back to My Tickets
        </Link>

        {/* Card Form */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
          
          {/* Cover Image & Event Info */}
          <div className="h-48 relative flex items-end p-8">
            <img 
              src="https://images.unsplash.com/photo-1540039155733-d7696c4826c5?q=80&w=1000&auto=format&fit=crop" 
              alt="Event Cover" 
              className="absolute inset-0 w-full h-full object-cover brightness-50" 
            />
            <div className="relative z-10 w-full">
              <span className="inline-flex items-center gap-1.5 bg-white/20 backdrop-blur-md text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-3">
                <Ticket size={14} /> VIP Access
              </span>
              <h1 className="text-3xl font-extrabold text-white tracking-tight drop-shadow-md">BridgeFest 2025</h1>
              <p className="text-gray-200 font-medium text-sm mt-1 drop-shadow">Oct 12, 2025 • My Dinh Stadium</p>
            </div>
          </div>

          {/* Form Content */}
          <form onSubmit={handleSubmit} className="p-8 sm:p-12">
            <div className="mb-10 text-center">
              <h2 className="text-2xl font-extrabold text-gray-900 mb-2">How was your experience?</h2>
              <p className="text-gray-500 font-medium">We'd love to hear your thoughts to make our next event even better.</p>
            </div>

            <div className="space-y-10">
              
              {/* Question 1: Star Rating (Clickable) */}
              <div className="bg-[#f8fbff] border border-[#8c9db3]/30 rounded-2xl p-8 text-center shadow-sm">
                <label className="block text-lg font-bold text-gray-800 mb-6">
                  1. Rate your overall experience <span className="text-red-500">*</span>
                </label>
                <div className="flex justify-center gap-2 sm:gap-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      className="transition-transform hover:scale-110 focus:outline-none"
                    >
                      <Star 
                        size={48} 
                        className={`transition-colors duration-200 ${
                          star <= (hoverRating || rating) 
                            ? 'text-yellow-400 fill-yellow-400 drop-shadow-md' 
                            : 'text-gray-200'
                        }`} 
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Question 2: NPS Score */}
              <div>
                <label className="block text-base font-bold text-gray-800 mb-4">
                  2. How likely are you to recommend this event to a friend?
                </label>
                <div className="flex justify-between gap-1 sm:gap-2">
                  {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setNps(num)}
                      className={`flex-1 py-3 rounded-lg font-bold text-sm transition-all border ${
                        nps === num 
                          ? 'bg-[#8c9db3] text-white border-[#8c9db3] shadow-md scale-105' 
                          : 'bg-white text-gray-500 border-gray-200 hover:border-[#8c9db3] hover:text-[#8c9db3]'
                      }`}
                    >
                      {num}
                    </button>
                  ))}
                </div>
                <div className="flex justify-between text-xs font-bold text-gray-400 uppercase tracking-wider mt-2 px-1">
                  <span>Not likely</span>
                  <span>Very likely</span>
                </div>
              </div>

              {/* Question 3: Open Text (Favorite) */}
              <div>
                <label className="block text-base font-bold text-gray-800 mb-3">
                  3. What did you love most about the event?
                </label>
                <textarea 
                  rows="3"
                  className="w-full border border-gray-200 rounded-xl p-4 text-gray-700 font-medium outline-none focus:border-[#8c9db3] focus:ring-2 focus:ring-[#8c9db3]/20 transition-all resize-none bg-gray-50 focus:bg-white"
                  placeholder="Tell us about your favorite performances, activities..."
                ></textarea>
              </div>

              {/* Question 4: Open Text (Improvement) */}
              <div>
                <label className="block text-base font-bold text-gray-800 mb-3">
                  4. What could we improve for next time?
                </label>
                <textarea 
                  rows="3"
                  className="w-full border border-gray-200 rounded-xl p-4 text-gray-700 font-medium outline-none focus:border-[#8c9db3] focus:ring-2 focus:ring-[#8c9db3]/20 transition-all resize-none bg-gray-50 focus:bg-white"
                  placeholder="Any issues with check-in, facilities, or schedule?"
                ></textarea>
              </div>

            </div>

            {/* Submit Button */}
            <div className="mt-12 pt-8 border-t border-gray-100 flex justify-end">
              <button 
                type="submit" 
                disabled={rating === 0} // Vô hiệu hóa nếu chưa chọn sao
                className={`px-8 py-4 rounded-xl font-bold text-base flex items-center gap-2 transition-all shadow-md ${
                  rating > 0 
                    ? 'bg-[#8c9db3] hover:bg-[#7a8ca3] text-white hover:-translate-y-1' 
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
              >
                Submit Feedback <Send size={18} />
              </button>
            </div>
            
            {rating === 0 && (
              <p className="text-right text-red-400 text-sm font-medium mt-2">
                * Please select a star rating before submitting.
              </p>
            )}

          </form>
        </div>
      </div>
    </div>
  );
};

export default SubmitFeedback;