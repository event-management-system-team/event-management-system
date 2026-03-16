import React from "react";
import { Button } from "../../../common/Button";
import { useTranslation } from "react-i18next";

export const ProfileView = ({ data, onEdit }) => {
  const { t } = useTranslation();
  return (
    <div className="space-y-8 animate-fadeIn">
      <div className="relative">
        <label className="block text-sm font-bold text-gray-700 mb-2">
          {t("full_name")}
        </label>
        <div className="w-full h-12 px-6 flex items-center rounded-full border border-gray-300 text-gray-900 text-sm">
          {data.fullName}
        </div>
      </div>

      <div className="relative">
        <label className="block text-sm font-bold text-gray-700 mb-2">
          {t("phone_number")}
        </label>
        <div className="w-full h-12 px-6 flex items-center rounded-full border border-gray-300 text-gray-900 text-sm">
          {data.phoneNumber}
        </div>
      </div>

      <div className="pt-8 border-t border-gray-100 flex justify-end">
        <Button onClick={onEdit} className="w-full sm:w-auto px-10">
          {t("edit_profile")}
        </Button>
      </div>
    </div>
  );
};
