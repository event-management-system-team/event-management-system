import { Dropdown, Avatar } from "antd";
import { Link, useNavigate } from "react-router-dom";
import {
    User,
    LogOut,
    Ticket,
    FileText,
    ChevronDown
} from "lucide-react";

const UserDropdown = () => {
    const navigate = useNavigate();

    const items = [
        {
            key: 'profile',
            label: <Link to="/profile">My Profile</Link>,
            icon: <User size={16} />,
        },
        {
            key: 'tickets',
            label: <Link to="/my-tickets">My Tickets</Link>,
            icon: <Ticket size={16} />,
        },
        {
            key: 'applications',
            label: <Link to="/my-applications">My Applications</Link>,
            icon: <FileText size={16} />,
        },
        {
            type: 'divider',
        },
        {
            key: 'logout',
            label: 'Logout',
            icon: <LogOut size={16} />,
            danger: true,
            onClick: () => {
                navigate('/login');
            },
        },
    ];

    return (
        <Dropdown
            menu={{ items }}
            trigger={['click']}
            placement="bottomRight"
        >
            <div className="cursor-pointer flex items-center gap-2 hover:bg-gray-100 py-1 px-2 rounded-full transition-all">

                <Avatar
                    size="large"
                    className="border border-primary/20 bg-white"
                    icon={<User size={20} className="text-gray-600" />}
                />

                <div className="hidden lg:flex flex-col items-start leading-none">
                    <span className="text-sm font-bold">Tuan Anh</span>
                    <span className="text-[10px] text-gray-500">Attendee</span>
                </div>

                <ChevronDown size={14} className="text-gray-400" />
            </div>
        </Dropdown>
    );
};

export default UserDropdown;