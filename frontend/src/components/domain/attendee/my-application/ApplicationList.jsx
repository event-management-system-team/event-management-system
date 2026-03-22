import ApplicationCard from "./ApplicationCard"
import LoadingState from '../../../common/LoadingState'
import EmptyState from '../../../common/EmptyState'

const ApplicationList = ({ isLoading, filteredApps, getStatusStyle, formatDate, isError }) => {
    return (
        <div className="flex flex-col gap-6 min-h-50">
            {isLoading ? (
                <LoadingState />
            ) : (isError || filteredApps.length === 0) ? (
                <EmptyState message="No applications found" />
            ) : (
                filteredApps.map((app) => (
                    <div
                        key={app.applicationId}
                        className="bg-white rounded-[28px] p-6 shadow-xl shadow-gray-200/40 border border-gray-100 flex flex-col md:flex-row gap-6 hover:translate-y-[-2px] transition-transform duration-300"
                    >
                        <ApplicationCard
                            app={app}
                            getStatusStyle={getStatusStyle}
                            formatDate={formatDate} />

                    </div>
                ))
            )}
        </div>
    )
}

export default ApplicationList
