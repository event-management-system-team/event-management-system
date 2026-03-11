import { Plus, Bell, ChevronRight, } from 'lucide-react';
import { useSearchParams } from 'react-router';
import { AdminSidebar } from "../../components/domain/admin/AdminSidebar.jsx";
import { CreateOrganizerModal } from "../../components/domain/admin/CreateOrganizerModal.jsx";
import { useEffect, useState } from "react";
import { Button } from "../../components/domain/admin/Button.jsx";
import { Avatar, AvatarFallback } from "../../components/domain/admin/Avatar.jsx";
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
    const [error, setError] = useState(null);
    const [status, setStatus] = useState(statusParam ? statusParam.toUpperCase() : "all");
    const [role, setRole] = useState(roleParam ? roleParam.toUpperCase() : "all");
    const [date, setDate] = useState(null);
    const [sortOption, setSortOption] = useState("newest");
    const [searchTerm, setSearchTerm] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { alert, showAlert, closeAlert } = useAlert();

    const fetchSummary = async () => {
        try {
            setLoading(true)
            const response = await adminService.getAccountSummary()
            setSummary(response.data)
        } catch (error) {
            setError("Cannot load sumary data");
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchSummary()
    }, [])

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value)
    }

    const handleStatusChange = (value) => {
        setStatus(value)
    }

    const handleRoleChange = (value) => {
        setRole(value)
    }

    const handleDateChange = (value) => {
        setDate(value)
    }

    const handleSortChange = (value) => {
        setSortOption(value)
    }

    const openModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    const handleOrganizerCreated = (newAccount) => {
        setAccounts(prevAccounts => [newAccount, ...prevAccounts]);
        setOriginalAccounts(prevOriginal => [newAccount, ...prevOriginal]);
    }

    const handleBanAccount = () => {
        fetchSummary()
    }

    return (
        <div className="flex h-screen bg-[#F1F0E8]">

            {loading && (
                <LoadingState />
            )}

            {error && (
                <EmptyState className='h-[600px]' />
            )}

            {/* Sidebar */}
            <AdminSidebar />

            {/* Main Content */}
            <main className="flex-1 overflow-auto">
                {/* Header */}
                <header className="bg-[#f7f7f7] border-b border-gray-200 px-8 py-5">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                            <span>Dashboard</span>
                            <ChevronRight className="h-4 w-4" />
                            <span>Account Management</span>
                        </div>
                        <div className="flex items-center gap-3">
                            {/* Notification Icon */}
                            <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full">
                                <Bell className="h-5 w-5 text-gray-600" />
                            </Button>
                            {/* Profile Icon */}
                            <Avatar className="w-9 h-9 cursor-pointer">
                                <AvatarFallback className="bg-[#7FA5A5] text-white text-sm">
                                    AR
                                </AvatarFallback>
                            </Avatar>
                        </div>
                    </div>
                    <div className="flex items-start justify-between">
                        <div>
                            <h1 className="text-foreground text-2xl mb-1 font-semibold">Account Management</h1>
                            <p className="text-gray-500 text-sm">
                                Oversee and manage system organizer accounts.
                            </p>
                        </div>
                        <Button
                            className="gap-2 bg-primary hover:bg-[#B3C8CF] text-white rounded-full px-5"
                            onClick={openModal}
                        >
                            <Plus className="h-4 w-4" />
                            Create Organizer Account
                        </Button>
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
                    setStatus={handleStatusChange}
                    role={role}
                    setRole={handleRoleChange}
                    setDate={handleDateChange}
                    sortOption={sortOption}
                    setSortOption={handleSortChange}
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