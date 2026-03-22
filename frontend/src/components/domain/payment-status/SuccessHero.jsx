import React from "react";
import { FaCircleCheck } from "react-icons/fa6";

const SuccessHero = () => (
  <div className="flex flex-col items-center text-center mb-10">
    <div className="w-20 h-20 bg-[#4ECDC4]/20 rounded-full flex items-center justify-center mb-4">
      <FaCircleCheck className="text-[#4ECDC4] text-5xl" />
    </div>
    <h1 className="text-[#131516] tracking-tight text-3xl md:text-4xl font-bold leading-tight pb-2">
      Payment Successful!
    </h1>
    <p className="text-[#6a787c] text-lg max-w-[500px]">
      Your tickets have been sent to your email and are also available below.
    </p>
  </div>
);

export default SuccessHero;