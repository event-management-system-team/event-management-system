import React from 'react';
import FeedbackItem from './FeedbackItem';

const FeedbackList = ({ feedbacks, isLoading }) => {
  if (isLoading) {
    return <div className="p-8 text-center text-gray-500">Đang tải danh sách đánh giá...</div>;
  }

  // Kiểm tra biến boolean bắt đầu bằng is/has
  const hasFeedbacks = feedbacks && feedbacks.length > 0;

  if (!hasFeedbacks) {
    return (
      <div className="flex flex-col items-center justify-center p-8 bg-gray-50 rounded-lg">
        <p className="text-gray-500">Chưa có đánh giá nào cho sự kiện này.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="p-4 border-b border-gray-200 bg-gray-50 rounded-t-lg">
        <h3 className="font-bold text-gray-700">Đánh giá từ người tham gia ({feedbacks.length})</h3>
      </div>
      <div className="divide-y divide-gray-100">
        {feedbacks.map((item) => (
          <FeedbackItem key={item.id} feedback={item} />
        ))}
      </div>
    </div>
  );
};

export default FeedbackList;