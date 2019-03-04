// 库引入
import React, { Component } from 'react';
import { computed, toJS } 　from 'mobx';
import { inject, observer } from 'mobx-react';
import classNames from 'classnames';
import {
  Chart,
  Geom,
  Axis,
  Tooltip,
  Legend
} from "bizcharts";
import fp from 'lodash/fp';
import DataSet from '@antv/data-set';

// 样式引入
import styles from './style.module.less';

@observer
class ParamHistChart extends Component {
  // 获得图表数据
  @computed get paramHistData() {
    const data = toJS(this.props.data);
    let paramHistData = [];
    if (data) {
      const { min, max, bins, counts } = { ...data };
      const binWidth = (max - min) / bins;
      const halfBin = binWidth / 2.0;
      paramHistData = counts.map((value, index) => ({ count: value, bin: min + index * binWidth - halfBin }));
      // paramHistData = counts.map((value, index) => ({ bin: min + index * binWidth - halfBin }));
    }
    return paramHistData;
  }

  render() {
    // const ds = new DataSet();
    // const dv = ds.createView().source(this.paramHistData);
    // dv.transform({
    //   type: 'bin.histogram',
    //   field: 'count',
    //   binWidth: 2,
    //   as: ['bin', 'count']
    // });
    // console.info('=============',dv);
    const cols = {
      bin: {
        nice: false
      },
      count: {
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
    console.info('render-层参量直方图');
    return (
      <div className={classNames(styles.ParamHistChart, this.props.className)} style={this.props.style}>
        <Chart height={400} padding={[60, 50, 80, 80]} data={this.paramHistData} scale={cols} forceFit placeholder>
          <Legend />
          <Axis name="bin" grid={grid} />
          <Axis name="count" grid={grid} />
          <Tooltip />
          <Geom type="interval" position="bin*count"/>
        </Chart>
      </div>
    );
  }
}

ParamHistChart.defaultProps = {
};

const InjectParamHistChart = inject(({ someStore = {} }) => ({ someProps: someStore.attribute }))(ParamHistChart);

export {
  ParamHistChart,
  InjectParamHistChart
};
