import React from "react";
import { MdPhotoCamera, MdEdit, MdLogout } from "react-icons/md";
import { InputField } from "./InputField";
import { Button } from "./Button";

const ProfileCard = () => {
  const handleSubmit = (e) => {
    e.preventDefault();
    // Xử lý logic lưu dữ liệu ở đây
  };

  return (
    <div className="bg-white rounded-[28px] shadow-xl overflow-hidden p-10 md:p-14">
      {/* Avatar Section */}
      <div className="flex flex-col items-center mb-12">
        <div className="relative group mb-6">
          <div className="w-[140px] h-[140px] rounded-full border-[6px] border-[#89A8B2]/20 overflow-hidden shadow-lg relative">
            <img
              alt="Alex Johnson"
              className="w-full h-full object-cover"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCNGoZ3bqF8Vjb_pUoczRjhrug-gcnb44o_A-uTtz1TPdHX-CdJ6lfR-ygPfPjltWXem116-Kd16QJNP9hecruIDupHfUYsw_h4nxBeQcdjsdutEIZbLHokp18qjxUdmD2SZVN_abKOVwks374_FZSphrxrbYbX7G32q65fChXm2WTOxA4lOUoAinBolktfXyG98qY6EUXkRo6RfxG4K1ZPMCYz6Vj5_FHzjwlWiBig-76c2-1lFCVgS8AaCN2dJf4mkGGfafo6kMc"
            />
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
              <MdPhotoCamera className="text-white text-3xl" />
            </div>
          </div>
          <div className="absolute -bottom-1 -right-1 bg-[#89A8B2] text-white p-2 rounded-full shadow-lg border-4 border-white cursor-pointer hover:bg-[#7a97a1] transition-colors">
            <MdEdit size={16} />
          </div>
        </div>
        <div className="text-center">
          <h2 className="text-2xl font-black text-[#2C3E50]">
            Edit Public Profile
          </h2>
          <p className="text-sm text-gray-500 mt-1 font-medium">
            Update your essential information for the community.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <InputField label="FULL NAME" defaultValue="Alex Johnson" />

        <InputField
          label="PROFESSIONAL TAGLINE"
          defaultValue="Event Logistics Specialist & Enthusiast"
        />

        <div className="space-y-2">
          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
            Bio
          </label>
          <textarea
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#89A8B2] focus:ring-2 focus:ring-[#89A8B2]/20 transition-all text-sm outline-none bg-[#F1F0E8]"
            rows="5"
            defaultValue="Passionate about creating seamless event experiences..."
          />
          <p className="text-[10px] text-gray-400 text-right font-medium">
            Brief description for your profile. URLs are allowed.
          </p>
        </div>

        <div className="pt-8 mt-4 border-t border-gray-100">
          <h3 className="text-lg font-bold text-[#2C3E50] mb-6">
            Security & Password
          </h3>
          <div className="space-y-6">
            <InputField
              label="CURRENT PASSWORD"
              type="password"
              defaultValue="********"
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <InputField
                label="NEW PASSWORD"
                type="password"
                placeholder="Min. 8 characters"
              />
              <InputField
                label="CONFIRM NEW PASSWORD"
                type="password"
                placeholder="Repeat new password"
              />
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-6">
          <button
            type="button"
            className="w-full sm:w-auto flex items-center justify-center gap-2 text-[#E63946] font-bold text-sm px-6 py-3 rounded-xl border border-[#E63946]/20 hover:bg-[#E63946]/5 transition-all"
          >
            <MdLogout size={18} /> Logout
          </button>

          <div className="flex items-center gap-4 w-full sm:w-auto">
            <button
              type="button"
              className="flex-1 sm:flex-none px-8 py-3.5 border-2 border-gray-200 text-gray-500 font-bold rounded-2xl hover:bg-gray-50 transition-all text-sm"
            >
              Cancel
            </button>
            <Button
              type="submit"
              className="flex-1 sm:w-40 !h-12 !text-sm !bg-none !bg-[#89A8B2]"
            >
              Save Changes
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ProfileCard;
