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
class ScoresChart extends Component {
  // 获得图表数据
  @computed get scoreData() {
    const data = toJS(this.props.data);
    const singleData = data.map((value, key) => ({ data: 'single', score: value, iterationsNumber: key }));
    let summaryData = [];
    if (data.length) {
      summaryData = this.EMACalc(data);
    }
    const scoreData = fp.flatten([singleData, summaryData]);
    console.info('获取模型评分与迭代的数据');
    return scoreData;
  }

  // 算法 得到summarydata的算法
  EMACalc = (mArray, mRange = 10) => {
    let emaObj = {};
    const k = 2 / (mRange + 1);
    const emaArray = [];
    // 第一个数据一样
    emaObj = {
      score: mArray[0],
      iterationsNumber: 0,
      data: 'summary'
    };
    emaArray.push(emaObj);
    // 剩下的数据需要计算
    for (var i = 1; i < mArray.length; i++) {
      let emaObj = {};
      emaObj.score = mArray[i] * k + emaArray[i-1].score * (1 - k);
      emaObj.iterationsNumber = i; 
      emaObj.data = 'summary';
      emaArray.push(emaObj);
    }
    return emaArray;
  }

  render() {
    const cols = {
      score: {
        min: 0,
        alias: '评分'
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
      // FIXME: tooltip样式改改
      <div className={classNames(styles.scoresChart, this.props.className)} style={this.props.style}>
        <Chart height={336} padding={[20, 30, 60, 60]} data={this.scoreData} scale={cols} forceFit placeholder>
          <Legend />
          <Axis name="iterationsNumber" grid={grid} />
          <Axis name="score" grid={grid} />
          <Tooltip
            title="iterationsNumber"
            crosshairs={{
              type: "y"
            }}
            // shared={false}
          />
          <Geom type="line" position="iterationsNumber*score" size={2} color='data'/>
        </Chart>
      </div>
    );
  }
}

ScoresChart.defaultProps = {
  data: []
};

const InjectScoresChart = inject(({ someStore = {} }) => ({ someProps: someStore.attribute }))(ScoresChart);

export {
  ScoresChart,
  InjectScoresChart
};