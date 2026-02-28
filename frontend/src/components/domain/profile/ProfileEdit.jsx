import React from "react";
import { InputField } from "../../common/InputField";
import { Button } from "../../common/Button";
import { IoLogOut } from "react-icons/io5";

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
  return (
    <form onSubmit={onSave} className="space-y-8 animate-fadeIn">
      {/* Profile Fields */}
      <div className="space-y-6">
        <div>
          <InputField
            label="Full Name"
            id="fullName"
            placeholder="Enter your full name"
            error={errors.fullName}
            {...register("fullName")}
          />
        </div>

        <div>
          <InputField
            label="Phone Number"
            id="phoneNumber"
            placeholder="+1 (555) 123-4567"
            error={errors.phoneNumber}
            {...register("phoneNumber")}
          />
        </div>
      </div>

      {/* Security Section */}
      <div className="pt-8 mt-4 border-t border-gray-100">
        <h3 className="text-lg font-bold text-blue-grey mb-6">
          Security & Password
        </h3>
        <div className="space-y-6">
          <InputField
            label="Current Password"
            id="currentPassword"
            type="password"
            placeholder="Enter current password"
            error={passwordErrors?.currentPassword}
            {...passwordRegister("currentPassword")}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <InputField
              label="New Password"
              id="newPassword"
              type="password"
              placeholder="Min. 8 characters"
              error={passwordErrors?.newPassword}
              {...passwordRegister("newPassword")}
            />

            <InputField
              label="Confirm New Password"
              id="confirmPassword"
              type="password"
              placeholder="Repeat new password"
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
          Logout
        </button>

        <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto shrink-0">
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="w-full sm:w-auto px-8 py-3.5 border-2 border-gray-200 text-gray-500 font-bold rounded-2xl hover:bg-gray-50 transition-all text-sm whitespace-nowrap disabled:opacity-50"
          >
            Cancel
          </button>

          <Button
            type="submit"
            disabled={loading}
            className="w-full sm:w-auto px-8 py-3.5 whitespace-nowrap"
          >
            {loading ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </div>
    </form>
  );
};
