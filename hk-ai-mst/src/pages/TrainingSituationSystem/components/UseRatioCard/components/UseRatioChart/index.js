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
class UseRatioChart extends Component {
  // 获得图表数据
  @computed get useRatioData() {
    const data = toJS(this.props.data);
    let useRatioData = null;
    if (data) {
      // FIXME:machineID需要改变
      const machineID = 0;
      const datas = fp.values(data)[machineID];
      const jvmCurrentFrac = datas.values[0];
      const offHeapFrac = datas.values[1];

      // 横轴数据（时间）
      const times = jvmCurrentFrac.map((value, key) => key);
      // 纵轴数据
      const jvmValuesData = jvmCurrentFrac.map((value, key) => ({ data: 'jvmValues', values: 100.0 * value, times: times[key] }));
      const offHeapValuesData = offHeapFrac.map((value, key) => ({ data: 'offHeapValues', values: 100.0 * value, times: times[key] }));
      useRatioData = fp.flatten([jvmValuesData, offHeapValuesData]);
    }
    console.info('获取JVM和堆外内存利用率%');

    return useRatioData;
  }

  render() {
     const cols = {
      values: {
        min: 0,
        max: 100,
        alias: '利用率'
      },
      times: {
        alias: '时间'
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
    console.info('render-利用率');
    return (
      <div className={classNames(styles.useRatioChart, this.props.className)} style={this.props.style}>
        <Chart height={335} padding={[60, 50, 80, 80]} data={this.useRatioData} scale={cols} forceFit placeholder>
          <Legend />
          <Axis name="times" grid={grid}/>
          <Axis name="values" grid={grid}/>
          <Tooltip
            title="times"
            crosshairs={{
              type: "y"
            }}
            // shared={false}
          />
          <Geom type="line" position="times*values" size={2} color='data'/>
        </Chart>
      </div>
    );
  }
}

UseRatioChart.defaultProps = {
};

const InjectUseRatioChart = inject(({someStore={}}) => ({someProps: someStore.attribute}))(UseRatioChart);

export {
  UseRatioChart,
  InjectUseRatioChart
};
