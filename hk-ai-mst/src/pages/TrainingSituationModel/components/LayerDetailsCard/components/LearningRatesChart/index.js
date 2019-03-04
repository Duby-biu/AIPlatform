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
class LearningRatesChart extends Component {
  // 获得图表数据
  @computed get learningRateData() {
    const data = toJS(this.props.data);
    let learningRateData = null;
    if (data) {
      let bData = [];
      let WData = [];
      if(data.lrs.b) {
        bData = data.lrs.b.map((value, index) => ({ data: 'b', value: value, iterationsNumber: data.iterCounts[index] }));
      }
      if(data.lrs.W) {
        WData = data.lrs.W.map((value, index) => ({ data: 'W', value: value, iterationsNumber: data.iterCounts[index] }));
      }
      learningRateData = fp.flatten([bData, WData]);
    }
    return learningRateData;
  }

  render() {
     const cols = {
      iterationsNumber: {
        alias: '迭代次数'
      },
      value: {
        alias: '值'
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
    console.info('render-学习比率');
    return (
      <div className={classNames(styles.LearningRatesChart, this.props.className)} style={this.props.style}>
        <Chart height={400} padding={[60, 50, 80, 80]} data={this.learningRateData} scale={cols} forceFit placeholder>
          <Legend />
          <Axis name="iterationsNumber" grid={grid}/>
          <Axis name="value" grid={grid}/>
          <Tooltip
            title="iterationsNumber"
            crosshairs={{
              type: "y"
            }}
          />
          <Geom type="line" position="iterationsNumber*value" size={2} color='data'/>
        </Chart>
      </div>
    );
  }
}

LearningRatesChart.defaultProps = {
};

const InjectLearningRatesChart = inject(({someStore={}}) => ({someProps: someStore.attribute}))(LearningRatesChart);

export {
  LearningRatesChart,
  InjectLearningRatesChart
};
