import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Button, Table, Space, Spin, Typography, Descriptions } from '@arco-design/web-react';
import { IconSearch, IconMore } from '@arco-design/web-react/icon';

import { formData } from '@/assets/js/common.js';
import PageModal from './pageModal.js';
import SearchForm from './searchForm.js';
import PageTool from './pageTool.js';
import './index.scss';

import { RootState } from '@/redux/store';
import {
  fetchUnderList,
  fetchUnderChildList,
  SearchParams,
  clearStore,
  fetchUnderChildInfo
} from '@/redux/reducer/umbrella/userList';


const UserList = () => {
  const [searchParams, setSearchParams] = useState({ searchValues: {}, pageNo: 1 } as SearchParams);
  const [pagePageNo, setPagePageNo] = useState(1);
  const [pageVisible, setPageVisible] = useState(false);
  const [pageId, setPageId] = useState('');
  const [userId, setUserId] = useState('');
  

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
    childInfo,
    childInfoList,
  } = useSelector(
    (state: RootState) => state.umbrellaUserSlice,
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
    if (pageId) handleSearchPage();
  }, [pageId, pagePageNo]);

  useEffect(() => {
    if (hasChild) setPageVisible(true);
  }, [hasChild])
  
  const getUserList = () => {
    const params = {
      ...searchParams,
      pageSize,
    }
    dispatch(fetchUnderList(params))
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
    dispatch(fetchUnderChildList(params));
  }

  const handleOpenPage = (id: string) => {
    setPageId(id);
  }

  const handleClosePage = () => {
    setPageVisible(false);
    setPageId('');
    setPagePageNo(1);
  }

  const handleChangePage = (page: number) => {
    setSearchParams({
      ...searchParams,
      pageNo: page,
    })
  }

  const changedPagePage = (page: number) => {
    setPagePageNo(page);
  }

  const handleOpenUserPage = (id: string) => {
    setUserId(id);
    dispatch(fetchUnderChildInfo(id))
  }

  const handleBack = () => {
    setUserId('');
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
      title: '邀请码',
      dataIndex: 'inviteCode',
      render: (rol: string) => (
        <Typography>
          <Typography.Paragraph copyable>
            {rol}
          </Typography.Paragraph>
        </Typography>)
    },
    {
      title: '创建时间',
      dataIndex: 'gmtCreate',
      render: (rol: string) => formData(rol)
    },
    {
      title: '下级用户',
      dataIndex: 'userId',
      align: 'center' as const,
      render: (rol: string) => (
        <Space size="small">
          <Button
            shape='round' type='outline' icon={<IconSearch />}
            onClick={() => handleOpenPage(rol)}
          />
        </Space>
      )
    },
    {
      title: '详情',
      dataIndex: 'userId',
      align: 'right' as const,
      render: (rol: string) => (
        <Space size="small">
          <Button
            shape='round' type='outline' icon={<IconMore />}
            onClick={() => handleOpenUserPage(rol)}
          />
        </Space>
      )
    }
  ];

  const ChildColumns = [
    {
      title: '仓位id',
      dataIndex: 'positionId',
      fixed: 'left' as const,
      width: 80,
    },
    {
      title: '合约名称',
      dataIndex: 'contractName',
      fixed: 'left' as const,
      width: 120,
    },
    {
      title: '方向',
      dataIndex: 'positionType',
      fixed: 'left' as const,
      width: 80,
    },
    {
      title: '持仓数量',
      dataIndex: 'amount',
    },
    {
      title: '可平数量',
      dataIndex: 'canCloseAmount',
    },
    {
      title: '开仓均价',
      dataIndex: 'averagePrice',
    },
    {
      title: '杠杆',
      dataIndex: 'level',
    },
    {
      title: '未结盈亏',
      dataIndex: 'applies',
    },
    {
      title: '未结盈亏收益率',
      dataIndex: 'appliesEarnRate',
    },
    {
      title: '保证金需求',
      dataIndex: 'margin',
    },
    {
      title: '收益率',
      dataIndex: 'earningRate',
    },
    {
      title: '当前价值',
      dataIndex: 'currentPrice',
    },
    {
      title: '开仓金额',
      dataIndex: 'openPositionPrice',
    },
    {
      title: '强平价',
      dataIndex: 'constraintPrice',
    },
  ];

  return (
    <div className='umbrella_userList'>
      {
        childInfo && childInfo.length > 0 && userId ? (
          <div>
            <PageTool handleBack={handleBack} userId={userId} />
            <div className="pageContent">
              <Descriptions
                colon=':&nbsp;&nbsp;'
                // column={4}
                // labelStyle={{ textAlign: 'right' }}
                layout='inline-horizontal'
                // layout='inline-vertical'
                title=''
                size='large'
                data={childInfo}
              />
            </div>
            <div className="pageContent">
              <Table
                data={childInfoList}
                scroll={{ x: 1800}}
                columns={ChildColumns}
                pagination={false}
              />
            </div>
          </div>
        ) : (
          <div>
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
              openUserInfo={handleOpenUserPage}
              changePage={(page: number) => changedPagePage(page)}
            />
          </div>
        )
      }
    </div>
  )
}


export default UserList