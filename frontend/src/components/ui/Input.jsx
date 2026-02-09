import React from 'react';
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
    return twMerge(clsx(inputs));
}

export const Input = ({ label, className, icon: Icon, ...props }) => {
    return (
        <div className="w-full space-y-1.5">
            {label && <label className="block text-sm font-semibold text-gray-700">{label}</label>}
            <div className="relative">
                <input
                    className={cn(
                        "w-full px-4 py-3 rounded-lg border border-gray-200 bg-gray-50 text-gray-900 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all placeholder:text-gray-400",
                        Icon && "pl-10",
                        className
                    )}
                    {...props}
                />
                {Icon && (
                    <Icon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                )}
            </div>
        </div>
    );
};

export const TextArea = ({ label, className, ...props }) => {
    return (
        <div className="w-full space-y-1.5">
            {label && <label className="block text-sm font-semibold text-gray-700">{label}</label>}
            <textarea
                className={cn(
                    "w-full px-4 py-3 rounded-lg border border-gray-200 bg-gray-50 text-gray-900 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all placeholder:text-gray-400 min-h-[120px] resize-y",
                    className
                )}
                {...props}
            />
        </div>
    );
};

export const Select = ({ label, className, options = [], ...props }) => {
    return (
        <div className="w-full space-y-1.5">
            {label && <label className="block text-sm font-semibold text-gray-700">{label}</label>}
            <div className="relative">
                <select
                    className={cn(
                        "w-full px-4 py-3 rounded-lg border border-gray-200 bg-gray-50 text-gray-900 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all appearance-none cursor-pointer",
                        className
                    )}
                    {...props}
                >
                    {options.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                            {opt.label}
                        </option>
                    ))}
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                </div>
            </div>
        </div>
    );
};
