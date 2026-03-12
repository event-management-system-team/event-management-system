import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./Card";
import {
    LineChart,
    Line,
    BarChart,
    Bar,
    PieChart,
    Pie,
    Cell,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer
} from 'recharts';

const EventChart = ({ monthlySales, topRevenueEvents, categoryDis, formatVND }) => {

    const formatMonth = (month) => {
        if (!month) return ""
        return month.toLowerCase().charAt(0).toUpperCase() + month.slice(1).toLowerCase()
    }

    const monthlySalesData = monthlySales.map((item, index) => ({
        month: formatMonth(item.month),
        sales: item.ticketsSold,
        revenue: item.revenue
    }))

    const categoryDistributionData = categoryDis.map((item, index) => ({
        name: item.categoryName,
        color: item.colorCode,
        events: item.count,
    }))

    const topRevenueEventsData = topRevenueEvents.map((item, index) => ({
        event: item.eventName,
        revenue: item.revenue
    }))

    return (
        <div className="grid grid-cols-2 gap-5 px-8 pb-6">

            {/* Ticket Sales By Month */}
            <Card className="bg-[#f7f7f7] shadow-sm border border-gray-200" id="ticketsSold">
                <CardHeader className="border-b border-gray-100">
                    <CardTitle className="text-xl font-semibold text-gray-700">Ticket Sales Trend</CardTitle>
                    <CardDescription>
                        Monthly ticket sales performance
                    </CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                    {!monthlySalesData || monthlySalesData.length === 0 ? (
                        <div className="flex items-center justify-center h-[200px] text-sm text-gray-400">
                            No data available
                        </div>
                    ) : (
                        <ResponsiveContainer width='100%' height={240}>
                            <LineChart data={monthlySalesData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                                <XAxis
                                    dataKey="month"
                                    tick={{ fontSize: 12 }}
                                    stroke="#6B7280"
                                />
                                <YAxis tick={{ fontSize: 12 }} stroke="#6B7280" />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: "#fff",
                                        border: "1px solid #E5E7EB",
                                        borderRadius: "6px",
                                        fontSize: "12px"
                                    }}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="sales"
                                    stroke="#3B82F6"
                                    strokeWidth={2}
                                    dot={{ r: 4 }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    )}
                </CardContent>
            </Card>

            {/* Revenue By Month */}
            <Card className="bg-[#f7f7f7] shadow-sm border border-gray-200">
                <CardHeader className="border-b border-gray-100">
                    <CardTitle className="text-xl font-semibold text-gray-700">Revenue Trend</CardTitle>
                    <CardDescription>
                        Monthly revenue
                    </CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                    {!monthlySalesData || monthlySalesData.length === 0 ? (
                        <div className="flex items-center justify-center h-[200px] text-sm text-gray-400">
                            No data available
                        </div>
                    ) : (
                        <ResponsiveContainer width="100%" height={240}>
                            <BarChart data={monthlySalesData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                                <XAxis
                                    dataKey="month"
                                    tick={{ fontSize: 11 }}
                                    stroke="#6B7280"
                                />
                                <YAxis tick={{ fontSize: 12 }} stroke="#6B7280" />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: "#fff",
                                        border: "1px solid #E5E7EB",
                                        borderRadius: "6px",
                                        fontSize: "12px"
                                    }}
                                    formatter={value => `${formatVND(value)}`}
                                />
                                <Bar dataKey="revenue" fill="#10B981" radius={[6, 6, 0, 0]} barSize={80} />
                            </BarChart>
                        </ResponsiveContainer>
                    )}
                </CardContent>
            </Card>

            {/* Event Category Distribution */}
            <Card className="bg-[#f7f7f7] shadow-sm border border-gray-200">
                <CardHeader className="border-b border-gray-100">
                    <CardTitle className="text-xl font-semibold text-gray-700">Event Distribution</CardTitle>
                    <CardDescription>Events by category breakdown</CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                    {!categoryDistributionData || categoryDistributionData.length === 0 ? (
                        <div className="flex items-center justify-center h-[200px] text-sm text-gray-400">
                            No data available
                        </div>
                    ) : (
                        <ResponsiveContainer width="100%" height={240}>
                            <PieChart>
                                <Pie
                                    data={categoryDistributionData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={100}
                                    paddingAngle={2}
                                    dataKey="events"
                                    nameKey="name"
                                >
                                    {categoryDistributionData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: "#fff",
                                        border: "1px solid #E5E7EB",
                                        borderRadius: "6px",
                                        fontSize: "12px"
                                    }}
                                />
                                <Legend
                                    layout="vertical"
                                    align="right"
                                    verticalAlign="middle"
                                    iconType="circle"
                                    iconSize={8}
                                    wrapperStyle={{ fontSize: "11px" }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    )}
                </CardContent>
            </Card>

            {/* Top Events By Revenue */}
            <Card className="bg-[#f7f7f7] shadow-sm border border-gray-200">
                <CardHeader className="border-b border-gray-100">
                    <CardTitle className="text-xl font-semibold text-gray-700">Revenue by Event</CardTitle>
                    <CardDescription>
                        Top performing events by revenue
                    </CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                    {!topRevenueEventsData || topRevenueEventsData.length === 0 ? (
                        <div className="flex items-center justify-center h-[200px] text-sm text-gray-400">
                            No data available
                        </div>
                    ) : (
                        <ResponsiveContainer width="100%" height={240}>
                            <BarChart data={topRevenueEventsData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                                <XAxis
                                    dataKey="event"
                                    tick={{ fontSize: 11 }}
                                    stroke="#6B7280"
                                />
                                <YAxis tick={{ fontSize: 12 }} stroke="#6B7280" />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: "#fff",
                                        border: "1px solid #E5E7EB",
                                        borderRadius: "6px",
                                        fontSize: "12px"
                                    }}
                                    formatter={value => `${formatVND(value)}`}
                                />
                                <Bar dataKey="revenue" fill="#2e96ea" radius={[6, 6, 0, 0]} barSize={60} />
                            </BarChart>
                        </ResponsiveContainer>
                    )}
                </CardContent>
            </Card>
        </div>
    )
};

export default EventChart;