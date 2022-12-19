import React from 'react';
import { Route, Switch, useLocation } from 'react-router-dom';
// import loadableRouter from '@/components/loadableRouter';
import { filterRouter } from '@/assets/js/common';
import Login from '@/pages/login';
import Main from '@/pages/main';
import Pass from '@/pages/pass';
import './index.scss';

const Routers = () => {
  const { pathname } = useLocation();
  return (
    <main className={`${!filterRouter(pathname) && 'innerRouter'}`}>
      <Switch>
        <Route path="/user" exact component={Login} />
        <Route path="/pass" component={Pass} />
        <Route path="/" component={Main} />
      </Switch>
    </main>
  )
};

export default Routers;