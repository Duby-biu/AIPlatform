// 库引入
import React, { Component } from 'react';
import { action, observable, computed, toJS } from 'mobx';
import { inject, observer } from 'mobx-react';
import classNames from 'classnames';
import axios from 'axios';
import {
  Card as AntDCard,
  Select as AntDSelect,
  Col as AntDCol,
  Row as AntDRow
} from 'antd';
import fp from 'lodash/fp';

// 组件引入
import { DocumentTitle } from '../../components/DocumentTitle';
import { UseRatioCard } from './components/UseRatioCard';
import { GPUCard } from './components/GPUCard';
import { HardwareInfoCard } from './components/HardwareInfoCard';
import { SoftwareInfoCard } from './components/SoftwareInfoCard';

// 样式引入
import styles from './style.module.less';

// 工具函数引入
import { parseJSON } from '../../utils/parseJSON';

// 一些值
const { SockJS, Stomp } = window;
const AntDOption = AntDSelect.Option;

/**
 * 系统-训练情况页面
 */
@observer
class TrainingSituationSystem extends Component {
  // 硬件信息表格头
  hardwareTableColumns = [{
    title: 'JVM最大内存',
    dataIndex: 'maxMemory',
    key: 'maxMemory',
  }, {
    title: '堆外内存最大内存',
    dataIndex: 'outMaxMemory',
    key: 'outMaxMemory',
  }, {
    title: 'JVM可用处理器',
    dataIndex: 'JVMProcessor',
    key: 'JVMProcessor',
  }, {
    title: '计算机设备的数量',
    dataIndex: 'computerNum',
    key: 'computerNum',
  }];

  // 软件信息表格头
  softwareTableColumns = [{
    title: '操作系统',
    dataIndex: 'os',
    key: 'os',
  }, {
    title: '主机名',
    dataIndex: 'hostname',
    key: 'hostname',
  }, {
    title: '操作系统架构',
    dataIndex: 'osArchitecture',
    key: 'osArchitecture',
  }, {
    title: 'JVM名',
    dataIndex: 'JVMname',
    key: 'JVMname',
  }, {
    title: 'JVM版本',
    dataIndex: 'JVMversion',
    key: 'JVMversion',
  }, {
    title: 'ND4J后端',
    dataIndex: 'ND4JbackED',
    key: 'ND4JbackED',
  }, {
    title: 'ND4J数据类型',
    dataIndex: 'ND4JdataType',
    key: 'ND4JdataType',
  }];

  // 存储最新的所有websocket发送过来的数据
  @observable socketData = {};

  // 设置socketData
  @action setSocketData = (data = []) => {
    this.socketData = data;
  }
  // JVM和堆外内存利用率以及GPU
  @computed get useRatio() {
    return toJS(this.socketData).memory;
  }

  // 是否有GPU
  @computed get gpu() {
    // FIXME:machineID待修改
    const machineID = 0;
    let haveGpu = false;
    if (toJS(this.socketData).memory) {
      const deviceArr = toJS(this.socketData).memory[machineID].isDevice;
      for (var device of deviceArr) {
        if (device) {
          haveGpu = true;
          break;
        }
      }
    }
    return haveGpu;
  }

  // 硬件信息
  @computed get hardwareTableDataSource() {
    const dataSource = [];
    const hardware = fp.flowRight(
      fp.flatten,
      fp.flatten,
      fp.values,
      fp.omitBy(fp.isUndefined),
    )(toJS(this.socketData).hardware);

    if (fp.size(hardware)) {
      const formatData = {
        key: '1',
        maxMemory: hardware[1],
        outMaxMemory: hardware[3],
        JVMProcessor: hardware[5],
        computerNum: hardware[7],
      };
      dataSource.push(formatData);
    }
    console.info('硬件信息', dataSource);
    return dataSource;
  }

