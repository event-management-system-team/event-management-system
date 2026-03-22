import { useState } from "react";
import { useFeedbackReviews } from "../../../hooks/useFeedbackReviews";
import { Pagination } from "antd";

export default function ReviewsList({ eventId }) {
  const [page, setPage] = useState(0);
  const { reviews, totalPages, totalElements, isLoading, isError } =
    useFeedbackReviews(eventId, page);

  return (
    <div className="bg-[#f7f7f7] rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="px-4 md:px-6 py-4 border-b border-gray-100 flex justify-between items-center">
        <h3 className="text-base font-bold">
          Recent Attendee Reviews
          {totalElements > 0 && (
            <span className="ml-2 text-sm font-normal text-gray-400">
              ({totalElements})
            </span>
          )}
        </h3>
      </div>

      {/* Loading skeleton */}
      {isLoading && (
        <div className="divide-y divide-gray-100">
          {[1, 2, 3].map((i) => (
            <div key={i} className="p-4 md:p-5 flex gap-4 animate-pulse">
              <div className="w-10 h-10 rounded-full bg-gray-200 shrink-0" />
              <div className="flex-1 space-y-2 pt-1">
                <div className="h-3 bg-gray-200 rounded w-1/4" />
                <div className="h-3 bg-gray-200 rounded w-3/4" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Error */}
      {isError && (
        <p className="p-8 text-center text-sm text-red-400">
          Something went wrong!
        </p>
      )}

      {/* List */}
      {!isLoading && !isError && (
        <div className="divide-y divide-gray-100">
          {reviews.length === 0 && (
            <p className="p-8 text-center text-sm text-gray-400">
              No reviews yet.
            </p>
          )}
          {reviews.map((review) => (
            <ReviewCard key={review.feedbackId} review={review} />
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalElements > 10 && (
        <div className="px-6 py-4 flex justify-center w-full border-t border-gray-100 bg-white">
          <Pagination
            align="center"
            responsive
            current={page + 1}
            pageSize={10}
            showSizeChanger={false}
            total={totalElements}
            onChange={(newPage) => setPage(newPage - 1)}
          />
        </div>
      )}
    </div>
  );
}

function ReviewCard({ review }) {
  const initials =
    review.attendeeName
      ?.split(" ")
      .map((w) => w[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() ?? "??";

  return (
    <div className="p-4 md:p-5 flex gap-3 md:gap-4 hover:bg-gray-50 transition-colors">
      <div className="w-10 h-10 rounded-full flex items-center justify-center bg-gray-200 text-gray-600 text-xs font-bold shrink-0 overflow-hidden">
        {review.avatarUrl ? (
          <img
            src={review.avatarUrl}
            alt={review.attendeeName}
            className="w-full h-full object-cover"
          />
        ) : (
          initials
        )}
      </div>

      <div className="flex-1 space-y-1">
        <div className="flex justify-between items-start">
          <div>
            <h4 className="font-semibold text-sm">{review.attendeeName}</h4>
            <p className="text-xs text-gray-400">
              {new Date(review.submittedAt).toLocaleDateString("vi-VN")}
            </p>
          </div>
          <span className="px-2 py-1 text-xs border rounded-full">
            {review.rating}/10
          </span>
        </div>
        {review.comment && (
          <p className="text-sm text-gray-600">{review.comment}</p>
        )}
      </div>
    </div>
  );
}
