// pages/PaymentSuccessPage.jsx
import React, { useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useQuery } from "@tanstack/react-query";
import { clearBooking } from "../../store/slices/booking.slice";
import bookingService from "../../services/booking.service";
import SuccessHero from "../../components/domain/payment-status/SuccessHero";
import TicketCard from "../../components/domain/payment-status/TicketCard";
import TicketSkeleton from "../../components/domain/payment-status/TicketSkeleton";
import OrderDetails from "../../components/domain/payment-status/OrderDetails";
import SuccessActions from "../../components/domain/payment-status/SuccessActions";

const PaymentSuccessPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const orderCode = searchParams.get("orderCode");

  useEffect(() => {
    dispatch(clearBooking());
  }, []);

  const { data: tickets = [], isLoading } = useQuery({
    queryKey: ["my-tickets", orderCode],
    queryFn: bookingService.getMyTickets,
    retry: 3,
    retryDelay: 2000,
  });

  const orderTickets = tickets.filter((t) => t.orderCode === orderCode);
  const displayTickets = orderTickets.length > 0 ? orderTickets : tickets;

  return (
    <div className="bg-[#E5E1DA] font-sans min-h-screen text-[#131516]">
      <main className="max-w-[1000px] mx-auto px-4 py-12 flex flex-col items-center">
        <SuccessHero />

        {isLoading ? (
          <TicketSkeleton />
        ) : displayTickets.length > 0 ? (
          <div className="w-full space-y-6">
            {displayTickets.map((ticket) => (
              <TicketCard
                key={ticket.ticketId}
                event={{
                  title: ticket.eventName,
                  date: ticket.eventStartDate
                    ? new Date(ticket.eventStartDate).toLocaleString("vi-VN", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    : "—",
                  location: ticket.eventLocation || "—",
                  tickets: `${ticket.ticketTypeName} × 1`,
                  ticketId: ticket.ticketCode,
                  image: ticket.eventBannerUrl || "",
                  qrCode: ticket.qrCodeUrl || "",
                }}
              />
            ))}
          </div>
        ) : (
          <div className="w-full bg-white/50 rounded-xl p-8 text-center text-[#6a787c]">
            Process...
          </div>
        )}

        <OrderDetails
          tickets={displayTickets}
          orderCode={orderCode}
          paymentMethod={displayTickets[0]?.paymentMethod || "VNPay"}
        />

        <SuccessActions onGoMyTickets={() => navigate("/my-tickets")} />
      </main>
    </div>
  );
};

export default PaymentSuccessPage;
