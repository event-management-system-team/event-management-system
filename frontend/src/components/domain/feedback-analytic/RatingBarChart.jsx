// src/components/domain/feedback-analytic/RatingBarChart.jsx
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function RatingBarChart({ ratingDistribution = [], isLoading }) {
  if (isLoading) {
    return (
      <div className="bg-[#f7f7f7] rounded-2xl p-4 md:p-6 h-64 animate-pulse" />
    );
  }

  return (
    <div className="bg-[#f7f7f7] rounded-2xl p-4 md:p-6 text-sm">
      <h3 className="font-bold mb-4">Rating Distribution</h3>
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={ratingDistribution}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="score" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="count" fill="#8aa8b2" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
