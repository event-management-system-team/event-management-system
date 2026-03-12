import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCategories } from '../store/slices/category.slice';

const useCategories = () => {
    const dispatch = useDispatch();
    const { categories, isLoading, isError } = useSelector((state) => state.category);

    const hasFetched = useRef(false);

    useEffect(() => {
        if (categories.length === 0 && !isLoading && !hasFetched.current) {
            dispatch(fetchCategories());
            hasFetched.current = true;
        }
    }, [dispatch, categories.length, isLoading]);

    const isEmpty = isError || !categories || categories.length === 0;

    return {
        categories,
        isLoading,
        isEmpty,
    };
};

export default useCategories;