import React from "react";
import { useTranslation } from "react-i18next";

const FailedActions = ({ onTryAgain }) => {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
      <button
        onClick={onTryAgain}
        className="flex-1 h-12 flex items-center justify-center rounded-xl bg-[#89A8B2] hover:bg-[#7a97a1] text-white font-bold text-base transition-colors shadow-sm"
      >
        {t("try_again")}
      </button>
    </div>
  );
}

export default FailedActions;