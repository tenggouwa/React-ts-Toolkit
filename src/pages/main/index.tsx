import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux';
import { Switch, Route, Redirect, useHistory, useLocation } from 'react-router-dom';
import { Layout, Menu, Message, Typography } from '@arco-design/web-react';
import { IconCalendar } from '@arco-design/web-react/icon';

import { RootState } from '@/redux/store';
import CommonHeader from '@/components/commonHeader';
import PageError from '@/pages/error';
import { ROUTE_LIST } from '@/router/menuList.js';
import { filterAuthByPath, filterOpenByAuth, filterComponentByAuth, changeColon2Slash } from '@/assets/js/menu.js';
import './index.scss'


const MenuItem = Menu.Item;
const SubMenu = Menu.SubMenu;
const { Sider, Content } = Layout;

const BaseMenu = () => {
  const history = useHistory();
  const location = useLocation();
  const { menuInfo } = useSelector(
    (state: RootState) => state.appSlice,
  );

  const [openedMenu, setOpenedMenu] = useState([]); // 展开的 数组
  const [selectedMenu, setSelectedMenu] = useState(''); // 当前

  useEffect(() => {
    if (menuInfo && menuInfo.length > 0) {
      const newVal = filterAuthByPath(menuInfo, location.pathname);
      setSelectedMenu(newVal);
      setOpenedMenu(filterOpenByAuth(menuInfo, newVal, 'authority'));
    }
  }, [location, menuInfo])

  if (!menuInfo || menuInfo.length === 0) return null;

  const recursionFun = (list:any) => {
    return list.map((item:any) => {
      if (item.children && item.children.length > 0) {
        return (
          <SubMenu
            key={item.authority}
            title={
              <span>
                <IconCalendar />
                {item.name}
              </span>
            }>
              {recursionFun(item.children)}
          </SubMenu>
        )
      }
      return(
        <MenuItem key={item.authority} onClick={() => history.push(`/${changeColon2Slash(item.authority)}`)}>
          <IconCalendar />
          {item.name}
        </MenuItem>
      )
    })
  }

  return <Menu
    openKeys={[...openedMenu]}
    selectedKeys={[selectedMenu]}
    onClickSubMenu={(key, event) => {
      setOpenedMenu(event);
    }}
    onClickMenuItem={(key, openKeys, keyPath) => {
      setSelectedMenu(key);
      keyPath.shift();
      setOpenedMenu(keyPath);
    }}
    accordion
    theme='dark'
    style={{ width: '100%' }}
  >
    {recursionFun(menuInfo)}
  </Menu>;
}

const BaseRouter = () => {
  const history = useHistory();
  const location = useLocation();
  const { menuInfo } = useSelector(
    (state: RootState) => state.appSlice,
  );
  let Arr:any = [];

  const recursionFun = (list:any) => {
    return list.forEach((item:any) => {
      const itemObj = Object.assign({}, item)
      if (itemObj.children && itemObj.children.length > 0) {
        recursionFun(itemObj.children)
      } else {
        if (itemObj.type === 1) {
          itemObj.component = filterComponentByAuth(ROUTE_LIST, itemObj.authority);
          Arr.push(itemObj)
        }
      }
    })
  }
  recursionFun(menuInfo);

  let firstRoute = '/umbrella';
  if (Arr && Arr.length > 0) {
    firstRoute = changeColon2Slash(Arr[0].authority);
  }

  useEffect(() => {
    if (menuInfo && menuInfo.length > 0) {
      if (location.pathname === '/') {
        history.push(`/${firstRoute}`)
      }
    }
  }, [location, menuInfo])

  if (!menuInfo || menuInfo.length <= 0) return null;

  return (
    <Switch>
      {
        Arr.map((item:any) => {
          if (item.component) return (
            <Route key={item.authority} path={`/${changeColon2Slash(item.authority)}`} component={item.component} />
          )
        })
      }
      <Route path="*"><PageError /></Route>
      <Redirect exact to="/" />
    </Switch>
  )
}

const Home = () => {
  const [collapsed, setCollapsed] = useState(false); // 展开的 数组

  const handleCollapse = (collapsed:boolean) => {
    // const content = type === 'responsive' ? '触发响应式收缩' : '点击触发收缩';
    // Message.info({
    //   content,
    //   duration: 2000,
    // });
    setCollapsed(collapsed)
  };
  
  return (
    <Layout className='layout-collapse-demo' hasSider>
      <Sider
        theme='dark'
        breakpoint='lg'
        onCollapse={(collapsed) => handleCollapse(collapsed)}
        collapsed={collapsed}
        width={220}
        collapsible
      >
        <div className='logo'>
          <Typography.Title ellipsis heading={5} style={{ color: '#fff' }}>
            合伙人管理系统
          </Typography.Title>
        </div>
        <BaseMenu/>
      </Sider>
      <Layout>
        <CommonHeader />
        <Layout style={{ padding: '20px 24px' }}>
          <Content>
            <BaseRouter />
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
}

export default Home;
