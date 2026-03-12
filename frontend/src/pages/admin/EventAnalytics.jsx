import { useEffect, useState } from 'react';
import { Button } from "../../components/domain/admin/Button.jsx";
import { adminService } from '../../services/admin.service.js';
import dayjs from "dayjs";
import LoadingState from '../../components/common/LoadingState.jsx';
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import GlobalAnalyticsCard from '../../components/domain/admin/GlobalAnalyticsCard.jsx';
import EventChart from '../../components/domain/admin/EventChart.jsx';
import AnalyticsFilter from '../../components/domain/admin/AnalyticsFilter.jsx';
import EventPerformanceList from '../../components/domain/admin/EventPerformanceList.jsx';
import { ChevronRight, Download } from 'lucide-react';

export function EventAnalytics() {
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
                            <ChevronRight className="h-4 w-4" />
                            <span>Event Analytics</span>
                        </div>
                    </div>
                    <div className="flex items-start justify-between">
                        <div>
                            <h1 className="text-foreground text-2xl mb-1 font-semibold">Event Analytics</h1>
                            <p className="text-gray-500 text-sm">
                                Comprehensive performance metrics and insights across all events
                            </p>
                        </div>
                        <div className="flex gap-2">
                            <Button variant="outline" className="gap-2 h-12 rounded-full hover:cursor-pointer" onClick={handleExportExcel}>
                                <Download className="h-4 w-4" />
                                Export Excel Report
                            </Button>
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
                    searchTerm={searchTerm}
                    status={status}
                    category={category}
                    date={date}
                    sortOption={sortOption}
                    onLoading={setLoading}
                    onError={setError}
                    formatVND={formatVND}
                    formatNumber={formatNumber}
                />
            </main >
        </div >
    )
}