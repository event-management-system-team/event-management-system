import { StatCard } from "./StatCard";
import LogoImg from '../../../../assets/logo.png'
import { useTranslation } from "react-i18next";

export const VisualSidebar = () => {
  const { t } = useTranslation();
  return (
    <div className="hidden md:flex md:w-1/2 bg-login-gradient relative overflow-hidden flex-col items-center justify-center p-12 text-white">
      <div
        className="absolute inset-0 opacity-20 bg-cover bg-center mix-blend-overlay"
        style={{
          backgroundImage:
            "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBmQrS1T9oW7WwwJyh2Pe50wnh5gsvCyYl2N5Q3ptbqpEZllY08KyKYiW8BOdDIpJvOfl-PDp68sqMTW0euPX8bIwKmaAbfKO-RuZ1ccu8AK0sRkFqPFesaPw575vOiI5cvgtYAwjVPyd_fTWV7ra2q1NqNZC4advm45X0di-GEYC6PuXug9m4EW75DBirP6NVQK0WuDZgJRMj1fjCq1OUCOX89BJRfKmV-iTWaO6dOe2FEtJxsjRmboVK0GymJAMzCXVNyRx361S4')",
        }}
      ></div>

      <div className="absolute -bottom-20 -left-20 size-64 bg-[#B3C8CF]/10 rounded-full blur-3xl"></div>
      <div className="absolute -top-20 -right-20 size-64 bg-white/10 rounded-full blur-3xl"></div>

      <div className="relative z-10 flex flex-col items-center text-center max-w-lg">
        <div className="mb-12">
          <div className="size-24 bg-white rounded-full flex items-center justify-center glass-effect mb-4 mx-auto">
            <img
              src={LogoImg}
              alt="EventHub Logo"
              className="w-24 h-24 object-contain" />
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight">EventHub</h1>
        </div>

        <h2 className="font-sans text-4xl lg:text-5xl font-black leading-tight mb-6">
          {t("sidebar_connecting")}
        </h2>
        <p className="font-sans text-lg opacity-90 font-medium mb-12">
          {t("sidebar_discover")}
        </p>

        <div className="grid grid-cols-2 gap-6 w-full">
          <StatCard label={t("sidebar_events")} value="15,000+" />
          <StatCard label={t("sidebar_members")} value="500k+" />
        </div>
      </div>
    </div>
  );
};
