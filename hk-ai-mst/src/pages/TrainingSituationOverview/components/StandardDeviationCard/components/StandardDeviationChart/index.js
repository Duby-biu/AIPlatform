// 库引入
import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import classNames from 'classnames';
import {
  Chart,
  Geom,
  Axis,
  Tooltip,
  Legend
} from "bizcharts";
import { computed, toJS } from 'mobx';
import fp from 'lodash/fp';

// 样式引入
import styles from './style.module.less';

@observer
class StandardDeviationChart extends Component {

  @computed get standardDeviationData() {
    const data = toJS(this.props.data);
    let lines = [];
    for(let key in data) {
      let oneLine = [];
      oneLine = data[key].map((value, index) => ({ data: key, standardDeviation2: Math.log10(value), iterationsNumber: index }));
      lines.push(oneLine);
    }
    lines = fp.flatten(lines);
    console.info('获取标准差数据');
    return lines;
  }

  render() {
    const cols = {
      standardDeviation: {
        min: 0,
        alias: '标准差'
      },
      iterationsNumber: {
        alias: '迭代次数'
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
    return (
      <div className={ classNames(styles.standardDeviationChart, this.props.className) } style={ this.props.style }>
         <Chart height={ 350 } padding={[20, 20, 60, 60]} data={ this.standardDeviationData } scale={ cols } forceFit placeholder>
          <Legend />
          <Axis name="iterationsNumber" grid={grid} />
          <Axis name="standardDeviation2" grid={grid} />
          <Tooltip
            title="iterationsNumber"
            crosshairs={{
              type: "y"
            }}
          />
          <Geom type="line" position="iterationsNumber*standardDeviation2" size={2} color='data'/>
        </Chart>
      </div>
    );
  }
}

StandardDeviationChart.defaultProps = {
  data: []
};

const InjectStandardDeviationChart = inject(({ someStore = {} }) => ({ someProps: someStore.attribute }))(StandardDeviationChart);

export {
  StandardDeviationChart,
  InjectStandardDeviationChart
};