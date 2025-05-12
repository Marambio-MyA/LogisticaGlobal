import { createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../api/axiosInstance';

export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async ({ email, password }, thunkAPI) => {
    try {
      const response = await axiosInstance.post('/auth/login', {
        email,
        password,
      });

      const { token, usuario } = response.data;
      localStorage.setItem('user', JSON.stringify(usuario));
      localStorage.setItem('authToken', token);
      console.log(usuario);

      return { user: usuario, token };
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || 'Credenciales inválidas'
      );
    }
  }
);
