import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apis from '@/fetch/index';
import { RootState } from '@/redux/store';
import { stat } from "fs";

interface UmbrellaFirst {
  account: string,
  lmTradeVol: string,
  mtradeVol: string,
  ttradeVol: string,
  wtradeVol: string,
  ytradeVol: string,
  userId: number | string,
}

export interface UmbrellaState {
  data: Array<UmbrellaFirst>,
  childInfo: UmbrellaFirst,
  loading: boolean,
  searchLoading: boolean,
}

const initialState:UmbrellaState = {
  data: [],
  childInfo: {} as UmbrellaFirst,
  loading: false,
  searchLoading: false,
}

export const fetchUnderUserInfo = createAsyncThunk('fetchUnderUserInfo', async ({}, { rejectWithValue }) => {
  try {
    const res = await apis.fetchUnderUserInfo();
    return res
  } catch (error) {
    return rejectWithValue(error)
  }
});

export const fetchAllUnderUserInfo = createAsyncThunk('fetchAllUnderUserInfo', async ({}, { rejectWithValue }) => {
  try {
    const res = await apis.fetchAllUnderUserInfo();
    return res
  } catch (error) {
    return rejectWithValue(error)
  }
});


export const umbrellaAccSummarySlice = createSlice({
  name: 'umbrellaAccSummarySlice',
  initialState,
  reducers: {
    clearStore: (state: UmbrellaState) => {
      state.childInfo = {} as UmbrellaFirst;
      state.data = []
    }
  },
  extraReducers: {
    // 查询当前用户账户信息
    [fetchUnderUserInfo.pending.type]: (state, action) => {
      state.loading = true;
    },
    [fetchUnderUserInfo.fulfilled.type]: (state, action) => {
      state.loading = false;
      const { data, success } = action.payload;
      if (success) {
        state.data = [data];
      } else {
        state.loading = false;
        state.data = [];
      }
    },
    // 查询当前用户所有下级账户信息
    [fetchAllUnderUserInfo.pending.type]: (state, action) => {
      state.searchLoading = true;
    },
    [fetchAllUnderUserInfo.fulfilled.type]: (state, action) => {
      state.searchLoading = false;
      const { data, success } = action.payload;
      if (success) {
        state.childInfo = data;
      } else {
        state.searchLoading = false;
        state.childInfo = {} as UmbrellaFirst;
      }
    },
  }
})

export const app = (state: RootState) => state.umbrellaAccSummarySlice;
export const { clearStore } = umbrellaAccSummarySlice.actions;
export default umbrellaAccSummarySlice.reducer
