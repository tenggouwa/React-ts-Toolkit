import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Button, Table, Space, Spin, Modal, Descriptions } from '@arco-design/web-react';
import { IconSearch } from '@arco-design/web-react/icon';
import DIS_LIST from './constants';

import { RootState } from '@/redux/store';
import {
  fetchUnderUserInfo,
  fetchAllUnderUserInfo,
  clearStore,
} from '@/redux/reducer/umbrella/accSummary';


const AccSummary = () => {
  const dispatch = useDispatch();
  const {
    data,
    loading,
    childInfo,
    searchLoading,
  } = useSelector(
    (state: RootState) => state.umbrellaAccSummarySlice,
  );

  const [visible, setVisible] = useState(false);

  useEffect(() => {
    getUserList();
    return function cleanup() {
      dispatch(clearStore())
    };
  }, []);

  useEffect(() => {
    if ((JSON.stringify(childInfo)!== '{}') && !searchLoading) {
      setVisible(true);
    } else {
      setVisible(false);
    }
  }, [childInfo, searchLoading]);

  const getUserList = () => {
    dispatch(fetchUnderUserInfo())
  }

  const handleOpenPage = () => {
    dispatch(fetchAllUnderUserInfo())
  }

  const TableColumns = [
    {
      title: '用户ID',
      dataIndex: 'userId',
    },
    {
      title: '邮箱',
      dataIndex: 'account',
    },
    {
      title: '上月交易额',
      dataIndex: 'lmTradeVol',
    },
    {
      title: '本月交易额',
      dataIndex: 'mtradeVol',
    },
    {
      title: '昨日交易额',
      dataIndex: 'ytradeVol',
    },
    {
      title: '今日交易额',
      dataIndex: 'ttradeVol',
    },
    {
      title: '下级交易额',
      dataIndex: 'userId',
      align: 'right' as const,
      render: () => (
        <Space size="small">
          <Button
            shape='round' type='outline' icon={<IconSearch />}
            loading={searchLoading}
            onClick={() => handleOpenPage()}
          />
        </Space>
      )
    },
  ]
  
  return (
    <div className="umbrella_contractSummary">
      <div className="pageContent">
        <Spin dot loading={loading}>
          <Table
            data={data}
            columns={TableColumns}
            pagination={false}
          />
        </Spin>
      </div>
      <Modal
        simple
        title="下级交易额"
        visible={visible}
        onOk={() => setVisible(false)}
        onCancel={() => setVisible(false)}
      >
        <Descriptions
          colon=' :'
          column={2}
          layout='inline-horizontal'
          data={
            DIS_LIST.map(item => {
              return {
                ...item,
                value: childInfo[item.value]
              }
            })
          }
        />
      </Modal>
    </div>
  )
}


export default AccSummary