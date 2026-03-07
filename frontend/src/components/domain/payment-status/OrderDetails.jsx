import React from "react";
import { FaWallet } from "react-icons/fa";

const OrderDetails = ({ tickets, orderCode, paymentMethod }) => {
  const ticketTypeName = tickets?.[0]?.ticketTypeName || "—";

  return (
    <div className="w-full mt-10 p-6 md:p-8 bg-white/50 rounded-xl border border-white">
      <h3 className="text-[#131516] text-lg font-bold mb-4">Order Details</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="flex flex-col">
          <span className="text-xs text-[#6a787c] uppercase font-bold tracking-tight mb-1">
            Items
          </span>
          <p className="font-semibold text-sm">
            {ticketTypeName} × {tickets.length || 0}
          </p>
        </div>
        <div className="flex flex-col">
          <span className="text-xs text-[#6a787c] uppercase font-bold tracking-tight mb-1">
            Order Code
          </span>
          <p className="font-semibold text-sm font-mono">{orderCode || "—"}</p>
        </div>
        <div className="flex flex-col">
          <span className="text-xs text-[#6a787c] uppercase font-bold tracking-tight mb-1">
            Payment Method
          </span>
          <div className="flex items-center gap-2">
            <FaWallet className="text-[#8aa9b2] text-sm" />
            <p className="font-semibold text-sm">{paymentMethod}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;