import { AlertCircle, Calendar, Users, UserX, Zap } from "lucide-react";
import { Card, CardContent } from "../admin/Card";
import { Link } from "react-router-dom";

const DashboardCard = ({ summary }) => {

    const summaryMetrics = [
        {
            title: "TOTAL EVENTS",
            value: summary?.totalEvents,
            icon: Calendar,
            iconBg: "bg-blue-100",
            iconColor: "text-blue-600",
            link: "/admin/events"
        },
        {
            title: "ACTIVE EVENTS",
            value: summary?.activeEvents,
            icon: Zap,
            iconBg: "bg-green-100",
            iconColor: "text-green-600"
        },
        {
            title: "PENDING REVIEWS",
            value: summary?.pendingEvents,
            icon: AlertCircle,
            iconBg: "bg-orange-100",
            iconColor: "text-orange-600",
            link: "/admin/events?status=pending",
            highlight: true
        },
        {
            title: "ORGANIZER ACCOUNTS",
            value: summary?.organizerAccounts,
            icon: Users,
            iconBg: "bg-purple-100",
            iconColor: "text-purple-600",
            link: "/admin/accounts?role=ORGANIZER"
        },
        {
            title: "SUSPENDED ACCOUNTS",
            value: summary?.bannedAccounts,
            icon: UserX,
            iconBg: "bg-red-100",
            iconColor: "text-red-600",
            link: "/admin/accounts?status=BANNED"
        }
    ]

    return (
        <div className="grid grid-cols-5 gap-4 mb-8">
            {summaryMetrics.map((metric, index) => (
                <Link key={index} to={metric.link}>
                    <Card
                        className={`bg-[#f7f7f7] shadow-sm hover:shadow-md transition-all cursor-pointer border border-gray-200 ${metric.highlight ? 'ring-2 ring-orange-400  border border-gray-200' : ''
                            }`}
                    >
                        <CardContent className="p-6">
                            <div className="flex items-start justify-between mb-4">
                                <div className={`p-3 rounded-lg ${metric.iconBg}`}>
                                    <metric.icon className={`h-6 w-6 ${metric.iconColor}`} />
                                </div>
                            </div>
                            <div className="text-3xl font-bold text-gray-900 mb-1">
                                {metric.value}
                            </div>
                            <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                                {metric.title}
                            </div>
                        </CardContent>
                    </Card>
                </Link>
            ))}
        </div>
    )
};

export default DashboardCard;