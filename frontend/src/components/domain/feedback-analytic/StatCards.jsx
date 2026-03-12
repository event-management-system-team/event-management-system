// src/components/domain/feedback-analytic/StatCards.jsx

export default function StatCards({
  averageRating,
  totalResponses,
  positiveFeedbackPct,
  isLoading,
}) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="bg-[#f7f7f7] rounded-2xl p-4 md:p-5 h-28 animate-pulse"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
      <div className="bg-[#f7f7f7] rounded-2xl p-4 md:p-5">
        <p className="text-xs text-gray-400 font-bold uppercase">
          Average Rating
        </p>
        <p className="text-4xl font-black">
          {averageRating ?? "—"}
          <span className="text-xl font-semibold text-gray-300">/10</span>
        </p>
      </div>

      <div className="bg-[#f7f7f7] rounded-2xl p-4 md:p-5">
        <p className="text-xs text-gray-400 font-bold uppercase">
          Total Responses
        </p>
        <p className="text-4xl font-black">{totalResponses ?? "—"}</p>
        <p className="text-xs font-bold text-emerald-500 mt-3">
          ↑ +12% from last event
        </p>
      </div>

      <div className="bg-[#f7f7f7] rounded-2xl p-4 md:p-5">
        <p className="text-xs text-gray-400 font-bold uppercase">
          Positive Feedback
        </p>
        <p className="text-4xl font-black">{positiveFeedbackPct ?? "—"}%</p>
        <div className="mt-3">
          <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
            <div
              className="bg-emerald-500 h-2 rounded-full transition-all duration-700"
              style={{ width: `${positiveFeedbackPct ?? 0}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
