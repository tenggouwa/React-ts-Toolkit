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
  memberId: string,
  partnerId: number,
  partnerUid: number,
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
  switchLoading: boolean,
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
  switchLoading: false,
  inputEmail: '',
}

export const fetchMemberList = createAsyncThunk('fetchMemberList', async (values: SearchParams, { rejectWithValue }) => {
  try {
    const res = await apis.fetchMemberList(values);
    return res
  } catch (error) {
    return rejectWithValue(error)
  }
});

export const addMember = createAsyncThunk('addMember', async (values: AddParams, { rejectWithValue }) => {
  try {
    const res = await apis.addMember(values);
    return res
  } catch (error) {
    return rejectWithValue(error)
  }
});

export const setMemberCommission = createAsyncThunk('setMemberCommission', async (values: AddParams, { rejectWithValue }) => {
  try {
    const res = await apis.setMemberCommission(values);
    return res
  } catch (error) {
    return rejectWithValue(error)
  }
});

export const getMemberInfo = createAsyncThunk('getMemberInfo', async (values: { userId: string }, { rejectWithValue }) => {
  try {
    const res = await apis.getMemberInfo(values);
    return res
  } catch (error) {
    return rejectWithValue(error)
  }
});

export const openUserPermission = createAsyncThunk('openUserPermission', async (id: string, { rejectWithValue }) => {
  try {
    const res = await apis.openUserPermission(id);
    return res
  } catch (error) {
    return rejectWithValue(error)
  }
});

export const partnerTeamSlice = createSlice({
  name: 'partnerTeamSlice',
  initialState,
  reducers: {
    clearEmail: (state: UmbrellaState) => {
      state.inputEmail = '';
    }
  },
  extraReducers: {
    // 查询返佣列表
    [fetchMemberList.pending.type]: (state, action) => {
      state.pageLoading = true;
    },
    [fetchMemberList.fulfilled.type]: (state, action) => {
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
    [fetchMemberList.rejected.type]: (state, action) => {
      state.pageLoading = false;
      Message.error(action.payload.message);
    },
    // 添加返佣
    [addMember.pending.type]: (state, action) => {
      state.reLoadPage = false;
      state.addLoading = true;
    },
    [addMember.fulfilled.type]: (state, action) => {
      const { success } = action.payload;
      if (success) {
        state.reLoadPage = true;
        state.addLoading = false;
        Message.success('添加团队成功！');
      } else {
        state.reLoadPage = false;
        state.addLoading = false;
      }
    },
    [addMember.rejected.type]: (state, action) => {
      state.reLoadPage = false;
      state.addLoading = false;
      Message.error(action.payload.message);
    },
    // 修改返佣
    [setMemberCommission.pending.type]: (state, action) => {
      state.reLoadPage = false;
      state.addLoading = true;
    },
    [setMemberCommission.fulfilled.type]: (state, action) => {
      const { success } = action.payload;
      if (success) {
        state.reLoadPage = true;
        state.addLoading = false;
        Message.success('修改成功！');
      } else {
        state.reLoadPage = false;
        state.addLoading = false;
      }
    },
    [setMemberCommission.rejected.type]: (state, action) => {
      state.reLoadPage = false;
      state.addLoading = false;
      Message.error(action.payload.message);
    },
    // 获取合伙人成员信息
    [getMemberInfo.pending.type]: (state, action) => {
      state.inputLoading = true;
      state.inputEmail = '';
    },
    [getMemberInfo.fulfilled.type]: (state, action) => {
      const { success, data } = action.payload;
      if (success) {
        state.inputLoading = false;
        state.inputEmail = data;
      } else {
        state.inputLoading = false;
        state.inputEmail = '';
      }
    },
    [getMemberInfo.rejected.type]: (state, action) => {
      state.inputLoading = false;
      state.inputEmail = '';
      Message.error(action.payload.message);
    },
    // 开通管理权限
    [openUserPermission.pending.type]: (state, action) => {
      state.switchLoading = true;
      state.reLoadPage = false;
    },
    [openUserPermission.fulfilled.type]: (state, action) => {
      state.switchLoading = false;
      const { success } = action.payload;
      if (success) {
        state.reLoadPage = true;
        Message.success('状态修改成功！');
      } else {
        state.switchLoading = false;
        state.reLoadPage = false;
      }
    },
  }
})

export const app = (state: RootState) => state.partnerTeamSlice;
export const { clearEmail } = partnerTeamSlice.actions;
export default partnerTeamSlice.reducer