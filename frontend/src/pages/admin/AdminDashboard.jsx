import { UserCircle, Clock, ArrowRight, } from 'lucide-react';
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../../components/domain/admin/Button.jsx";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/domain/admin/Card.jsx";
import { Badge } from "../../components/domain/admin/Badge.jsx";
import { useEffect, useState } from 'react';
import { adminService } from '../../services/admin.service.js';
import LoadingState from '../../components/common/LoadingState.jsx';
import dayjs from "dayjs";
import DashboardCard from '../../components/domain/admin/DashboardCard.jsx';

export function AdminDashboard() {
    const navigate = useNavigate();
    const [summary, setSummary] = useState()
    const [pendingEvents, setPendingEvents] = useState([])

    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(false)

    const fetchData = async () => {
        try {
            setLoading(true)

            const [summaryRes, pendingEventRes] = await Promise.all([
                adminService.getDashboardSummary(),
                adminService.getTopPendingEvents()
            ])

            setSummary(summaryRes.data)
            setPendingEvents(pendingEventRes.data)

        } catch (error) {
            setError("Cannot load dashboard data")
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchData()
    }, [])

    return (
        <div className="flex h-screen bg-[#F1F0E8]">

            {loading && (
                <LoadingState />
            )}

            {error && (
                <EmptyState className='h-[600px]' />
            )}

            {/* Main Content */}
            <main className="flex-1 overflow-auto">
                {/* Header */}
                <header className="bg-[#f7f7f7] border-b border-gray-200 px-8 py-5">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                            <span>Dashboard</span>
                        </div>
                    </div>

                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-semibold text-gray-900">System Overview</h1>
                            <p className="text-sm text-gray-500 mt-1">Monitor platform health and pending tasks</p>
                        </div>
                        <div className="text-sm text-gray-600">
                            <span className="font-medium">Last updated:</span> {new Date().toLocaleTimeString()}
                        </div>
                    </div>
                </header>

                {/* Main Dashboard Content */}
                <div className="p-8">
                    {/* Top Summary Metrics */}
                    <DashboardCard summary={summary} />

                    {/* Pending Actions - Requires Attention */}
                    <div className="mb-8">
                        {/* Pending Events */}
                        <Card className="bg-[#f7f7f7] shadow-sm border border-gray-200">
                            <CardHeader className="border-b border-gray-100">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <CardTitle className="text-xl font-semibold text-gray-700">Pending Events</CardTitle>
                                        <CardDescription>Events awaiting review and approval</CardDescription>
                                    </div>
                                    <Badge className="bg-orange-100 text-orange-700 hover:bg-orange-100">
                                        {summary?.pendingEvents ?? 0} pending
                                    </Badge>
                                </div>
                            </CardHeader>
                            <CardContent className="p-0">
                                <div className="divide-y divide-gray-200">
                                    {!pendingEvents || pendingEvents.length === 0 ? (
                                        <div className="flex items-center justify-center flex-1 text-sm text-gray-400 mt-5 mb-20">
                                            No pending event yet
                                        </div>
                                    ) : (
                                        pendingEvents.map((event) => {
                                            const detailUrl = `/admin/events/event-detail/${event.eventSlug}`

                                            return (
                                                <Link
                                                    key={event.eventSlug}
                                                    to={detailUrl}
                                                    className="block hover:bg-[#eef3f5] transition-colors"
                                                >
                                                    <div className="p-4 px-8 flex items-center justify-between">
                                                        <div className="flex-1 min-w-0">
                                                            <div className="font-medium text-gray-900 mb-1 truncate">
                                                                {event.eventName}
                                                            </div>
                                                            <div className="flex items-center gap-3 text-xs text-gray-500">
                                                                <span className="flex items-center gap-1">
                                                                    <UserCircle className="h-3 w-3" />
                                                                    {event.organizer.fullName}
                                                                </span>
                                                                <span>•</span>
                                                                <span className="flex items-center gap-1">
                                                                    <Clock className="h-3 w-3" />
                                                                    {dayjs(event.createdAt).format("MMM DD, YYYY")}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </Link>
                                            )
                                        })
                                    )}
                                </div>
                                {pendingEvents && pendingEvents.length > 0 && (
                                    <div className="p-3 border-t border-gray-100">
                                        <Button variant="ghost" className="w-full h-12 text-[#7FA5A5] hover:text-[#6D9393] hover:bg-[#7FA5A5]/10 hover:cursor-pointer" onClick={() => navigate("/admin/events?status=PENDING")}>
                                            View All Pending Events
                                            <ArrowRight className="ml-2 h-4 w-4" />
                                        </Button>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </main>
        </div>
    );
}