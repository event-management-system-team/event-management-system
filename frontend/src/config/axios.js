import axios from 'axios';
import { STORAGE_KEYS } from './constants';

// Tạo một instance của axios với cấu hình mặc định
const axiosClient = axios.create({
baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api',
headers: {
    'Content-Type': 'application/json',
},
timeout: 10000, // 10 giây
});

// Thêm interceptor để tự động thêm token vào header của mỗi request
axiosClient.interceptors.request.use(
    (config) => {
        // Tự động lấy token từ Local Storage gắn vào Header
        const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Thêm interceptor để xử lý response và lỗi
axiosClient.interceptors.response.use(
    (response) => {
        // Trả về dữ liệu trực tiếp từ response
        return response.data;
    },
    (error) => {
        // Xử lý lỗi chung ở đây (nếu cần)
        if(error.response?.status === 401) {
            // Nếu lỗi 401 (Unauthorized), xóa token khỏi localStorage
            localStorage.removeItem(STORAGE_KEYS.TOKEN);
            localStorage.removeItem(STORAGE_KEYS.USER_INFO);
            // Có thể thêm logic chuyển hướng người dùng về trang đăng nhập nếu cần
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);
export default axiosClient;