import React from 'react'
import { Modal, Spin, Table } from '@arco-design/web-react';

const PageModal = ({ visible, onClose, dataSource, loading, pageNo, total, changePage }) => {
  const VOL_COLUMN = [
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
  ]

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
            columns={VOL_COLUMN}
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
