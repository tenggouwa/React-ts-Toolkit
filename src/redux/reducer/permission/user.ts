import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apis from '@/fetch/index';
import { RootState } from '@/redux/store';
import { Message } from '@arco-design/web-react';

export interface SearchParams {
  searchAccount?: string,
  childId?: string,
  pageNo?: number,
  pageSize?: number,
}

export interface AddParams {
  brokerId: string,
  email?: string,
  username?: string
}

export interface setRoleParams {
  roleId?: string,
  userId: string,
}

export interface upgradeUserParams {
  id: string,
  rate: string
}

interface PermissionList {
  authority: string,
  children: Array<any>
  icon: string,
  id: string,
  name: string,
  type: 0 | 1,
  url: string
}

interface PermissionUserFirst {
  id: number,
  name: string,
  permissions: Array<PermissionList>,
}

interface PermissionUserList {
  brokerId: number,
  email: string,
  freeze: boolean,
  gmtCreate: Date,
  userId: number,
  username: string
}

export interface PermissionUserState {
  roleList: Array<PermissionUserFirst>,
  data: Array<PermissionUserList>,
  total: number,
  pageSize: number,
  pageLoading: boolean,
  addLoading: boolean,
  userRole: string,
  roleLoading: boolean,
  resetLoading: boolean,
  switchLoading: boolean,
  reLoadPage: boolean,
  inputLoading: boolean,
  inputEmail: string,
}

const initialState:PermissionUserState = {
  roleList: [],
  pageSize: 10,
  total: 0,
  data: [],
  userRole: '',
  pageLoading: false,
  roleLoading: false,
  addLoading: false,
  resetLoading: false,
  switchLoading: false,
  reLoadPage: false,
  inputLoading: false,
  inputEmail: '',
}

export const getRoleList = createAsyncThunk('getRoleList', async ({}, { rejectWithValue }) => {
  try {
    const res = await apis.getRoleList();
    return res
  } catch (error) {
    return rejectWithValue(error)
  }
});

export const fetchUserList = createAsyncThunk('fetchUserList', async (values: SearchParams, { rejectWithValue }) => {
  try {
    const res = await apis.fetchUserList(values);
    return res
  } catch (error) {
    return rejectWithValue(error)
  }
});

export const addUser = createAsyncThunk('addUser', async (values: AddParams, { rejectWithValue }) => {
  try {
    const res = await apis.addUser(values);
    return res
  } catch (error) {
    return rejectWithValue(error)
  }
});

export const fetchUserRole = createAsyncThunk('fetchUserRole', async (id: string, { rejectWithValue }) => {
  try {
    const res = await apis.fetchUserRole({userId: id});
    return res
  } catch (error) {
    return rejectWithValue(error)
  }
});

export const setUserRole = createAsyncThunk('setUserRole', async (values: setRoleParams, { rejectWithValue }) => {
  try {
    const res = await apis.setUserRole(values);
    return res
  } catch (error) {
    return rejectWithValue(error)
  }
});

export const resetUserPwd = createAsyncThunk('resetUserPwd', async (id: string, { rejectWithValue }) => {
  try {
    const res = await apis.resetUserPwd(id);
    return res
  } catch (error) {
    return rejectWithValue(error)
  }
});


export const freezeUser = createAsyncThunk('freezeUser', async (id: string, { rejectWithValue }) => {
  try {
    const res = await apis.freezeUser(id);
    return res
  } catch (error) {
    return rejectWithValue(error)
  }
});


export const reFreezeUser = createAsyncThunk('reFreezeUser', async (id: string, { rejectWithValue }) => {
  try {
    const res = await apis.reFreezeUser(id);
    return res
  } catch (error) {
    return rejectWithValue(error)
  }
});

export const getMemberInfo = createAsyncThunk('getMemberInfo', async (values: { userId: string }, { rejectWithValue }) => {
  try {
    const res = await apis.getUserEmailInfo(values);
    return res
  } catch (error) {
    return rejectWithValue(error)
  }
});

