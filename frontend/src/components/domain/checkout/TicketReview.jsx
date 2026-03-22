import React from "react";
import { HiTicket } from "react-icons/hi2";

const TicketReview = ({ event, tickets }) => (
  <section className="bg-white rounded-xl p-6 border border-[#89A8B2]/20 shadow-sm">
    <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
      <HiTicket className="text-[#89A8B2] size-5" /> Ticket Review
    </h2>
    <div className="flex flex-col md:flex-row gap-6 items-start">
      <div className="flex-1 space-y-2">
        <p className="text-xs font-bold text-[#89A8B2] uppercase tracking-widest">
          Selected Event
        </p>
        <h3 className="text-lg font-bold">{event?.eventName || "__"}</h3>
        <div className="flex flex-wrap items-center gap-2 mt-2">
          {tickets?.map((t) => (
            <div
              key={t.ticketTypeId}
              className="px-3 py-1 bg-white/50 rounded-lg border border-[#89A8B2]/10"
            >
              <p className="text-sm font-medium">
                {t.ticketTypeName} (×{t.quantity})
              </p>
            </div>
          ))}
        </div>
      </div>
      <div className="w-full md:w-48 h-28 rounded-lg overflow-hidden border-2 border-white shadow-sm shrink-0">
        {event?.bannerUrl ? (
          <img
            src={event.bannerUrl}
            alt={event.eventName}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-slate-100" />
        )}
      </div>
    </div>
  </section>
);

export default TicketReview;
