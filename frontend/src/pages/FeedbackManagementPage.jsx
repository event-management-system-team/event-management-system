import React from 'react';
import { useParams } from 'react-router-dom';
import { useFeedbackList } from '@/hooks/useFeedback';
import FeedbackList from '@/components/feedback/FeedbackList';

const FeedbackManagementPage = () => {
  // 1. Lấy param từ URL (Route)
  const { eventId } = useParams();

  // 2. Gọi Hook để lấy dữ liệu (Logic tách biệt khỏi UI)
  const { feedbackList, isLoading, hasError, errorMessage } = useFeedbackList(eventId);

  // 3. Xử lý lỗi UI tại Page level
  if (hasError) {
    return <div className="text-red-500 p-4">Lỗi: {errorMessage}</div>;
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Quản lý phản hồi</h1>
        <p className="text-gray-500">Xem ý kiến của người tham gia về sự kiện này.</p>
      </div>

      {/* Truyền data xuống Component hiển thị */}
      <FeedbackList 
        feedbacks={feedbackList} 
        isLoading={isLoading} 
      />
    </div>
  );
};

export default FeedbackManagementPage;