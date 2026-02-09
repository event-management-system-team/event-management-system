import React from 'react';
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
    return twMerge(clsx(inputs));
}

export const Button = ({ children, className, variant = 'primary', ...props }) => {
    const baseStyles = "px-6 py-3 rounded-lg font-medium transition-all duration-200 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed";

    const variants = {
        primary: "bg-[#9ba9b4] hover:bg-[#8a9aa5] text-white shadow-sm", // Grey-ish blue from "Continue to Tickets" - wait, screenshot actually looks like a greenish grey or slate. Let's try to pick a better color. The screenshot button "Continue to Tickets" looks like a muted blue-grey.
        // Actually, looking closer at the screenshot, the "Continue to Tickets" button is #8da6ae (approx).
        // Let's use a custom class for that specific look or a general primary.
        // The "Save as Draft" is text only.
        ghost: "bg-transparent hover:bg-gray-200 text-gray-600",
        outline: "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50",
    };

    // The button in screenshot "Continue to Tickets" has a gradient or solid fill, rounded-full or large rounded. matching screenshot.
    // It is `bg-[#94A3B8]` kind of color? No, it's `bg-[#8E9BAE]` or similar.
    // Let's settle on a nice slate-500 equivalent.

    return (
        <button
            className={cn(baseStyles, variants[variant], className)}
            {...props}
        >
            {children}
        </button>
    );
};
