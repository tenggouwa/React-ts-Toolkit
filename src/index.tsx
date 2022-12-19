import React from 'react';
import ReactDOM from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import { HashRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from '@/redux/store';
import Routers from './router';
import CommonHook from '@/components/commonHook';

import './styles/index.scss';

/*初始化*/
renderWithHotReload(Routers);

/*热更新*/
if (module.hot) {
  module.hot.accept("./router/index.tsx", () => {
    // const Router = require("./router/index.tsx").default;
    renderWithHotReload(Routers);
  });
}

function renderWithHotReload(Routers: any) {
  ReactDOM.render(
    <AppContainer>
      <Provider store={store}>
        <Router>
          <CommonHook />
          <Routers />
        </Router>
      </Provider>
    </AppContainer>,
    document.getElementById("app")
  );
}