import { useRef, useState } from 'react';
import { toPng } from 'html-to-image';

export const useExportTicket = () => {
    const ticketRef = useRef(null);
    const [isExporting, setIsExporting] = useState(false);

    const exportToImage = async (fileName = 'Ticket.png') => {
        const element = ticketRef.current;
        if (!element) return;

        setIsExporting(true);

        try {
            const imgData = await toPng(element, { pixelRatio: 2 });
            const link = document.createElement('a');
            link.download = fileName;
            link.href = imgData;
            link.click();
        } catch (error) {
            console.error("Fail export ticket:", error);
        } finally {
            setIsExporting(false);
        }
    };

    return { ticketRef, isExporting, exportToImage };
};