import { useRef, useState } from "react";

export const useAlert = () => {
    const [alert, setAlert] = useState({ type: "success", message: "" });
    const timerRef = useRef(null);

    const showAlert = (type, message, duration = 3000) => {
        setAlert({ type, message });

        if (timerRef.current) clearTimeout(timerRef.current);

        timerRef.current = setTimeout(() => {
            setAlert((prev) => ({ ...prev, message: "" }));
        }, duration);
    };

    const closeAlert = () => {
        if (timerRef.current) clearTimeout(timerRef.current);
        setAlert((prev) => ({ ...prev, message: "" }));
    };

    return { alert, showAlert, closeAlert };
};