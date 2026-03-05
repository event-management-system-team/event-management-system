import React from "react";
import { FaUser } from "react-icons/fa";
import { InputField } from "../../common/InputField";

const CustomerInfo = () => {
  return (
    <section className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
        <FaUser className="text-[#89A8B2] size-5" /> Customer Info
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <InputField
          label="Full Name"
          id="full-name"
          placeholder="Enter your full name"
          defaultValue="Alex Johnson"
          // Nếu bạn dùng react-hook-form, bạn sẽ truyền {...register("fullName")} ở đây
        />

        <InputField
          label="Email Address"
          id="email"
          type="email"
          placeholder="Enter your email"
          defaultValue="alex.j@example.com"
        />
      </div>
    </section>
  );
};

export default CustomerInfo;
