import React from 'react';
import Layout from '../../components/layout/Layout';
import { Button } from '../../components/common/Button';
import { EventDetailsSection } from './components/EventDetailsSection';
import { ScheduleSection } from './components/ScheduleSection';
import { LocationSection } from './components/LocationSection';
import { ArrowRight, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const CreateEvent = () => {
    const navigate = useNavigate();

    const progress = 50;

    return (
        <Layout>
            <div className="max-w-5xl mx-auto px-8 py-6">
                {/* Breadcrumb + Save Draft + Progress */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-2 text-sm">
                        <span className="text-[#8da6ae] hover:underline cursor-pointer">My Events</span>
                        <span className="text-gray-400">›</span>
                        <span className="text-gray-700 font-medium">Create New Event</span>
                    </div>
                    <div className="flex items-center space-x-4">
                        <button className="text-gray-500 font-medium hover:text-gray-900 text-sm">Save Draft</button>
                        <div className="flex items-center space-x-2">
                            <span className="text-xs font-bold text-gray-500 tracking-wider">PROGRESS</span>
                            <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-[#1A202C] rounded-full transition-all duration-500"
                                    style={{ width: `${progress}%` }}
                                ></div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Stepper */}
                <div className="flex justify-between items-center mb-10 px-8">
                    <div className="flex flex-col items-center">
                        <div className="w-10 h-10 rounded-full bg-[#8da6ae] text-white flex items-center justify-center font-bold mb-2">1</div>
                        <span className="text-sm font-bold text-gray-900">Step 1: Details</span>
                    </div>
                    <div className="flex-1 h-0.5 bg-gray-200 mx-6 mt-[-20px]"></div>
                    <div className="flex flex-col items-center opacity-40">
                        <div className="w-10 h-10 rounded-full border-2 border-gray-300 text-gray-400 flex items-center justify-center font-bold mb-2">2</div>
                        <span className="text-sm font-medium text-gray-400">Step 2: Tickets & Pricing</span>
                    </div>
                </div>

                {/* Form Sections */}
                <div className="space-y-6">
                    <EventDetailsSection />
                    <ScheduleSection />
                    <LocationSection />
                </div>

                {/* Footer Actions */}
                <div className="flex justify-end pt-4 pb-8">
                    <Button
                        onClick={() => navigate('/create-event/tickets')}
                        className="bg-[#9ba9b4] hover:bg-[#8a9aa5] text-white px-8 py-3 rounded-xl flex items-center space-x-2"
                    >
                        <span>Continue to Tickets</span>
                        <ArrowRight className="w-4 h-4 ml-1" />
                    </Button>
                </div>

                {/* Last Saved */}
                <div className="text-center pb-6">
                    <span className="text-xs font-bold text-gray-400 tracking-widest">LAST SAVED: JUST NOW</span>
                </div>
            </div>
        </Layout>
    );
};

export default CreateEvent;

