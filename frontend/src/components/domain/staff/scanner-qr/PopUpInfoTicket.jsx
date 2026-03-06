import { Modal, Button, Typography } from 'antd';
import {
    UserOutlined,
    MailOutlined,
    BarcodeOutlined,
    TagOutlined,
    CheckCircleOutlined,
    ClockCircleOutlined,
    CalendarOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';

const { Text } = Typography;

const PopUpInfoTicket = ({
    isVisible,
    onClose,
    ticketData,
    onCheckIn
}) => {
    if (!ticketData) return null;

    const isCheckedIn = ticketData.status === 'CHECKED_IN';
    const isError = ticketData.status === 'ERROR';

    return (
        <Modal
            title={<div className="text-xl font-extrabold text-[#2C3E50] border-b border-slate-100 pb-4 mb-2">Ticket Information</div>}
            open={isVisible}
            onCancel={onClose}
            footer={null}
            centered
            width={400}
            styles={{
                content: { borderRadius: '24px', padding: '24px' },
                mask: { backdropFilter: 'blur(4px)' }
            }}
        >
            <div className="flex flex-col gap-4 py-2">

                <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-semibold text-slate-500">Current Status:</span>
                    {isCheckedIn ? (
                        <div className="bg-green-100 text-green-700 text-[11px] font-extrabold px-3 py-1.5 rounded-full flex items-center gap-1.5 m-0 border border-green-200">
                            <CheckCircleOutlined /> CHECKED IN
                        </div>
                    ) : isError ? (
                        <div className="bg-red-100 text-red-700 text-[11px] font-extrabold px-3 py-1.5 rounded-full m-0 uppercase border border-red-200">
                            {ticketData.message || 'INVALID TICKET'}
                        </div>
                    ) : (
                        <div className="bg-[#89A8B2]/10 text-[#89A8B2] text-[11px] font-extrabold px-3 py-1.5 rounded-full m-0 border border-[#89A8B2]/20">
                            NOT CHECKED IN YET
                        </div>
                    )}
                </div>

                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex flex-col gap-4 mt-2 shadow-sm">
                    <div className="flex items-center gap-3">
                        <div className="bg-[#89A8B2]/10 text-[#89A8B2] p-2.5 rounded-xl border border-[#89A8B2]/20 shadow-sm">
                            <UserOutlined className="text-xl" />
                        </div>
                        <div className="flex flex-col">
                            <Text className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-0.5">Attendee Name</Text>
                            <Text className="text-base font-extrabold text-[#2C3E50] leading-tight">{ticketData.customerName}</Text>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="bg-white text-slate-500 p-2.5 rounded-xl border border-slate-200 shadow-sm">
                            <MailOutlined className="text-xl" />
                        </div>
                        <div className="flex flex-col">
                            <Text className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-0.5">Email Address</Text>
                            <Text className="text-sm font-bold text-[#2C3E50] leading-tight truncate">{ticketData.email}</Text>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-3 mt-1 shadow-sm">
                    <div className="bg-[#89A8B2]/5 p-3.5 rounded-2xl border border-[#89A8B2]/20 flex flex-col gap-1 items-start">
                        <div className="flex items-center gap-1.5 text-slate-500 mb-1">
                            <TagOutlined className="text-[#89A8B2]" />
                            <Text className="text-[10px] font-bold uppercase tracking-wider">Ticket Type</Text>
                        </div>
                        <Text className="font-extrabold text-[#89A8B2] text-sm">{ticketData.ticketType}</Text>
                    </div>

                    <div className="bg-white p-3.5 rounded-2xl border border-slate-200 flex flex-col gap-1 items-start">
                        <div className="flex items-center gap-1.5 text-slate-500 mb-1">
                            <BarcodeOutlined className="text-slate-400" />
                            <Text className="text-[10px] font-bold uppercase tracking-wider">Ticket Code</Text>
                        </div>
                        <Text className="font-extrabold text-[#2C3E50] tracking-wider text-sm">{ticketData.ticketCode}</Text>
                    </div>
                </div>

                <div className="bg-white border text-sm border-slate-100 rounded-2xl p-4 flex flex-col gap-3 mt-1 shadow-sm">
                    {ticketData.createdAt && (
                        <div className="flex items-center justify-between">
                            <span className="text-slate-500 font-medium flex items-center gap-2">
                                <CalendarOutlined className="text-slate-400" /> Purchased On
                            </span>
                            <span className="font-bold text-slate-700 text-xs">
                                {dayjs(ticketData.createdAt).format('DD MMM YYYY, HH:mm')}
                            </span>
                        </div>
                    )}

                    {isCheckedIn && ticketData.checkInTime && (
                        <>
                            <div className="h-px w-full bg-slate-100 my-0.5"></div>
                            <div className="flex items-center justify-between">
                                <span className="text-green-600 font-medium flex items-center gap-2">
                                    <ClockCircleOutlined className="text-green-500" /> Check-in Time
                                </span>
                                <span className="font-bold text-green-700 text-xs">
                                    {dayjs(ticketData.checkInTime).format('DD MMM YYYY, HH:mm:ss')}
                                </span>
                            </div>
                        </>
                    )}
                </div>


                {!isCheckedIn && !isError && (
                    <div className="mt-3">
                        <Button
                            type="primary"
                            size="large"
                            className="w-full bg-[#89A8B2] hover:bg-[#6c8a94] h-14 text-base font-extrabold rounded-2xl shadow-lg shadow-[#89A8B2]/30 border-none transition-all hover:scale-[1.02]"
                            icon={<CheckCircleOutlined className="text-lg" />}
                            onClick={() => onCheckIn(ticketData)}
                        >
                            CONFIRM CHECK-IN
                        </Button>
                    </div>
                )}

                {isError && (
                    <div className="mt-3">
                        <Button
                            danger
                            size="large"
                            className="w-full h-14 text-base font-extrabold rounded-2xl transition-all hover:scale-[1.02]"
                            onClick={onClose}
                        >
                            CLOSE
                        </Button>
                    </div>
                )}
            </div>
        </Modal>
    );
};

export default PopUpInfoTicket;
