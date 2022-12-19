import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Table, Spin } from '@arco-design/web-react';

import { RootState } from '@/redux/store';
import {
  fetchUmbrellaNetPosition,
  clearStore,
} from '@/redux/reducer/umbrella/contractNetPosition';


const ContractNetPosition = () => {
  const dispatch = useDispatch();
  const {
    data,
    loading,
  } = useSelector(
    (state: RootState) => state.umbrellaContractNetPosition,
  );

  useEffect(() => {
    getNetPositionList();
    return function cleanup() {
      dispatch(clearStore())
    };
  }, []);

  const getNetPositionList = () => {
    dispatch(fetchUmbrellaNetPosition())
  }

  const TableColumns = [
    {
      title: '合约名称',
      dataIndex: 'contractName',
    },
    {
      title: '方向',
      dataIndex: 'direction',
    },
    {
      title: '多头总头寸(U)',
      dataIndex: 'buysTotalPosition',
    },
    {
      title: '空头总头寸(U)',
      dataIndex: 'sellsTotalPosition',
    },
    {
      title: '净头寸(U)',
      dataIndex: 'netPosition',
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
    </div>
  )
}


export default ContractNetPosition