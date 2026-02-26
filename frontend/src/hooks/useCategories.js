import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCategories } from '../store/slices/category.slice';

const useCategories = () => {
    const dispatch = useDispatch();
    const { categories, isLoading, isError } = useSelector((state) => state.category);

    useEffect(() => {
        if (categories.length === 0 && !isLoading) {
            dispatch(fetchCategories());
        }
    }, [dispatch, categories.length, isLoading]);

    const isEmpty = isError || !categories || categories.length === 0;

    return {
        categories,
        isLoading,
        isEmpty
    };
};

export default useCategories;