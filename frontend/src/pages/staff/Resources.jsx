import React, { useState } from 'react';
import HeaderSearch from '../../components/domain/staff/resources/HeaderSearch';
import MainContent from '../../components/domain/staff/resources/MainContent';
import { useQuery } from '@tanstack/react-query';
import LoadingState from '../../components/common/LoadingState';
import EmptyState from '../../components/common/EmptyState';
import { useParams } from 'react-router';
import staffService from '../../services/staff.service';

const ResourcePage = () => {

    const { eventSlug } = useParams();

    const { data, isLoading, isError } = useQuery({
        queryKey: ['workspace', eventSlug],
        queryFn: () => staffService.getWorkspace(eventSlug),
        enabled: !!eventSlug
    });

    const [searchQuery, setSearchQuery] = useState('');

    const filteredResources = (data?.resources || []).filter(res =>
        res.resourceName.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (isLoading) return <LoadingState />;
    if (isError || !data) return <EmptyState className='h-[600px]' />;
    return (
        <div className="flex-1 h-[calc(100vh-80px)] w-full overflow-y-auto bg-[#E5E1DA] text-slate-900 font-sans">
            <main className="max-w-[1200px] mx-auto w-full transition-all duration-300 ease-in-out p-6 md:p-4 lg:p-6 pb-20">

                <HeaderSearch
                    eventName={data.eventInfo?.eventName}
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery} />

                <MainContent filteredResources={filteredResources} />
            </main>
        </div>
    );
};

export default ResourcePage;