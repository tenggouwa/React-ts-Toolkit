import React from 'react';
import { Button } from '@arco-design/web-react';
import { IconPlus } from '@arco-design/web-react/icon';

const PageTool = ({ handleOpenDialog }) => {
  return <div className='pageTool'>
    <Button type='primary' onClick={() => handleOpenDialog()}><IconPlus />添加合伙人</Button>
  </div>
}

export default PageTool;