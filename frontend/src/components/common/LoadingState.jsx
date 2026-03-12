import { Skeleton } from 'antd';

const LoadingState = ({ className = "" }) => {
    return (
        <div className={`w-full bg-gray-50 rounded-3xl p-8 flex flex-col justify-end ${className}`}>
            <Skeleton active paragraph={{ rows: 3 }} title={{ width: '50%' }} />
            <div className="mt-6 flex gap-4">
                <Skeleton.Button active shape="round" size="large" />
                <Skeleton.Button active shape="round" size="large" />
            </div>
        </div>
    );
};

export default LoadingState