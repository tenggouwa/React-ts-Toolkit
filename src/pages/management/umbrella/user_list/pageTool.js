import React from 'react';
import { Button, Typography } from '@arco-design/web-react';
import { IconLeft } from '@arco-design/web-react/icon';

const PageTool = ({ handleBack, userId='--' }) => {
  return <div className='pageTool'>
    <Button type='primary' onClick={() => handleBack()}><IconLeft />返回</Button>
    <Typography.Title heading={6} style={{ display: 'inline-block', marginLeft: '20px', marginTop: '0' }}>
      当前查询UID: {userId}
    </Typography.Title>
  </div>
}

export default PageTool;