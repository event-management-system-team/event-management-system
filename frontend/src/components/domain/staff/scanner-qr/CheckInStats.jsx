import { Flex, Progress, Tag, Typography } from 'antd';
import { Ticket, Star } from 'lucide-react';
import { useMemo } from 'react';


const { Text } = Typography;

const CheckInStats = ({ ticketStats }) => {

    const getTicketUI = (ticketName) => {
        const name = (ticketName || '').toLowerCase();

        if (name.includes('vip')) {
            return { icon: Star, bg: 'bg-purple-50', border: 'border-purple-100', color: 'text-purple-500' };
        }

        return { icon: Ticket, bg: 'bg-blue-50', border: 'border-blue-100', color: 'text-blue-500' };
    };


    const { totalSold, totalCheckIn, percentage } = useMemo(() => {
        if (!ticketStats || ticketStats.length === 0) return { totalSold: 0, totalCheckIn: 0, percentage: 0 };

        const sold = ticketStats.reduce((sum, ticket) => sum + ticket.soldCount, 0);
        const checkIn = ticketStats.reduce((sum, ticket) => sum + ticket.checkInCount, 0);
        const percent = sold === 0 ? 0 : ((checkIn / sold) * 100).toFixed(1);

        return { totalSold: sold, totalCheckIn: checkIn, percentage: percent };
    }, [ticketStats]);


    return (
        <div className="bg-white rounded-3xl flex flex-col shadow-sm border border-slate-100 p-6 h-fit sticky top-0 transition-all flex-1">
            <Flex vertical gap="middle">
                <Flex justify="space-between" align="flex-end">
                    <Flex vertical>
                        <Text
                            type="secondary"
                            strong
                            style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1px' }}
                        >
                            Total Check-In Progress
                        </Text>

                        <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', marginTop: '4px' }}>
                            <span style={{ fontSize: '48px', fontWeight: 900, color: '#2C3E50', lineHeight: 1 }}>
                                {totalCheckIn}
                            </span>
                            <span style={{ fontSize: '18px', fontWeight: 'bold', color: '#94a3b8' }}>
                                / {totalSold}
                            </span>
                        </div>
                    </Flex>

                    <Tag
                        color="success"
                        style={{
                            margin: 0,
                            padding: '4px 12px',
                            fontSize: '14px',
                            fontWeight: 'bold',
                            borderRadius: '8px'
                        }}
                    >
                        {percentage}%
                    </Tag>
                </Flex>


                <Progress
                    percent={percentage}
                    showInfo={false}
                    status="active"
                    strokeColor={{ '0%': '#89A8B2', '100%': '#4ECDC4' }}
                    size={['100%', 12]}
                />
            </Flex>
            <div style={{ paddingTop: '20px', borderTop: '1px solid #f1f5f9' }}>
                <Text
                    type="secondary"
                    strong
                    style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1px', display: 'block', marginBottom: '16px' }}
                >
                    Ticket Type Breakdown
                </Text>

                {ticketStats?.map((stat) => {
                    const ui = getTicketUI(stat.ticketName);
                    const IconComp = ui.icon;

                    return (
                        <Flex key={stat.ticketTypeId} justify="space-between" align="center">
                            <Flex align="center" gap="12px">
                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center border ${ui.bg} ${ui.border}`}>
                                    <IconComp size={16} className={ui.color} />
                                </div>

                                <Flex vertical>
                                    <Text strong style={{ color: '#2C3E50', fontSize: '14px', lineHeight: 1.2 }}>
                                        {stat.ticketName}
                                    </Text>
                                    <Text type="secondary" style={{ fontSize: '10px', fontWeight: 500 }}>
                                        Total: {stat.soldCount}
                                    </Text>
                                </Flex>
                            </Flex>

                            <div style={{ textAlign: 'right' }}>
                                <Text strong style={{ color: '#2C3E50', fontSize: '14px', fontWeight: 900 }}>
                                    {stat.checkInCount}
                                </Text>
                                <Text type="secondary" style={{ fontSize: '12px', fontWeight: 500, marginLeft: '4px' }}>
                                    in
                                </Text>
                            </div>
                        </Flex>
                    );
                })}
            </div>
        </div>

    );
};

export default CheckInStats;