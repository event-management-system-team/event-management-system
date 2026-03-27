import { Plus, ChevronRight, } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import { CreateOrganizerModal } from "../../components/domain/admin/CreateOrganizerModal.jsx";
import { useEffect, useState } from "react";
import { Button } from "../../components/domain/admin/Button.jsx";
import { adminService } from "../../services/admin.service.js";
import { Alert } from "../../components/common/Alert.jsx";
import { useAlert } from '../../hooks/useAlert.js';
import LoadingState from '../../components/common/LoadingState.jsx';
import AccountSummaryCard from '../../components/domain/admin/AccountSummaryCard.jsx';
import EmptyState from '../../components/common/EmptyState.jsx';
import AccountFilter from '../../components/domain/admin/AccountFilter.jsx';
import AccountList from '../../components/domain/admin/AccountList.jsx';

export function AccountManagement() {

    const [searchParams] = useSearchParams()
    const roleParam = searchParams.get("role")
    const statusParam = searchParams.get("status")

    const [summary, setSummary] = useState()

    const [loading, setLoading] = useState(true);
    const [summaryLoading, setSummaryLoading] = useState(true);
    const [error, setError] = useState(null);
    const [status, setStatus] = useState(statusParam ? statusParam.toUpperCase() : "all");
    const [role, setRole] = useState(roleParam ? roleParam.toUpperCase() : "all");
    const [date, setDate] = useState(null);
    const [sortOption, setSortOption] = useState("newest");
    const [searchTerm, setSearchTerm] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { alert, showAlert, closeAlert } = useAlert();
    const [refreshKey, setRefreshKey] = useState(0);

    const fetchSummary = async () => {
        try {
            setSummaryLoading(true)
            const response = await adminService.getAccountSummary()
            setSummary(response.data)
        } catch (error) {
            setError("Cannot load sumary data");
            console.error(error)
        } finally {
            setSummaryLoading(false)
        }
    }

    useEffect(() => {
        fetchSummary()
    }, [])

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value)
    }

    const openModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    const handleOrganizerCreated = () => {
        setRefreshKey(prev => prev + 1);
    };

    const handleBanAccount = () => {
        fetchSummary()
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
                                <span className="text-gray-600">Account Management</span>
                            </div>
                            <h1 className="text-2xl md:text-3xl font-black text-[#1e2d3d] tracking-tight">Account Management</h1>
                            <p className="text-gray-500 text-sm mt-1">
                                Oversee and manage system organizer accounts.
                            </p>
                        </div>
                        <div className="flex items-center gap-3">
                            <Button
                                className="gap-2 bg-[#7FA5A5] hover:bg-[#6D9393] text-white rounded-full px-5 py-2 shadow-sm font-medium transition-colors hover:cursor-pointer h-10"
                                onClick={openModal}
                            >
                                <Plus className="h-4 w-4" />
                                Create Organizer Account
                            </Button>
                        </div>
                    </div>
                </header>

                {/* Summary Cards */}
                <AccountSummaryCard
                    summary={summary}
                />

                {/* Search, Filter & Sort Controls */}
                <AccountFilter
                    searchTerm={searchTerm}
                    onSearchChange={handleSearchChange}
                    status={status}
                    setStatus={setStatus}
                    role={role}
                    setRole={setRole}
                    setDate={setDate}
                    sortOption={sortOption}
                    setSortOption={setSortOption}
                />

                {/* Account List Table */}
                <AccountList
                    searchTerm={searchTerm}
                    status={status}
                    role={role}
                    date={date}
                    sortOption={sortOption}
                    onLoading={setLoading}
                    onError={setError}
                    showAlert={showAlert}
                    onBan={handleBanAccount}
                    refreshKey={refreshKey}
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

            {/* Create Organizer Modal */}
            <CreateOrganizerModal
                isOpen={isModalOpen}
                onClose={closeModal}
                onCreated={handleOrganizerCreated}
                onAlert={showAlert}
            />
        </div>

    );
}