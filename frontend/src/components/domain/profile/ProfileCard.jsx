import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { ProfileView } from "./ProfileView";
import { ProfileEdit } from "./ProfileEdit";
import { ProfileAvatar } from "./ProfileAvatar";
import { Alert } from "../../common/Alert";
import profileService from "../../../services/profile.service";
import {
  updateProfileSchema,
  changePasswordSchema,
} from "../../../schemas/profile.schema";
import { logoutUser, setUser } from "../../../store/slices/auth.slice";

export const ProfileCard = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [isEditMode, setIsEditMode] = useState(false);
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);

  // Profile form
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(updateProfileSchema),
  });

  // Password form
  const {
    register: passwordRegister,
    handleSubmit: handlePasswordSubmit,
    formState: { errors: passwordErrors },
    reset: resetPassword,
  } = useForm({
    resolver: zodResolver(changePasswordSchema),
  });

  // Load profile on mount
  useEffect(() => {
    const loadProfile = async () => {
      try {
        const data = await profileService.getMyProfile();
        setProfileData(data);
        reset({
          fullName: data.fullName || "",
          phoneNumber: data.phone || "",
        });
      } catch (err) {
        console.error("Failed to load profile:", err);
        setError("Failed to load profile");
      }
    };
    loadProfile();
  }, [reset]);

  // Auto clear messages
  useEffect(() => {
    if (success || error) {
      const timer = setTimeout(() => {
        setSuccess(null);
        setError(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [success, error]);

  // Save profile
  const handleSave = async (data) => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      // Update profile
      const updatedProfile = await profileService.updateProfile({
        fullName: data.fullName,
        phone: data.phoneNumber,
      });

      setProfileData(updatedProfile);
      dispatch(
        setUser({
          ...user,
          fullName: data.fullName,
          full_name: data.fullName,
        })
      );

      setSuccess("Profile updated successfully!");

      // Check if password fields are filled
      const passwordData = {
        currentPassword: document.getElementById("currentPassword")?.value,
        newPassword: document.getElementById("newPassword")?.value,
        confirmPassword: document.getElementById("confirmPassword")?.value,
      };

      if (
        passwordData.currentPassword &&
        passwordData.newPassword &&
        passwordData.confirmPassword
      ) {
        await handlePasswordSubmit(async (pwdData) => {
          await profileService.changePassword(pwdData);
          setSuccess("Profile and password updated successfully!");
          resetPassword();
        })();
      }

      setIsEditMode(false);
    } catch (err) {
      setError(err.response?.data?.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  // Cancel edit
  const handleCancel = () => {
    reset({
      fullName: profileData?.fullName || "",
      phoneNumber: profileData?.phone || "",
    });
    resetPassword();
    setIsEditMode(false);
  };

  // Upload avatar
  const handleAvatarUpload = async (file) => {
    setUploadingAvatar(true);
    setError(null);
    setSuccess(null);

    try {
      const result = await profileService.uploadAvatar(file);

      setProfileData({
        ...profileData,
        avatarUrl: result.avatarUrl,
      });

      dispatch(
        setUser({
          ...user,
          avatarUrl: result.avatarUrl,
        }),
      );

      setSuccess("Avatar updated successfully!");
    } catch (err) {
      setError(err.response?.data?.error || "Avatar upload failed");
    } finally {
      setUploadingAvatar(false);
    }
  };

  // Logout
  const handleLogout = async () => {
    await dispatch(logoutUser());
    navigate("/");
  };

  if (!profileData) {
    return (
      <main className="flex-grow py-12 px-6">
        <div className="max-w-2xl mx-auto flex justify-center items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent" />
        </div>
      </main>
    );
  }

  return (
    <main className="flex-grow py-12 px-6">
      <div className="max-w-2xl mx-auto">
        {/* Alerts */}
        {success && (
          <Alert
            type="success"
            message={success}
            onClose={() => setSuccess(null)}
          />
        )}
        {error && (
          <Alert type="error" message={error} onClose={() => setError(null)} />
        )}

        <div className="bg-white rounded-[28px] shadow-xl overflow-hidden p-10 md:p-14">
          <ProfileAvatar
            avatarUrl={profileData.avatarUrl}
            isEditMode={isEditMode}
            onImageUpload={handleAvatarUpload}
            uploading={uploadingAvatar}
          />

          {isEditMode ? (
            <ProfileEdit
              register={register}
              errors={errors}
              onSave={handleSubmit(handleSave)}
              onCancel={handleCancel}
              onLogout={handleLogout}
              loading={loading}
              passwordRegister={passwordRegister}
              passwordErrors={passwordErrors}
            />
          ) : (
            <ProfileView
              data={{
                fullName: profileData.fullName,
                phoneNumber: profileData.phone,
              }}
              onEdit={() => setIsEditMode(true)}
            />
          )}
        </div>

        <div className="mt-8 text-center">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">
            Member since{" "}
            {profileData.createdAt
              ? new Date(profileData.createdAt).toLocaleDateString("en-US", {
                  month: "long",
                  year: "numeric",
                })
              : "N/A"}
          </p>
        </div>
      </div>
    </main>
  );
};
