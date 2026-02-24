import { useDispatch } from "react-redux";
import { logoutUser } from "../../../store/slices/auth.slice";
import { Dropdown, Avatar } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { User, LogOut, Ticket, FileText, ChevronDown } from "lucide-react";

const UserDropdown = ({ user }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logoutUser());

    navigate("/login");
  };

  const items = [
    {
      key: "profile",
      label: <Link to="/me">My Profile</Link>,
      icon: <User size={16} />,
    },
    {
      key: "tickets",
      label: <Link to="/my-tickets">My Tickets</Link>,
      icon: <Ticket size={16} />,
    },
    {
      key: "applications",
      label: <Link to="/my-applications">My Applications</Link>,
      icon: <FileText size={16} />,
    },
    {
      type: "divider",
    },
    {
      key: "logout",
      label: "Logout",
      icon: <LogOut size={16} />,
      danger: true,
      onClick: () => {
        handleLogout();
      },
    },
  ];

  return (
    <Dropdown menu={{ items }} trigger={["click"]} placement="bottomRight">
      <div className="cursor-pointer flex items-center gap-2 hover:bg-gray-100 py-1 px-2 rounded-full transition-all">
        <Avatar
          size="large"
          src={user?.avatar_url || user?.avatar}
          className="border border-primary/20 bg-white"
          icon={<User size={20} className="text-gray-600" />}
        />

        <div className="hidden lg:flex flex-col items-start leading-none">
          <span className="text-sm font-bold">{user?.fullName || user?.full_name}</span>
          <span className="text-[10px] text-gray-500">{user?.role}</span>
        </div>

        <ChevronDown size={14} className="text-gray-400" />
      </div>
    </Dropdown>
  );
};

export default UserDropdown;
