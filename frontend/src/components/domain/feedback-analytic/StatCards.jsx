export default function StatCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
      <div className="bg-[#f7f7f7] rounded-2xl p-4 md:p-5">
        <p className="text-xs text-gray-400 font-bold uppercase">
          Average Rating
        </p>

        <p className="text-4xl font-black">
          7.8<span className="text-xl font-semibold text-gray-300">/10</span>
        </p>
      </div>

      <div className="bg-[#f7f7f7] rounded-2xl p-4 md:p-5">
        <p className="text-xs text-gray-400 font-bold uppercase">
          Total Responses
        </p>
        <p className="text-4xl font-black">245</p>
        <p className="text-xs font-bold text-emerald-500 mt-3 flex items-center gap-1">
          ↑ +12% from last event
        </p>
      </div>

      <div className="bg-[#f7f7f7] rounded-2xl p-4 md:p-5">
        <p className="text-xs text-gray-400 font-bold uppercase">
          Positive Feedback
        </p>
        <p className="text-4xl font-black">92%</p>
        <div className="mt-3 space-y-1.5">
          <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
            <div
              className="bg-emerald-500 h-2 rounded-full transition-all duration-700"
              style={{ width: `${92}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
