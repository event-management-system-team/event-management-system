import { useState, useEffect } from 'react';

const useFilterEvents = ({ initialValues = {}, searchParams, setSearchParams }) => {

    const [keyword, setKeyword] = useState(initialValues.keyword || '')
    const [location, setLocation] = useState(initialValues.location || '')
    const [date, setDate] = useState(initialValues.date || '')
    const [categories, setCategories] = useState(initialValues.categories ? initialValues.categories.split(',') : [])
    const [price, setPrice] = useState(initialValues.price || '')
    const [isFree, setIsFree] = useState(initialValues.isFree || false);


    useEffect(() => setKeyword(initialValues.keyword || ''), [initialValues.keyword]);
    useEffect(() => setLocation(initialValues.location || ''), [initialValues.location]);
    useEffect(() => setDate(initialValues.date || ''), [initialValues.date]);
    useEffect(() => setCategories(initialValues.categories ? initialValues.categories.split(',') : []), [initialValues.categories]);
    useEffect(() => setPrice(initialValues.price || ''), [initialValues.price]);
    useEffect(() => setIsFree(initialValues.isFree || false), [initialValues.isFree]);

    const handleSearch = () => {
        if (keyword) searchParams.set('keyword', keyword); else searchParams.delete('keyword');

        if (location)
            searchParams.set('location', location); else searchParams.delete('location');

        searchParams.set('page', 0);
        setSearchParams(searchParams);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') handleSearch();
    };

    const handleApply = () => {
        if (categories && categories.length > 0) {
            searchParams.set('categories', categories.join(','));
        } else searchParams.delete('categories');

        if (date) searchParams.set('date', date); else searchParams.delete('date');
        if (price) searchParams.set('price', price); else searchParams.delete('price');
        if (isFree) searchParams.set('isFree', 'true'); else searchParams.delete('isFree');


        searchParams.set('page', 0);
        setSearchParams(searchParams);
    };

    const handleReset = () => {
        setDate('');
        setCategories('');
        setPrice('');
        setIsFree(false);

        searchParams.delete('date');
        searchParams.delete('categories');
        searchParams.delete('price');
        searchParams.delete('isFree');
        searchParams.set('page', 0);

        setSearchParams(searchParams);
    };

    return {
        keyword, setKeyword,
        location, setLocation,
        handleSearch, handleKeyDown,
        date, setDate,
        categories: categories, setCategories: setCategories,
        price, setPrice,
        isFree, setIsFree,
        handleApply, handleReset
    };
};

export default useFilterEvents;