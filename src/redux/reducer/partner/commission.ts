import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apis from '@/fetch/index';
import { RootState } from '@/redux/store';
import { Message } from '@arco-design/web-react';

export interface AddParams {
  leaderName?: string,
  rate: string,
  userId: string,
  id?: string | number,
}

export interface SearchParams {
  pageNo?: number,
  pageSize?: number,
}

export interface ResultItem {
  bonusRate: number,
  id: number,
  level: number,
  partnerName: string,
  partnerUserId: number,
  state: 0 | 1
}

interface UmbrellaFirst {
  account: string,
  gmtCreate: Date,
  inviteCode: string,
  userId: number | string,
}
export interface UmbrellaState {
  pageSize: number,
  total: number,
  data: Array<UmbrellaFirst>,
  pageLoading: boolean,
  reLoadPage: boolean,
  addLoading: boolean,
  inputLoading: boolean,
  inputEmail: string,
}

const initialState:UmbrellaState = {
  pageSize: 10,
  total: 0,
  data: [],
  pageLoading: false,
  reLoadPage: false,
  addLoading: false,
  inputLoading: false,
  inputEmail: '',
}

export const fetchPartnerList = createAsyncThunk('fetchPartnerList', async (values: SearchParams, { rejectWithValue }) => {
  try {
    const res = await apis.fetchPartnerList(values);
    return res
  } catch (error) {
    return rejectWithValue(error)
  }
});

export const addPartner = createAsyncThunk('addPartner', async (values: AddParams, { rejectWithValue }) => {
  try {
    const res = await apis.addPartner(values);
    return res
  } catch (error) {
    return rejectWithValue(error)
  }
});

export const setPartnerCommission = createAsyncThunk('setPartnerCommission', async (values: AddParams, { rejectWithValue }) => {
  try {
    const res = await apis.setPartnerCommission(values);
    return res
  } catch (error) {
    return rejectWithValue(error)
  }
});

export const disPartner = createAsyncThunk('disPartner', async (userId: string, { rejectWithValue }) => {
  try {
    const res = await apis.disPartner(userId);
    return res
  } catch (error) {
    return rejectWithValue(error)
  }
});

export const getPartnerInfo = createAsyncThunk('getPartnerInfo', async (values: { userId: string }, { rejectWithValue }) => {
  try {
    const res = await apis.getPartnerInfo(values);
    return res
  } catch (error) {
    return rejectWithValue(error)
  }
});


export const partnerCommissionSlice = createSlice({
  name: 'partnerCommissionSlice',
  initialState,
  reducers: {
    clearEmail: (state: UmbrellaState) => {
      state.inputEmail = '';
    }
  },
  extraReducers: {
    // 查询返佣列表
    [fetchPartnerList.pending.type]: (state, action) => {
      state.pageLoading = true;
    },
    [fetchPartnerList.fulfilled.type]: (state, action) => {
      state.pageLoading = false;
      const { data, success, total } = action.payload;
      if (success) {
        state.data = data;
        state.total = total;
      } else {
        state.data = [];
        state.total = 0;
      }
    },
    [fetchPartnerList.rejected.type]: (state, action) => {
      state.pageLoading = false;
      Message.error(action.payload.message);
    },
    // 添加返佣
    [addPartner.pending.type]: (state, action) => {
      state.reLoadPage = false;
      state.addLoading = true;
    },
    [addPartner.fulfilled.type]: (state, action) => {
      const { success } = action.payload;
      if (success) {
        state.reLoadPage = true;
        state.addLoading = false;
        Message.success('添加合伙人成功！');
      } else {
        state.reLoadPage = false;
        state.addLoading = false;
      }
    },
    [addPartner.rejected.type]: (state, action) => {
      state.reLoadPage = false;
      state.addLoading = false;
      Message.error(action.payload.message);
    },
    // 修改返佣
    [setPartnerCommission.pending.type]: (state, action) => {
      state.reLoadPage = false;
      state.addLoading = true;
    },
    [setPartnerCommission.fulfilled.type]: (state, action) => {
      const { success } = action.payload;
      if (success) {
        state.reLoadPage = true;
        state.addLoading = false;
        Message.success('修改合伙人成功！');
      } else {
        state.reLoadPage = false;
        state.addLoading = false;
      }
    },
    [setPartnerCommission.rejected.type]: (state, action) => {
      state.reLoadPage = false;
      state.addLoading = false;
      Message.error(action.payload.message);
    },
    // 禁用
    [disPartner.pending.type]: (state, action) => {
      state.reLoadPage = false;
    },
    [disPartner.fulfilled.type]: (state, action) => {
      const { success } = action.payload;
      if (success) {
        state.reLoadPage = true;
        Message.success('禁用合伙人返佣成功！');
      } else {
        state.reLoadPage = false;
      }
    },
    [disPartner.rejected.type]: (state, action) => {
      state.reLoadPage = false;
      Message.error(action.payload.message);
    },
    // 获取合伙人成员信息
    [getPartnerInfo.pending.type]: (state, action) => {
      state.inputLoading = true;
      state.inputEmail = '';
    },
    [getPartnerInfo.fulfilled.type]: (state, action) => {
      const { success, data } = action.payload;
      if (success) {
        state.inputLoading = false;
        state.inputEmail = data;
      } else {
        state.inputLoading = false;
        state.inputEmail = '';
      }
    },
    [getPartnerInfo.rejected.type]: (state, action) => {
      state.inputLoading = false;
      state.inputEmail = '';
      Message.error(action.payload.message);
    },
  }
})

export const app = (state: RootState) => state.partnerCommissionSlice;
export const { clearEmail } = partnerCommissionSlice.actions;
export default partnerCommissionSlice.reducer;
