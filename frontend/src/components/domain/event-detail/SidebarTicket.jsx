import { Info, Lock, Minus, Plus, Ticket } from "lucide-react";
import { useTicketCart } from "../../../hooks/useTicketCart";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  reserveTickets,
  setSelectedTickets,
  setSelectedEvent,
} from "../../../store/slices/booking.slice";

const SidebarTicket = ({ minPrice, ticketTypes, event }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading } = useSelector((state) => state.booking);
  const { isAuthenticated } = useSelector((state) => state.auth);

  const {
    ticketCounts,
    handleAddTicket,
    handleRemoveTicket,
    subTotal,
    freeTicketCount,
    handleAddFreeTicket,
    handleRemoveFreeTicket,
    totalSelectedTickets,
    maxTickets,
    formatCurrency,
  } = useTicketCart(ticketTypes);

  const eventState = {
    eventId: event?.eventId,
    eventName: event?.eventName,
    eventSlug: event?.eventSlug,
    location: event?.location,
    startDate: event?.startDate,
    bannerUrl: event?.bannerUrl,
  };

  const handleBuyTickets = async () => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    if (!ticketTypes || ticketTypes.length === 0) {
      navigate("/attendee/checkout", {
        state: {
          tickets: [{
            ticketTypeId: null,
            ticketTypeName: "Free Admission",
            price: 0,
            quantity: freeTicketCount,
          }],
          event: eventState,
        },
      });
      return;
    }

    const selectedList = ticketTypes
      .filter((t) => (ticketCounts[t.ticketTypeId] || 0) > 0)
      .map((t) => ({
        ticketTypeId: t.ticketTypeId,
        ticketTypeName: t.ticketName,
        price: t.price,
        quantity: ticketCounts[t.ticketTypeId],
      }));

    if (selectedList.length === 0) return;

    try {
      await Promise.all(
        selectedList.map((ticket) =>
          dispatch(
            reserveTickets({
              ticketTypeId: ticket.ticketTypeId,
              quantity: ticket.quantity,
            }),
          ).unwrap(),
        ),
      );

      navigate("/attendee/checkout", {
        state: {
          tickets: selectedList,
          event: eventState,
        },
      });
    } catch (error) {
      console.error(error);
    }
  };

  const hasSelectedTickets =
    ticketTypes?.length > 0 &&
    ticketTypes.some((t) => (ticketCounts[t.ticketTypeId] || 0) > 0);

  return (
    <div className="bg-white rounded-[28px] shadow-xl overflow-hidden border border-[#E5E1DA]">
      <div className="p-6 border-b border-[#E5E1DA] flex items-center justify-between">
        <span className="text-sm font-medium text-slate-500 uppercase tracking-widest">
          Starting at
        </span>
        <div className="text-right">
          <span className="text-2xl font-black text-primary">
            {minPrice ? formatCurrency(minPrice) : "Free"}
          </span>
        </div>
      </div>

      <div className="p-6 space-y-4">
        <div className="flex items-start sm:items-center gap-2.5 p-3 bg-amber-50/80 rounded-xl border border-amber-100 mb-2">
          <Info className="w-4 h-4 text-amber-500 shrink-0 mt-0.5 sm:mt-0" />
          <p className="text-[12px] text-amber-700 font-medium leading-relaxed">
            Maximum of{" "}
            <span className="font-bold text-amber-600">
              {maxTickets} tickets
            </span>{" "}
            per account.
          </p>
        </div>
        {ticketTypes && ticketTypes.length > 0 ? (
          ticketTypes.map((ticket) => {
            const count = ticketCounts[ticket.ticketTypeId] || 0;
            const isSoldOut =
              (ticket.soldCount ?? 0) + (ticket.reservedCount ?? 0) >=
              ticket.quantity;
            return (
              <div
                key={ticket.ticketTypeId}
                className={`flex items-center justify-between p-4 rounded-2xl ${isSoldOut ? "bg-slate-50 opacity-50" : "bg-slate-50"}`}
              >
                <div>
                  <p className={`font-bold ${isSoldOut ? "line-through" : ""}`}>
                    {ticket.ticketName}
                  </p>
                  {!isSoldOut ? (
                    <p className="text-sm text-primary font-bold">
                      {formatCurrency(ticket.price)}
                    </p>
                  ) : (
                    <p className="text-[11px] text-red-500 font-bold uppercase tracking-widest mt-1">
                      Sold Out
                    </p>
                  )}
                </div>

                <div
                  className={`flex items-center gap-3 ${isSoldOut ? "cursor-not-allowed" : ""}`}
                >
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
                                                ${
                                                  !isSoldOut
                                                    ? "border-primary text-primary bg-primary/10"
                                                    : "border-slate-200 hover:bg-slate-100"
                                                }`}
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })
        ) : (
          <div className="flex items-center justify-between p-4 bg-green-50/50 rounded-2xl border border-green-100/50">
            <div className="flex gap-4 items-center">
              <div className="size-10 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                <Ticket />
              </div>
              <div>
                <p className="font-bold text-slate-800">Tickets</p>
                <p className="text-sm text-green-600 font-bold mt-0.5">
                  Admission is free
                </p>
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
          onClick={handleBuyTickets}
          disabled={loading || (ticketTypes?.length > 0 && !hasSelectedTickets)}
          className="w-full bg-primary hover:bg-primary/90 text-white font-extrabold py-4 rounded-xl transition-all uppercase tracking-wider shadow-lg shadow-primary/20 disabled:opacity-70 disabled:shadow-none disabled:cursor-not-allowed relative overflow-hidden"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-3">
              <span className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-white rounded-full animate-bounce [animation-delay:-0.3s]" />
                <span className="w-1.5 h-1.5 bg-white rounded-full animate-bounce [animation-delay:-0.15s]" />
                <span className="w-1.5 h-1.5 bg-white rounded-full animate-bounce" />
              </span>
              <span className="text-sm tracking-widest font-bold">
                Securing your seats...
              </span>
            </span>
          ) : !ticketTypes || ticketTypes.length === 0 ? (
            "Register Now"
          ) : subTotal > 0 ? (
            "Buy Tickets Now"
          ) : hasSelectedTickets ? (
            "Register Now"
          ) : (
            "Select Tickets"
          )}
        </button>

        {subTotal > 0 && (
          <div className="mt-4 flex items-center justify-center gap-2 text-[10px] text-slate-500 uppercase tracking-widest font-bold">
            <Lock className="w-3 h-3" />
            Safe payment via VNPay
          </div>
        )}
      </div>
    </div>
  );
};

export default SidebarTicket;
