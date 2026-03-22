import { ChevronRight, } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import { useEffect, useState } from "react";
import { useAlert } from '../../hooks/useAlert.js';
import { adminService } from '../../services/admin.service.js';
import { Alert } from '../../components/common/Alert.jsx';
import LoadingState from '../../components/common/LoadingState.jsx';
import EventSummaryCard from '../../components/domain/admin/EventSummaryCard.jsx';
import EventFilter from '../../components/domain/admin/EventFilter.jsx';
import EventList from '../../components/domain/admin/EventList.jsx';

export function EventManagement() {

    const [searchParams] = useSearchParams()
    const statusParam = searchParams.get("status")

    const [summary, setSummary] = useState()
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
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
            setLoading(true)

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
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchData()
    }, [])

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value)
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
                            <span>Event Management</span>
                        </div>
                    </div>
                    <div className="flex items-start justify-between">
                        <div>
                            <h1 className="text-foreground text-2xl mb-1 font-semibold">
                                Event Management
                            </h1>
                            <p className="text-gray-500 text-sm">
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