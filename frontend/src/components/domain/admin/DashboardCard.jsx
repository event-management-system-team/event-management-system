import { AlertCircle, Calendar, Users, UserX, Zap } from "lucide-react";
import { Card, CardContent } from "../admin/Card";
import { Link } from "react-router-dom";
import { useTranslation } from 'react-i18next';

const DashboardCard = ({ summary }) => {
    const { t } = useTranslation();

    const summaryMetrics = [
        {
            title: t('adc_total_events'),
            value: summary?.totalEvents ?? 0,
            icon: Calendar,
            iconBg: "bg-blue-100",
            iconColor: "text-blue-600",
            link: "/admin/events"
        },
        {
            title: t('adc_active_events'),
            value: summary?.activeEvents ?? 0,
            icon: Zap,
            iconBg: "bg-green-100",
            iconColor: "text-green-600"
        },
        {
            title: t('adc_pending_reviews'),
            value: summary?.pendingEvents ?? 0,
            icon: AlertCircle,
            iconBg: "bg-orange-100",
            iconColor: "text-orange-600",
            link: "/admin/events?status=pending",
            highlight: true
        },
        {
            title: t('adc_organizer_accounts'),
            value: summary?.organizerAccounts ?? 0,
            icon: Users,
            iconBg: "bg-purple-100",
            iconColor: "text-purple-600",
            link: "/admin/accounts?role=ORGANIZER"
        },
        {
            title: t('adc_suspended_accounts'),
            value: summary?.bannedAccounts ?? 0,
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