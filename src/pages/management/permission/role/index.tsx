import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Button, Table, Space, Message, Modal, Spin, Divider } from '@arco-design/web-react';
import { IconPen, IconDelete } from '@arco-design/web-react/icon';

import { RootState } from '@/redux/store';
import {
  getRoleList,
  getPersonMenuInfo,
  deleteRole,
  addRole,
  setRolePermission,
  AddParams,
  PermissionUserFirst,
} from '@/redux/reducer/permission/role';

import PageFrom from './pageForm.js';
import PageTool from './pageTool.js';
import EditForm from './editForm.js';
import './index.scss';

const permissionRole = () => {
  const dispatch = useDispatch()
  const {
    permissionList,
    pageSize,
    total,
    data,
    addLoading,
    editLoading,
    reLoadPage,
  } = useSelector(
    (state: RootState) => state.permissionRoleSlice,
  );

  const [pageNo, setPageNo] = useState(1);
  const [visible, setVisible] = useState(false);
  const [editVisible, setEditVisible] = useState(false);
  const [editId, setEditId] = useState('');
  const [editPermission, setEditPermission] = useState([]);

  useEffect(() => {
    dispatch(getPersonMenuInfo());
  }, []);

  useEffect(() => {
    if (reLoadPage) {
      const params = {
        pageNo,
        pageSize,
      }
      dispatch(getPersonMenuInfo());
      dispatch(getRoleList(params));
    }
  }, [reLoadPage]);

  useEffect(() => {
    const params = {
      pageNo,
      pageSize,
    }
    dispatch(getRoleList(params));
  }, [pageNo]);

  const handleOpenDialog = () => {
    setVisible(true);
  }

  const handleAddSubmit = (result: AddParams) => {
    dispatch(addRole(result));
    handleCloseDialog();
  }

  const handleCloseDialog = () => {
    setVisible(false);
  }

  const handleOpenEditDialog = (item: PermissionUserFirst) => {
    const { id, permissions } = item;
    if ((id !== editId) && editVisible) {
      Message.info('请先保存未编辑完成的权限');
      return false;
    }
    setEditVisible(true);
    setEditId(id);
    setEditPermission(permissions);
  }

  const handleEditSubmit = (result: Array<string>) => {
    const params = {
      permissions: result,
      roleId: editId
    }
    dispatch(setRolePermission(params));
    handleCloseEditDialog();
  }

  const handleCloseEditDialog = () => {
    setEditVisible(false);
    setEditId('');
  }

  const handleDelete = (id: string) => {
    dispatch(deleteRole(id));
  }

  const handleChangePage = (page: number) => {
    setPageNo(page);
  }

  const TableColumns = [
    {
      title: '角色',
      dataIndex: 'name',
    },
    {
      title: '操作',
      dataIndex: 'id',
      align: 'right' as const,
      render: (rol: string, item: PermissionUserFirst) => (
        <Space size="mini">
          <Button loading={editVisible && (editId === rol)} type='primary' icon={<IconPen />} onClick={() => handleOpenEditDialog(item)}/>
          <Button
            type='primary'
            status='danger'
            icon={<IconDelete />}
            onClick={() => {
              Modal.confirm({
                title: '删除确认',
                content: '确定删除当前角色吗？',
                okButtonProps: { status: 'danger' },
                onOk: () => handleDelete(rol),
              })
            }}
          />
        </Space>
      )
    },
  ];

  return (
    <div className="permissionRole">
      <PageTool handleOpenDialog={() => handleOpenDialog()} />
      <div className="pageContent">
        <Table
          style={{ flex: '1' }}
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
        <Divider type='vertical' style={{ minHeight: '500px' }}/>
        <div className='transfer'>
          <EditForm
            visible={editVisible}
            dataSource={permissionList}
            permission={editPermission}
            onSubmit={(result: Array<string>) => handleEditSubmit(result)}
            close={() => handleCloseEditDialog()}
            loading={editLoading}
          />
        </div>
      </div>
      <PageFrom
        visible={visible}
        onSubmit={(result: AddParams) => handleAddSubmit(result)}
        close={() => handleCloseDialog()}
        loading={addLoading}
      />
    </div>
  )
}

export default permissionRole;
