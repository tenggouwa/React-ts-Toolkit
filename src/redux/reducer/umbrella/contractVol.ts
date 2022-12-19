import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apis from '@/fetch/index';
import { RootState } from '@/redux/store';
import { Message } from '@arco-design/web-react';
import { removeProperty } from '@/assets/js/common';

export interface SearchParams {
  searchAccount?: string,
  childId?: string,
  pageNo?: number,
  pageSize?: number,
}

interface UmbrellaFirst {
  account: string,
  lmTradeVol: string,
  mtradeVol: string,
  ttradeVol: string,
  wtradeVol: string,
  userId: number | string,
}

export interface UmbrellaState {
  pageSize: number,
  total: number,
  data: Array<UmbrellaFirst>,
  loading: boolean,
  pageId: string,
  pageTotal: number,
  pageList: Array<UmbrellaFirst>,
  pageLoading: boolean,
  hasChild: boolean,
}

const initialState:UmbrellaState = {
  pageSize: 10,
  total: 0,
  data: [],
  loading: false,
  pageId: '',
  pageTotal: 0,
  pageList: [],
  pageLoading: false,
  hasChild: false,
}

export const fetchUnderContractVol = createAsyncThunk('fetchUnderContractVol', async (values: SearchParams, { rejectWithValue }) => {
  try {
    const res = await apis.fetchUnderContractVol(removeProperty(values));
    return res
  } catch (error) {
    return rejectWithValue(error)
  }
});

export const fetchUnderChildContractVol = createAsyncThunk('fetchUnderChildContractVol', async (values: SearchParams, { rejectWithValue }) => {
  try {
    const res = await apis.fetchUnderChildContractVol(removeProperty(values));
    return res
  } catch (error) {
    return rejectWithValue(error)
  }
});

export const umbrellaContractVolSlice = createSlice({
  name: 'umbrellaContractVolSlice',
  initialState,
  reducers: {
    clearStore: (state: UmbrellaState) => {
      state.hasChild = false;
    }
  },
  extraReducers: {
    // 查询伞下一级合约权益
    [fetchUnderContractVol.pending.type]: (state, action) => {
      state.loading = true;
    },
    [fetchUnderContractVol.fulfilled.type]: (state, action) => {
      state.loading = false;
      const { data, success, total } = action.payload;
      if (success) {
        state.data = data;
        state.total = total;
      } else {
        state.loading = false;
        state.data = [];
        state.total = 0;
      }
    },
    // 查询伞下二级合约权益
    [fetchUnderChildContractVol.pending.type]: (state, action) => {
      state.pageLoading = true;
      state.hasChild = false;
    },
    [fetchUnderChildContractVol.fulfilled.type]: (state, action) => {
      state.pageLoading = false;
      const { success, data, total } = action.payload;
      if (success && data && data.length > 0) {
        state.pageList = data;
        state.pageTotal = total;
        state.hasChild = true;
      } else {
        state.pageLoading = false;
        state.hasChild = false;
        state.pageList = [];
        state.pageTotal = 0;
        Message.info('暂无数据！');
      }
    },
  }
})

export const app = (state: RootState) => state.umbrellaContractVolSlice;
export const { clearStore } = umbrellaContractVolSlice.actions;
export default umbrellaContractVolSlice.reducer
