import React from "react";
import { MdHelpOutline } from "react-icons/md";
import { useTranslation } from "react-i18next";

const FailedReasons = () => {
  const { t } = useTranslation();

  const reasons = [
    t("reason_insufficient_balance"),
    t("reason_incorrect_card"),
    t("reason_bank_timeout"),
    t("reason_user_cancelled"),
    t("reason_daily_limit"),
  ];

  return (
    <div className="w-full bg-[#F5F5F0] rounded-xl p-8 mb-10 border border-slate-200 shadow-sm">
      <div className="flex items-start gap-4">
        <MdHelpOutline className="text-slate-400 text-2xl mt-1 shrink-0" />
        <div>
          <h3 className="text-slate-800 text-lg font-semibold mb-3">
            {t("possible_failure_reasons")}
          </h3>
          <ul className="space-y-2 text-slate-600 text-base">
            {reasons.map((reason, i) => (
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
};

export default FailedReasons;