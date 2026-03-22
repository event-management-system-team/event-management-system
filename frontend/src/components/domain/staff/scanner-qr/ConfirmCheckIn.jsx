import React from 'react';
import { Modal } from 'antd';
import { User, Ticket, QrCode } from 'lucide-react';

const ConfirmCheckIn = ({ isOpen, onClose, onConfirm, ticketInfo, isLoading }) => {
    if (!ticketInfo) return null;

    return (
        <Modal
            open={isOpen}
            onCancel={onClose}
            footer={null}
            centered
            width={240}
            closeIcon={false}
            classNames={{
                content: 'p-0 overflow-hidden rounded-[16px]',
                body: 'p-3'
            }}
        >
            <div className="text-center mb-3 mt-0.5">
                <h3 className="text-[15px] font-bold text-[#2C3E50]">Confirm</h3>
            </div>
            <div className="bg-[#F8FAFC] rounded-lg p-2 mb-4 border border-slate-100 flex flex-col gap-2">
                <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-blue-500 shrink-0" />
                    <p className="font-semibold text-slate-800 text-xs truncate flex-1">
                        {ticketInfo.customerName || 'N/A'}
                    </p>
                </div>

                <div className="h-[1px] w-full bg-slate-200/50"></div>

                <div className="flex items-center gap-2">
                    <Ticket className="w-4 h-4 text-purple-500 shrink-0" />
                    <p className="font-semibold text-slate-800 text-xs truncate flex-1">
                        {ticketInfo.ticketType || 'N/A'}
                    </p>
                </div>

                <div className="h-[1px] w-full bg-slate-200/50"></div>

                <div className="flex items-center gap-2">
                    <QrCode className="w-4 h-4 text-orange-500 shrink-0" />
                    <p className="font-mono font-semibold text-slate-800 text-[11px] truncate flex-1">
                        {ticketInfo.ticketCode || 'N/A'}
                    </p>
                </div>
            </div>

            <div className="flex gap-2">
                <button
                    onClick={onClose}
                    disabled={isLoading}
                    className="flex-1 px-2 py-1.5 rounded-md font-semibold text-xs text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors disabled:opacity-50"
                >
                    Cancel
                </button>
                <button
                    onClick={onConfirm}
                    disabled={isLoading}
                    className="flex-1 px-2 py-1.5 rounded-md font-semibold text-xs text-white bg-[#4ECDC4] hover:bg-[#45b8b0] flex items-center justify-center gap-1 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
                >
                    {isLoading ? (
                        <div className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                    ) : (
                        'Check In'
                    )}
                </button>
            </div>
        </Modal>
    );
};

export default ConfirmCheckIn;
