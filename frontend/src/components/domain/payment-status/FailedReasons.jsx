import React from "react";
import { MdHelpOutline } from "react-icons/md";

const REASONS = [
  "Insufficient account balance",
"Incorrect card information",
"Bank timeout or maintenance",
"Transaction cancelled by user",
"Daily transaction limit exceeded",
];

const FailedReasons = () => (
  <div className="w-full bg-[#F5F5F0] rounded-xl p-8 mb-10 border border-slate-200 shadow-sm">
    <div className="flex items-start gap-4">
      <MdHelpOutline className="text-slate-400 text-2xl mt-1 shrink-0" />
      <div>
        <h3 className="text-slate-800 text-lg font-semibold mb-3">
          Possible reasons for failure:
        </h3>
        <ul className="space-y-2 text-slate-600 text-base">
          {REASONS.map((reason, i) => (
            <li key={i} className="flex items-center gap-2">
              <span className="size-1.5 rounded-full bg-primary/60 shrink-0" />
              {reason}
            </li>
          ))}
        </ul>
      </div>
    </div>
  </div>
);

export default FailedReasons;