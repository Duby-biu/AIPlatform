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
class GPUChart extends Component {
  // 获得图表数据
  @computed get GPUData() {
    const data = toJS(this.props.data);
    let GPUData = null;
    if (data) {
      // FIXME:machineID需要改变
      const machineID = 0;
      const datas = fp.values(data)[machineID];
      const GPUDatas = datas.values[2];
      if(GPUDatas){
        GPUData = GPUDatas.map((value, key) => ({ data: 'titan xp', values: 100.0 * value, times: key }));
        console.info('获取GPU数据');
      }
    }
    return GPUData;
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
    console.info('render-GPU');
    return (
      <div className={classNames(styles.GPUChart, this.props.className)} style={this.props.style}>
        <Chart height={335} padding={[60, 50, 80, 80]} data={this.GPUData} scale={cols} forceFit placeholder>
          <Legend />
          <Axis name="times" grid={grid}/>
          <Axis name="values" grid={grid}/>
          <Tooltip
            title="times"
            crosshairs={{
              type: "y"
            }}
          />
          <Geom type="line" position="times*values" size={2} color='data'/>
        </Chart>
      </div>
    );
  }
}

GPUChart.defaultProps = {
};

const InjectUseRatioChart = inject(({someStore={}}) => ({someProps: someStore.attribute}))(GPUChart);

export {
  GPUChart,
  InjectUseRatioChart
};
