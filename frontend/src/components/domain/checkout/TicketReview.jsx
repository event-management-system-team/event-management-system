import React from "react";
import { HiTicket } from "react-icons/hi2";

const TicketReview = () => (
  <section className="bg-white rounded-xl p-6 border border-[#89A8B2]/20 shadow-sm">
    <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
      <HiTicket className="text-[#89A8B2] size-5" /> Ticket Review
    </h2>
    <div className="flex flex-col md:flex-row gap-6 items-start">
      <div className="flex-1 space-y-2">
        <p className="text-xs font-bold text-[#89A8B2] uppercase tracking-widest">
          Selected Event
        </p>
        <h3 className="text-lg font-bold">
          Vietnam International Music Festival
        </h3>
        <div className="flex items-center gap-4 mt-2">
          <div className="px-3 py-1 bg-white/50 rounded-lg border border-[#89A8B2]/10">
            <p className="text-sm font-medium">Standard Ticket (x2)</p>
          </div>
        </div>
      </div>
      <div className="w-full md:w-48 h-28 rounded-lg overflow-hidden border-2 border-white shadow-sm">
        <div
          className="w-full h-full bg-cover bg-center"
          style={{
            backgroundImage:
              'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDwwLPJ7JKixFVrSHZfZ73wFsaElW4FIYb2BIImxxVNjnMYvwiq-ffyPFWokAVsvcZ4Q7OMgrjvINYfGm9dKhlL1KgEBrdUclb2RohjDpUMoMNmlNYIzOP5J7Dny135RFgTS3UNxqGC5uhNWWsWec7LFzakc48FYnGOBYL6pxmFLX_yqeV59wfGYGJhvXhOodDC1YY0RD9G4X9rE90ukr25JfnnHlAT_ZHk8W3AdyukfestUKrteeJvbikJV5wV_wKfJf_knRMbJmA")',
          }}
        />
      </div>
    </div>
  </section>
);

export default TicketReview;
