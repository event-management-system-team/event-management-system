import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

i18n.use(initReactI18next).init({
    resources: {
        en: {
            translation: {
                greeting: "Hello",
                welcome: "Welcome to my app",
                login: "Login",
                register: "Register",
                logout: "Logout",
                dashboard: "Dashboard",
                accounts: "Accounts",
                events: "Events",
                analytics: "Analytics",
            }
        },
        vi: {
            translation: {
                greeting: "Xin chào",
                welcome: "Chào mừng đến với ứng dụng",
                login: "Đăng nhập",
                register: "Đăng ký",
                logout: "Đăng xuất",
                dashboard: "Bảng điều khiển",
                accounts: "Tài khoản",
                events: "Sự kiện",
                analytics: "Phân tích",
            }
        }
    },
    lng: 'vi',        // ngôn ngữ mặc định
    fallbackLng: 'en', // fallback nếu không tìm thấy key
});

export default i18n;