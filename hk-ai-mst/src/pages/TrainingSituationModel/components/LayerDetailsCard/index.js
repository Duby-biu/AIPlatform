// 库引入
import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import classNames from 'classnames';
import { toJS, computed, action, observable } from 'mobx';
import {
  Card as AntDCard
} from 'antd';
import fp from 'lodash/fp';

// 样式引入
import styles from './style.module.less';

// 组件引入
import { LayerTable } from './components/LayerTable';
import { MeanMagChart } from './components/MeanMagChart';
import { ActivationChart } from './components/ActivationChart';
import { ParamHistChart } from './components/ParamHistChart';
import { UpdateHistChart } from './components/UpdateHistChart';
import { LearningRatesChart } from './components/LearningRatesChart';

const AntDCardGrid = AntDCard.Grid;
const meanMagTabList = [{
  key: 'updates',
  tab: 'Updates',
}, {
  key: 'param',
  tab: 'Param',
}, {
  key: 'ratio',
  tab: 'Ratio',
}];
const paramHistTabList = [{
  key: 'b',
  tab: 'b',
}, {
  key: 'W',
  tab: 'W',
}];
const layerTableColumns = [{
  title: '名称',
  dataIndex: 'name',
  key: 'name',
}, {
  title: '值',
  dataIndex: 'value',
  key: 'value',
}];
@observer
class LayerDetailsCard extends Component {
  @observable meanMagChartData = null;
  @observable paramHistChartData = null;
  @observable updateHistChartData = null;

  // 层信息 表
  @computed get layerTableDataSource() {
    return fp.flowRight(
      fp.map(([name, value]) => ({
        key: name,
        name: name,
        value: value
      })),
      fp.flatten,
      fp.values,
      fp.omitBy(fp.isUndefined),
      fp.pick(['layerInfo'])
    )(toJS(this.props.datas));
  }

  // 更新：参数比率 图
  @action handleMeanMagTabChange = (key) => {
    const data = toJS(this.props.datas);
    console.info('key', key);
    if (key === 'updates') {
      this.meanMagChartData = data.meanMag.updateMM;
    } else if (key === 'param') {
      this.meanMagChartData = data.meanMag.paramMM;
    } else if (key === 'ratio') {
      this.meanMagChartData = {
        type: 'log',
        ...data.meanMag.ratios
      };
    }
  }
  @computed get getUpdateData() {
    const data = toJS(this.props.datas);
    if (data.meanMag) {
      return data.meanMag.updateMM;
    }
    return null;
  }
  @computed get iterCounts() {
    const data = toJS(this.props.datas);
    if (data.meanMag) {
      return data.meanMag.iterCounts;
    } else {
      return null;
    }
  }

  // 激活 图
  @computed get activationChartData() {
    return toJS(this.props.datas).activations;
  }

  // 层参量直方 图
  @action handleParamHistTabChange = (key) => {
    const data = toJS(this.props.datas);
    console.info('key', key);
    this.paramHistChartData = data.paramHist[key];
  }
  @computed get getParamBData() {
    const data = toJS(this.props.datas);
    if (data.paramHist) {
      return data.paramHist.b;
    }
    return null;
  }

  // 层更新直方 图
  @action handleUpdateHistTabChange = (key) => {
    const data = toJS(this.props.datas);
    console.info('key', key);
    this.updateHistChartData = data.updateHist[key];
  }
  @computed get getUpdateBData() {
    const data = toJS(this.props.datas);
    if (data.updateHist) {
      return data.updateHist.b;
    }
    return null;
  }

  // 学习比率 图
  @computed get learningRateChartData() {
    return toJS(this.props.datas).learningRates;
  }
  

  render() {
    console.info('render-层详情');
    return (
      <div className={(this.props.className)} style={this.props.style}>
        <div className={classNames(styles.layerIntroduceCard)} style={toJS(this.props.introduceStyle)} >
          <AntDCard title={this.props.cardTitle0}>
            <AntDCardGrid className={classNames(styles.introduceTitle)}>图层可视化UI</AntDCardGrid>
            <AntDCardGrid className={classNames(styles.introduceContent)}>Content</AntDCardGrid>
          </AntDCard>
        </div>
        <div className={classNames(styles.layerDetailsCard)} style={toJS(this.props.layerDetailsStyle)} >
          <AntDCard title={this.props.cardTitle1}>
            <LayerTable dataSource={this.layerTableDataSource} columns={layerTableColumns} />
          </AntDCard>

          <AntDCard
          title={this.props.cardTitle2}
          tabList={meanMagTabList}
          onTabChange={this.handleMeanMagTabChange}>
            <MeanMagChart data={this.meanMagChartData || this.getUpdateData} iterCounts={this.iterCounts} />
          </AntDCard>

          <AntDCard title={this.props.cardTitle3}>
            <ActivationChart data={this.activationChartData} />
          </AntDCard>

          <AntDCard
          title={this.props.cardTitle4}
          tabList={paramHistTabList}
          onTabChange={this.handleParamHistTabChange}>
            <ParamHistChart data={this.paramHistChartData || this.getParamBData} />
          </AntDCard>

          <AntDCard
          title={this.props.cardTitle5}
          tabList={paramHistTabList}
          onTabChange={this.handleUpdateHistTabChange}>
            <UpdateHistChart data={this.updateHistChartData || this.getUpdateBData} />
          </AntDCard>

          <AntDCard title={this.props.cardTitle6}>
            <LearningRatesChart data={this.learningRateChartData} />
          </AntDCard>
        </div>
      </div>
    );
  }
}

LayerDetailsCard.defaultProps = {
  // card的标题
  cardTitle0: '入门',
  // card的标题
  cardTitle1: '层详情',
  // card的标题
  cardTitle2: <span>更新：参数比率（平均幅度): log<sub>10</sub></span>,
  // card的标题
  cardTitle3: 'Layer Activations',
  // card的标题
  cardTitle4: '层 Parameters Histogram  (W)',
  // card的标题
  cardTitle5: '层 Updates Histogram  (W)',
  // card的标题
  cardTitle6: 'Parameter Learning Rates',
  // 表格的数据
  tableDataSource: [],
  // 表头
  tableColumns: []
};

const InjectLayerDetails = inject(({ someStore = {} }) => ({ someProps: someStore.attribute }))(LayerDetailsCard);

export {
  LayerDetailsCard,
  InjectLayerDetails
};