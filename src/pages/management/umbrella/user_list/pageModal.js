import React from 'react'
import { Modal, Spin, Table, Typography, Space, Button } from '@arco-design/web-react';
import { IconMore } from '@arco-design/web-react/icon';
import { formData } from '@/assets/js/common.js';

const PageModal = ({ visible, onClose, dataSource, loading, pageNo, total, changePage, openUserInfo }) => {
  const USER_COLUMN = [
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
      render: (rol) => (
        <Typography>
          <Typography.Paragraph copyable>
            {rol}
          </Typography.Paragraph>
        </Typography>)
    },
    {
      title: '创建时间',
      dataIndex: 'gmtCreate',
      align: 'right',
      render: (rol) => formData(rol)
    },
    {
      title: '详情',
      dataIndex: 'userId',
      align: 'right',
      render: (rol) => (
        <Space size="small">
          <Button
            shape='round' type='outline' icon={<IconMore />}
            onClick={() => openUserInfo(rol)}
          />
        </Space>
      )
    }
  ];

  return (
    <Modal
        footer={null}
        simple
        closable
        maskClosable={false}
        style={{ width: '900px' }}
        title='下级用户'
        visible={visible}
        onOk={() => onClose()}
        onCancel={() => onClose()}
      >
        <Spin dot loading={loading}>
          <Table
            columns={USER_COLUMN}
            data={dataSource}
            pagination={{
              current: pageNo,
              pageSize: 10,
              total,
              hideOnSinglePage: true,
              onChange: (page) => changePage(page)
            }}
          />
        </Spin>
      </Modal>
  )
}


export default PageModal;
