import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import ApplicationList from '../../components/domain/my-application/ApplicationList';
import applicationService from '../../services/application.service'

const MyApplicationPage = () => {
    const [filter, setFilter] = useState('All');

    const { data: applications = [], isLoading, isError } = useQuery({
        queryKey: ['applications'],
        queryFn: () => applicationService.getApplications(),
    })

    const formatDate = (isoString) => {
        if (!isoString) return 'N/A';
        const date = new Date(isoString);
        return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: '2-digit' });
    };

    const getStatusStyle = (status) => {
        switch (status) {
            case 'PENDING':
                return 'bg-[#FF6B35]/10 text-[#FF6B35] border-[#FF6B35]/20';
            case 'APPROVED':
                return 'bg-[#4ECDC4]/10 text-[#4ECDC4] border-[#4ECDC4]/20';
            case 'REJECTED':
                return 'bg-red-500/10 text-red-500 border-red-500/20';
            default:
                return 'bg-gray-500/10 text-gray-500 border-gray-500/20';
        }
    };

    const filteredApps = applications.filter(app => {
        if (filter === 'All') return true;
        return app.status === filter.toUpperCase();
    });

    return (
        <main className="max-w-[1000px] mx-auto px-6 py-10 w-full font-sans">
            <div className="flex flex-col gap-2 mb-8">
                <h1 className="text-4xl md:text-5xl font-black tracking-tight">
                    My Applications
                </h1>
                <p className="text-gray-500 font-medium">
                    Manage and track your staff applications for upcoming events.
                </p>
            </div>

            <div className="bg-white p-1 rounded-full flex gap-2 mb-10 w-fit border border-gray-200 shadow-sm overflow-x-auto">
                {['All', 'Pending', 'Approved', 'Rejected'].map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setFilter(tab)}
                        className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${filter === tab
                            ? 'bg-[#8aa8b2] text-white shadow-md shadow-[#8aa8b2]/20'
                            : 'text-gray-600 hover:bg-gray-100'
                            }`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {/* Application List */}
            <ApplicationList
                isLoading={isLoading}
                filteredApps={filteredApps}
                getStatusStyle={getStatusStyle}
                formatDate={formatDate}
                isError={isError} />
        </main>
    );
};

export default MyApplicationPage;