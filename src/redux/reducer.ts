import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import apis from '@/fetch/index';
import { RootState } from '@/redux/store';

console.log();

interface UserInfo {
  email: string,
  freeze: boolean,
  isGoogleAuth: boolean
  userId: number,
  username: string
}

interface AppState {
  userInfo: UserInfo,
  menuInfo: Array<string>,
}
const initialState:AppState = {
  userInfo: {} as UserInfo,
  menuInfo: [],
}

export const getMenuInfo = createAsyncThunk('getMenuInfo', async ({}, { rejectWithValue }) => {
  try {
    const res = await apis.getMenuInfo();
    return res
  } catch (error) {
    return rejectWithValue(error)
  }
});

export const appSlice = createSlice({
  name: 'appSlice',
  initialState,
  reducers: {
    //@ts-ignore
    clearMenu: (state) => {
      state.menuInfo = []
    }
  },
  extraReducers: {
    [getMenuInfo.fulfilled.type]: (state, action) => {
      const { data, success } = action.payload;
      if (success) {
        localStorage.menuInfo = JSON.stringify(data.authorities)
        state.menuInfo = data.authorities || [],
        state.userInfo = data
      } else {
        state.menuInfo = [],
        state.userInfo = {} as UserInfo
      }
    },
    [getMenuInfo.rejected.type]: (state, action) => {
      state.menuInfo = [],
      state.userInfo = {} as UserInfo
    },
  }
})


export const app = (state: RootState) => state.appSlice;
export const { clearMenu } = appSlice.actions;
export default appSlice.reducer

