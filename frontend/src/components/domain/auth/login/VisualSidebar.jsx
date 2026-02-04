import { SiEventbrite } from "react-icons/si";
import { StatCard } from "./StatCard";
export const VisualSidebar = () => {
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
          <div className="size-24 bg-white/20 rounded-full flex items-center justify-center glass-effect mb-4 mx-auto">
            <SiEventbrite className="size-12 text-white" />
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight">EventHub</h1>
        </div>

        <h2 className="text-4xl lg:text-5xl font-black leading-tight mb-6">
          Connecting you to thousands of events
        </h2>
        <p className="text-lg opacity-90 font-medium mb-12">
          Discover the best moments happening around you.
        </p>

        <div className="grid grid-cols-2 gap-4 w-full">
          <StatCard label="Events" value="15,000+" />
          <StatCard label="Members" value="500k+" />
        </div>
      </div>
    </div>
  );
};
