import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Button, Table, Space, Modal, Spin } from '@arco-design/web-react';
import { IconStop, IconPen } from '@arco-design/web-react/icon';

import { RootState } from '@/redux/store';
import {
  fetchPartnerList,
  addPartner,
  setPartnerCommission,
  disPartner,
  AddParams,
  ResultItem,
} from '@/redux/reducer/partner/commission';

import { filterLabel } from '@/assets/js/common';
import { STATUS_LIST } from './constants';
import PageTool from './pageTool.js';
import PageForm from './pageForm';

const PartnerCommission = () => {
  const dispatch = useDispatch()
  const {
    pageSize,
    total,
    data,
    pageLoading,
    addLoading,
    reLoadPage,
  } = useSelector(
    (state: RootState) => state.partnerCommissionSlice,
  );
  
  const [visible, setVisible] = useState(false);
  const [formType, setFormType] = useState('add');
  const [pageNo, setPageNo] = useState(1);
  const [formData, setFormData] = useState({} as ResultItem);


  useEffect(() => {
    if (reLoadPage) {
      const params = {
        pageNo,
        pageSize,
      }
      dispatch(fetchPartnerList(params));
    }
  }, [reLoadPage]);
  
  useEffect(() => {
    const params = {
      pageNo,
      pageSize,
    }
    dispatch(fetchPartnerList(params));
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
      dispatch(addPartner(result));
    } else {
      const params = {
        ...result,
        id: formData.id
      }
      dispatch(setPartnerCommission(params));
    }
    handleCloseDialog();
  }

  const handleCloseDialog = () => {
    setVisible(false);
    setFormData({} as ResultItem);
  }

  const handleDisPartner = (id: string) => {
    dispatch(disPartner(id));
  }

  const handleChangePage = (page: number) => {
    setPageNo(page);
  }
  const TableColumns = [
    {
      title: '合伙人名称',
      dataIndex: 'partnerName',
    },
    {
      title: '合伙人UID',
      dataIndex: 'partnerUserId',
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
      title: '禁用返佣',
      dataIndex: 'partnerUserId',
      align: 'center' as const,
      render: (rol: string, item: ResultItem) => {
        let isDisable = false;
        if (item.state === 1) {
          isDisable = true;
        }
        return (
          <Space size="mini">
            <Button
              type='primary'
              status='danger'
              disabled={isDisable}
              icon={<IconStop />}
              onClick={() => {
                Modal.confirm({
                  title: '禁用确认',
                  content: '确定禁用当前合伙人返佣吗？',
                  okButtonProps: { status: 'danger' },
                  onOk: () => handleDisPartner(rol),
                })
              }}
            >
              {isDisable && '已禁用'}
            </Button>
          </Space>
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
    <div className="permissionCommission">
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

export default PartnerCommission;