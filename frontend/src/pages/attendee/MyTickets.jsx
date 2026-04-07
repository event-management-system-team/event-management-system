import { useState, useEffect, useRef } from "react";
import { ArrowRight, Loader } from "lucide-react";
import { Pagination } from "antd";
import EmptyState from "../../components/common/EmptyState";
import { Link } from "react-router-dom";
import bookingService from "../../services/booking.service";
import { useTranslation } from "react-i18next";

import TicketCard from "../../components/domain/my-events/TicketCard";

const MyTicketsPage = () => {
  const { t } = useTranslation();
  const [filter, setFilter] = useState("All");
  const [ticketGroups, setTicketGroups] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const listTopRef = useRef(null);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const tabs = [
    { key: "All", label: t("tab_all") },
    { key: "Confirmed", label: t("tab_confirmed") },
    { key: "Pending", label: t("tab_pending") },
    { key: "Cancelled", label: t("tab_cancelled") },
  ];

  useEffect(() => {
    const fetchMyTickets = async () => {
      try {
        const response = await bookingService.getMyTickets();

        const groups = {};
        response.forEach((ticket) => {
          if (!groups[ticket.orderCode]) {
            groups[ticket.orderCode] = {
              eventId: ticket.eventId,
              orderCode: ticket.orderCode,
              startDate: ticket.eventStartDate,
              eventName: ticket.eventName,
              location: ticket.eventLocation,
              ticketCount: 0,
              status: ticket.status,
              hasCheckedIn: false,
              bannerUrl: ticket.eventBannerUrl,
              eventSlug: ticket.orderCode,
            };
          }
          groups[ticket.orderCode].ticketCount += 1;
          if (ticket.status === 'CHECKED_IN') {
            groups[ticket.orderCode].hasCheckedIn = true;
          }
        });

        setTicketGroups(Object.values(groups));
      } catch (error) {
        console.error("Failed to fetch tickets:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMyTickets();
  }, []);

  // Reset page when filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [filter]);

  const filteredGroups = ticketGroups.filter((group) => {
    if (filter === "All") return true;
    if (filter === "Confirmed") return group.status === "CONFIRMED" || group.status === "PAID";
    return group.status === filter.replace("-", "_").toUpperCase();
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredGroups.slice(indexOfFirstItem, indexOfLastItem);

  const onChangePage = (page) => {
    setCurrentPage(page);

    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }

    setTimeout(() => {
      if (listTopRef.current) {
        listTopRef.current.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    }, 100);
  };

  const getEmptyMessage = () => {
    if (filter === "All") return t("no_tickets_message");
    const filterLabel = tabs.find((tab) => tab.key === filter)?.label?.toLowerCase() || "";
    return t("no_tickets_filtered", { filter: filterLabel });
  };

  return (
    <main className="max-w-[1200px] mx-auto px-4 md:px-6 py-8 md:py-12 w-full font-sans min-h-screen">
      <div className="mb-6 md:mb-8" ref={listTopRef}>
        <h1 className="text-3xl md:text-5xl font-black tracking-tight text-gray-900 mb-2 md:mb-3">
          {t("my_tickets_title")}
        </h1>
        <p className="text-gray-500 font-medium text-base md:text-lg">
          {t("my_tickets_subtitle")}
        </p>
      </div>

      <div className="bg-white p-1 rounded-full flex gap-2 mb-10 w-fit border border-gray-200 shadow-sm overflow-x-auto">
        {["All", "Confirmed", "Pending", "Checked-in", "Cancelled"].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setFilter(tab.key)}
            className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${filter === tab.key
                ? "bg-[#8aa8b2] text-white shadow-md shadow-[#8aa8b2]/20"
                : "text-gray-600 hover:bg-gray-100"
              }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-20">
          <Loader className="w-10 h-10 animate-spin text-[#8aa8b2]" />
        </div>
      ) : filteredGroups.length > 0 ? (
        <div className="mb-16 md:mb-24">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mb-10">
            {currentItems.map((group) => (
              <TicketCard key={group.orderCode} {...group} />
            ))}
          </div>

          {filteredGroups.length > itemsPerPage && (
            <div className="mt-16 mb-8 flex justify-center w-full">
              <Pagination
                align="center"
                responsive
                current={currentPage}
                pageSize={itemsPerPage}
                showSizeChanger={false}
                total={filteredGroups.length}
                onChange={onChangePage}
              />
            </div>
          )}
        </div>
      ) : (
        <EmptyState
          className="mb-10"
          message={getEmptyMessage()}
        />
      )}

      <div className="border-2 border-dashed border-gray-200 rounded-[32px] md:rounded-[40px] py-12 md:py-16 px-4 md:px-6 text-center flex flex-col items-center gap-4 md:gap-5 bg-white/40">
        <h2 className="text-2xl md:text-3xl font-black text-gray-900">
          {t("want_more_excitement")}
        </h2>
        <p className="text-gray-500 font-semibold text-lg max-w-lg">
          {t("explore_events_area")}
        </p>
        <Link
          to="/events"
          className="mt-2 bg-[#B3C8CF] hover:bg-[#8aa8b2] text-gray-600 px-10 py-4 rounded-2xl font-black flex items-center gap-2 transition-all group shadow-sm"
        >
          {t("browse_new_events")}
          <ArrowRight
            size={20}
            className="group-hover:translate-x-1 transition-transform"
          />
        </Link>
      </div>
    </main>
  );
};

export default MyTicketsPage;
