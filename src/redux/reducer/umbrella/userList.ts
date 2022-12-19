import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apis from '@/fetch/index';
import { RootState } from '@/redux/store';
import { Message } from '@arco-design/web-react';
import { removeProperty, filterLabel, arrayTrim } from '@/assets/js/common';
import { NATION_LIST } from './constants';

export interface SearchParams {
  searchAccount?: string,
  childId?: string,
  pageNo?: number,
  pageSize?: number,
}

export interface ResultForm {
  account?: string,
  accountRight?: string,
  avaMargin?: string,
  effLeverage?: string,
  orderMargin?: string,
  positionsMargin?: string,
  requiredMargin?: string,
  safetyMargin?: string,
  userId?: string,
}

interface UmbrellaFirst {
  account: string,
  gmtCreate: Date,
  inviteCode: string,
  userId: number | string,
}

interface LabelValue {
  label: string,
  value: string,
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
  childInfo: Array<LabelValue>,
  childInfoList: any,
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
  childInfo: [],
  childInfoList: [],
}

export const fetchUnderList = createAsyncThunk('fetchUnderList', async (values: SearchParams, { rejectWithValue }) => {
  try {
    const res = await apis.fetchUnderList(removeProperty(values));
    return res
  } catch (error) {
    return rejectWithValue(error)
  }
});

export const fetchUnderChildList = createAsyncThunk('fetchUnderChildList', async (values: SearchParams, { rejectWithValue }) => {
  try {
    const res = await apis.fetchUnderChildList(removeProperty(values));
    return res
  } catch (error) {
    return rejectWithValue(error)
  }
});

export const fetchUnderChildInfo = createAsyncThunk('fetchUnderChildInfo', async (id: string, { rejectWithValue }) => {
  try {
    const res = await apis.fetchUnderChildInfo({ userId: id });
    return res
  } catch (error) {
    return rejectWithValue(error)
  }
});

export const umbrellaUserSlice = createSlice({
  name: 'umbrellaUserSlice',
  initialState,
  reducers: {
    clearStore: (state: UmbrellaState) => {
      state.hasChild = false;
    }
  },
  extraReducers: {
    // 查询伞下一级用户列表
    [fetchUnderList.pending.type]: (state, action) => {
      state.loading = true;
    },
    [fetchUnderList.fulfilled.type]: (state, action) => {
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
    // 查询伞下二级用户列表
    [fetchUnderChildList.pending.type]: (state, action) => {
      state.pageLoading = true;
      state.hasChild = false;
    },
    [fetchUnderChildList.fulfilled.type]: (state, action) => {
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
    // 查询伞下用户信息
    [fetchUnderChildInfo.pending.type]: (state, action) => {
      state.childInfo = [];
      state.childInfoList = [];
    },
    [fetchUnderChildInfo.fulfilled.type]: (state, action) => {
      const { success, data } = action.payload;
      if (success && data) {
        const result = Object.keys(data).map((el) => {
          const label = filterLabel(el, NATION_LIST)
          if (label !== '--') {
            return {
              value: data[el],
              label
            }
          }
        })
        state.childInfo = arrayTrim(result);
        state.childInfoList = data.contractPositionInfoDTOList || [];
      } else {
        state.childInfo = [];
        state.childInfoList = [];
        Message.info('暂无数据！');
      }
    },
  }
})

export const app = (state: RootState) => state.umbrellaUserSlice;
export const { clearStore } = umbrellaUserSlice.actions;
export default umbrellaUserSlice.reducer