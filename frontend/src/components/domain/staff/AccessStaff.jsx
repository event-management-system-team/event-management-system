import React from 'react'
import LoadingState from '../../common/LoadingState';
import EmptyState from '../../common/EmptyState';
import { Outlet, useParams } from 'react-router';
import { useQuery } from '@tanstack/react-query';
import { Button, Result } from 'antd';
import staffService from '../../../services/staff.service';

const AccessStaff = () => {
    const { eventSlug } = useParams();

    const { data, isLoading, isError, error } = useQuery({
        queryKey: ['workspace', eventSlug],
        queryFn: () => staffService.getWorkspace(eventSlug),
        enabled: !!eventSlug,
        retry: false
    })


    if (isLoading) return <LoadingState />

    if (isError) {
        const errorMessage = error?.response?.data?.error;
        return (
            <div className="flex h-screen w-full items-center justify-center px-4">
                <div className="w-full max-w-lg rounded-2xl bg-white p-6  border-t-4 transition-all">
                    <Result
                        status="error"
                        title={<span className="text-2xl font-extrabold text-[#800020]">Access Failed</span>}
                        subTitle={<span className="text-base font-medium text-red-600">{errorMessage}</span>}
                        extra={[
                            <Button type="primary" key="console" onClick={() => window.history.back()} className="...">
                                Go Back
                            </Button>,
                            <Button key="try-again" onClick={() => window.location.reload()} className="...">
                                Try Again
                            </Button>,
                        ]}
                    />
                </div>
            </div>
        );
    }


    if (!data) return <EmptyState className='h-[600px]' />

    return <Outlet context={{ data }} />;


}

export default AccessStaff
