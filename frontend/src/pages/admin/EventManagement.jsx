import { ChevronRight, } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import { useEffect, useState } from "react";
import { useAlert } from '../../hooks/useAlert.js';
import { adminService } from '../../services/admin.service.js';
import { Alert } from '../../components/common/Alert.jsx';
import LoadingState from '../../components/common/LoadingState.jsx';
import EmptyState from '../../components/common/EmptyState.jsx';
import EventSummaryCard from '../../components/domain/admin/EventSummaryCard.jsx';
import EventFilter from '../../components/domain/admin/EventFilter.jsx';
import EventList from '../../components/domain/admin/EventList.jsx';

export function EventManagement() {

    const [searchParams] = useSearchParams()
    const statusParam = searchParams.get("status")

    const [summary, setSummary] = useState()
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [summaryLoading, setSummaryLoading] = useState(true);
    const [error, setError] = useState(null);
    const [status, setStatus] = useState(statusParam ? statusParam.toUpperCase() : "all");
    const [category, setCategory] = useState("all");
    const [priceType, setPriceType] = useState("all");
    const [date, setDate] = useState(null);
    const [sortOption, setSortOption] = useState("newest");
    const [searchTerm, setSearchTerm] = useState("");
    const { alert, showAlert, closeAlert } = useAlert();

    const fetchData = async () => {
        try {
            setSummaryLoading(true)

            const [summaryRes, categoryRes] = await Promise.all([
                adminService.getEventSummary(),
                adminService.getAllCategories()
            ])

            setSummary(summaryRes.data)
            setCategories(categoryRes.data)

        } catch (error) {
            setError("Cannot load events data")
            console.error(error)
        } finally {
            setSummaryLoading(false)
        }
    }

    useEffect(() => {
        fetchData()
    }, [])

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value)
    }

    if (summaryLoading) return <LoadingState />
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
                                <span className="text-gray-600">Event Management</span>
                            </div>
                            <h1 className="text-2xl md:text-3xl font-black text-[#1e2d3d] tracking-tight">Event Management</h1>
                            <p className="text-gray-500 text-sm mt-1">
                                Manage and oversee all platform-wide events and requests.
                            </p>
                        </div>
                    </div>
                </header>

                {/* Summary Cards */}
                <EventSummaryCard
                    summary={summary}
                />

                {/* Filter Events Section */}
                <EventFilter
                    categories={categories}
                    searchTerm={searchTerm}
                    onSearchChange={handleSearchChange}
                    status={status}
                    setStatus={setStatus}
                    category={category}
                    setCategory={setCategory}
                    priceType={priceType}
                    setPriceType={setPriceType}
                    setDate={setDate}
                    sortOption={sortOption}
                    setSortOption={setSortOption}
                />

                {/* Event List Table */}
                <EventList
                    searchTerm={searchTerm}
                    status={status}
                    category={category}
                    priceType={priceType}
                    date={date}
                    sortOption={sortOption}
                    onLoading={setLoading}
                    onError={setError}
                    showAlert={showAlert}
                />
            </main>

            {/* Global Alert */}
            <div className="fixed top-6 right-6 z-[999] w-[360px]">
                <Alert
                    type={alert.type}
                    message={alert.message}
                    onClose={closeAlert}
                />
            </div>
        </div>
    )
}