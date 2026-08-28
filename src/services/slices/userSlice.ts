import {
  forgotPasswordApi,
  getUserApi,
  loginUserApi,
  logoutApi,
  registerUserApi,
  resetPasswordApi,
  updateUserApi
} from '@api';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { TUser } from '@utils-types';
import { deleteCookie, setCookie } from '@utils-cookie';
import { RootState } from '../store';

export const loginUserThunk = createAsyncThunk(
  'users/loginUser',
  ({ email, password }: { email: string; password: string }) =>
    loginUserApi({ email, password })
);

export const getUserThunk = createAsyncThunk('users/getUser', () =>
  getUserApi()
);

export const registerUserThunk = createAsyncThunk(
  'users/registerUser',
  (data: { email: string; name: string; password: string }) =>
    registerUserApi(data)
);

export const forgotUserPasswordThunk = createAsyncThunk(
  'users/forgotPassword',
  (data: { email: string }) => forgotPasswordApi(data)
);

export const resetUserPasswordThunk = createAsyncThunk(
  'users/resetPassword',
  (data: { password: string; token: string }) => resetPasswordApi(data)
);

export const updateUserThunk = createAsyncThunk(
  'users/updateUser',
  (user: { email: string; name: string; password: string }) =>
    updateUserApi(user)
);

export const logoutUserThunk = createAsyncThunk('users/logout', () =>
  logoutApi()
);

export interface UserState {
  isInit: boolean;
  isLoading: boolean;
  user: TUser | null;
  error: string;
}

const initialState: UserState = {
  isInit: false,
  isLoading: false,
  user: null,
  error: ''
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    init: (state) => {
      state.isInit = true;
    }
  },
  extraReducers: (builder) => {
    builder.addCase(loginUserThunk.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(loginUserThunk.rejected, (state) => {
      state.isLoading = false;
      state.isInit = true;
    });
    builder.addCase(loginUserThunk.fulfilled, (state, { payload }) => {
      state.isLoading = false;
      state.isInit = true;
      state.user = payload.user;
      setCookie('accessToken', payload.accessToken);
      localStorage.setItem('refreshToken', payload.refreshToken);
    });

    builder.addCase(getUserThunk.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(getUserThunk.rejected, (state, action) => {
      state.isInit = true;
      state.isLoading = false;
      state.error = action.error.message ?? '';
    });
    builder.addCase(getUserThunk.fulfilled, (state, { payload }) => {
      state.isInit = true;
      state.isLoading = false;
      state.user = payload.user;
    });

    builder.addCase(registerUserThunk.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(registerUserThunk.rejected, (state) => {
      state.isInit = true;
      state.isLoading = false;
    });
    builder.addCase(registerUserThunk.fulfilled, (state, { payload }) => {
      state.isInit = true;
      state.isLoading = false;
      state.user = payload.user;
      setCookie('accessToken', payload.accessToken);
      localStorage.setItem('refreshToken', payload.refreshToken);
    });
    builder.addCase(logoutUserThunk.fulfilled, (state) => {
      state.user = null;
      localStorage.clear(); // очищаем refreshToken
      deleteCookie('accessToken'); // очищаем accessToken
    });

    builder.addCase(updateUserThunk.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(updateUserThunk.rejected, (state) => {
      state.isLoading = false;
      state.isInit = true;
    });
    builder.addCase(updateUserThunk.fulfilled, (state, { payload }) => {
      state.isLoading = false;
      state.isInit = true;
      state.user = payload.user;
    });
  }
});

export const { init } = userSlice.actions;
export const selectUser = (state: RootState) => state.user.user;
export const selectUserState = (state: RootState) => state.user;
export const selectUserName = (state: RootState) => state.user.user?.name ?? '';
export default userSlice.reducer;
