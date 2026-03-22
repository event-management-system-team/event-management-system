import { Calendar, CalendarCheck, CheckCircle, Zap } from "lucide-react";
import { Card, CardContent } from "../admin/Card";

const EventSummaryCard = ({ summary }) => {

    const summaryMetrics = (summary) => [
        {
            title: "TOTAL EVENTS",
            value: summary?.totalEvents ?? 0,
            icon: Calendar,
            iconBg: "bg-blue-100",
            iconColor: "text-blue-600"
        },
        {
            title: "ACTIVE",
            value: summary?.activeEvents ?? 0,
            icon: Zap,
            iconBg: "bg-green-100",
            iconColor: "text-green-600"
        },
        {
            title: "PENDING",
            value: summary?.pendingEvents ?? 0,
            icon: CalendarCheck,
            iconBg: "bg-orange-100",
            iconColor: "text-orange-600"
        },
        {
            title: "COMPLETED",
            value: summary?.completedEvents ?? 0,
            icon: CheckCircle,
            iconBg: "bg-gray-200",
            iconColor: "text-gray-600"
        }
    ]

    const metrics = summaryMetrics(summary);

    return (
        <div className="grid grid-cols-4 gap-5 p-8">
            {metrics.map((metric, index) => {
                const Icon = metric.icon
                return (<Card key={index} className="bg-[#f7f7f7] shadow-sm border border-gray-200">
                    <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-3">
                            <div
                                className={`w-10 h-10 ${metric.iconBg} rounded-lg flex items-center justify-center`}
                            >
                                <Icon className={`h-5 w-5 ${metric.iconColor}`} />
                            </div>
                        </div>
                        <div className="text-xs text-gray-500 mb-1 tracking-wide">
                            {metric.title}
                        </div>
                        <div className="text-3xl font-semibold text-gray-900">
                            {metric.value}
                        </div>
                    </CardContent>
                </Card>)
            })}
        </div>
    )
};

export default EventSummaryCard;