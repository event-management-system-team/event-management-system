import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { message } from 'antd';
import {
  Mail,
  Phone,
  Pencil,
  Eye,
  EyeOff,
  LogOut,
  Save,
  CalendarDays,
  Users,
  Star,
  ShieldCheck,
  User,
  Building2,
  Camera,
  Check,
  X,
  Loader2,
} from 'lucide-react';
import profileService from '../../services/profile.service';
import organizerService from '../../services/organizer.service';
import { logoutUser, setUser } from '../../store/slices/auth.slice';

const OrganizerProfilePage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const avatarInputRef = useRef(null);

  // Profile state
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ totalEvents: 0, staffManaged: 0 });

  // Editable fields
  const [editingField, setEditingField] = useState(null); // 'fullName' | 'phone' | 'bio'
  const [editValue, setEditValue] = useState('');
  const [saving, setSaving] = useState(false);

  // Password state
  const [passwords, setPasswords] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [changingPassword, setChangingPassword] = useState(false);

  // Avatar uploading
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [profileData, statsData] = await Promise.all([
        profileService.getMyProfile(),
        organizerService.getMyEventStats(),
      ]);
      setProfile(profileData);
      setStats(statsData);
    } catch (err) {
      console.error('Failed to load profile:', err);
      message.error('Failed to load profile data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // ── Inline editing ────────────────────────────────────────────────────
  const startEdit = (field, currentValue) => {
    setEditingField(field);
    setEditValue(currentValue || '');
  };

  const cancelEdit = () => {
    setEditingField(null);
    setEditValue('');
  };

  const saveEdit = async () => {
    if (!editValue.trim()) return;
    setSaving(true);
    try {
      const updateData = {};
      if (editingField === 'fullName') updateData.fullName = editValue.trim();
      if (editingField === 'phone') updateData.phone = editValue.trim();

      const updated = await profileService.updateProfile(updateData);
      setProfile(updated);

      // Also update the Redux user state
      dispatch(setUser({ ...user, ...updateData }));

      message.success('Profile updated!');
      cancelEdit();
    } catch (err) {
      message.error(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  // ── Avatar upload ─────────────────────────────────────────────────────
  const handleAvatarUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file
    if (!file.type.startsWith('image/')) {
      message.error('Please select an image file');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      message.error('Image must be less than 5MB');
      return;
    }

    setUploadingAvatar(true);
    try {
      const result = await profileService.uploadAvatar(file);
      const newAvatarUrl = result.avatarUrl;

      setProfile((prev) => ({ ...prev, avatarUrl: newAvatarUrl }));
      dispatch(setUser({ ...user, avatarUrl: newAvatarUrl }));
      message.success('Avatar updated!');
    } catch (err) {
      message.error('Failed to upload avatar');
    } finally {
      setUploadingAvatar(false);
    }
  };

  // ── Password change ───────────────────────────────────────────────────
  const handleChangePassword = async () => {
    const { currentPassword, newPassword, confirmPassword } = passwords;

    if (!currentPassword || !newPassword || !confirmPassword) {
      message.warning('Please fill in all password fields');
      return;
    }
    if (newPassword !== confirmPassword) {
      message.error('New passwords do not match');
      return;
    }
    if (newPassword.length < 8) {
      message.error('Password must be at least 8 characters');
      return;
    }

    setChangingPassword(true);
    try {
      await profileService.changePassword(passwords);
      message.success('Password changed successfully!');
      setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      message.error(err.response?.data?.message || 'Failed to change password');
    } finally {
      setChangingPassword(false);
    }
  };

  // ── Logout ────────────────────────────────────────────────────────────
  const handleLogout = () => {
    dispatch(logoutUser());
    navigate('/login');
  };

  // ── Loading state ─────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="w-10 h-10 text-[#89A8B2] animate-spin mx-auto mb-4" />
          <p className="text-gray-400 font-medium">Loading profile...</p>
        </div>
      </div>
    );
  }

  const avatarUrl = profile?.avatarUrl || user?.avatarUrl || user?.avatar_url;

  return (
    <div className="p-8 lg:p-12 flex flex-col items-center pb-12">
      {/* Header */}
      <div className="w-full max-w-6xl mb-8">
        <h1 className="text-2xl md:text-3xl font-black text-[#1e2d3d] tracking-tight">
          Organizer Profile
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          Manage your profile, organization details, and account security.
        </p>
      </div>

      {/* Profile Card */}
      <div className="bg-white w-full max-w-6xl rounded-[28px] shadow-xl shadow-black/5 overflow-hidden flex flex-col md:flex-row">
        {/* ── Left Panel ─────────────────────────────────────────── */}
        <div className="w-full md:w-[30%] bg-slate-50 border-r border-slate-100 p-10 flex flex-col items-center text-center">
          {/* Avatar */}
          <div className="relative mb-6 group">
            <div
              className="w-[140px] h-[140px] rounded-full bg-cover bg-center border-4 border-[#89A8B2] shadow-lg overflow-hidden flex items-center justify-center bg-gray-200"
              style={avatarUrl ? { backgroundImage: `url('${avatarUrl}')` } : {}}
            >
              {!avatarUrl && (
                <User size={48} className="text-gray-400" />
              )}
            </div>
            {/* Online indicator */}
            <div className="absolute bottom-1 right-1 bg-green-500 border-4 border-white w-6 h-6 rounded-full" />
            {/* Upload overlay */}
            <button
              onClick={() => avatarInputRef.current?.click()}
              disabled={uploadingAvatar}
              className="absolute inset-0 rounded-full bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100 cursor-pointer"
            >
              {uploadingAvatar ? (
                <Loader2 size={24} className="text-white animate-spin" />
              ) : (
                <Camera size={24} className="text-white" />
              )}
            </button>
            <input
              ref={avatarInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleAvatarUpload}
            />
          </div>

          {/* Name */}
          {editingField === 'fullName' ? (
            <div className="flex items-center gap-2 mb-1">
              <input
                type="text"
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                className="text-xl font-extrabold text-slate-900 text-center border-b-2 border-[#89A8B2] bg-transparent outline-none w-40"
                autoFocus
              />
              <button onClick={saveEdit} disabled={saving} className="text-green-600 hover:text-green-700">
                <Check size={18} />
              </button>
              <button onClick={cancelEdit} className="text-red-500 hover:text-red-600">
                <X size={18} />
              </button>
            </div>
          ) : (
            <h2
              className="text-2xl font-extrabold text-slate-900 mb-1 cursor-pointer group flex items-center gap-2"
              onClick={() => startEdit('fullName', profile?.fullName)}
            >
              {profile?.fullName || 'No Name'}
              <Pencil size={14} className="text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity" />
            </h2>
          )}

          <p className="text-slate-500 font-medium mb-4 capitalize">{profile?.role?.toLowerCase() || 'Organizer'}</p>

          {/* Verified badge */}
          {profile?.emailVerified && (
            <div className="bg-[#89A8B2]/10 text-[#89A8B2] text-[10px] font-bold tracking-widest uppercase px-3 py-1 rounded-full mb-8 border border-[#89A8B2]/20">
              Verified Organizer
            </div>
          )}

          {/* Contact info */}
          <div className="w-full space-y-3 mb-10">
            {/* Email */}
            <div className="flex items-center gap-3 p-3 bg-white rounded-xl border border-slate-100 shadow-sm">
              <Mail size={18} className="text-[#89A8B2] shrink-0" />
              <span className="text-xs font-semibold text-slate-600 truncate">{profile?.email || '—'}</span>
            </div>

            {/* Phone */}
            {editingField === 'phone' ? (
              <div className="flex items-center gap-2 p-3 bg-white rounded-xl border border-[#89A8B2] shadow-sm">
                <Phone size={18} className="text-[#89A8B2] shrink-0" />
                <input
                  type="tel"
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  className="text-xs font-semibold text-slate-600 flex-1 outline-none bg-transparent"
                  placeholder="Enter phone number"
                  autoFocus
                />
                <button onClick={saveEdit} disabled={saving} className="text-green-600 hover:text-green-700">
                  <Check size={16} />
                </button>
                <button onClick={cancelEdit} className="text-red-500 hover:text-red-600">
                  <X size={16} />
                </button>
              </div>
            ) : (
              <div
                className="flex items-center gap-3 p-3 bg-white rounded-xl border border-slate-100 shadow-sm group cursor-pointer hover:border-[#89A8B2]/50 transition-colors"
                onClick={() => startEdit('phone', profile?.phone)}
              >
                <Phone size={18} className="text-[#89A8B2] shrink-0" />
                <span className="text-xs font-semibold text-slate-600">
                  {profile?.phone || 'Add phone number'}
                </span>
                <Pencil size={14} className="text-slate-300 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            )}
          </div>

          {/* Account management */}
          <div className="w-full text-left mt-auto">
            <h4 className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-4 ml-1">
              Account Management
            </h4>
            <button
              onClick={handleLogout}
              className="w-full border border-red-200 text-red-500 font-bold py-3 px-4 rounded-xl hover:bg-red-50 transition-all flex items-center justify-center gap-2 text-sm cursor-pointer"
            >
              <LogOut size={18} />
              Logout
            </button>
          </div>
        </div>

        {/* ── Right Panel ────────────────────────────────────────── */}
        <div className="w-full md:w-[70%] p-10 lg:p-14">
          {/* Stats */}
          <div className="grid grid-cols-3 gap-6 mb-12">
            <div className="bg-[#F1F0E8] p-6 rounded-2xl text-center border border-slate-100 shadow-sm">
              <div className="flex items-center justify-center gap-2 mb-1">
                <CalendarDays size={20} className="text-[#89A8B2]" />
              </div>
              <p className="text-3xl font-extrabold text-slate-900 mb-1">{stats.totalEvents ?? 0}</p>
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Total Events</p>
            </div>
            <div className="bg-[#F1F0E8] p-6 rounded-2xl text-center border border-slate-100 shadow-sm">
              <div className="flex items-center justify-center gap-2 mb-1">
                <Users size={20} className="text-[#89A8B2]" />
              </div>
              <p className="text-3xl font-extrabold text-slate-900 mb-1">{stats.activeCount ?? 0}</p>
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Active Events</p>
            </div>
            <div className="bg-[#F1F0E8] p-6 rounded-2xl text-center border border-slate-100 shadow-sm">
              <div className="flex items-center justify-center gap-2 mb-1">
                <Star size={20} className="text-yellow-500" />
              </div>
              <p className="text-3xl font-extrabold text-slate-900 mb-1">{stats.completedCount ?? 0}</p>
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Completed</p>
            </div>
          </div>

          {/* Account Info */}
          <div className="mb-12">
            <h3 className="text-lg font-extrabold text-slate-900 flex items-center gap-2 mb-4">
              <Building2 size={20} className="text-[#89A8B2]" />
              Account Info
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-slate-50 p-6 rounded-2xl border border-slate-100">
              <div className="flex flex-col gap-1">
                <span className="text-xs font-bold text-slate-400 uppercase">Email</span>
                <span className="text-sm font-bold text-slate-800 truncate">{profile?.email}</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-xs font-bold text-slate-400 uppercase">Role</span>
                <span className="text-sm font-bold text-slate-800 capitalize">{profile?.role?.toLowerCase()}</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-xs font-bold text-slate-400 uppercase">Joined</span>
                <span className="text-sm font-bold text-slate-800">
                  {profile?.createdAt
                    ? new Date(profile.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
                    : '—'}
                </span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-xs font-bold text-slate-400 uppercase">Status</span>
                <span className="text-sm font-bold text-green-600 flex items-center gap-1.5">
                  <span className="w-2 h-2 bg-green-500 rounded-full" />
                  {profile?.emailVerified ? 'Verified' : 'Unverified'}
                </span>
              </div>
            </div>
          </div>

          {/* ── Security & Password ──────────────────────────────── */}
          <div className="pt-8 border-t border-slate-100">
            <h3 className="text-lg font-extrabold text-slate-900 flex items-center gap-2 mb-6">
              <ShieldCheck size={20} className="text-[#89A8B2]" />
              Security & Password
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {/* Current Password */}
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 ml-1">
                  Current Password
                </label>
                <div className="relative">
                  <input
                    type={showPasswords.current ? 'text' : 'password'}
                    value={passwords.currentPassword}
                    onChange={(e) => setPasswords((p) => ({ ...p, currentPassword: e.target.value }))}
                    className="w-full bg-[#F1F0E8] border-none rounded-xl py-3 px-4 text-sm font-medium focus:ring-2 focus:ring-[#89A8B2]/30 transition-shadow outline-none"
                    placeholder="Enter current password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPasswords((s) => ({ ...s, current: !s.current }))}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#89A8B2] transition-colors"
                  >
                    {showPasswords.current ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* New Password */}
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 ml-1">
                  New Password
                </label>
                <div className="relative">
                  <input
                    type={showPasswords.new ? 'text' : 'password'}
                    value={passwords.newPassword}
                    onChange={(e) => setPasswords((p) => ({ ...p, newPassword: e.target.value }))}
                    className="w-full bg-[#F1F0E8] border-none rounded-xl py-3 px-4 text-sm font-medium focus:ring-2 focus:ring-[#89A8B2]/30 transition-shadow outline-none"
                    placeholder="Enter new password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPasswords((s) => ({ ...s, new: !s.new }))}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#89A8B2] transition-colors"
                  >
                    {showPasswords.new ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 ml-1">
                  Confirm New Password
                </label>
                <div className="relative">
                  <input
                    type={showPasswords.confirm ? 'text' : 'password'}
                    value={passwords.confirmPassword}
                    onChange={(e) => setPasswords((p) => ({ ...p, confirmPassword: e.target.value }))}
                    className="w-full bg-[#F1F0E8] border-none rounded-xl py-3 px-4 text-sm font-medium focus:ring-2 focus:ring-[#89A8B2]/30 transition-shadow outline-none"
                    placeholder="Repeat new password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPasswords((s) => ({ ...s, confirm: !s.confirm }))}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#89A8B2] transition-colors"
                  >
                    {showPasswords.confirm ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                onClick={handleChangePassword}
                disabled={changingPassword}
                className="bg-[#89A8B2] text-white font-bold py-3 px-8 rounded-xl hover:opacity-90 transition-all shadow-lg shadow-[#89A8B2]/20 flex items-center gap-2 text-sm cursor-pointer disabled:opacity-50"
              >
                {changingPassword ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : (
                  <Save size={18} />
                )}
                Update Password
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrganizerProfilePage;
