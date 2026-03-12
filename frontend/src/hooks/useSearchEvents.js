import { useState } from 'react';
import { useNavigate } from 'react-router-dom'

const useSearchEvents = () => {
    const [keyword, setKeyword] = useState('')
    const [location, setLocation] = useState('')
    const [date, setDate] = useState('')

    const navigate = useNavigate();

    const handleSearch = () => {
        const params = new URLSearchParams();

        if (keyword.trim()) params.append('keyword', keyword.trim());
        if (location) params.append('location', location);
        if (date) params.append('date', date);

        navigate(`/events?${params.toString()}`)
    }

    const handleKeyDown = (e) => {
        if (e.key === "Enter") handleSearch();
    }

    return {
        keyword, setKeyword,
        location, setLocation,
        date, setDate,
        handleSearch,
        handleKeyDown,
    }
}

export default useSearchEvents

