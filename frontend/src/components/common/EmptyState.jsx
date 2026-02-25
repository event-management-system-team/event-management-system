import { Empty } from 'antd';

const EmptyState = ({ className = "", message = "No data" }) => {
    return (
        <div className={`flex flex-col items-center justify-center border-none rounded-3xl border-2 ${className}`}>
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