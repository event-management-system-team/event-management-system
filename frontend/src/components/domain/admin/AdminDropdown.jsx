import { Avatar, Dropdown } from 'antd'
import { LogOut, User } from 'lucide-react'
import { useNavigate } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { logoutUser } from '../../../store/slices/auth.slice';

const AdminDropdown = ({ setIsOpen }) => {
    const { user } = useSelector((state) => state.auth);

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleLogout = () => {
        dispatch(logoutUser());
        navigate("/login");
    };

    const menuItems = [
        { key: '2', label: 'Logout', icon: <LogOut size={16} />, danger: true, onClick: handleLogout },
    ];

    return (
        <div className="p-5 mt-auto">
            <hr className="border-white/10 mb-6" />
            <Dropdown menu={{ items: menuItems }} trigger={['click']} placement="top">
                <div className="rounded-2xl p-2 flex items-center gap-3 cursor-pointer hover:bg-white/10 transition-colors whitespace-nowrap">
                    <Avatar
                        size="large"
                        src={user?.avatarUrl || user?.avatar_url || user?.avatar}
                        className="border border-primary/20 bg-white"
                        icon={<User size={20} className="text-gray-600" />}
                    />
                    <div className="overflow-hidden">
                        <p className="text-sm font-bold text-white truncate">{user?.fullName || user?.full_name}</p>
                        <div className="flex items-center gap-1.5">
                            <div className="size-1.5 bg-[#4ECDC4] rounded-full animate-pulse"></div>
                            <p className="text-[10px] text-white/60 uppercase tracking-wider font-bold">Online</p>
                        </div>
                    </div>
                </div>
            </Dropdown>
        </div>

    )
}

export default AdminDropdown
