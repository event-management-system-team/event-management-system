import React from "react";
import { InputField } from "../../../common/InputField";
import { Button } from "../../../common/Button";
import { IoLogOut } from "react-icons/io5";
import { useTranslation } from "react-i18next";

export const ProfileEdit = ({
  register,
  errors,
  onSave,
  onCancel,
  onLogout,
  loading,
  passwordRegister,
  passwordErrors,
}) => {
  const { t } = useTranslation();
  return (
    <form onSubmit={onSave} className="space-y-8 animate-fadeIn">
      {/* Profile Fields */}
      <div className="space-y-6">
        <div>
          <InputField
            label={t("full_name")}
            id="fullName"
            placeholder={t("enter_full_name")}
            error={errors.fullName}
            {...register("fullName")}
          />
        </div>

        <div>
          <InputField
            label={t("phone_number")}
            id="phoneNumber"
            placeholder={t("enter_phone_placeholder")}
            error={errors.phoneNumber}
            {...register("phoneNumber")}
          />
        </div>
      </div>

      {/* Security Section */}
      <div className="pt-8 mt-4 border-t border-gray-100">
        <h3 className="text-lg font-bold text-blue-grey mb-6">
          {t("security_password")}
        </h3>
        <div className="space-y-6">
          <InputField
            label={t("current_password")}
            id="currentPassword"
            type="password"
            placeholder={t("enter_current_password")}
            error={passwordErrors?.currentPassword}
            {...passwordRegister("currentPassword")}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <InputField
              label={t("new_password")}
              id="newPassword"
              type="password"
              placeholder={t("min_8_characters")}
              error={passwordErrors?.newPassword}
              {...passwordRegister("newPassword")}
            />

            <InputField
              label={t("confirm_new_password")}
              id="confirmPassword"
              type="password"
              placeholder={t("repeat_new_password")}
              error={passwordErrors?.confirmPassword}
              {...passwordRegister("confirmPassword")}
            />
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="pt-8 mt-4 border-t border-gray-100 flex flex-col md:flex-row items-center justify-between gap-6 flex-wrap">
        <button
          type="button"
          onClick={onLogout}
          className="w-full md:w-auto flex items-center justify-center gap-2 text-[#E63946] font-bold text-sm px-6 py-3 rounded-xl border border-[#E63946]/20 hover:bg-[#E63946]/5 transition-all"
        >
          <IoLogOut className="text-lg" />
          {t("logout")}
        </button>

        <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto shrink-0">
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="w-full sm:w-auto px-8 py-3.5 border-2 border-gray-200 text-gray-500 font-bold rounded-2xl hover:bg-gray-50 transition-all text-sm whitespace-nowrap disabled:opacity-50"
          >
            {t("cancel")}
          </button>

          <Button
            type="submit"
            disabled={loading}
            className="w-full sm:w-auto px-8 py-3.5 whitespace-nowrap"
          >
            {loading ? t("saving") : t("save_changes")}
          </Button>
        </div>
      </div>
    </form>
  );
};