  // 软件信息
  @computed get softwareTableDataSource() {
    const dataSource = [];
    const software = fp.flowRight(
      fp.flatten,
      fp.flatten,
      fp.values,
      fp.omitBy(fp.isUndefined),
    )(toJS(this.socketData).software);

    if (fp.size(software)) {
      const formatData = {
        key: '1',
        os: software[1],
        hostname: software[3],
        osArchitecture: software[5],
        JVMname: software[7],
        JVMversion: software[9],
        ND4JbackED: software[11],
        ND4JdataType: software[13],
      };
      dataSource.push(formatData);
    }
    console.info('软件信息', dataSource);
    return dataSource;
  }

  // 建立socket链接
  @action socketConnect = () => {
    axios(this.props.socketUrl).then(() => {
      console.info('系统--创建socket链接',this.props.match.params.id);
      const header = {
        model_id: (this.props.match.params.id ? this.props.match.params.id : this.props.stompClientConnectHeaders)
      };
      const sendtUrl = this.props.sendtUrl + header.model_id;
      const subscribeSystemDataUrl = this.props.subscribeSystemDataUrl + header.model_id;

      this.socket = new SockJS(this.props.socketUrl);
      this.stompClient = Stomp.over(this.socket);
      this.stompClient.debug = null;
      this.stompClient.connect(header, (frame) => {
        console.info('系统--链接成功，发送消息');
        this.stompClient.send(sendtUrl, {}, null);
        this.stompClient.subscribe(subscribeSystemDataUrl, res => {
          console.info('系统--发送成功，订阅消息');
          console.info(res, parseJSON(res.body));
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
    console.info('系统--关闭socket链接');
    if (this.socket) {
      this.socket.close();
    }
    if (this.stompClient) {
      this.stompClient.disconnect();
    }
  }

  @action handleChange = (value) => {
    console.info(value);

  }

  componentDidMount() {
    console.info('didmount-系统');
    this.socketConnect();
  }
  componentWillUnmount() {
    this.socketDisconnect();
  }

  render() {
    console.info('render-系统');
    const serverSelect = (<AntDSelect
      defaultValue="lucy"
      onChange={this.handleChange}>
      <AntDOption value="jack">Jack</AntDOption>
      <AntDOption value="lucy">Lucy</AntDOption>
      <AntDOption value="Yiminghe">yiminghe</AntDOption>
    </AntDSelect>);
    const gpu = this.gpu;
    let col = {
      xs: 24
    };
    let hideOrShow = {
      display: 'none'
    };
    if (gpu) {
      col = {
        xs: 24,
        lg: 12,
      };
      hideOrShow = {
        display: 'block'
      };
    }
    const chartData = this.useRatio;
    return (
      <div className={classNames(styles.trainingSituationSystem, 'page', this.props.className)}>
        <AntDCard
          title={this.props.cardTitle}
          extra={serverSelect}>
          <AntDRow type="flex" gutter={24}>
            <AntDCol className={classNames(styles.col)} {...col} >
              <UseRatioCard chartData={chartData} />
            </AntDCol>
            <AntDCol className={classNames(styles.col)} {...col} style={hideOrShow} >
              <GPUCard chartData={chartData} />
            </AntDCol>
          </AntDRow>
          <HardwareInfoCard tableDataSource={this.hardwareTableDataSource} tableColumns={this.hardwareTableColumns} />
          <SoftwareInfoCard style={{ marginTop: 20 }} tableDataSource={this.softwareTableDataSource} tableColumns={this.softwareTableColumns} />
        </AntDCard>
        <DocumentTitle documentTitle="系统-训练情况" />
      </div>
    );
  }
}

TrainingSituationSystem.defaultProps = {
  cardTitle: '系统信息',
  // websocket的地址
  socketUrl: '/hkai-admin/ws/v1.0/monitor/model/connect',
  // 参数（头信息）
  stompClientConnectHeaders: { "model_id": "123456" },
  // 发送消息的地址
  sendtUrl: '/ws/v1.0/monitor/model/message/system/',
  // 订阅的数据
  subscribeSystemDataUrl: '/message/system/'
};

const InjectTrainingSituationSystem = inject()(TrainingSituationSystem);

export {
  TrainingSituationSystem,
  InjectTrainingSituationSystem
};