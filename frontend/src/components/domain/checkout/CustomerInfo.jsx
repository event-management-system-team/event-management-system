// components/domain/checkout/CustomerInfo.jsx
// THAY THẾ hoàn toàn file cũ — bỏ defaultValue hardcode, nhận props từ CheckoutPage
import React from "react";
import { FaUser } from "react-icons/fa";
import { InputField } from "../../common/InputField";

const CustomerInfo = ({ form, setForm, formErrors, setFormErrors }) => {
  const handleChange = (field) => (e) => {
    setForm({ ...form, [field]: e.target.value });
    if (formErrors[field]) {
      setFormErrors({ ...formErrors, [field]: "" });
    }
  };

  return (
    <section className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
        <FaUser className="text-[#89A8B2] size-4" /> Customer Info
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <InputField
            label="Full Name"
            id="full-name"
            value={form.fullName}
            onChange={handleChange("fullName")}
            placeholder="Nguyen Van A"
          />
          {formErrors?.fullName && (
            <p className="text-red-500 text-xs mt-1">{formErrors.fullName}</p>
          )}
        </div>

        <div>
          <InputField
            label="Email Address"
            id="email"
            type="email"
            value={form.email}
            onChange={handleChange("email")}
            placeholder="example@email.com"
          />
          {formErrors?.email && (
            <p className="text-red-500 text-xs mt-1">{formErrors.email}</p>
          )}
        </div>
      </div>
    </section>
  );
};

export default CustomerInfo;
