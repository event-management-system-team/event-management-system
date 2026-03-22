import React from "react";
import { FaMapMarkerAlt } from "react-icons/fa";
import { MdArrowForward } from "react-icons/md";
import { Button } from "../../common/Button";

const OrderSummary = ({ event, tickets, subTotal, loading, onConfirm }) => {
  const formatCurrency = (amount) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount || 0);

  return (
    <aside className="sticky top-32 space-y-6">
      <div className="bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden">
        <div
          className="h-32 bg-cover bg-center bg-slate-100"
          style={{
            backgroundImage: event?.bannerUrl
              ? `url("${event.bannerUrl}")`
              : undefined,
          }}
        />

        <div className="p-6">
          <h3 className="font-bold text-lg leading-tight">
            {event?.eventName || "—"}
          </h3>

          {event?.location && (
            <div className="flex items-center gap-2 mt-2 text-gray-500 text-sm">
              <FaMapMarkerAlt className="size-4 shrink-0" />
              <span>{event.location}</span>
            </div>
          )}

          <div className="mt-8 space-y-3 pt-6 border-t border-gray-100">
            {tickets?.map((t) => (
              <div
                key={t.ticketTypeId}
                className="flex justify-between text-sm text-gray-500"
              >
                <span>
                  {t.ticketTypeName} (×{t.quantity})
                </span>
                <span className="font-medium text-black">
                  {formatCurrency(t.price * t.quantity)}
                </span>
              </div>
            ))}

            <div className="flex justify-between text-sm text-gray-500">
              <span>Service Fee</span>
              <span className="font-medium text-black">Free</span>
            </div>

            <div className="flex justify-between items-center pt-4 mt-2">
              <span className="font-bold text-lg">Total Payment</span>
              <span className="text-2xl font-black text-[#FF6B35]">
                {formatCurrency(subTotal)}
              </span>
            </div>
          </div>

          <div className="mt-8">
            <Button onClick={onConfirm} disabled={loading}>
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg
                    className="animate-spin h-4 w-4"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v8z"
                    />
                  </svg>
                  Process...
                </span>
              ) : (
                <>
                  CONFIRM & PAY
                  <MdArrowForward className="size-5 transition-transform group-hover:translate-x-1" />
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default OrderSummary;
