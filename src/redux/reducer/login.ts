import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apis from '@/fetch/index';
import { RootState } from '@/redux/store';
import { Message } from '@arco-design/web-react';

export interface LoginFormIn {
  password: string,
  username: string,
}

export interface ChangedFormIn {
  password: string,
}

export interface LoginState {
  loading: boolean,
  isLoginSuccess: boolean,
  isLoginOutSuccess: boolean,
  isLoginChangedSuccess: boolean,
  changedLoading: boolean,
}

const initialState:LoginState = {
  loading: false,
  isLoginSuccess: false,
  isLoginOutSuccess: false,
  changedLoading: false,
  isLoginChangedSuccess: false,
}

export const loginSubmit = createAsyncThunk('loginSubmit', async (values: LoginFormIn, { rejectWithValue }) => {
  try {
    const res = await apis.userLogin(values);
    return res
  } catch (error) {
    return rejectWithValue(error)
  }
});

export const loginOut = createAsyncThunk('loginOut', async ({}, { rejectWithValue }) => {
  try {
    const res = await apis.userLoginOut();
    return res
  } catch (error) {
    return rejectWithValue(error)
  }
});

export const userChangePass = createAsyncThunk('userChangePass', async (password: string, { rejectWithValue }) => {
  try {
    const res = await apis.userChangePass(password);
    return res
  } catch (error) {
    return rejectWithValue(error)
  }
});

export const loginSlice = createSlice({
  name: 'loginSlice',
  initialState,
  reducers: {
    clearStore: (state: LoginState) => {
      state.isLoginSuccess = false;
      state.isLoginOutSuccess = false;
      state.isLoginChangedSuccess = false;
    }
  },
  extraReducers: {
    // 登录
    [loginSubmit.pending.type]: (state, action) => {
      state.loading = true;
      state.isLoginSuccess = false;
    },
    [loginSubmit.fulfilled.type]: (state, action) => {
      state.loading = false;
      const { data, success } = action.payload;
      if (success) {
        state.isLoginSuccess = true;
        Message.success('登录成功！')
        window.localStorage.setItem('Token', data)
      } else {
        state.isLoginSuccess = false;
      }
    },
    // 登出
    [loginOut.pending.type]: (state, action) => {
      state.isLoginOutSuccess = false;
    },
    [loginOut.fulfilled.type]: (state, action) => {
      const { success } = action.payload;
      if (success) {
        state.isLoginOutSuccess = true;
        Message.success('登出成功！');
        window.localStorage.removeItem('Token');
        window.localStorage.removeItem('menuInfo');
      } else {
        state.isLoginOutSuccess = false;
      }
    },
    // 修改密码
    [userChangePass.pending.type]: (state, action) => {
      state.changedLoading = true;
      state.isLoginChangedSuccess = false;
    },
    [userChangePass.fulfilled.type]: (state, action) => {
      const { success } = action.payload;
      if (success) {
        state.isLoginChangedSuccess = true;
        state.changedLoading = false;
        Message.success('修改成功！');
        window.localStorage.removeItem('Token');
        window.localStorage.removeItem('menuInfo');
      } else {
        state.changedLoading = true;
        state.isLoginChangedSuccess = false;
      }
    },
  }
})

export const app = (state: RootState) => state.loginSlice;
export const { clearStore } = loginSlice.actions;
export default loginSlice.reducer