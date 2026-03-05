import React from "react";
import { FaMapMarkerAlt } from "react-icons/fa";
import { MdArrowForward } from "react-icons/md";
import { Button } from "../../common/Button";

const OrderSummary = () => (
  <aside className="sticky top-32 space-y-6">
    <div className="bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden">
      <div
        className="h-32 bg-cover bg-center"
        style={{
          backgroundImage:
            'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBmue5-M1SnXuhCBLJRccHT1HeM6nUO2BMLTs7Z8u8ZCwMfJjP6vy_YocvbG1EVWj_LoERWaLup73fZRRS2-qpBzbeXWp-TPMA74kZ2zWdusw-GOWAgeZrL9_TeYJp_Kx0Iwj6iOT4BQA5Aba5jsPMr2duGj1En3OPmJ9SdYhZQhBwgzhjaBqDY3QsZhmh5N4QjTISogbch9fDmYSrgDA5LIEcg13ufMoDt9Hz7DBg1HFhyE_IV8XIlfzPQN_bFovntEIu9DIhtp9Q")',
        }}
      />
      <div className="p-6">
        <h3 className="font-bold text-lg leading-tight">
          Vietnam International Music Festival 2024
        </h3>
        <div className="flex items-center gap-2 mt-2 text-gray-500 text-sm">
          <FaMapMarkerAlt className="size-4" />
          <span>National Stadium, HCM City</span>
        </div>

        <div className="mt-8 space-y-3 pt-6 border-t border-gray-100">
          <div className="flex justify-between text-sm text-gray-500">
            <span>Subtotal (2 tickets)</span>
            <span className="font-medium text-black">$120.00</span>
          </div>
          <div className="flex justify-between text-sm text-gray-500">
            <span>Service Fee</span>
            <span className="font-medium text-black">$5.50</span>
          </div>
          <div className="flex justify-between items-center pt-4 mt-2">
            <span className="font-bold text-lg">Total Payment</span>
            <span className="text-2xl font-black text-[#FF6B35]">$125.50</span>
          </div>
        </div>

        <div className="mt-8">
          <Button onClick={() => console.log("Processing payment...")}>
            CONFIRM & PAY
            <MdArrowForward className="size-5 transition-transform group-hover:translate-x-1" />
          </Button>
        </div>
      </div>
    </div>
  </aside>
);

export default OrderSummary;
