import { useState, useEffect } from 'react';

const useFilterRecruitment = ({ initialValues = {}, searchParams, setSearchParams }) => {

    const [keyword, setKeyword] = useState(initialValues.keyword || '')
    const [location, setLocation] = useState(initialValues.location || '')
    const [deadline, setDeadline] = useState(initialValues.deadline || '')

    useEffect(() => setKeyword(initialValues.keyword || ''), [initialValues.keyword]);
    useEffect(() => setLocation(initialValues.location || ''), [initialValues.location]);
    useEffect(() => setDeadline(initialValues.deadline || ''), [initialValues.deadline]);

    const handleSearch = () => {
        if (keyword) searchParams.set('keyword', keyword);
        else searchParams.delete('keyword');

        searchParams.set('page', 0);
        setSearchParams(searchParams);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') handleSearch();
    };

    const handleApply = () => {
        if (location) searchParams.set('location', location); else searchParams.delete('location');
        if (deadline) searchParams.set('deadline', deadline); else searchParams.delete('deadline');

        searchParams.set('page', 0);
        setSearchParams(searchParams);
    };

    const handleReset = () => {
        setLocation('')
        setDeadline('');

        searchParams.delete('deadline');
        searchParams.delete('location');
        searchParams.set('page', 0);

        setSearchParams(searchParams);
    };

    return {
        keyword, setKeyword,
        location, setLocation,
        handleSearch, handleKeyDown,
        deadline, setDeadline,
        handleApply, handleReset
    };
};

export default useFilterRecruitment;