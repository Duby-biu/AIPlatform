// 库引入
import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import classNames from 'classnames';
import { Col, Row } from 'antd';
import { action, observable, computed, toJS } from 'mobx';
import axios from 'axios';
import fp from 'lodash/fp';

// 组件引入
import { DocumentTitle } from '../../components/DocumentTitle';
import { ScoresCard } from './components/ScoresCard';
import { ModelAndTrainingDetailsCard } from './components/ModelAndTrainingDetailsCard';
import { UpdateRatiosCard } from './components/UpdateRatiosCard';
import { StandardDeviationCard } from './components/StandardDeviationCard';


// 工具函数引入
import { parseJSON } from '../../utils/parseJSON';

// 样式引入
import styles from './style.module.less';


// 一些值
const { SockJS, Stomp } = window;

/**
 * 概述-训练情况页面
 */
@observer
class TrainingSituationOverview extends Component {
  // 模型和训练详情表格头,不需要响应式
  modelAndTrainingTableColumns = [{
    title: '名称',
    dataIndex: 'name',
    key: 'name',
  }, {
    title: '状态(值)',
    dataIndex: 'value',
    key: 'value',
  }];

  // 存储最新的所有websocket发送过来的数据
  @observable socketData = {};

  // 设置socketData
  @action setSocketData = (data = []) => {
    this.socketData = data;
  }

  // 模型评分与迭代
  @computed get scoresData() {
    return this.socketData.scores;
  }

  // 模型和训练详情
  @computed get modelAndTrainingTableDataSource() {
    // 处理数据格式
    return fp.flowRight(
      fp.map(([name, value]) => ({
        key: name,
        name: name,
        value: value
      })),
      fp.flatten,
      fp.values,
      fp.omitBy(fp.isUndefined),
      fp.pick(['model', 'perf'])
    )(toJS(this.socketData));
  }

  // 更新：参数比率（平均幅度）
  @computed get updateRatiosData() {
    return this.socketData.updateRatios;
  }

  // 标准差
  @computed get standardDeviationData() {
    return fp.flowRight(
      fp.pick(['stdevUpdates', 'stdevGradients', 'stdevActivations'])
    )(toJS(this.socketData));
  }

  // 建立socket链接
  @action socketConnect = () => {
    axios(this.props.socketUrl).then(() => {
      console.info('概述--创建socket链接');
      const header = {
        model_id: (this.props.match.params.id ? this.props.match.params.id : this.props.stompClientConnectHeaders)
      };
      const sendtUrl = this.props.sendtUrl + header.model_id;
      const subscribeOverviewDataUrl = this.props.subscribeOverviewDataUrl + header.model_id;

      //链接Socket
      this.socket = new SockJS(this.props.socketUrl);
      //使用STOMP子协议的WebSocket客户端（以SockJS方式实例化stomp客户端）
      this.stompClient = Stomp.over(this.socket);
      this.stompClient.debug = null;
      //链接WebSocket服务端
      this.stompClient.connect(header, (frame) => {
        console.info('概述--链接成功，发送消息');
        this.stompClient.send(sendtUrl, {}, null);
        this.stompClient.subscribe(subscribeOverviewDataUrl, res => {
          console.info('概述--发送成功，订阅消息');
          console.info(res,parseJSON(res.body));
          this.setSocketData(parseJSON(res.body));
          // this.socket.close();
          // this.stompClient.disconnect();
        });
        
      }, err => { console.log('stompClient发生错误', err); });
    }).catch((error) => {
      console.info(error);
    });
  }

  // 关闭socket链接
  @action socketDisconnect = () => {
    console.info('概述--关闭socket链接');
    if (this.socket) {
      this.socket.close();
    }
    if (this.stompClient) {
      this.stompClient.disconnect();
    }
  }

  componentDidMount() {
    console.info('didmount-概述');
    this.socketConnect();
  }
  componentWillUnmount() {
    this.socketDisconnect();
  }
  render() {
    console.info('render-概述');
    return (
      <div className={classNames(styles.trainingSituationOverview, 'page', this.props.className)}>
        <Row type="flex" gutter={24}>
          <Col className={classNames(styles.Col)} xs={24} lg={16} >
            <ScoresCard chartData={this.scoresData} />
          </Col>
          <Col className={classNames(styles.Col)} xs={24} lg={8} >
            <ModelAndTrainingDetailsCard tableDataSource={this.modelAndTrainingTableDataSource} tableColumns={this.modelAndTrainingTableColumns} />
          </Col>
        </Row>
        <Row type="flex" gutter={24}>
          <Col className={classNames(styles.Col)} xs={24} lg={12} >
            <UpdateRatiosCard chartData={this.updateRatiosData} />
          </Col>
          <Col className={classNames(styles.Col)} xs={24} lg={12} >
            <StandardDeviationCard chartData={this.standardDeviationData} />
          </Col>
        </Row>
        <DocumentTitle documentTitle="概述-训练情况" />
      </div>
    );
  }
}

TrainingSituationOverview.defaultProps = {
  // websocket的地址
  socketUrl: '/hkai-admin/ws/v1.0/monitor/model/connect',
  // 参数（头信息）
  stompClientConnectHeaders: { "model_id": "123456" },
  // 发送消息的地址
  sendtUrl: '/ws/v1.0/monitor/model/message/overview/',
  // 订阅的数据
  subscribeOverviewDataUrl: '/message/overview/',
};

const InjectTrainingSituationOverview = inject()(TrainingSituationOverview);

export {
  TrainingSituationOverview,
  InjectTrainingSituationOverview
};