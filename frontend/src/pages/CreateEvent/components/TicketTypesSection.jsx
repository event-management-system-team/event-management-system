import React from 'react';
import { Trash2, PlusCircle } from 'lucide-react';

export const TicketTypesSection = ({ tickets, onTicketChange, onRemoveTicket, onAddTicket }) => {
    return (
        <div className="mb-10">
            {/* Column Headers */}
            <div className="grid grid-cols-[1fr_160px_160px_40px] gap-4 mb-4 px-2">
                <span className="text-xs font-bold text-gray-400 tracking-wider uppercase">Ticket Name</span>
                <span className="text-xs font-bold text-gray-400 tracking-wider uppercase text-center">Quantity</span>
                <span className="text-xs font-bold text-gray-400 tracking-wider uppercase text-center">Price (USD)</span>
                <span></span>
            </div>

            {/* Ticket Rows */}
            <div className="space-y-3">
                {tickets.map((ticket) => (
                    <div
                        key={ticket.id}
                        className="grid grid-cols-[1fr_160px_160px_40px] gap-4 items-center bg-gray-50/50 border border-gray-200 rounded-xl px-4 py-3 hover:border-[#8da6ae]/40 transition-colors"
                    >
                        <input
                            type="text"
                            value={ticket.name}
                            onChange={(e) => onTicketChange(ticket.id, 'name', e.target.value)}
                            placeholder="Ticket name"
                            className="w-full bg-transparent text-gray-900 font-medium focus:outline-none placeholder:text-gray-400"
                        />
                        <input
                            type="number"
                            value={ticket.quantity}
                            onChange={(e) => onTicketChange(ticket.id, 'quantity', parseInt(e.target.value) || 0)}
                            className="w-full bg-transparent text-gray-700 text-center focus:outline-none"
                        />
                        <div className="flex items-center justify-center">
                            <span className="text-gray-400 mr-1">$</span>
                            <input
                                type="number"
                                value={ticket.price.toFixed(2)}
                                onChange={(e) => onTicketChange(ticket.id, 'price', parseFloat(e.target.value) || 0)}
                                step="0.01"
                                className="w-full bg-transparent text-gray-700 text-center focus:outline-none"
                            />
                        </div>
                        <button
                            onClick={() => onRemoveTicket(ticket.id)}
                            className="flex items-center justify-center text-gray-300 hover:text-red-400 transition-colors"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                    </div>
                ))}
            </div>

            {/* Add Ticket Button */}
            <button
                onClick={onAddTicket}
                className="w-full mt-4 py-4 border-2 border-dashed border-[#8da6ae]/30 rounded-xl flex items-center justify-center space-x-2 text-[#8da6ae] hover:bg-[#8da6ae]/5 hover:border-[#8da6ae]/50 transition-colors"
            >
                <PlusCircle className="w-5 h-5" />
                <span className="font-medium">Add Another Ticket Type</span>
            </button>
        </div>
    );
};
