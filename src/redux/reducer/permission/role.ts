import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apis from '@/fetch/index';
import { RootState } from '@/redux/store';
import { Message } from '@arco-design/web-react';

export interface SearchParams {
  pageNo?: number,
  pageSize?: number,
}

export interface AddParams {
  name: string,
}

export interface EditParams {
  permissions: Array<string>,
  roleId: string
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

export interface PermissionUserFirst {
  id: string,
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
  permissionList: Array<PermissionUserFirst>,
  data: Array<PermissionUserList>,
  total: number,
  pageSize: number,
  pageLoading: boolean,
  addLoading: boolean,
  roleLoading: boolean,
  resetLoading: boolean,
  switchLoading: boolean,
  reLoadPage: boolean,
}

const initialState:PermissionUserState = {
  permissionList: [],
  pageSize: 10,
  total: 0,
  data: [],
  pageLoading: false,
  roleLoading: false,
  addLoading: false,
  resetLoading: false,
  switchLoading: false,
  reLoadPage: false,
}

export const getRoleList = createAsyncThunk('getRoleList', async (values: SearchParams, { rejectWithValue }) => {
  try {
    const res = await apis.getRoleList();
    return res
  } catch (error) {
    return rejectWithValue(error)
  }
});

export const getPersonMenuInfo = createAsyncThunk('getPersonMenuInfo', async ({}, { rejectWithValue }) => {
  try {
    const res = await apis.getPersonMenuInfo();
    return res
  } catch (error) {
    return rejectWithValue(error)
  }
});

export const addRole = createAsyncThunk('addRole', async (values: AddParams, { rejectWithValue }) => {
  try {
    const res = await apis.addRole(values);
    return res
  } catch (error) {
    return rejectWithValue(error)
  }
});

export const setRolePermission = createAsyncThunk('setRolePermission', async (values: EditParams, { rejectWithValue }) => {
  try {
    const res = await apis.setRolePermission(values);
    return res
  } catch (error) {
    return rejectWithValue(error)
  }
});

export const deleteRole = createAsyncThunk('deleteRole', async (id: string, { rejectWithValue }) => {
  try {
    const res = await apis.deleteRole(id);
    return res
  } catch (error) {
    return rejectWithValue(error)
  }
});


export const permissionRoleSlice = createSlice({
  name: 'permissionRoleSlice',
  initialState,
  reducers: {
  },
  extraReducers: {
    // 查询权限列表
    [getPersonMenuInfo.fulfilled.type]: (state, action) => {
      const { data, success } = action.payload;
      if (success) {
        state.permissionList = data;
      } else {
        state.permissionList = [];
        Message.error(action.payload.message);
      }
    },
    // 获取角色列表
    [getRoleList.pending.type]: (state, action) => {
      state.pageLoading = true;
    },
    [getRoleList.fulfilled.type]: (state, action) => {
      state.pageLoading = false;
      const { success, data, total } = action.payload;
      if (success) {
        state.data = data;
        state.total = total;
      } else {
        state.pageLoading = false;
        state.data = [];
        state.total = 0;
      }
    },
    // 添加角色
    [addRole.pending.type]: (state, action) => {
      state.addLoading = true;
      state.reLoadPage = false;
    },
    [addRole.fulfilled.type]: (state, action) => {
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
    // 设置角色权限
    [setRolePermission.pending.type]: (state, action) => {
      state.roleLoading = true;
      state.reLoadPage = false;
    },
    [setRolePermission.fulfilled.type]: (state, action) => {
      state.roleLoading = false;
      const { success } = action.payload;
      if (success) {
        state.reLoadPage = true;
        Message.success('修改权限成功！');
      } else {
        state.roleLoading = false;
        state.reLoadPage = false;
      }
    },
    // 删除角色
    [deleteRole.pending.type]: (state, action) => {
      state.resetLoading = true;
      state.reLoadPage = false;
    },
    [deleteRole.fulfilled.type]: (state, action) => {
      state.resetLoading = false;
      const { success } = action.payload;
      if (success) {
        state.reLoadPage = true;
        Message.success('删除成功！');
      } else {
        state.resetLoading = false;
        state.reLoadPage = false;
      }
    },
  }
})

export const app = (state: RootState) => state.permissionRoleSlice;
export default permissionRoleSlice.reducer