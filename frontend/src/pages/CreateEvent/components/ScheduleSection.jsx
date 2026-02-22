import React from 'react';
import { Calendar, Clock } from 'lucide-react';
import { Input } from '../../../components/common/Input';

export const ScheduleSection = () => {
    return (
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 mb-8">
            <div className="flex items-center space-x-2 mb-6">
                <Clock className="w-6 h-6 text-gray-400" />
                <h2 className="text-xl font-bold text-gray-900">Schedule Details</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                    label="Start Date"
                    type="date"
                    icon={Calendar}
                />
                <Input
                    label="End Date"
                    type="date"
                    icon={Calendar}
                />
            </div>
            <div className="mt-6">
                <Input
                    label="Start Time"
                    type="time"
                    icon={Clock}
                />
            </div>
        </div>
    );
};
