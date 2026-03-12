import { Calendar, DollarSign, Target, Users, Zap } from "lucide-react";
import { Card, CardContent } from "../admin/Card";

const GlobalAnalyticsCard = ({ summary, formatVND, formatNumber }) => {

    const formatTotalNumber = (num) => {
        return Number(num).toLocaleString('en-US')
    }

    const globalMetrics = [
        {
            title: "TOTAL EVENTS",
            value: formatTotalNumber(summary?.totalEvents),
            icon: Calendar,
            iconBg: "bg-blue-100",
            iconColor: "text-blue-600"
        },
        {
            title: "ACTIVE EVENTS",
            value: formatTotalNumber(summary?.activeEvents),
            icon: Zap,
            iconBg: "bg-green-100",
            iconColor: "text-green-600"
        },
        {
            title: "TOTAL TICKETS SOLD",
            value: formatTotalNumber(summary?.totalTicketsSold),
            icon: Target,
            iconBg: "bg-purple-100",
            iconColor: "text-purple-600"
        },
        {
            title: "TOTAL REVENUE",
            value: formatVND(summary?.totalRevenue),
            icon: DollarSign,
            iconBg: "bg-emerald-100",
            iconColor: "text-emerald-600"
        },
        {
            title: "AVG ATTENDANCE RATE",
            value: `${formatNumber(summary?.averageAttendanceRate)} %`,
            icon: Users,
            iconBg: "bg-orange-100",
            iconColor: "text-orange-600"
        }
    ]

    return (
        <div className="grid grid-cols-5 gap-4 p-8 pb-6">
            {globalMetrics.map((metric, index) => {
                const Icon = metric.icon

                return (
                    <Card key={index} className="bg-[#f7f7f7] shadow-sm border border-gray-200">
                        <CardContent className="p-5">
                            <div className="flex items-start justify-between mb-2">
                                <div
                                    className={`w-9 h-9 ${metric.iconBg} rounded-lg flex items-center justify-center`}
                                >
                                    <Icon className={`h-4 w-4 ${metric.iconColor}`} />
                                </div>
                            </div>
                            <div className="text-xs text-gray-500 mb-1 tracking-wide">
                                {metric.title}
                            </div>
                            <div className="text-2xl font-semibold text-gray-900">
                                {metric.value}
                            </div>
                        </CardContent>
                    </Card>
                )
            })}
        </div>
    )
};

export default GlobalAnalyticsCard;