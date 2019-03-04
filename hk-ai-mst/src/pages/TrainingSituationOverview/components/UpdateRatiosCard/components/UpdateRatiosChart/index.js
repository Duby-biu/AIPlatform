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

// consts引入
import { mockData } from './mockData';

// 样式引入
import styles from './style.module.less';

@observer
class UpdateRatiosChart extends Component {
  @computed get updateRatiosData() {
    const data = toJS(this.props.data);
    let lines = [];
    for(let key in data) {
      let oneLine = [];
      oneLine = data[key].map((value, index) => ({ data: key, updateRatios2:  Math.log10(value), iterationsNumber: index }));
      lines.push(oneLine);
    }
    lines = fp.flatten(lines);
    console.info('获取参数比率数据');
    return lines;
  }

  render() {
    const cols = {
      updateRatios: {
        min: 0,
        alias: 'log'+<sub>10</sub>+'比例'
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
      <div className={ classNames(styles.updateRatiosChart, this.props.className) } style={ this.props.style }>
        <Chart height={ 350 } padding={[20, 20, 60, 60]} data={ this.updateRatiosData } scale={ cols } forceFit placeholder>
          <Legend />
          <Axis name="iterationsNumber" grid={grid} />
          <Axis name="updateRatios2" grid={grid} />
          <Tooltip
            title="iterationsNumber"
            crosshairs={{
              type: "y"
            }}
          />
          <Geom type="line" position="iterationsNumber*updateRatios2" size={2} color='data'/>
        </Chart>
      </div>
    );
  }
}

UpdateRatiosChart.defaultProps = {
  data: mockData
};

const InjectUpdateRatiosChart = inject(({ someStore = {} }) => ({ someProps: someStore.attribute }))(UpdateRatiosChart);

export {
  UpdateRatiosChart,
  InjectUpdateRatiosChart
};