import {
    Plus,
    Calendar1,
} from 'lucide-react';
import { useParams } from 'react-router';
import { useState } from "react";
import { Button } from "../../components/domain/admin/Button.jsx";
import { Tabs, TabsList, TabsTrigger } from "../../components/domain/admin/Tabs.jsx";
import { Alert } from "../../components/common/Alert.jsx";
import { useAlert } from '../../hooks/useAlert.js';
import StaffListTab from '../../components/domain/organizer/StaffListTab.jsx';
import LoadingState from '../../components/common/LoadingState.jsx';
import EmptyState from '../../components/common/EmptyState.jsx';
import ResourceTab from '../../components/domain/organizer/ResourceTab.jsx';
import WorkScheduleTab from '../../components/domain/organizer/WorkScheduleTab.jsx';

export default function StaffManagement() {

    const { id } = useParams();
    const [activeTab, setActiveTab] = useState('staff');

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
    const [isResourceModalOpen, setIsResourceModalOpen] = useState(false)
    const { alert, showAlert, closeAlert } = useAlert();

    const openScheduleModal = () => setIsScheduleModalOpen(true)
    const closeScheduleModal = () => setIsScheduleModalOpen(false)
    const openResourceModal = () => setIsResourceModalOpen(true)
    const closeResourceModal = () => setIsResourceModalOpen(false)

    const getTopRightAction = () => {
        switch (activeTab) {
            case "resources":
                return (
                    <Button
                        className="gap-2 bg-primary hover:bg-[#B3C8CF] text-white rounded-full px-5 py-5 h-12 w-40 hover:cursor-pointer"
                        onClick={openResourceModal}
                    >
                        <Plus className="h-4 w-4" />
                        Upload Resource
                    </Button>
                )
            case "schedule":
                return (
                    <div className='flex gap-3'>
                        <Button
                            className="gap-2 bg-[#f7f7f7] hover:bg-[#B3C8CF] text-gray rounded-full px-5 py-5 h-12 w-40 border-1 border-gray-200 hover:cursor-pointer"
                            onClick={openScheduleModal}
                        >
                            <Calendar1 className="h-4 w-4" />
                            Create Schedule
                        </Button>
                    </div>
                )
            default:
                return null
        }
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
                <header className="bg-[#F1F0E8] px-8 py-5 pt-8">
                    <div className="flex items-start justify-between">
                        <div>
                            <h1 className="text-foreground text-2xl mb-1 font-semibold">Staff Management</h1>
                            <p className="text-gray-500 text-sm">
                                Oversee and manage system organizer accounts.
                            </p>
                        </div>
                        <div className="flex items-center gap-3">
                            {getTopRightAction()}
                        </div>
                    </div>
                </header>

                {/* Tabs */}
                <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                    <TabsList
                        className="flex ml-7 gap-2 px-2 py-6 bg-white border-none rounded-xl shadow-sm w-fit">
                        <TabsTrigger
                            value="staff"
                            className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-mediumb text-gray-500 transition-all hover:text-gray-900 data-[state=active]:bg-[#7FA5A5] data-[state=active]:text-white data-[state=active]:shadow p-4.5 hover:cursor-pointer"
                        >
                            Staff
                        </TabsTrigger>

                        <TabsTrigger
                            value="schedule"
                            className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium text-gray-500       transition-all hover:text-gray-900 data-[state=active]:bg-[#7FA5A5] data-[state=active]:text-white  data-[state=active]:shadow p-4.5 hover:cursor-pointer"
                        >
                            Work Schedule
                        </TabsTrigger>

                        <TabsTrigger
                            value="resources"
                            className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium text-gray-500    transition-all hover:text-gray-900 data-[state=active]:bg-[#7FA5A5] data-[state=active]:text-white  data-[state=active]:shadow p-4.5 hover:cursor-pointer"
                        >
                            Resources
                        </TabsTrigger>
                    </TabsList>

                    {/* TAB 1: Staff Information */}
                    <StaffListTab
                        id={id}
                        onLoading={setLoading}
                        onError={setError}
                    />

                    {/* TAB 2: Work Schedule */}
                    <WorkScheduleTab
                        id={id}
                        isScheduleModalOpen={isScheduleModalOpen}
                        closeScheduleModal={closeScheduleModal}
                        onLoading={setLoading}
                        onError={setError}
                        showAlert={showAlert}
                    />

                    {/* TAB 3: Resources */}
                    <ResourceTab
                        id={id}
                        isResourceModalOpen={isResourceModalOpen}
                        closeResourceModal={closeResourceModal}
                        onLoading={setLoading}
                        onError={setError}
                        showAlert={showAlert}
                    />

                </Tabs>
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
    );
}