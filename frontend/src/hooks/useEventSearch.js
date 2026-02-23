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
        keyword, setKeyword,
        location, setLocation,
        handleSearch,
        handleKeyDown
    }
}

export default useEventSearch

