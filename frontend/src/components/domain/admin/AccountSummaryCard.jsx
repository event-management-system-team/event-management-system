import { CheckCircle, Users, UserX } from "lucide-react";
import { Card, CardContent } from "../admin/Card";

const AccountSummaryCard = ({ summary }) => {

    const summaryMetrics = (summary) => [
        {
            title: "TOTAL ACCOUNTS",
            value: summary?.totalAccounts ?? 0,
            icon: Users,
            iconBg: "bg-blue-100",
            iconColor: "text-blue-600"
        },
        {
            title: "ACTIVE",
            value: summary?.activeAccounts ?? 0,
            icon: CheckCircle,
            iconBg: "bg-green-100",
            iconColor: "text-green-600"
        },
        {
            title: "BANNED",
            value: summary?.bannedAccounts ?? 0,
            icon: UserX,
            iconBg: "bg-red-100",
            iconColor: "text-red-600"
        }
    ]

    const metrics = summaryMetrics(summary);

    return (
        <div className="grid grid-cols-3 gap-5 p-8">
            {metrics.map((metric, index) => {
                const Icon = metric.icon
                return (
                    <Card key={index} className="bg-[#f7f7f7] shadow-sm border border-gray-200">
                        <CardContent className="p-6">
                            <div className="flex items-start justify-between mb-3">
                                <div
                                    className={`w-10 h-10 ${metric.iconBg} rounded-lg flex items-center justify-center`}
                                >
                                    <Icon className={`h-5 w-5 ${metric.iconColor}`} />
                                </div>
                                <div
                                    className={`flex items-center gap-1 text-xs ${metric.trending === "up" ? "text-green-600" : "text-red-600"
                                        }`}
                                >
                                </div>
                            </div>
                            <div className="text-xs text-gray-500 mb-1 tracking-wide">
                                {metric.title}
                            </div>
                            <div className="text-3xl font-semibold text-gray-900">
                                {metric.value}
                            </div>
                        </CardContent>
                    </Card>
                )
            })}
        </div>
    )
};

export default AccountSummaryCard;