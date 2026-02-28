import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import categoryService from '../../services/category.service';

export const fetchCategories = createAsyncThunk(
    'category/fetchCategories',
    async (_, thunkAPI) => {
        try {
            const data = await categoryService.getAllCategories();
            return data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data);
        }
    }
);


const categorySlice = createSlice({
    name: 'category',
    initialState: {
        categories: [],
        isLoading: false,
        isError: false,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder

            .addCase(fetchCategories.pending, (state) => {
                state.isLoading = true;
                state.isError = false;
            })

            .addCase(fetchCategories.fulfilled, (state, action) => {
                state.isLoading = false;
                state.categories = action.payload;
            })

            .addCase(fetchCategories.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
            });
    }
});

export default categorySlice.reducer;
