import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Button, Table, Space, Spin } from '@arco-design/web-react';
import { IconSearch } from '@arco-design/web-react/icon';

import PageModal from './pageModal.js';
import SearchForm from './searchForm.js';

import { RootState } from '@/redux/store';
import {
  fetchUnderContractVol,
  fetchUnderChildContractVol,
  SearchParams,
  clearStore
} from '@/redux/reducer/umbrella/contractVol';


const ContractVol = () => {
  const [searchParams, setSearchParams] = useState({ searchValues: {}, pageNo: 1 } as SearchParams);
  const [pagePageNo, setPagePageNo] = useState(1);
  const [pageVisible, setPageVisible] = useState(false);
  const [pageId, setPageId] = useState('');

  const dispatch = useDispatch()
  const {
    pageSize,
    total,
    data,
    loading,
    pageTotal,
    pageList,
    pageLoading,
    hasChild,
  } = useSelector(
    (state: RootState) => state.umbrellaContractVolSlice,
  );

  useEffect(() => {
    return function cleanup() {
      dispatch(clearStore())
    };
  }, []);

  useEffect(() => {
    getUserList();
  }, [searchParams]);

  useEffect(() => {
    if (pageId) {
      handleSearchPage();
    }
  }, [pageId, pagePageNo]);

  useEffect(() => {
    if (hasChild) setPageVisible(true);
  }, [hasChild])
  
  const getUserList = () => {
    const params = {
      ...searchParams,
      pageSize,
    }
    dispatch(fetchUnderContractVol(params))
  }

  const handleSearch = (values: SearchParams) => {
    setSearchParams({
      pageNo: 1,
      ...values,
    })
  }

  const handleSearchPage = async () => {
    const params = {
      childId: pageId,
      pageNo: pagePageNo,
      pageSize,
    }
    dispatch(fetchUnderChildContractVol(params));
  }

  const handleOpenPage = (id: string) => {
    setPageId(id);
  }

  const handleClosePage = () => {
    setPageVisible(false);
    setPageId('');
    setPagePageNo(1);
  }

  const handleChangePage = (page:number) => {
    setSearchParams({
      ...searchParams,
      pageNo: page,
    })
  }

  const changedPagePage = (page:number) => {
    setPagePageNo(page);
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
      title: '当周交易额',
      dataIndex: 'wtradeVol',
    },
    {
      title: '昨日交易额',
      dataIndex: 'ytradeVol',
    },
    {
      title: '下级用户',
      dataIndex: 'userId',
      align: 'right' as const,
      render: (rol:string) => (
        <Space size="small">
          <Button
            shape='round' type='outline' icon={<IconSearch />}
            onClick={() => handleOpenPage(rol)}
          />
        </Space>
      )
    }
  ]

  return (
    <div className="umbrella_userList">
      <SearchForm onSearch={handleSearch} />
      <div className="pageContent">
        <Spin dot loading={loading}>
          <Table
            data={data}
            columns={TableColumns}
            pagination={{
              current: searchParams.pageNo,
              pageSize,
              total,
              hideOnSinglePage: true,
              onChange: (page) => handleChangePage(page)
            }}
          />
        </Spin>
      </div>
      <PageModal
        dataSource={pageList}
        visible={pageVisible}
        loading={pageLoading}
        pageNo={pagePageNo}
        total={pageTotal}
        onClose={() => handleClosePage()}
        changePage={(page: number) => changedPagePage(page)}
      />
    </div>
  )
}


export default ContractVol;
