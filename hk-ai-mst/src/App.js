// 库引入
import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { Switch, BrowserRouter as Router, Route, Redirect } from 'react-router-dom';
import loadable from 'react-loadable';
import { BackTop } from 'antd';
// 组件引入
import { LoadableSpin } from './components/LoadableSpin';
import { SpinModal } from './components/SpinModal';
import { ScrollToTop } from './components/ScrollToTop';
import { InjectPrivateRoute as PrivateRoute } from './components/PrivateRoute';

// 404页
const PageNotFound = loadable({
  loader: () => import('./pages/NotFound').then(({ PageNotFound }) => PageNotFound),
  loading: LoadableSpin
});

// 登录页面
const PageLogin = loadable({
  loader: () => import('./pages/Login').then(({ InjectLogin: Login }) => Login),
  loading: LoadableSpin
});

// 注册页面
const PageRegister = loadable({
  loader: () => import('./pages/Register').then(({ InjectRegister: Register }) => Register),
  loading: LoadableSpin
});

// 流程编辑页面
const PageProcessEditor = loadable({
  loader: () => import('./pages/ProcessEditor').then(({ InjectProcessEditor: ProcessEditor }) => ProcessEditor),
  loading: LoadableSpin
});

// 训练情况页面
const PageTrainingSituation = loadable({
  loader: () => import('./pages/TrainingSituation').then(({ InjectTrainingSituation: TrainingSituation }) => TrainingSituation),
  loading: LoadableSpin
});

// admin页面
const PageAdmin = loadable({
  loader: () => import('./pages/Admin').then(({ InjectAdmin: Admin }) => Admin),
  loading: LoadableSpin
});


@inject(({ uiStore }) => ({ showModalLoading: uiStore.modalLoading.show }))
@observer
class App extends Component {
  render() {
    return (
      <Router>
        <div className="app height100">
          <Switch>
            <PrivateRoute path="/index" component={ PageProcessEditor } />
            <Route path="/login" component={ PageLogin } />
            <Route path="/register" component={ PageRegister } />
            <Route path="/admin/training-situation" component={ PageTrainingSituation } />
            <Route path="/admin" component={ PageAdmin } />
            <Redirect exact from="/" to="/admin" />
            <Route component={ PageNotFound } />
          </Switch>
          {/* SpinModal在整个应用中仅用渲染一次 */ }
          <SpinModal visible={ this.props.showModalLoading } />
          {/* ScrollToTop在整个应用中仅用渲染一次 */ }
          <ScrollToTop />
          {/* BackTop和ScrollToTop不一样 */ }
          <BackTop style={ {
            right: 10
          } } />
        </div>
      </Router>
    );
  }
}

export default App;
