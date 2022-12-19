import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { Avatar, Space, Dropdown, Menu, Typography, Modal, Button } from '@arco-design/web-react';
import { IconExport, IconPen } from '@arco-design/web-react/icon';

import { RootState } from '@/redux/store';
import { loginOut, clearStore } from '@/redux/reducer/login';
import { clearMenu } from '@/redux/reducer';

import './index.scss';

const { Text } = Typography;

const Header = () => {
  const history = useHistory();
  const dispatch = useDispatch();

  const { userInfo, menuInfo } = useSelector(
    (state: RootState) => state.appSlice,
  );

  const { isLoginOutSuccess } = useSelector(
    (state: RootState) => state.loginSlice,
  );

  useEffect(() => {
    return function cleanup() {
      dispatch(clearStore())
    };
  }, []);
  
  useEffect(() => {
    if (isLoginOutSuccess) {
      dispatch(clearMenu())
    }
  }, [isLoginOutSuccess])

  useEffect(() => {
    const localMenuStr = window.localStorage.getItem('menuInfo');
    const localMenu = JSON.parse(localMenuStr);

    if (!localMenu || localMenu.length === 0) {
      history.push('/user');
    }
  }, [menuInfo])

  const handleLoginOut = () => {
    dispatch(loginOut());
  }

  const dropList = (
    <Menu theme="dark">
      <Menu.Item key='2' onClick={() => history.push('/pass')}><IconPen /> 修改密码</Menu.Item>
      <Menu.Item key='1' onClick={() => handleLoginOut()}><IconExport /> 退出登录</Menu.Item>
    </Menu>
  );

  return (
    <div className="header">
      <Dropdown droplist={dropList} position='bl'>
        <Space size="small" style={{ marginLeft: 'auto', marginRight: '10px', cursor: 'pointer' }}>
          <Avatar style={{ backgroundColor: '#14a9f8' }}>{userInfo.username || '--'}</Avatar>
          <Text style={{ color: '#fff' }}>{userInfo.email || '--'}</Text>
        </Space>
      </Dropdown>
      <Modal
        title='提示'
        visible={userInfo.isDefaultPassword}
        mask
        simple
        autoFocus={false}
        focusLock={true}
        maskClosable={false}
        footer={() => 
          <Button type='primary' onClick={() => history.push('/pass')}>去修改</Button>
        }
      >
        <p>
          由于您现在使用的是系统默认密码，请点击去修改，修改密码.
        </p>
      </Modal>
    </div>
  )
}

export default Header;
