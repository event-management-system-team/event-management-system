import { Clock, BadgeCent } from 'lucide-react';
import { useEffect, useRef } from 'react';

const CustomEventModal = ({ calendarEvent }) => {
    const startTime = String(calendarEvent.start).substring(11, 16);
    const endTime = String(calendarEvent.end).substring(11, 16);
    const modalRef = useRef(null);

    useEffect(() => {
        if (!modalRef.current) return;

        const modalContainer = modalRef.current.closest('.sx__event-modal') || modalRef.current;

        modalContainer.style.marginLeft = '0px';
        modalContainer.style.marginTop = '0px';

        const rect = modalContainer.getBoundingClientRect();
        const calendarEl = document.querySelector('.sx-custom-calendar');
        if (!calendarEl) return;

        const calRect = calendarEl.getBoundingClientRect();

        let shiftX = 0;
        let shiftY = 0;
        const padding = 16;

        if (rect.right > calRect.right) {
            shiftX = calRect.right - rect.right - padding;
        }
        else if (rect.left < calRect.left) {
            shiftX = calRect.left - rect.left + padding;
        }
        if (rect.bottom > calRect.bottom) {
            shiftY = calRect.bottom - rect.bottom - padding;
        }
        else if (rect.top < calRect.top) {
            shiftY = calRect.top - rect.top + padding;
        }
        if (shiftX !== 0) modalContainer.style.marginLeft = `${shiftX}px`;
        if (shiftY !== 0) modalContainer.style.marginTop = `${shiftY}px`;

    }, [calendarEvent]);

    return (
        <div ref={modalRef} className="bg-white p-5 rounded-2xl shadow-xl border border-red-50 min-w-[280px]">
            <h3 className="font-bold text-lg text-slate-500 mb-4">{calendarEvent.title}</h3>

            <div className="space-y-3 text-sm text-slate-700">
                <div className="flex items-center gap-3">
                    <div className="p-1.5 bg-yellow-50 rounded-md text-yellow-600">
                        <Clock size={16} />
                    </div>
                    <span className="font-medium">{startTime} - {endTime}</span>
                </div>
                <div className="flex items-center gap-3">
                    <div className="p-1.5 bg-red-50 rounded-md text-red-600">
                        <BadgeCent size={16} />
                    </div>
                    <span className="font-medium">{calendarEvent.location || 'Not yet'}</span>
                </div>
            </div>
        </div>
    );
};

export default CustomEventModal
