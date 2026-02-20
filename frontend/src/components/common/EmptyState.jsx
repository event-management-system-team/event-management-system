import { Empty } from 'antd';

const EmptyState = ({ className = "", message = "No data" }) => {
    return (
        <div className={`flex flex-col items-center justify-center bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200 ${className}`}>
            <Empty
                description={
                    <span className="text-gray-500 font-medium text-lg">
                        {message}
                    </span>
                }
                image={Empty.PRESENTED_IMAGE_SIMPLE}
            />
        </div>
    );
};

export default EmptyState;