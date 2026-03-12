import { useParams } from "react-router-dom";
import { useFeedbackAnalytics } from "../../hooks/useFeedbackAnalytics";

import StatCards from "../../components/domain/feedback-analytic/StatCards";
import RatingBarChart from "../../components/domain/feedback-analytic/RatingBarChart";
import ReviewsList from "../../components/domain/feedback-analytic/ReviewsList";

export default function AnalyticsPage() {
  const { eventId } = useParams();
  const { analytics, isLoading, isError } = useFeedbackAnalytics(eventId);

  return (
    <div className="p-4 md:p-8 lg:p-10 w-full space-y-4 md:space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-black text-[#1e2d3d] tracking-tight">
              Feedback & Reviews
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              Analytic Dashboard for{" "}
              <span className="text-[#89A8B2] font-semibold">
                Annual Tech Summit 2023
              </span>
            </p>
          </div>
          <div className="flex gap-2">
            <button className="px-4 py-2 bg-white border border-gray-200 rounded-full text-sm font-semibold hover:bg-gray-50 shadow-sm">
              ↓ Export
            </button>
            <button
              onClick={() => console.log("Create Feedback Form")}
              className="px-5 py-2 bg-[#89A8B2] text-white rounded-full text-sm font-bold hover:opacity-90 shadow-md"
            >
              + Create Feedback Form
            </button>
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
