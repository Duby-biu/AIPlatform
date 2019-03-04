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

// 样式引入
import styles from './style.module.less';

@observer
class MeanMagChart extends Component {
  // 获得图表数据
  @computed get meanMagData() {
    const data = toJS(this.props.data);
    const iterCounts = toJS(this.props.iterCounts);
    let meanMagData = [];
    if (data) {
      if(data.type === 'log'){
        for(let key in data) {
          if(data[key] === 'log') continue;
          let oneLine = [];
          oneLine = data[key].map((value, index) => ({ data: key, updateRatio: Math.log10(value), iterationsNumber: iterCounts[index] }));
          meanMagData.push(oneLine);
        }
      } else {
        for(let key in data) {
          let oneLine = [];
          oneLine = data[key].map((value, index) => ({ data: key, updateRatio: value, iterationsNumber: iterCounts[index] }));
          meanMagData.push(oneLine);
        }
      }
    }
    meanMagData = fp.flatten(meanMagData);
    return meanMagData;
  }

  render() {
    const cols = {
      iterationsNumber: {
        alias: '迭代次数'
      },
      updateRatio: {
        alias: '参数比率'
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
    console.info('render-更新：参数比率');
    return (
      <div className={classNames(styles.MeanMagChart, this.props.className)} style={this.props.style}>
        <Chart height={400} padding={[60, 50, 80, 80]} data={this.meanMagData} scale={cols} forceFit placeholder>
          <Legend />
          <Axis name="iterationsNumber" grid={grid}/>
          <Axis name="updateRatio" grid={grid}/>
          <Tooltip
            title="iterationsNumber"
            crosshairs={{
              type: "y"
            }}
          />
          <Geom type="line" position="iterationsNumber*updateRatio" size={2} color='data'/>
        </Chart>
      </div>
    );
  }
}

MeanMagChart.defaultProps = {
};

const InjectMeanMagChart = inject(({ someStore = {} }) => ({ someProps: someStore.attribute }))(MeanMagChart);

export {
  MeanMagChart,
  InjectMeanMagChart
};
