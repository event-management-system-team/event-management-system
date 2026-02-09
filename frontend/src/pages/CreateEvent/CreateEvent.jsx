import React from 'react';
import Layout from '../../components/layout/Layout';
import { Button } from '../../components/ui/Button';
import { EventDetailsSection } from './components/EventDetailsSection';
import { ScheduleSection } from './components/ScheduleSection';
import { LocationSection } from './components/LocationSection';
import { ArrowRight } from 'lucide-react';

const CreateEvent = () => {
    return (
        <Layout>
            <div className="max-w-5xl mx-auto px-8 py-8">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <h1 className="text-2xl font-bold text-gray-900">Create New Event</h1>
                    <div className="flex items-center space-x-4">
                        <button className="text-gray-500 font-medium hover:text-gray-900">Save as Draft</button>
                        <span className="text-gray-300">|</span>
                        <span className="text-gray-400 text-sm font-medium">Step 1 of 2</span>
                    </div>
                </div>

                {/* Stepper */}
                <div className="flex justify-center mb-12">
                    <div className="flex items-center">
                        <div className="flex items-center space-x-2">
                            <div className="w-8 h-8 rounded-full bg-[#8da6ae] text-white flex items-center justify-center font-bold">1</div>
                            <span className="font-bold text-gray-900">Basic Info</span>
                        </div>
                        <div className="w-32 h-0.5 bg-gray-200 mx-4"></div>
                        <div className="flex items-center space-x-2 opacity-40">
                            <div className="w-8 h-8 rounded-full border-2 border-gray-300 text-gray-400 flex items-center justify-center font-bold">2</div>
                            <span className="font-medium text-gray-400">Tickets & Pricing</span>
                        </div>
                    </div>
                </div>

                {/* Form Sections */}
                <div className="space-y-6"> {/* Added spacing between cards if needed, but they have margin-bottom already */}
                    <EventDetailsSection />
                    <ScheduleSection />
                    <LocationSection />
                </div>

                {/* Footer Actions */}
                <div className="flex justify-end pt-4 pb-12">
                    <Button className="bg-[#9ba9b4] hover:bg-[#8a9aa5] text-white px-8 py-3 rounded-xl flex items-center space-x-2">
                        <span>Continue to Tickets</span>
                        <ArrowRight className="w-4 h-4 ml-1" />
                    </Button>
                </div>

            </div>
        </Layout>
    );
};

export default CreateEvent;
