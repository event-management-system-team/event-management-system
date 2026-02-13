import React from 'react';
import { formatDate } from '@/utils/formatDate'; // Giả sử có util này

const FeedbackItem = ({ feedback }) => {
  // Destructuring để tránh dùng biến mơ hồ "obj"
  const { userAvatar, userName, rating, comment, createdAt } = feedback;

  // Helper render sao (UI logic nhỏ nằm trong component là ok)
  const renderStars = (count) => {
    return Array.from({ length: 5 }, (_, index) => (
      <span key={index} className={index < count ? "text-yellow-400" : "text-gray-300"}>
        ★
      </span>
    ));
  };

  return (
    <div className="flex gap-4 p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors">
      {/* Avatar */}
      <img 
        src={userAvatar || "https://via.placeholder.com/40"} 
        alt={userName} 
        className="w-10 h-10 rounded-full object-cover"
      />

      {/* Content */}
      <div className="flex-1">
        <div className="flex justify-between items-start">
          <div>
            <h4 className="font-semibold text-gray-800">{userName}</h4>
            <div className="flex items-center text-sm mt-1">
              {renderStars(rating)}
            </div>
          </div>
          <span className="text-xs text-gray-400">{formatDate(createdAt)}</span>
        </div>
        
        <p className="mt-2 text-gray-600 text-sm leading-relaxed">
          {comment}
        </p>
      </div>
    </div>
  );
};

export default FeedbackItem;