import React from 'react'
import { Result, Button } from '@arco-design/web-react';
import { useHistory } from 'react-router-dom';


const PageError = () => {
  const history = useHistory();
  return (
    <Result
      status='404'
      subTitle='当前页面404了, 请联系开发人员, 或者稍后重试。'
      extra={[
        <Button key='back' type='primary' onClick={() => history.push('/user')}>回到登录</Button>,
      ]}
    >
    </Result>
  )
}

export default PageError