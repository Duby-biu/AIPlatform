// 库引入
import React, {Component} from 'react';
import { computed, toJS }　from 'mobx';
import {inject, observer} from 'mobx-react';
import classNames from 'classnames';
import {
  Chart,
  Geom,
  Axis,
  Tooltip,
  Legend
} from "bizcharts";
import fp from 'lodash/fp';

// 样式引入
import styles from './style.module.less';

@observer
class ActivationChart extends Component {
  // 获得图表数据
  @computed get activationData() {
    const data = toJS(this.props.data);
    let activationData = [];
    let meanData = [];
    let meanPlus = [];
    let meanMinus = [];
    if (data) {
      const iter = data.iterCount;
      meanData = iter.map((value, index) => ({ data: 'mean', activation: data.mean[index], iterationsNumber: value }));
      meanPlus = iter.map((value, index) => ({ data: 'meanPlus', activation: data.mean[index] + 2 * data.stdev[index], iterationsNumber: value }));
      meanMinus = iter.map((value, index) => ({ data: 'meanMinus', activation: data.mean[index] - 2 * data.stdev[index], iterationsNumber: value }));
    }
    activationData = fp.flatten([meanData, meanPlus, meanMinus]);
    return activationData;
  }

  render() {
    const cols = {
      iterationsNumber: {
        alias: '迭代次数'
      },
      activation: {
        alias: '激活'
      }
    };
    const grid = {
      type: 'line',
      lineStyle: {
        stroke: '#ddd',
        lineWidth: 1,
      },
      zeroLineStyle: {
        stroke: '#ddd',
      }
    };
    console.info('render-激活');
    return (
      <div className={classNames(styles.activationChart, this.props.className)} style={this.props.style}>
        <Chart height={400} padding={[60, 50, 80, 80]} data={this.activationData} scale={cols} forceFit placeholder>
          <Legend />
          <Axis name="iterationsNumber" grid={grid}/>
          <Axis name="activation" grid={grid}/>
          <Tooltip
            title="iterationsNumber"
            crosshairs={{
              type: "y"
            }}
          />
          <Geom type="line" position="iterationsNumber*activation" size={2} color='data'/>
        </Chart>
      </div>
    );
  }
}

ActivationChart.defaultProps = {
};

const InjectActivationChart = inject(({someStore={}}) => ({someProps: someStore.attribute}))(ActivationChart);

export {
  ActivationChart,
  InjectActivationChart
};
