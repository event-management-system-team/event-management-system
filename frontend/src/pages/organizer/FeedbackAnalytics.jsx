import { useParams, Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useFeedbackAnalytics } from "../../hooks/useFeedbackAnalytics";
import axiosInstance from "../../config/axios";

import { ArrowLeft, Plus } from "lucide-react";
import StatCards from "../../components/domain/feedback-analytic/StatCards";
import RatingBarChart from "../../components/domain/feedback-analytic/RatingBarChart";
import ReviewsList from "../../components/domain/feedback-analytic/ReviewsList";

export default function AnalyticsPage() {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const { analytics, isLoading, isError } = useFeedbackAnalytics(eventId);
  const [eventName, setEventName] = useState("");

  useEffect(() => {
    if (!eventId) return;
    axiosInstance.get(`/organizer/events/${eventId}`)
      .then((res) => {
        const data = res.data?.data || res.data;
        setEventName(data?.eventName || data?.name || "This Event");
      })
      .catch(() => setEventName("This Event"));
  }, [eventId]);

  return (
    <div className="p-4 md:p-8 lg:p-10 w-full space-y-4 md:space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
             <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-4 text-gray-400 hover:text-gray-700 text-sm font-medium mb-3 transition-colors group"
          >
            <ArrowLeft size={20} className="group-hover:-translate-x-0.5 transition-transform" />
            <h1 className="text-2xl md:text-3xl font-black text-[#1e2d3d] tracking-tight">
              Feedback & Reviews
            </h1>
            </button>
            <p className="text-gray-500 text-sm mt-1">
              Analytic Dashboard for{" "}
              <span className="text-[#89A8B2] font-semibold">
                {eventName || "..."}
              </span>
            </p>
          </div>
          <div className="flex gap-2">
            <Link
              to={`/organizer/feedback/feedbacklist/${eventId}`}
              className="flex-1 sm:flex-none justify-center bg-white text-[#8c9db3] px-4 sm:px-5 py-2 sm:py-2.5 rounded-lg flex items-center gap-2 text-xs sm:text-sm font-bold shadow-md transition-all active:scale-95"
            >
              < span className="whitespace-nowrap">View All Feedback</span>
            </Link>
            <Link
              to={`/organizer/feedback/createform/${eventId}`}
              className="flex-1 sm:flex-none justify-center bg-[#8c9db3] hover:bg-[#7a8ca3] text-white border border-red-100 px-4 sm:px-5 py-2 sm:py-2.5 rounded-lg flex items-center gap-2 text-xs sm:text-sm font-bold shadow-sm cursor-not-allowed"
            >
              <Plus
                size={16}
                strokeWidth={2.5} 
                className="sm:w-[18px] sm:h-[18px]"
              />{" "}
              <span className="whitespace-nowrap">Create Feedback Form</span>
            </Link>
          </div>
        </div>

        {isError && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl">
            Something went wrong!
          </div>
        )}

        <StatCards
          averageRating={analytics?.averageRating}
          totalResponses={analytics?.totalResponses}
          positiveFeedbackPct={analytics?.positiveFeedbackPct}
          isLoading={isLoading}
        />

        <RatingBarChart
          ratingDistribution={analytics?.ratingDistribution ?? []}
          isLoading={isLoading}
        />

        <ReviewsList eventId={eventId} />
    </div>
  );
}
