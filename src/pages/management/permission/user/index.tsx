import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Button, Table, Space, Switch, Spin } from '@arco-design/web-react';
import { IconPen, IconRefresh, IconArrowUp } from '@arco-design/web-react/icon';

import { RootState } from '@/redux/store';
import {
  getRoleList,
  fetchUserList,
  addUser,
  fetchUserRole,
  setUserRole,
  resetUserPwd,
  freezeUser,
  reFreezeUser,
  AddParams,
  upgradeUserParams,
  upgradeUser,
  setRoleParams
} from '@/redux/reducer/permission/user';
import { formData, filterLabel } from '@/assets/js/common.js'

import PageTool from './pageTool.js';
import PageForm from './pageForm';
import UpgradeForm from './upgradeForm';
import RoleForm from './roleForm.js';
import { USER_TYPE_LIST } from './constants';

const PermissionUser = () => {
  const dispatch = useDispatch()
  const {
    roleList,
    pageSize,
    total,
    data,
    pageLoading,
    roleLoading,
    addLoading,
    resetLoading,
    switchLoading,
    reLoadPage,
    userRole,
  } = useSelector(
    (state: RootState) => state.permissionUserSlice,
  );
  
  const [visible, setVisible] = useState(false);
  const [roleVisible, setRoleVisible] = useState(false);
  const [upgradeVisible, setUpgradeVisible] = useState(false);
  const [pageNo, setPageNo] = useState(1);
  const [opUserId, setOpUserId] = useState('');
  const [upgradeId, setUpgradeId] = useState('');
  const [upgradeBrokerId, setUpgradeBrokerId] = useState('');
  const [userRoleId, setUserRoleId] = useState('');


  useEffect(() => {
    dispatch(getRoleList());
  }, []);

  useEffect(() => {
    if (reLoadPage) {
      const params = {
        pageNo,
        pageSize,
      }
      dispatch(fetchUserList(params));
    }
  }, [reLoadPage]);
  
  useEffect(() => {
    const params = {
      pageNo,
      pageSize,
    }
    dispatch(fetchUserList(params));
  }, [pageNo]);


  const handleOpenDialog = () => {
    setVisible(true);
  }

  const handleAddSubmit = (result: AddParams) => {
    dispatch(addUser(result));
    handleCloseDialog();
  }

  const handleCloseDialog = () => {
    setVisible(false);
  }

  const handleOpenRoleDialog = (id: string) => {
    dispatch(fetchUserRole(id));
    setRoleVisible(true);
    setUserRoleId(id);
  }

  const handleSetSubmit = async (result: setRoleParams) => {
    const params = {
      ...result,
      userId: userRoleId
    }
    dispatch(setUserRole(params));
    handleCloseSetDialog();
  }

  const handleCloseSetDialog = () => {
    setRoleVisible(false);
    setUserRoleId('');
  }

  const handleChangeSwitch = async (args: boolean, rol: boolean, id: string) => {
    setOpUserId(id);
    if(args) {
      dispatch(freezeUser(id));
    } else {
      dispatch(reFreezeUser(id));
    }
  }

  const handleResetPwd = async (id: string) => {
    setOpUserId(id);
    dispatch(resetUserPwd(id));
  }

  const handleUpgradeSubmit = async (result: upgradeUserParams) => {
    const { rate } = result;
    const params = {
      rate,
      id: upgradeId
    }
    dispatch(upgradeUser(params));
    handleCloseUpgradeDialog();
  }

  const handleOpenUserUpgrade = (id: string, brokerId: string) => {
    setUpgradeVisible(true);
    setUpgradeId(id);
    setUpgradeBrokerId(brokerId);
  }

  const handleCloseUpgradeDialog = () => {
    setUpgradeVisible(false);
    setUpgradeId('');
    setUpgradeBrokerId('');
  }

  const handleChangePage = (page: number) => {
    setPageNo(page);
  }

  const TableColumns = [
    {
      title: '用户ID',
      dataIndex: 'userId',
    },
    {
      title: '邮箱',
      dataIndex: 'email',
    },
    {
      title: '用户类型',
      dataIndex: 'userType',
      render: (rol: string) => filterLabel(rol, USER_TYPE_LIST)
    },
    {
      title: '创建时间',
      dataIndex: 'gmtCreate',
      render: (rol: Date) => formData(rol)
    },
    {
      title: '状态',
      dataIndex: 'freeze',
      align: 'center' as const,
      render: (rol: boolean, item: any) => {
        return (
          <Switch
            checkedText='活跃'
            uncheckedText='冻结'
            checked={rol}
            loading={switchLoading && (opUserId === item.userId)}
            onChange={(args) => handleChangeSwitch(args, rol, item.userId)}
          />
        )
      }
    },
    {
      title: '重置密码',
      dataIndex: 'userId',
      align: 'center' as const,
      render: (rol: string) => (
        <Space size="mini">
          <Button
            loading={resetLoading && (opUserId === rol)}
            shape='round' type='outline' icon={<IconRefresh />}
            onClick={() => handleResetPwd(rol)}
          />
        </Space>
      )
    },
    {
      title: '角色升级',
      dataIndex: 'userId',
      align: 'center' as const,
      render: (rol: string, item: any) => (
        <Space size="mini">
          <Button
            disabled={item.userType === 2}
            shape='round' type='outline' icon={<IconArrowUp />}
            onClick={() => handleOpenUserUpgrade(item.userId, item.brokerId)}
          />
        </Space>
      )
    },
    {
      title: '角色分配',
      dataIndex: 'userId',
      align: 'right' as const,
      render: (rol: string) => (
        <Space size="mini">
          <Button type='primary' onClick={() => handleOpenRoleDialog(rol)} icon={<IconPen />} />
        </Space>
      )
    },
  ];


  return (
    <div className="permissionUser">
      <PageTool handleOpenDialog={() => handleOpenDialog()} />
      <div className="pageContent">
        <Spin dot loading={pageLoading}>
          <Table
            columns={TableColumns}
            data={data}
            pagination={{
              current: pageNo,
              pageSize,
              total,
              hideOnSinglePage: true,
              onChange: (page) => handleChangePage(page)
            }}
          />
        </Spin>
      </div>
      <PageForm
        visible={visible}
        onSubmit={(result: AddParams) => handleAddSubmit(result)}
        close={() => handleCloseDialog()}
        loading={addLoading}
      />
      <UpgradeForm
        id={upgradeBrokerId}
        visible={upgradeVisible}
        onSubmit={(result: upgradeUserParams) => handleUpgradeSubmit(result)}
        close={() => handleCloseUpgradeDialog()}
        loading={addLoading}
      />
      <RoleForm
        userRole={userRole}
        dataSource={roleList}
        visible={roleVisible}
        onSubmit={(result: setRoleParams) => handleSetSubmit(result)}
        close={() => handleCloseSetDialog()}
        loading={roleLoading}
      />
    </div>
  )
}

export default PermissionUser;