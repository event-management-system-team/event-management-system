import React from "react";
import { MdError } from "react-icons/md";

const FailedHero = ({ errorMessage }) => (
  <div className="mb-8 flex flex-col items-center text-center">
    <div className="size-20 rounded-full bg-red-50 flex items-center justify-center text-red-500 mb-6">
      <MdError className="text-5xl" />
    </div>
    <h1 className="text-slate-900 text-3xl md:text-4xl font-bold leading-tight text-center mb-4">
      Payment Unsuccessful
    </h1>
    <p className="text-slate-600 text-lg leading-relaxed text-center max-w-md">
      {errorMessage}
    </p>
  </div>
);

export default FailedHero;