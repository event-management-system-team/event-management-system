import StatCards from "../../components/domain/feedback-analytic/StatCards";
import RatingBarChart from "../../components/domain/feedback-analytic/RatingBarChart";
import ReviewsList from "../../components/domain/feedback-analytic/ReviewsList";
import Sidebar from "../../components/layout/Sidebar";

export default function AnalyticsPage() {
  return (
    <div className="flex min-h-screen bg-[#f8f7f2] font-sans w-full">
      <Sidebar />
      <div className="flex-1 ml-0 lg:ml-64 p-4 md:p-8 lg:p-10 w-full overflow-x-hidden space-y-4 md:space-y-6">
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

        <StatCards />

        <RatingBarChart />

        <ReviewsList />
      </div>
    </div>
  );
}
