// 库引入
import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import classNames from 'classnames';
import { Layout, Icon } from 'antd';
import loadable from 'react-loadable';
import { action, observable, computed } from 'mobx';
import { Switch, Route } from 'react-router-dom';

//组件引入
import { Logo } from '../../components/Logo';
import { PageToolBar } from '../../components/PageToolBar';
import { AddModelButton } from '../../components/AddModelButton';
import { InjectDocumentTitle as DocumentTitle } from '../../components/DocumentTitle';
import { SideMenu } from '../../components/SideMenu';
import { LoadableSpin } from '../../components/LoadableSpin';

// utils 引入
import { trimPathSpritCharsEndInProps } from '../../utils/trimSpritCharsEnd';

// consts引入
import { adminSideMenuDataSource } from '../../constants/adminSideMenuDataSource';

// 样式引入
import styles from './style.module.less';

// 一些值
const { Header, Sider, Content, Footer } = Layout;

// 子页面
// 数据管理-admin页
const PageDataManagement = loadable({
  loader: () => import('../DataManagement').then(({ InjectDataManagement: DataManagement }) => DataManagement),
  loading: LoadableSpin
});

// 任务管理-admin页
const PageTaskManagement = loadable({
  loader: () => import('../TaskManagement').then(({ InjectTaskManagement: TaskManagement }) => TaskManagement),
  loading: LoadableSpin
});

// 模型管理-模型配置页
const PageModelConfig = loadable({
  loader: () => import('../ModelManagement/ModelConfig').then(({ InjectModelConfig: ModelConfig }) => ModelConfig),
  loading: LoadableSpin
});

// 模型管理-模型训练页
const PageModelTrain = loadable({
  loader: () => import('../ModelManagement/ModelTrain').then(({ InjectModelTrain: ModelTrain }) => ModelTrain),
  loading: LoadableSpin
});

// 模型管理-模型验证页
const PageModelVerification = loadable({
  loader: () => import('../ModelManagement/ModelVerification').then(({ InjectModelVerification: ModelVerification }) => ModelVerification),
  loading: LoadableSpin
});

// 模型管理-模型发布页
const PageModelRelease = loadable({
  loader: () => import('../ModelManagement/ModelRelease').then(({ InjectModelRelease: ModelRelease }) => ModelRelease),
  loading: LoadableSpin
});

// 系统管理-构件管理页
const PageComponentManagement = loadable({
  loader: () => import('../SystemManagement/ComponentManagement').then(({ InjectComponentManagement: ComponentManagement }) => ComponentManagement),
  loading: LoadableSpin
});

// 系统管理-图标管理页
const PageIconManagement = loadable({
  loader: () => import('../SystemManagement/IconManagement').then(({ InjectIconManagement: IconManagement }) => IconManagement),
  loading: LoadableSpin
});

// processEditor页面
const PageProcessEditor = loadable({
  loader: () => import('../../pages/ProcessEditor').then(({ InjectProcessEditor: ProcessEditor }) => ProcessEditor),
  loading: LoadableSpin
});

@observer
class Admin extends Component {
  // 指示左侧导航是否关闭
  @observable siderCollapsed = false;

  // 当前matchPath,去掉结尾的/
  @computed get matchPath() {
    return trimPathSpritCharsEndInProps(this.props);
  }
  // 创建子路由的path
  @action createPath = (path) => {
    return `${this.matchPath}${path}`;
  }
  // 切换左侧导航的展开状态
  @action toggleSiderCollapsed = () => {
    this.siderCollapsed = !this.siderCollapsed;
  }
  render() {
    return (
      <div className={ classNames(styles.admin, this.props.className) }>
        <Layout className={ classNames('height100') }>
          <Sider
            style={{minHeight:'100vh'}}
            className={ classNames(styles.side) }
            breakpoint="lg"
            collapsedWidth="0"
            trigger={ null }
            collapsible
            collapsed={ this.siderCollapsed }
          >
            <SideMenu dataSource={ adminSideMenuDataSource } />
          </Sider>
          <Layout>
            <Header className={ classNames(styles.header) }>
              <Icon
                className={ classNames(styles.siderCollapsedTrigger) }
                type={ this.siderCollapsed ? 'menu-unfold' : 'menu-fold' }
                onClick={ this.toggleSiderCollapsed }
              />
              <Logo className={ classNames(styles.logo) } />
              <AddModelButton />
              <PageToolBar />
            </Header>
            <Content style={ { padding: 24 } }>
            {/* <Card><Button>新增按钮</Button></Card> */}
              <Switch>
                <Route exact path={ ('/admin') } component={null} />
                <Route path={ this.createPath('/index') } component={null} />
                <Route path={ this.createPath('/data-management') } component={ PageDataManagement } />
                <Route path={ this.createPath('/task-management') } component={ PageTaskManagement } />
                <Route path={ this.createPath('/model-management/train') } component={ PageModelTrain } />
                <Route exact path={ this.createPath('/model-management/config') } component={ PageModelConfig } />
                <Route path={ this.createPath('/model-management/config/editor')} component={ PageProcessEditor } />
                <Route path={ this.createPath('/model-management/verification') } component={ PageModelVerification } />
                <Route path={ this.createPath('/model-management/release') } component={ PageModelRelease } />
                <Route path={ this.createPath('/system-management/component')} component={ PageComponentManagement } />
                <Route path={ this.createPath('/system-management/icon')} component={ PageIconManagement } />
              </Switch>
            </Content>
            <Footer>
              footer
            </Footer>
          </Layout>
        </Layout>
        <DocumentTitle documentTitle="核格人工智能平台" />
      </div>
    );
  }
}

Admin.defaultProps = {

};

const InjectAdmin = inject()(Admin);

export {
  Admin,
  InjectAdmin
};