import { MapPin } from 'lucide-react';
import { Select } from 'antd';
import { useLocation } from '../../../hooks/useLocation';
import LoadingState from '../../common/LoadingState';

const FilterLocation = ({ location, setLocation }) => {
    const { data: locations, isLoading } = useLocation();

    return (
        <div className="mb-8">

            <div className="flex items-center gap-2 mb-4">
                <MapPin className="text-primary w-5 h-5" strokeWidth={2.5} />
                <span className="font-bold text-sm">Location</span>
            </div>

            <div className="px-1">
                {isLoading ? (
                    <LoadingState />
                ) : (
                    <Select
                        className="w-full"
                        size="medium"
                        allowClear
                        showSearch
                        placeholder="Everywhere"
                        value={location || undefined}
                        onChange={(value) => setLocation(value || '')}
                        loading={isLoading}
                        filterOption={(input, option) =>
                            (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                        }
                        options={locations}
                    />
                )}
            </div>

        </div>
    );
}

export default FilterLocation;