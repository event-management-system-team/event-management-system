import { useMemo, useReducer, useState } from 'react';

const MAX_TICKETS = 5;

const cardReducer = (state, action) => {
    switch (action.type) {
        case 'ADD_TICKET': {

            const currentTotal = Object.values(state).reduce((sum, count) => sum + count, 0);
            if (currentTotal >= MAX_TICKETS) return state;

            const ticketId = action.payload;
            return { ...state, [ticketId]: (state[ticketId] || 0) + 1 }
        }

        case 'REMOVE_TICKET': {
            const ticketId = action.payload;
            const currentCount = state[ticketId] || 0;

            if (currentCount <= 0) return state;

            if (currentCount === 1) {
                const newState = { ...state };
                delete newState[ticketId];
                return newState;
            }

            return {
                ...state,
                [ticketId]: currentCount - 1
            };
        }

        default:
            return state;

    }

}

export const useTicketCart = (ticketTypes) => {

    const [ticketCounts, dispatch] = useReducer(cardReducer, {});

    const handleAddTicket = (ticketId) => {
        dispatch({ type: 'ADD_TICKET', payload: ticketId })
    };

    const handleRemoveTicket = (ticketId) => {
        dispatch({ type: 'REMOVE_TICKET', payload: ticketId });
    };

    const subTotal = useMemo(() => {
        if (!ticketTypes || ticketTypes.length === 0) return 0;
        return ticketTypes.reduce((total, ticket) => {
            const count = ticketCounts[ticket.ticketTypeId] || 0
            return total + (ticket.price * count)
        }, 0)
    }, [ticketTypes, ticketCounts])

    const totalSelectedTickets = useMemo(() => {
        return Object.values(ticketCounts).reduce((sum, count) => sum + count, 0);
    }, [ticketCounts]);


    const [freeTicketCount, setFreeTicketCount] = useState(1);

    const handleAddFreeTicket = () => {
        setFreeTicketCount(prev => Math.min(MAX_TICKETS, prev + 1));
    };

    const handleRemoveFreeTicket = () => {
        setFreeTicketCount(prev => Math.max(1, prev - 1));
    };


    const formatCurrency = (amount) => {
        if (amount === undefined || amount === null) return '0đ';
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
    };

    return {
        ticketCounts,
        handleAddTicket,
        handleRemoveTicket,
        subTotal,
        freeTicketCount,
        handleAddFreeTicket,
        handleRemoveFreeTicket,
        maxTickets: MAX_TICKETS,
        totalSelectedTickets,
        formatCurrency
    };
};