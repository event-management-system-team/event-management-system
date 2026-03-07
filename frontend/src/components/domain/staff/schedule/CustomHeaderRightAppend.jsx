import { useEffect, useState } from "react";

export const TOGGLE_EVENT_NAME = 'toggleNationalHolidays';

const CustomHeaderRightAppend = () => {

    const [show, setShow] = useState(false);

    useEffect(() => {
        const handleSync = (e) => setShow(e.detail);
        window.addEventListener(TOGGLE_EVENT_NAME, handleSync);
        return () => window.removeEventListener(TOGGLE_EVENT_NAME, handleSync);
    }, []);

    const handleChange = (e) => {
        const checked = e.target.checked;
        setShow(checked);
        window.dispatchEvent(new CustomEvent(TOGGLE_EVENT_NAME, { detail: checked }));
    };

    return (
        <div className="flex justify-end items-center px-2 mr-2 self-center">
            <label className="flex items-center gap-3 cursor-pointer group">
                <span className="text-sm font-bold text-[#2C3E50]">Show National Holiday</span>

                <div className={`relative w-12 h-6 transition-colors duration-300 rounded-full ${show ? 'bg-[#89A8B2]' : 'bg-slate-300'}`}>
                    <div className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform duration-300 shadow-sm ${show ? 'translate-x-6' : 'translate-x-0'}`}></div>
                </div>

                <input
                    type="checkbox"
                    className="sr-only"
                    checked={show}
                    onChange={handleChange}
                />
            </label>
        </div>
    );
};

export default CustomHeaderRightAppend