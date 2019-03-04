// 库引入
import React, { Component } from 'react';
import { observable, action, computed } from 'mobx';
import { inject, observer } from 'mobx-react';
import classNames from 'classnames';
import axios from 'axios';
import {
  Layout,
  Icon,
  Button as AntDButton,
  message as AntDmessage
} from 'antd';
import loadable from 'react-loadable';
import { Route, Switch } from 'react-router-dom';

// 组件引入
import { Logo } from '../../components/Logo';
import { InjectDocumentTitle as DocumentTitle } from '../../components/DocumentTitle';
import { SideMenu } from '../../components/SideMenu';
import { LoadableSpin } from '../../components/LoadableSpin';

// utils 引入
import { trimPathSpritCharsEndInProps } from '../../utils/trimSpritCharsEnd';
import { parseJSON } from '../../utils/parseJSON';

// consts引入
// import { trainingSituationSideMenuDataSource } from '../../constants/trainingSituationSideMenuDataSource';

// 样式引入
import styles from './style.module.less';

// 数据操作引入
import { stopModel } from '../../api/modelManagement/modelTrain';

// Mobx引入
import { Monitoring } from './MonitoringMobx';

// 一些值
const { SockJS, Stomp } = window;
const { Header, Sider, Content } = Layout;
const monitor = new Monitoring();

// 子页面
// 训练情况-概述页
const PageTrainingSituationOverview = loadable({
  loader: () => import('../TrainingSituationOverview').then(({ InjectTrainingSituationOverview: TrainingSituationOverview }) => TrainingSituationOverview),
  loading: LoadableSpin
});

// 训练情况-模型页
const PageTrainingSituationModel = loadable({
  loader: () => import('../TrainingSituationModel').then(({ InjectTrainingSituationModel: TrainingSituationModel }) => TrainingSituationModel),
  loading: LoadableSpin
});

// 训练情况-概述页
const PageTrainingSituationSystem = loadable({
  loader: () => import('../TrainingSituationSystem').then(({ InjectTrainingSituationSystem: TrainingSituationSystem }) => TrainingSituationSystem),
  loading: LoadableSpin
});

/**
 * 训练情况页面
 */
@observer
class TrainingSituation extends Component {
  // 指示左侧导航是否展开
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

  // 停止训练
  @action doStop = () => {
    const batchId = monitor.batchId;
    stopModel(batchId).then((response) => {
      console.info(response);
      (() => {
        AntDmessage.success(response.msg);
      })();
    }).catch(error => {
      console.info(error);
      (() => {
        AntDmessage.error(error.response.data.msg);
      })();
    });
  }

  // 建立socket链接
  @action socketConnect = () => {
    axios(this.props.socketUrl).then(() => {
      const batchId = monitor.batchId;
      console.info('监控-异常消息', batchId);
      const header = {
        model_id: (batchId ? batchId : this.props.stompClientConnectHeaders)
      };
      const sendtUrl = this.props.sendtUrl + header.model_id;

      this.socket = new SockJS(this.props.socketUrl);
      this.stompClient = Stomp.over(this.socket);
      this.stompClient.debug = null;
      this.stompClient.connect(header, () => {
        console.info('监控--链接成功，发送消息');
        this.stompClient.send(sendtUrl, {}, null);
        console.info('监控--发送成功，订阅消息');
        this.stompClient.subscribe(this.props.subscribeModelhDataUrl, res => {
          console.info(res);
        });
       
      }, err => {
        console.log('stompClient发生错误', err);
      });
    }).catch((error) => {
      console.info(error);
    });
  }

  // 关闭socket链接
  @action socketDisconnect = () => {
    console.info('监控--关闭socket链接');
    if (this.socket) {
      this.socket.close();
    }
    if (this.stompClient) {
      this.stompClient.disconnect();
    }
  }

  // 子页面路由
  @computed get trainingSituationSideMenuDataSource() {
    const batchId = monitor.batchId;
    return [{
      key: '/overview',
      permissionId: '/overview',
      title: '概述',
      to: `/overview/${batchId}`,
      iconType: 'laptop',
      children: undefined
    }, {
      key: '/model',
      permissionId: '/model',
      title: '模型',
      to: `/model/${batchId}`,
      iconType: 'deployment-unit',
      children: undefined
    }, {
      key: '/system',
      permissionId: '/system',
      title: '系统',
      to: `/system/${batchId}`,
      iconType: 'dashboard',
      children: undefined
    }];
  }

  componentWillMount() {
    console.info('will');
    const url = this.props.location.pathname;
    const batchId = url.substr(url.lastIndexOf('/') + 1);
    monitor.setBatchId(batchId);
  }
  componentDidMount() {
    this.socketConnect();
  }
  componentWillUnmount() {
    console.info('xiezai');
    this.socketDisconnect();
  }

  render() {
    console.info('render-监控');
    return (
      <div className={classNames(styles.trainingSituation, 'page', this.props.className)}>
        <Layout className={classNames(styles.outerLayout)}>
          <Sider
            className={classNames(styles.sider)}
            breakpoint="lg"
            collapsedWidth="0"
            trigger={null}
            collapsible
            collapsed={this.siderCollapsed}
          >
            <SideMenu dataSource={this.trainingSituationSideMenuDataSource} defaultSelectedKeys={['/overview']}/>
          </Sider>
          <Layout>
            <Header className={classNames(styles.header)}>
              <Icon
                className={classNames(styles.siderCollapsedTrigger)}
                type={this.siderCollapsed ? 'menu-unfold' : 'menu-fold'}
                onClick={this.toggleSiderCollapsed}
              />
              <Logo className={classNames(styles.logo)} />
              <AntDButton
                type='primary'
                onClick={this.doStop}
              >
                停止训练
              </AntDButton>
            </Header>
            <Content style={{ padding: 24 }}>
              <Switch>
                <Route path={this.createPath('/overview') + '/:id'} component={PageTrainingSituationOverview} />
                <Route path={this.createPath('/model') + '/:id'} component={PageTrainingSituationModel} />
                <Route path={this.createPath('/system') + '/:id'} component={PageTrainingSituationSystem} />
              </Switch>
            </Content>
          </Layout>
        </Layout>
        <DocumentTitle documentTitle="训练情况-核格人工智能平台" />
      </div>
    );
  }
}

TrainingSituation.defaultProps = {
  // websocket的地址
  socketUrl: '/hkai-admin/ws/v1.0/monitor/model/connect',
  // 参数（头信息）
  stompClientConnectHeaders: { "model_id": "123456" },
  // 发送消息的地址
  sendtUrl: '/ws/v1.0/monitor/model/message/overview/',
  // 订阅的数据
  subscribeModelhDataUrl: '/user/message/exception',
};

const InjectTrainingSituation = inject()(TrainingSituation);

export {
  TrainingSituation,
  InjectTrainingSituation
};