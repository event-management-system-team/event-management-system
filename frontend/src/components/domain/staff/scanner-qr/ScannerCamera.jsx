import { useRef, useState } from 'react';
import { ScanLine } from 'lucide-react';
import ConfirmCheckIn from './ConfirmCheckIn';
import { Scanner } from '@yudiel/react-qr-scanner';
import { message } from 'antd';

const ScannerCamera = ({ onVerifyQR, onScanQR, isCheckingIn }) => {
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [scannedTicket, setScannedTicket] = useState(null);
    const coolDownRef = useRef(false);

    return (
        <div className="bg-white rounded-3xl p-4 shadow-sm border border-slate-100 relative overflow-hidden flex flex-col shrink-0 h-[400px] lg:h-1/2">
            <div className="flex items-center justify-between mb-3 px-1 shrink-0">
                <div className="flex items-center gap-2">
                    <ScanLine className="text-[#89A8B2]" size={22} />
                    <h2 className="text-[#2C3E50] text-base font-extrabold tracking-tight">Ticket Scanner</h2>
                </div>
                <div className="flex items-center gap-1.5 bg-green-50 px-2 py-1 rounded-md border border-green-100">
                    <span className="animate-pulse size-1.5 rounded-full bg-green-500"></span>
                    <span className="text-[10px] font-bold text-green-700 uppercase tracking-wide">Camera Active</span>
                </div>
            </div>

            <div className="w-full flex-1 overflow-hidden rounded-2xl bg-black relative shadow-inner">
                <Scanner
                    onScan={(result) => {
                        if (isCheckingIn || coolDownRef.current) {
                            return;
                        }
                        if (result && result.length > 0) {
                            const scannedCode = result[0].rawValue;
                            coolDownRef.current = true;

                            const verifyAsync = async () => {
                                try {
                                    if (onVerifyQR) {
                                        message.loading({ content: 'Verifying ticket...', key: 'verify_qr', duration: 0 });
                                        const ticket = await onVerifyQR(scannedCode);
                                        message.destroy('verify_qr');
                                        setScannedTicket(ticket);
                                        setIsConfirmOpen(true);
                                    } else {
                                        setScannedTicket({
                                            ticketCode: scannedCode
                                        });
                                        setIsConfirmOpen(true);
                                    }
                                } catch (error) {
                                    message.destroy('verify_qr');
                                    message.error(error.message || "Ticket verification failed!");
                                    setTimeout(() => {
                                        coolDownRef.current = false;
                                    }, 2000);
                                }
                            };

                            verifyAsync();
                        }
                    }}
                    onError={(error) => {
                        message.error("Camera Error: " + error?.message);
                    }}
                    constraints={{
                        facingMode: 'environment'
                    }}
                    components={{
                        audio: true,
                        torch: true,
                        finder: true
                    }}
                    styles={{
                        video: { objectFit: 'cover' }
                    }}
                />
            </div>

            <ConfirmCheckIn
                isOpen={isConfirmOpen}
                onClose={() => {
                    setIsConfirmOpen(false);
                    setTimeout(() => { coolDownRef.current = false; }, 1500);
                }}
                onConfirm={() => {
                    if (onScanQR && scannedTicket) {
                        onScanQR(scannedTicket.ticketCode);
                        setIsConfirmOpen(false);
                        setTimeout(() => { coolDownRef.current = false; }, 2000);
                    }
                }}
                ticketInfo={scannedTicket}
                isLoading={isCheckingIn}
            />
        </div>
    );
};

export default ScannerCamera;