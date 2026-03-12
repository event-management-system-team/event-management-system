import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function RatingBarChart() {
  const ratingDistribution = [
    { score: 1, count: 3 },
    { score: 2, count: 4 },
    { score: 3, count: 8 },
    { score: 4, count: 10 },
    { score: 5, count: 15 },
    { score: 6, count: 22 },
    { score: 7, count: 38 },
    { score: 8, count: 55 },
    { score: 9, count: 52 },
    { score: 10, count: 100 },
  ];

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