export const upgradeUser = createAsyncThunk('upgradeUser', async (values: upgradeUserParams, { rejectWithValue }) => {
  try {
    const res = await apis.upgradeUser(values);
    return res
  } catch (error) {
    return rejectWithValue(error)
  }
});

export const permissionUserSlice = createSlice({
  name: 'permissionUserSlice',
  initialState,
  reducers: {
    clearEmail: (state: PermissionUserState) => {
      state.inputEmail = '';
    }
  },
  extraReducers: {
    // 获取角色列表
    [getRoleList.fulfilled.type]: (state, action) => {
      const { data, success } = action.payload;
      if (success) {
        state.roleList = data;
      } else {
        state.roleList = [];
        Message.error(action.payload.message);
      }
    },
    // 查询用户列表
    [fetchUserList.pending.type]: (state, action) => {
      state.pageLoading = true;
    },
    [fetchUserList.fulfilled.type]: (state, action) => {
      state.pageLoading = false;
      const { success, data, total } = action.payload;
      if (success) {
        state.data = data;
        state.total = total;
      } else {
        state.data = [];
        state.total = 0;
        state.pageLoading = false;
      }
    },
    // 添加管理用户
    [addUser.pending.type]: (state, action) => {
      state.addLoading = true;
      state.reLoadPage = false;
    },
    [addUser.fulfilled.type]: (state, action) => {
      state.addLoading = false;
      const { success } = action.payload;
      if (success) {
        state.reLoadPage = true;
        Message.success('添加成功！');
      } else {
        state.addLoading = false;
        state.reLoadPage = false;
      }
    },
    // 查询用户角色
    [fetchUserRole.pending.type]: (state, action) => {
      state.addLoading = true;
      state.userRole = '';
    },
    [fetchUserRole.fulfilled.type]: (state, action) => {
      state.addLoading = false;
      const { success, data } = action.payload;
      if (success) {
        state.userRole = data.id;
      } else {
        state.addLoading = false;
        state.userRole = '';
      }
    },
    // 设置用户角色
    [setUserRole.pending.type]: (state, action) => {
      state.roleLoading = true;
      state.reLoadPage = false;
    },
    [setUserRole.fulfilled.type]: (state, action) => {
      state.roleLoading = false;
      const { success } = action.payload;
      if (success) {
        state.reLoadPage = true;
        Message.success('角色添加成功！');
      } else {
        state.roleLoading = false;
        state.reLoadPage = false;
      }
    },
    // 重置密码
    [resetUserPwd.pending.type]: (state, action) => {
      state.resetLoading = true;
      state.reLoadPage = false;
    },
    [resetUserPwd.fulfilled.type]: (state, action) => {
      state.resetLoading = false;
      const { success } = action.payload;
      if (success) {
        state.reLoadPage = true;
        Message.success('密码重置成功！');
      } else {
        state.resetLoading = false;
        state.reLoadPage = false;
      }
    },
    // 冻结管理用户
    [freezeUser.pending.type]: (state, action) => {
      state.switchLoading = true;
      state.reLoadPage = false;
    },
    [freezeUser.fulfilled.type]: (state, action) => {
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
    //解冻管理用户
    [reFreezeUser.pending.type]: (state, action) => {
      state.switchLoading = true;
      state.reLoadPage = false;
    },
    [reFreezeUser.fulfilled.type]: (state, action) => {
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

    // 升级用户
    [upgradeUser.pending.type]: (state, action) => {
      state.reLoadPage = false;
    },
    [upgradeUser.fulfilled.type]: (state, action) => {
      const { success } = action.payload;
      if (success) {
        state.reLoadPage = true;
        Message.success('用户升级成功！');
      }
    },
    [getMemberInfo.rejected.type]: (state, action) => {
      state.reLoadPage = false;
      Message.error(action.payload.message);
    },
  }
})

export const app = (state: RootState) => state.permissionUserSlice;
export const { clearEmail } = permissionUserSlice.actions;
export default permissionUserSlice.reducer