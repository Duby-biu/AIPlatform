// 库引入
import React, { Component } from 'react';
import { action, computed, toJS } from 'mobx';
import { inject, observer } from 'mobx-react';
import classNames from 'classnames';
import {
  Chart,
  Geom,
  Axis,
  Tooltip,
  Legend,
  Coord
} from "bizcharts";
import fp from 'lodash/fp';
import {
  Form as AntDForm,
  Input as AntDInput,
  Button as AntDButton,
  Row as AntDRow,
  Col as AntDCol,
  Select as AntDSelect,
  Radio as AntDRadio,
} from 'antd';

// 样式引入
import styles from './style.module.less';

// 数据操作引入
import { searchTableData } from '../../api/modelManagement/modelRelease';


@observer
class CustomChart extends Component {
  // 获得图表数据
  @computed get chartData() {
    const data = toJS(this.props.data);
    console.info(data);

    let chartData = null;
    if (data.length > 0) {
      chartData = [];
      const keys = Object.keys(data[0]);
      const axisX = keys[0];
      const axisYs = fp.drop(1)(keys);
      data.forEach(value => {
        axisYs.forEach(axisY => {
          let obj = { name: axisY, value: value[axisY] };
          obj[axisX] = value[axisX];
          chartData.push(obj);
        });
      });
    }
    console.info('自定义图形格式化数据', chartData);
    return chartData;
  }

  // 图组件
  @computed get chartComp() {
    console.info('-----------', this.props.setting.coordType);
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
    const data = toJS(this.props.data);
    let axisX = '';
    let axisY = 'value';

    if (data.length > 0) {
      const keys = Object.keys(data[0]);
      if (this.props.type.type !== 'point') {
        axisX = keys[0];
      } else {
        axisX = keys[1];
        axisY = keys[2];
        console.info(axisX, axisY);
      }
    }

    // 折线图、柱状图
    const Comp1 = (<React.Fragment>
      <Legend />
      <Axis name={axisX} grid={grid} />
      <Axis name={axisY} grid={grid} />
      <Tooltip
        title={axisX}
        crosshairs={{
          type: "y"
        }}
      />
      <Coord type={this.props.setting.coordType} />
      <Geom
        type={this.props.type.type}
        position={axisX + '*' + axisY}
        color='name'
        adjust={[
          {
            type: "dodge",
            marginRatio: 0.08
          }
        ]}
      />
    </React.Fragment>);

    // 饼图
    const Comp2 = (<React.Fragment>
      <Legend />
      <Coord type={this.props.setting.coordType} radius={1} />
      <Axis name={axisX} />
      <Tooltip
        title={axisX}
      />
      <Geom type={this.props.type.type} position={axisY} color={axisX} />
    </React.Fragment>);

    // 点图
    const Comp3 = (<React.Fragment>
      <Legend />
      <Axis name={axisX} grid={grid} />
      <Axis name={axisY} grid={grid} />
      <Tooltip
        showTitle={false}
        crosshairs={{
          type: "cross"
        }}
      />
      <Coord type={this.props.setting.coordType} />
      <Geom
        type={this.props.type.type}
        position={axisX + '*' + axisY}
        color={Object.keys(data[0])[0]}
        shape="circle"
        opacity={0.6}
        tooltip={[`${Object.keys(data[0])[0]}*${axisX}*${axisY}`, (name, axisX, axisY) => {
          return {
            name: name,
            value: axisX + '  ' + axisY
          };
        }]}
      />
    </React.Fragment>);

    switch (this.props.type.type) {
      case 'line':
      case 'interval': return Comp1;
      case 'intervalStack': return Comp2;
      case 'point': return Comp3;
      default: return null;
    }

  }

  render() {
    console.info('render-自定义图表', this.props.type);
    let data = [];
    if (this.props.type.type !== 'point') {
      data = this.chartData;
    } else {
      data = this.props.data;

    }
    const cols = {
      // score: {
      //   min: 0,
      //   alias: '评分'
      // },
      // iterationsNumber: {
      //   alias: '迭代次数'
      // }
    };

    return (

      <div className={classNames(styles.customChart, this.props.className)} style={this.props.style}>
        <Chart height={400} padding={[20, 30, 60, 60]} data={data} scale={cols} forceFit placeholder>
          {this.chartComp}
        </Chart>
      </div>
    );
  }
}

CustomChart.defaultProps = {
};

// const InjectCustomChart = inject(({someStore={}}) => ({someProps: someStore.attribute}))(CustomChart);
const InjectCustomChart = inject()(CustomChart);

export {
  CustomChart,
  InjectCustomChart
};