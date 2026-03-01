import { Info, Lock, Minus, Plus, Ticket } from 'lucide-react'
import { useTicketCart } from '../../../hooks/useTicketCart'
import EmptyState from '../../common/EmptyState'

const SidebarTicket = ({ minPrice, ticketTypes }) => {


    const { ticketCounts, handleAddTicket, handleRemoveTicket, subTotal,
        freeTicketCount, handleAddFreeTicket, handleRemoveFreeTicket,
        totalSelectedTickets, maxTickets, formatCurrency } = useTicketCart(ticketTypes)
    return (
        <div className="bg-white rounded-[28px] shadow-xl overflow-hidden border border-[#E5E1DA]">

            <div className="p-6 border-b border-[#E5E1DA] flex items-center justify-between">
                <span className="text-sm font-medium text-slate-500 uppercase tracking-widest">Starting at</span>
                <div className="text-right">
                    <span className="text-2xl font-black text-primary">
                        {minPrice ? formatCurrency(minPrice) : 'Free'}
                    </span>
                </div>
            </div>

            <div className="p-6 space-y-4">
                <div className="flex items-start sm:items-center gap-2.5 p-3 bg-amber-50/80 rounded-xl border border-amber-100 mb-2">
                    <Info className="w-4 h-4 text-amber-500 shrink-0 mt-0.5 sm:mt-0" />
                    <p className="text-[12px] text-amber-700 font-medium leading-relaxed">
                        Maximum of <span className="font-bold text-amber-600">{maxTickets} tickets</span>  per account.
                    </p>
                </div>
                {ticketTypes && ticketTypes.length > 0 ? (
                    ticketTypes.map((ticket) => {
                        const count = ticketCounts[ticket.ticketTypeId] || 0;
                        const isSoldOut = (ticket.soldCount + ticket.reservedCount) === ticket.quantity;
                        return (
                            <div
                                key={ticket.ticketTypeId}
                                className={`flex items-center justify-between p-4 rounded-2xl ${isSoldOut ? 'bg-slate-50 opacity-50' : 'bg-slate-50'}`}
                            >
                                <div>
                                    <p className={`font-bold ${isSoldOut ? 'line-through' : ''}`}>{ticket.ticketName}</p>
                                    {!isSoldOut ? (
                                        <p className="text-sm text-primary font-bold">
                                            {formatCurrency(ticket.price)}
                                        </p>
                                    ) : (
                                        <p className="text-[11px] text-red-500 font-bold uppercase tracking-widest mt-1">Sold Out</p>
                                    )}
                                </div>

                                <div className={`flex items-center gap-3 ${isSoldOut ? 'cursor-not-allowed' : ''}`}>
                                    <button
                                        onClick={() => handleRemoveTicket(ticket.ticketTypeId)}
                                        disabled={isSoldOut || count <= 0}
                                        className="size-8 rounded-full border border-slate-200 flex items-center justify-center hover:bg-slate-100 transition-colors disabled:opacity-50 disabled:hover:bg-transparent"
                                    >
                                        <Minus className="w-4 h-4" />
                                    </button>
                                    {count}
                                    <button
                                        onClick={() => handleAddTicket(ticket.ticketTypeId)}
                                        disabled={isSoldOut || totalSelectedTickets >= maxTickets}
                                        className={`size-8 rounded-full border flex items-center justify-center transition-colors disabled:opacity-50
                                                ${!isSoldOut
                                                ? 'border-primary text-primary bg-primary/10'
                                                : 'border-slate-200 hover:bg-slate-100'}`}
                                    >
                                        <Plus className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        );
                    })
                ) : (
                    // Free
                    <div className="flex items-center justify-between p-4 bg-green-50/50 rounded-2xl border border-green-100/50">
                        <div className="flex gap-4 items-center">
                            <div className="size-10 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                                <Ticket />
                            </div>
                            <div>
                                <p className="font-bold text-slate-800">Tickets</p>
                                <p className="text-sm text-green-600 font-bold mt-0.5">Admission is free</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <button
                                onClick={handleRemoveFreeTicket}
                                disabled={freeTicketCount <= 1}
                                className="size-8 rounded-full border border-slate-200 flex items-center justify-center hover:bg-slate-100 transition-colors disabled:opacity-50 disabled:hover:bg-transparent"
                            >
                                <Minus className="w-4 h-4" />
                            </button>

                            <span className="text-sm font-bold w-4 text-center text-green-800">
                                {freeTicketCount}
                            </span>

                            <button
                                onClick={handleAddFreeTicket}
                                disabled={freeTicketCount >= maxTickets}
                                className="size-8 rounded-full border border-slate-200 flex items-center justify-center hover:bg-slate-100 transition-colors disabled:opacity-50 disabled:hover:bg-transparent"
                            >
                                <Plus className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                )}
            </div>

            <div className="p-6 bg-slate-100/50">
                <div className="flex items-center justify-between mb-6">
                    <span className="text-slate-600 font-semibold">Subtotal</span>
                    <span className="text-xl font-bold">{formatCurrency(subTotal)}</span>
                </div>

                <button
                    disabled={(ticketTypes?.length > 0) && (!ticketTypes.some(t => ticketCounts[t.ticketTypeId] > 0))}
                    className="w-full bg-primary hover:bg-primary/90 text-white font-extrabold py-4 rounded-xl transition-all uppercase tracking-wider shadow-lg shadow-primary/20 disabled:bg-slate-300 disabled:shadow-none disabled:cursor-not-allowed"
                >
                    {(!ticketTypes || ticketTypes.length === 0)
                        ? 'Registration'
                        : (subTotal > 0 ? 'Buy Tickets Now' : 'Select Tickets')}
                </button>

                <div className="mt-4 flex items-center justify-center gap-2 text-[10px] text-slate-500 uppercase tracking-widest font-bold">
                    <Lock className="w-3 h-3" />
                    Safe payment via VNPay
                </div>
            </div>
        </div>
    )
}

export default SidebarTicket
