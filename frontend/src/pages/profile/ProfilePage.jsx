import React, { useState } from "react";
import { ProfileView } from "../../components/domain/profile/ProfileView";
import { ProfileEdit } from "../../components/domain/profile/ProfileEdit";
import { ProfileAvatar } from "../../components/domain/profile/ProfileAvatar"; // Import component mới

const initialData = {
  fullName: "Alex Johnson",
  phoneNumber: "+1 (555) 123-4567",
  avatar:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuCNGoZ3bqF8Vjb_pUoczRjhrug-gcnb44o_A-uTtz1TPdHX-CdJ6lfR-ygPfPjltWXem116-Kd16QJNP9hecruIDupHfUYsw_h4nxBeQcdjsdutEIZbLHokp18qjxUdmD2SZVN_abKOVwks374_FZSphrxrbYbX7G32q65fChXm2WTOxA4lOUoAinBolktfXyG98qY6EUXkRo6RfxG4K1ZPMCYz6Vj5_FHzjwlWiBig-76c2-1lFCVgS8AaCN2dJf4mkGGfafo6kMc",
};

const ProfilePage = () => {
  const [isEditMode, setIsEditMode] = useState(false);
  const [formData, setFormData] = useState(initialData);

  const handleSave = () => {
    console.log("Saving data...", formData);
    setIsEditMode(false);
  };

  const handleCancel = () => {
    setFormData(initialData);
    setIsEditMode(false);
  };

  // Hàm xử lý tạm thời khi user chọn ảnh mới
  const handleAvatarUpload = (file) => {
    // Trong thực tế, bạn sẽ gọi API upload ảnh (ví dụ lên S3, Cloudinary)
    // Ở đây mình dùng URL.createObjectURL để preview ảnh tạm thời
    const tempImageUrl = URL.createObjectURL(file);
    setFormData((prev) => ({ ...prev, avatar: tempImageUrl }));
  };

  return (
    <div className="min-h-screen flex flex-col bg-beige font-display text-[#2C3E50]">
      <main className="flex-grow py-12 px-6">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-[28px] shadow-xl overflow-hidden p-10 md:p-14">
            <ProfileAvatar
              avatarUrl={formData.avatar}
              isEditMode={isEditMode}
              onImageUpload={handleAvatarUpload}
            />

            {isEditMode ? (
              <ProfileEdit
                data={formData}
                onChange={setFormData}
                onSave={handleSave}
                onCancel={handleCancel}
              />
            ) : (
              <ProfileView data={formData} onEdit={() => setIsEditMode(true)} />
            )}
          </div>
          <div className="mt-8 text-center">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">
              Member since February 2021
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProfilePage;
