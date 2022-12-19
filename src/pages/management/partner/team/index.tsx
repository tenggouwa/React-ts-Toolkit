import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Button, Table, Space, Switch, Spin } from '@arco-design/web-react';
import { IconPen } from '@arco-design/web-react/icon';

import { RootState } from '@/redux/store';
import {
  fetchMemberList,
  addMember,
  setMemberCommission,
  openUserPermission,
  AddParams,
  ResultItem,
} from '@/redux/reducer/partner/team';

import { filterLabel } from '@/assets/js/common';
import { STATUS_LIST } from './constants';
import PageTool from './pageTool.js';
import PageForm from './pageForm';

const PartnerTeam = () => {
  const dispatch = useDispatch()
  const {
    pageSize,
    total,
    data,
    pageLoading,
    addLoading,
    switchLoading,
    reLoadPage,
  } = useSelector(
    (state: RootState) => state.partnerTeamSlice,
  );
  
  const [visible, setVisible] = useState(false);
  const [opUserId, setOpUserId] = useState('');
  const [formType, setFormType] = useState('add');
  const [pageNo, setPageNo] = useState(1);
  const [formData, setFormData] = useState({} as ResultItem);


  useEffect(() => {
    if (reLoadPage) {
      const params = {
        pageNo,
        pageSize,
      }
      dispatch(fetchMemberList(params));
    }
  }, [reLoadPage]);
  
  useEffect(() => {
    const params = {
      pageNo,
      pageSize,
    }
    dispatch(fetchMemberList(params));
  }, [pageNo]);


  const handleOpenDialog = (type: 'add' | 'update', item?: ResultItem) => {
    if (type === 'update') {
      setFormData(item)
    }
    setFormType(type)
    setVisible(true);
  }

  const handleAddSubmit = (result: AddParams) => {
    if (formType === 'add') {
      const params = {
        ...result,
      }
      dispatch(addMember(params));
    } else {
      const params = {
        ...result,
        id: formData.id
      }
      dispatch(setMemberCommission(params));
    }
    handleCloseDialog();
  }

  const handleCloseDialog = () => {
    setVisible(false);
    setFormData({} as ResultItem);
  }

  const handleChangePage = (page: number) => {
    setPageNo(page);
  }

  const handleChangeSwitch = async (args: boolean, id: string) => {
    setOpUserId(id);
    dispatch(openUserPermission(id))
  }

  const TableColumns = [
    {
      title: '成员UID',
      dataIndex: 'memberId',
    },
    {
      title: '成员账号',
      dataIndex: 'memberAccount',
    },
    {
      title: '返佣比例',
      dataIndex: 'bonusRate',
      render: (rol: string) => `${rol}%`
    },
    {
      title: '状态',
      dataIndex: 'state',
      render: (rol: number) => filterLabel(rol, STATUS_LIST)
    },
    {
      title: '管理权限',
      dataIndex: 'openManageAuthority',
      align: 'center' as const,
      render: (rol: number, item: any) => {
        return (
          <Switch
            checkedText='已开通'
            uncheckedText="去开通"
            checked={rol !== 0}
            disabled={item.state === 1 || rol !== 0}
            loading={switchLoading && (opUserId === item.id)}
            onChange={(args) => handleChangeSwitch(args, item.id)}
          />
        )
      }
    },
    {
      title: '修改',
      dataIndex: 'id',
      align: 'right' as const,
      render: (rol: string, item: ResultItem) => (
        <Space size="mini">
          <Button disabled={item.state === 1} type='primary' icon={<IconPen />} onClick={() => handleOpenDialog('update', item)} />
        </Space>
      )
    },
  ];


  return (
    <div className="permissionUser">
      <PageTool handleOpenDialog={() => handleOpenDialog('add')} />
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
        formData={formData}
        type={formType}
        visible={visible}
        onSubmit={(result: AddParams) => handleAddSubmit(result)}
        close={() => handleCloseDialog()}
        loading={addLoading}
      />
    </div>
  )
}

export default PartnerTeam;