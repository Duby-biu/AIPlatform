// 库引入
import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { action, observable } from 'mobx';
import classNames from 'classnames';
import axios from 'axios';
import {
  Row as AntDRow,
  Col as AntDCol
} from 'antd';

// 组件引入
import { DocumentTitle } from '../../components/DocumentTitle';
import { LayersCard } from './components/LayersCard';
import { LayerDetailsCard } from './components/LayerDetailsCard';

// 样式引入
import styles from './style.module.less';

// 工具函数引入
import { parseJSON } from '../../utils/parseJSON';

// 一些值
const { SockJS, Stomp } = window;
/**
 * 模型-训练情况页面
 */
@observer
class TrainingSituationModel extends Component {
  // 存储最新的所有websocket发送过来的数据
  @observable socketData = {};
  // 存储最新的所有websocket发送过来的具体层数据
  @observable socketDataById = {};
  // 点击的层级id
  @observable layerId = null;
  // 简介
  @observable introduceStyle = {
    display: 'block'
  };
  // 详情
  @observable layerDetailsStyle = {
    display: 'none'
  };

  // 设置socketData
  @action setSocketData = (data = []) => {
    this.socketData = data;
  }

  // 设置具体层socketData
  @action setSocketDataById = (data = []) => {
    this.socketDataById = data;
  }

  // 设置layerId、改变图表显隐、断开链接并且创建新链接
  @action setLayerId = (value) => {
    if (this.layerId !== value) {
      this.layerId = value;
      console.info('layid', value);
      this.layerDetailsStyle = {
        display: 'block'
      };
      this.introduceStyle = {
        display: 'none'
      };
      this.socketDisconnectById(value);
      this.socketConnectById(value);
    }
  }
  
  // 建立socket链接
  @action socketConnect = () => {
    axios(this.props.socketUrl).then(() => {
      console.info('模型--创建socket链接');
      const header = {
        model_id: (this.props.match.params.id ? this.props.match.params.id : this.props.stompClientConnectHeaders)
      };
      console.info(header);
      const sendtUrl = this.props.sendtUrl + header.model_id;
      const subscribeModelhDataUrl = this.props.subscribeModelhDataUrl + header.model_id;

      this.socket = new SockJS(this.props.socketUrl);
      this.stompClient = Stomp.over(this.socket);
      this.stompClient.debug = null;
      this.stompClient.connect(header, () => {
        console.info('模型--链接成功，发送消息');
        this.stompClient.send(sendtUrl, {}, null);
        this.stompClient.subscribe(subscribeModelhDataUrl, res => {
          console.info('模型--发送成功，订阅消息');
          console.info(res, parseJSON(res.body));
          this.setSocketData(parseJSON(res.body));
          this.socket.close();
          this.stompClient.disconnect();
        });
      }, err => { console.log('stompClient发生错误', err); });
    }).catch((error) => {
      console.info(error);
    });
  }

  // 关闭socket链接
  @action socketDisconnect = () => {
    console.info('模型--关闭socket链接');
    if (this.socket) {
      this.socket.close();
    }
    if (this.stompClient) {
      this.stompClient.disconnect();
    }
  }


  // 建立层socket链接
  @action socketConnectById = (id) => {
    axios(this.props.socketUrl).then(() => {
      console.info('层',id,'--创建socket链接');
      const header = {
        model_id: (this.props.match.params.id ? this.props.match.params.id : this.props.stompClientConnectHeaders)
      };
      const sendtUrlById = this.props.sendtUrlById + header.model_id + '/' + id;
      const subscribeModelDataUrlById = this.props.subscribeModelDataUrlById + header.model_id + '/' + id;

      this.socketById = new SockJS(this.props.socketUrl);
      this.stompClientById = Stomp.over(this.socketById);
      this.stompClientById.debug = null;
      this.stompClientById.connect(header, () => {
        console.info('层',id,'--链接成功，发送消息');
        this.stompClientById.send(sendtUrlById, {}, null);
        this.stompClientById.subscribe(subscribeModelDataUrlById, res => {
          console.info('层',id,'--发送成功，订阅消息');
          console.info(res, parseJSON(res.body));
          this.setSocketDataById(parseJSON(res.body));
          this.socketById.close();
          this.stompClientById.disconnect();
        });
      }, err => { console.log('stompClient发生错误', err); });
    }).catch((error) => {
      console.info(error);
    });
  }

  // 关闭层socket链接
  @action socketDisconnectById = () => {
    if (this.socketById) {
      console.info('层--关闭socket链接');
      this.socketById.close();
    }
    if (this.stompClientById) {
      this.stompClientById.disconnect();
    }
  }

  componentDidMount() {
    console.info('didmount-模型');
    this.socketConnect();
  }
  componentWillUnmount() {
    this.socketDisconnect();
    this.socketDisconnectById();
  }

  render() {
    console.info('render-模型');
    return (
      <div className={classNames(styles.trainingSituationModel, 'page', this.props.className)}>
        <AntDRow type="flex" gutter={24}>
          <AntDCol className={classNames(styles.col)} xs={24} lg={8} >
            <LayersCard
              graphData={this.socketData}
              style={{ height: 600 }}
              setLayerId={this.setLayerId}
            />
          </AntDCol>
          <AntDCol xs={24} lg={16} >
            <LayerDetailsCard
              datas={this.socketDataById}
              layerDetailsStyle={this.layerDetailsStyle}
              introduceStyle={this.introduceStyle}
            />
          </AntDCol>
        </AntDRow>
        <DocumentTitle documentTitle="模型-训练情况" />
      </div>
    );
  }
}

TrainingSituationModel.defaultProps = {
  // websocket的地址
  socketUrl: '/hkai-admin/ws/v1.0/monitor/model/connect',
  // 参数（头信息）
  stompClientConnectHeaders: { "model_id": "123456" },
  // 发送消息的地址
  sendtUrl: '/ws/v1.0/monitor/model/message/model/graph/',
  // 订阅的数据
  subscribeModelhDataUrl: '/message/model/graph/',
  // 通过层id订阅的数据
  subscribeModelDataUrlById: '/message/model/data/',
  // 通过层id发送消息的地址
  sendtUrlById: '/ws/v1.0/monitor/model/message/model/data/',
};

const InjectTrainingSituationModel = inject()(TrainingSituationModel);

export {
  TrainingSituationModel,
  InjectTrainingSituationModel
};