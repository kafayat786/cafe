import { createAsyncThunk } from '@reduxjs/toolkit';
import axiosWrapper from '../../utils/api';

export const loginUser = createAsyncThunk('auth/login', async ({ username, password }, { rejectWithValue }) => {
    try {
        const data = await axiosWrapper('post', `${import.meta.env.VITE_API_BASE_URL}/user/login`, { username, password });
        return data;
    } catch (error) {
        return rejectWithValue(error.message);
    }
});

export const registerUser = createAsyncThunk('auth/signup', async ({ password, username }, { rejectWithValue }) => {
    try {
        const { data } = await axiosWrapper('post', `${import.meta.env.VITE_API_BASE_URL}/user/signup`, { password, username });
        return data;
    } catch (error) {
        return rejectWithValue(error.message);
    }
});
