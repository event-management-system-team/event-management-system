export default function ReviewsList() {
  const recentReviews = [
    {
      feedbackId: "1",
      attendeeName: "Sarah Jenkins",
      rating: 9,
      comment: "Keynote về Future of AI rất ấn tượng!",
      submittedAt: "2023-10-12T10:30:00",
    },

    {
      feedbackId: "2",
      attendeeName: "Sarah Jenkins",
      rating: 9,
      comment: "Keynote về Future of AI rất ấn tượng!",
      submittedAt: "2023-10-12T10:30:00",
    },

    {
      feedbackId: "3",
      attendeeName: "Sarah Jenkins",
      rating: 9,
      comment: "Keynote về Future of AI rất ấn tượng!",
      submittedAt: "2023-10-12T10:30:00",
    },
  ];

  return (
    <div className="bg-[#f7f7f7] rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="px-4 md:px-6 py-4 border-b border-gray-100">
        <h3 className="text-base font-bold">Recent Attendee Reviews</h3>
      </div>

      <div className="divide-y divide-gray-100">
        {recentReviews.map((review) => {
          const initials = review.attendeeName
            .split(" ")
            .map((w) => w[0])
            .join("")
            .slice(0, 2)
            .toUpperCase();

          return (
            <div
              key={review.feedbackId}
              className="p-4 md:p-5 flex gap-3 md:gap-4 hover:bg-gray-50 transition-colors"
            >
              <div className="w-10 h-10 rounded-full flex items-center justify-center bg-gray-200 text-gray-600 text-xs font-bold">
                {initials}
              </div>

              <div className="flex-1 space-y-1">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-semibold text-sm">
                      {review.attendeeName}
                    </h4>

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
        })}
      </div>
    </div>
  );
}
