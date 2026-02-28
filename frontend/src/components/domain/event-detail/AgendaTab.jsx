import { Flex, Timeline, Typography } from 'antd';
import { Clock, MapPin } from 'lucide-react';
import EmptyState from '../../common/EmptyState';

const AgendaTab = ({ agendas }) => {

    const formatAgendaTime = (timeString) => {
        if (!timeString) return '';
        const date = new Date(timeString);
        return date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
    };
    return (
        <div className="bg-cream p-4 sm:p-8 rounded-3xl animate-in fade-in duration-500 shadow-sm border border-slate-100">
            <h3 className="text-2xl font-bold mb-4">Agenda</h3>

            {agendas && agendas.length > 0 ? (
                <div className="mt-6 sm:ml-2">
                    <Flex vertical gap="middle">
                        <Timeline
                            mode="start"
                            titleSpan="25%"
                            items={agendas.map((agenda) => ({
                                key: agenda.agendaId,

                                title: (
                                    <div className="text-slate-500 font-bold text-sm pr-4 flex items-center justify-end gap-2">
                                        <span>{formatAgendaTime(agenda.startTime)}</span>
                                        {agenda.endTime && (
                                            <>
                                                <span className="text-slate-300">-</span>
                                                <span>{formatAgendaTime(agenda.endTime)}</span>
                                            </>
                                        )}
                                    </div>
                                ),

                                content: (
                                    <div className="pb-6 pl-2 sm:pl-4">
                                        <div className="bg-[#faf9f5] p-4 sm:p-5 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow duration-300">
                                            <h4 className="text-[17px] font-bold mb-1.5">
                                                {agenda.title}
                                            </h4>

                                            {agenda.location && (
                                                <div className="flex items-center gap-1.5 text-sm text-slate-500 mb-2">
                                                    <MapPin className="w-4 h-4" />
                                                    <span>{agenda.location}</span>
                                                </div>
                                            )}

                                            {agenda.description && (
                                                <p className="text-slate-500 text-sm leading-relaxed">
                                                    {agenda.description}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                ),
                            }))}
                        />
                    </Flex>
                </div>
            ) : (
                <EmptyState message='We are updating the agenda' />
            )}
        </div>
    )
}

export default AgendaTab
