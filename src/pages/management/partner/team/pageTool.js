import React from 'react';
import { Button } from '@arco-design/web-react';
import { IconPlus } from '@arco-design/web-react/icon';

const PageTool = ({ handleOpenDialog }) => {
  return <div className='pageTool'>
    <Button type='primary' onClick={() => handleOpenDialog()}><IconPlus />添加团队</Button>
  </div>
}

export default PageTool;