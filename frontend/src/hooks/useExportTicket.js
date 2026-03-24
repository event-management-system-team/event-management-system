import { useRef, useState } from 'react';
import { toPng } from 'html-to-image';

export const useExportTicket = () => {

    const singleRef = useRef(null);
    const multiRefs = useRef([]);

    const [isExporting, setIsExporting] = useState(false);

    const exportSingle = async (fileName = 'Ticket.png') => {
        const element = singleRef.current;
        if (!element) return;

        setIsExporting(true);
        try {
            const imgData = await toPng(element, { pixelRatio: 2 });
            const link = document.createElement('a');
            link.download = fileName;
            link.href = imgData;
            link.click();
        } catch (error) {
            console.error("Lỗi xuất 1 vé:", error);
        } finally {
            setIsExporting(false);
        }
    };

    const exportMultiple = async (tickets) => {
        setIsExporting(true);
        try {
            for (let i = 0; i < tickets.length; i++) {
                const element = multiRefs.current[i];
                if (!element) continue;

                const imgData = await toPng(element, { pixelRatio: 2 });
                const link = document.createElement('a');
                link.download = `${tickets[i].eventName}_${tickets[i].ticketCode}.png`;
                link.href = imgData;
                link.click();

                // Delay 500ms
                if (i < tickets.length - 1) {
                    await new Promise(resolve => setTimeout(resolve, 500));
                }
            }
        } catch (error) {
            console.error("Lỗi xuất nhiều vé:", error);
        } finally {
            setIsExporting(false);
        }
    };

    return {
        singleRef,
        multiRefs,
        isExporting,
        exportSingle,
        exportMultiple
    };
};