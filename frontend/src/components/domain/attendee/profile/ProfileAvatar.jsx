import React, { useRef } from "react";
import { FaCamera } from "react-icons/fa";
import { MdEdit } from "react-icons/md";

export const ProfileAvatar = ({ avatarUrl, isEditMode, onImageUpload }) => {
  const fileInputRef = useRef(null);

  const handleCameraClick = () => {
    if (isEditMode && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && onImageUpload) {
      onImageUpload(file);
    }
  };

  return (
    <div className="flex flex-col items-center mb-12">
      <div className="relative group mb-6">
        <div className="size-[140px] rounded-full border-[6px] border-[#B3C8CF]/20 overflow-hidden shadow-lg relative">
          <img
            alt="Profile"
            className="w-full h-full object-cover bg-beige"
            src={avatarUrl}
          />

          {isEditMode && (
            <div
              onClick={handleCameraClick}
              className="absolute inset-0 bg-black/40 flex items-center justify-center cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <FaCamera className="text-white size-6" />
            </div>
          )}
        </div>

        {!isEditMode && (
          <div className="absolute -bottom-1 -right-1 bg-[#8aa8b2] text-white p-2 rounded-full shadow-lg border-4 border-white">
            <MdEdit className="text-sm block" />
          </div>
        )}
      </div>

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/png, image/jpeg, image/webp"
        className="hidden"
      />

      <div className="text-center">
        <h2 className="text-2xl font-black text-blue-grey">
          {isEditMode ? "Edit Public Profile" : "Public Profile"}
        </h2>
        <p className="text-sm text-gray-500 mt-1 font-medium">
          {isEditMode
            ? "Update your essential information for the community."
            : "Your essential information for the community."}
        </p>
      </div>
    </div>
  );
};
