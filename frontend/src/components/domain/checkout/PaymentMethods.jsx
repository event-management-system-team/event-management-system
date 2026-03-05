import React, { useState } from "react";
import { MdPayments } from "react-icons/md";

const PaymentMethods = () => {
  const [selected, setSelected] = useState("vnpay");

  const methods = [
    {
      id: "vnpay",
      name: "VNPay",
      desc: "Scan QR or use Bank App",
      icon: "https://lh3.googleusercontent.com/aida-public/AB6AXuDIACIyhlHji8pAkTc_74g2_LOSX0HP9FkeXEq08NoOKJkmytAjbu4amNeRPV8iznClmoYoOM_Yh5cUC5TOfmmolzngvKK7Z7nJz30G-dptJSeZAx4qu8x3jXUjMgYQXUxmiLQwCIirkGZNplrkYegG7Q0Oj1ZhU_B5irM8sqK5_kvCnU-3t2WYzxkAhCKYyMNA89yZJ_Y3TmMjfVZrcbWsRRdouV7r-m7HUiGZ1-IZPfJd_d_gvPkp-sMsrXgcq6G6JOUwx4n0HsE",
    },
  ];

  return (
    <section className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
        <MdPayments className="text-[#89A8B2] size-5" /> Payment Method
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {methods.map((method) => (
          <label
            key={method.id}
            onClick={() => setSelected(method.id)}
            className={`relative flex items-center p-4 rounded-xl border-2 cursor-pointer transition-all ${selected === method.id ? "border-[#89A8B2] bg-[#89A8B2]/5" : "border-gray-100"}`}
          >
            <div className="flex items-center gap-4 w-full">
              <div className="size-12 rounded bg-white flex items-center justify-center p-2 border border-gray-100">
                <img
                  src={method.icon}
                  alt={method.name}
                  className="max-h-full"
                />
              </div>
              <div className="flex-1">
                <p className="font-bold">{method.name}</p>
                <p className="text-xs text-gray-500">{method.desc}</p>
              </div>
              <div
                className={`size-5 rounded-full border-2 flex items-center justify-center ${selected === method.id ? "border-[#89A8B2]" : "border-gray-300"}`}
              >
                {selected === method.id && (
                  <div className="size-2.5 rounded-full bg-[#89A8B2]" />
                )}
              </div>
            </div>
          </label>
        ))}
      </div>
    </section>
  );
};

export default PaymentMethods;
