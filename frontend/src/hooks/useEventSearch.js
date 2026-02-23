import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom'

const useEventSearch = () => {
    const [keyword, setKeyword] = useState('')
    const [location, setLocation] = useState('')

    const navigator = useNavigate();

    const handleSearch = () => {
        const params = new URLSearchParams();

        if (keyword.trim()) params.append('keyword', keyword.trim());
        if (location) params.append('location', location);

        navigator(`/events?${params.toString()}`)
    }

    const handleKeyDown = (e) => {
        if (e.key === "Enter") handleSearch();
    }

    return {
        keyword,
        setKeyword,
        location,
        setLocation,
        handleSearch,
        handleKeyDown
    }
}

export default useEventSearch


export const LOCATIONS = [
    { value: '', label: 'Tất cả địa điểm' },
    { value: 'Hà Nội', label: 'TP. Hà Nội' },
    { value: 'Hồ Chí Minh', label: 'TP. Hồ Chí Minh' },
    { value: 'Đà Nẵng', label: 'TP. Đà Nẵng' },
    { value: 'Hải Phòng', label: 'TP. Hải Phòng' },
    { value: 'Cần Thơ', label: 'TP. Cần Thơ' },
    { value: 'Huế', label: 'TP. Huế' },
    { value: 'An Giang', label: 'An Giang' },
    { value: 'Bắc Ninh', label: 'Bắc Ninh' },
    { value: 'Cà Mau', label: 'Cà Mau' },
    { value: 'Cao Bằng', label: 'Cao Bằng' },
    { value: 'Điện Biên', label: 'Điện Biên' },
    { value: 'Đồng Nai', label: 'Đồng Nai' },
    { value: 'Đồng Tháp', label: 'Đồng Tháp' },
    { value: 'Gia Lai', label: 'Gia Lai' },
    { value: 'Hà Tĩnh', label: 'Hà Tĩnh' },
    { value: 'Hưng Yên', label: 'Hưng Yên' },
    { value: 'Khánh Hòa', label: 'Khánh Hòa' },
    { value: 'Lai Châu', label: 'Lai Châu' },
    { value: 'Lâm Đồng', label: 'Lâm Đồng' },
    { value: 'Lạng Sơn', label: 'Lạng Sơn' },
    { value: 'Lào Cai', label: 'Lào Cai' },
    { value: 'Nghệ An', label: 'Nghệ An' },
    { value: 'Ninh Bình', label: 'Ninh Bình' },
    { value: 'Phú Thọ', label: 'Phú Thọ' },
    { value: 'Quảng Ngãi', label: 'Quảng Ngãi' },
    { value: 'Quảng Ninh', label: 'Quảng Ninh' },
    { value: 'Quảng Trị', label: 'Quảng Trị' },
    { value: 'Sơn La', label: 'Sơn La' },
    { value: 'Tây Ninh', label: 'Tây Ninh' },
    { value: 'Thanh Hóa', label: 'Thanh Hóa' },
    { value: 'Thái Nguyên', label: 'Thái Nguyên' },
    { value: 'Tuyên Quang', label: 'Tuyên Quang' },
    { value: 'Vĩnh Long', label: 'Vĩnh Long' },
    { value: 'Đắk Lắk', label: 'Đắk Lắk' }
];