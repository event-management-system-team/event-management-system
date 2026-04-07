import { useEffect, useState } from 'react';
import { Button } from "../../components/domain/admin/Button.jsx";
import { adminService } from '../../services/admin.service.js';
import dayjs from "dayjs";
import LoadingState from '../../components/common/LoadingState.jsx';
import EmptyState from '../../components/common/EmptyState.jsx';
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import GlobalAnalyticsCard from '../../components/domain/admin/GlobalAnalyticsCard.jsx';
import EventChart from '../../components/domain/admin/EventChart.jsx';
import AnalyticsFilter from '../../components/domain/admin/AnalyticsFilter.jsx';
import EventPerformanceList from '../../components/domain/admin/EventPerformanceList.jsx';
import { ChevronRight, Download } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export function EventAnalytics() {
    const { t } = useTranslation();
    const [events, setEvents] = useState([])
    const [summary, setSummary] = useState()
    const [monthlySales, setMonthlySales] = useState([])
    const [topRevenueEvents, setTopRevenueEvents] = useState([])
    const [categoryDis, setCategoryDis] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(false)
    const [status, setStatus] = useState("all")
    const [category, setCategory] = useState("all")
    const [date, setDate] = useState(null)
    const [sortOption, setSortOption] = useState("newest")
    const [categories, setCategories] = useState([]);
    const [searchTerm, setSearchTerm] = useState("")
    const [sheetData, setSheetData] = useState(null)

    const fetchData = async () => {
        try {
            setLoading(true)

            const [eventRes, summaryRes, salesRes, topRevenueRes, categoryRes, categoriesListRes] = await Promise.all([
                adminService.getEventAnalytics(),
                adminService.getSummaryAnalytics(),
                adminService.getMonthlyTicketSales(),
                adminService.getTopRevenueEvents(),
                adminService.getCategoryDistribution(),
                adminService.getAllCategories()
            ])

            setEvents(eventRes.data)
            setSummary(summaryRes.data)
            setMonthlySales(salesRes.data)
            setTopRevenueEvents(topRevenueRes.data)
            setCategoryDis(categoryRes.data)
            setCategories(categoriesListRes.data)

        } catch (error) {
            setError("Cannot load event analytics")
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchData()
    }, [])

    const getData = () => {
        return events
    }

    useEffect(() => {
        setSheetData(getData())
    }, [])

    const formatExcelData = (events) => {
        return events
            .filter(event => event.status === "COMPLETED")
            .map((event, index) => {
                const attendanceRate = event.attendanceRate * 100

                return {
                    "No.": index + 1,
                    "Event Name": event.eventName,
                    "Category": event.categoryName,
                    "Date": dayjs(event.startDate).format("YYYY-MM-DD"),
                    "Start Time": dayjs(event.startDate).format("HH:mm"),
                    "End Time": dayjs(event.endDate).format("HH:mm"),
                    "Tickets Sold": event.ticketsSold,
                    "Total Capacity": event.totalCapacity,
                    "Total Revenue": event.revenue,
                    "Attendance Rate (%)": attendanceRate
                }
            })
    }

    const handleExportExcel = () => {
        const excelData = formatExcelData(events)

        const worksheet = XLSX.utils.json_to_sheet(excelData)

        const workbook = XLSX.utils.book_new()
        XLSX.utils.book_append_sheet(workbook, worksheet, "Events Report")

        const excelBuffer = XLSX.write(workbook, {
            bookType: "xlsx",
            type: "array"
        })

        const fileData = new Blob([excelBuffer], {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        })

        saveAs(fileData, "events-report.xlsx")
    }

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value)
    }

    const formatVND = (amount) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(amount)
    }

    const formatNumber = (num) => {
        return Number(num).toFixed(2)
    }

    if (loading) return <LoadingState />
    if (error) return <EmptyState className='h-[600px]' />

    return (
        <div className="flex flex-col flex-1 bg-[#F1F0E8]">

            {/* Main Content */}
            <main className="flex-1 overflow-auto">
                {/* Header */}
                <header className="bg-[#F1F0E8] px-8 py-5 pt-8">
                    <div className="flex items-start justify-between">
                        <div>
                            <div className="flex items-center gap-4 text-gray-400 text-sm font-medium mb-3">
                                <span>Dashboard</span>
                                <ChevronRight className="h-4 w-4" />
                                <span className="text-gray-600">Event Analytics</span>
                            </div>
                            <h1 className="text-2xl md:text-3xl font-black text-[#1e2d3d] tracking-tight">Event Analytics</h1>
                            <p className="text-gray-500 text-sm mt-1">
                                Comprehensive performance metrics and insights across all events.
                            </p>
                        </div>
                        <div className="flex items-center gap-3">
                            {events.length > 0 && (
                                <Button
                                    className="gap-2 bg-white hover:bg-gray-50 text-[#1e2d3d] rounded-full px-5 py-2 shadow-sm border border-gray-200 font-medium transition-colors hover:cursor-pointer h-10"
                                    onClick={handleExportExcel}
                                >
                                    <Download className="h-4 w-4" />
                                    {t('ad_export_excel')}
                                </Button>
                            )}
                        </div>
                    </div>
                </header>

                {/* Global Analytics Overview */}
                <GlobalAnalyticsCard
                    summary={summary}
                    formatVND={formatVND}
                    formatNumber={formatNumber}
                />

                {/* Data Visualization Section */}
                <EventChart
                    monthlySales={monthlySales}
                    categoryDis={categoryDis}
                    topRevenueEvents={topRevenueEvents}
                    formatVND={formatVND}
                />

                {/* Filters & Search */}
                <AnalyticsFilter
                    categories={categories}
                    searchTerm={searchTerm}
                    onSearchChange={handleSearchChange}
                    status={status}
                    setStatus={setStatus}
                    category={category}
                    setCategory={setCategory}
                    setDate={setDate}
                    sortOption={sortOption}
                    setSortOption={setSortOption}
                />

                {/* Event Performance Table */}
                <EventPerformanceList
                    events={events}
                    searchTerm={searchTerm}
                    status={status}
                    category={category}
                    date={date}
                    sortOption={sortOption}
                    formatVND={formatVND}
                    formatNumber={formatNumber}
                />
            </main >
        </div >
    )
}