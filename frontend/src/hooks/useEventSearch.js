import { useEffect, useState } from 'react';
import { createSearchParams, useNavigate } from 'react-router-dom'

const useEventSearch = (initialValues = {}) => {
    const [keyword, setKeyword] = useState(initialValues.keyword || '')
    const [location, setLocation] = useState(initialValues.location || '')
    const [date, setDate] = useState(initialValues.date || '')
    const [category, setCategory] = useState(initialValues.category || '')
    const [price, setPrice] = useState(initialValues.price || '')

    const navigate = useNavigate();

    const handleSearch = () => {
        const params = new URLSearchParams();

        if (keyword.trim()) params.append('keyword', keyword.trim());
        if (location) params.append('location', location);
        if (date) params.append('date', date);
        if (category) params.append('category', category);
        if (price) params.append('price', price);

        navigate(`/events?${params.toString()}`)
    }

    const handleKeyDown = (e) => {
        if (e.key === "Enter") handleSearch();
    }

    const searchByCategory = (category) => {
        const queryString = createSearchParams({ category: category }).toString()
        navigate(`/events?${queryString}`)
    }

    useEffect(() => {
        setKeyword(initialValues.keyword || '');
        setLocation(initialValues.location || '');
        setDate(initialValues.date || '');
        setCategory(initialValues.category || '');
        setPrice(initialValues.price || '');
    }, [initialValues.keyword, initialValues.location, initialValues.date, initialValues.category, initialValues.price]);

    return {
        keyword, setKeyword,
        location, setLocation,
        date, setDate,
        category, setCategory,
        price, setPrice,
        handleSearch,
        handleKeyDown,
        searchByCategory
    }
}

export default useEventSearch

