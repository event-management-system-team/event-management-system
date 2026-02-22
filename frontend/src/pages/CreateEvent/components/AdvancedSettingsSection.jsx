import React from 'react';
import { Shield, EyeOff } from 'lucide-react';

const Toggle = ({ enabled, onToggle }) => {
    return (
        <button
            onClick={onToggle}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus:outline-none ${enabled ? 'bg-[#8da6ae]' : 'bg-gray-300'
                }`}
        >
            <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 shadow-sm ${enabled ? 'translate-x-6' : 'translate-x-1'
                    }`}
            />
        </button>
    );
};

export const AdvancedSettingsSection = ({ settings, onToggle }) => {
    return (
        <div>
            <h3 className="text-xs font-bold text-[#8da6ae] tracking-widest uppercase mb-4">Advanced Settings</h3>

            <div className="space-y-3">
                {/* Limit tickets per person */}
                <div className="flex items-center justify-between bg-gray-50/50 border border-gray-200 rounded-xl px-5 py-4">
                    <div className="flex items-center space-x-3">
                        <div className="w-9 h-9 rounded-lg bg-[#8da6ae]/10 flex items-center justify-center">
                            <Shield className="w-4 h-4 text-[#8da6ae]" />
                        </div>
                        <div>
                            <p className="font-semibold text-gray-900 text-sm">Limit tickets per person</p>
                            <p className="text-xs text-gray-400">Enable to restrict how many tickets a single account can buy</p>
                        </div>
                    </div>
                    <Toggle enabled={settings.limitTickets} onToggle={() => onToggle('limitTickets')} />
                </div>

                {/* Private event */}
                <div className="flex items-center justify-between bg-gray-50/50 border border-gray-200 rounded-xl px-5 py-4">
                    <div className="flex items-center space-x-3">
                        <div className="w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center">
                            <EyeOff className="w-4 h-4 text-gray-400" />
                        </div>
                        <div>
                            <p className="font-semibold text-gray-900 text-sm">Private event (invite only)</p>
                            <p className="text-xs text-gray-400">Your event will only be accessible via a direct secret link</p>
                        </div>
                    </div>
                    <Toggle enabled={settings.privateEvent} onToggle={() => onToggle('privateEvent')} />
                </div>
            </div>
        </div>
    );
};
