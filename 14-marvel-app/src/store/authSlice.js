import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isLoggedIn: false,
  user: null,
  loading: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginStart: state => {
      state.loading = true;
    },
    loginSuccess: (state, action) => {
      state.loading = false;
      state.isLoggedIn = true;
      state.user = action.payload;
    },
    loginFailure: state => {
      state.loading = false;
      state.isLoggedIn = false;
    },
    logout: state => {
      state.isLoggedIn = false;
      state.user = null;
      state.loading = false;
    },
    register: (state, action) => {
      state.isLoggedIn = true;
      state.user = action.payload;
    },
  },
});

export const { loginStart, loginSuccess, loginFailure, logout, register } =
  authSlice.actions;

export default authSlice.reducer;
