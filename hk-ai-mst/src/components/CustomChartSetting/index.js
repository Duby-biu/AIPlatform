// 库引入
import React, { Component } from 'react';
import { action, observable } from 'mobx';
import { inject, observer } from 'mobx-react';
import classNames from 'classnames';
import {
  Form as AntDForm,
  Input as AntDInput,
  Button as AntDButton,
  Row as AntDRow,
  Col as AntDCol,
  Select as AntDSelect,
  Radio as AntDRadio,
} from 'antd';
import fp from 'lodash/fp';

// 样式引入
import styles from './style.module.less';

const AntDFormItem = AntDForm.Item;
const AntDOption = AntDSelect.Option;

const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 16 }
};

@AntDForm.create()
@observer
class CustomChartSetting extends Component {
  @observable options = [];

  // 暴露表单方法给父组件
  @action componentDidMount = () => {
    this.props.getChild(this.props.form);
  }

  @action handleTypeChange = (value) => {
    this.props.type.setType(value);
  }

  @action dataSourceChange = (value) => {
    this.options = value;
    this.props.setting.setXOptions(value);
    this.props.setting.setYOptions(value);
  }

  // 去掉y中x选择的值
  @action xAxisChange = (value) => {
    this.props.setting.setYOptions(fp.pull(value)(this.options));
  }
  // 去掉x中y选择的值
  @action yAxisChange = (value) => {
    this.props.setting.setXOptions(fp.pullAll(value)(this.options));
  }

  // 根据选择的类型返回不同组件
  @action compBasedOnType = (type) => {
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14 }
    };
    switch (type) {
      case 'line': {
        const line = (
          <div>折线图</div>
        );
        this.props.setting.setCoordType('rect');
        return line;
      };
      case 'interval': {
        const interval = (
          <div>柱状图</div>
        );
        this.props.setting.setCoordType('rect');
        return interval;
      };
      case 'intervalStack': {
        const intervalStack = (
          <div>饼图</div>
        );
        this.props.setting.setCoordType('theta');
        return intervalStack;
      };
      case 'point': {
        const point = (
          <div>点图</div>
        );
        return point;
      };
      case 'arae': {
        const arae = (
          <div>面积图</div>
        );
        return arae;
      };
      case 'box': {
        const box = (
          <div>箱形图</div>
        );
        return box;
      };
      case 'candle': {
        const candle = (
          <div>烛形图</div>
        );
        return candle;
      };
      case 'heatmap': {
        const heatmap = (
          <div>热力图</div>
        );
        return heatmap;
      };
      case 'instrument': {
        const instrument = (
          <div>仪表盘</div>
        );
        return instrument;
      };
      case 'funnel': {
        const funnel = (
          <div>漏斗图</div>
        );
        return funnel;
      };
      case 'map': {
        const map = (
          <div>地图</div>
        );
        return map;
      };
      case 'radar': {
        const radar = (
          <div>雷达图</div>
        );
        return radar;
      };
      case 'faceted': {
        const faceted = (
          <div>分面图</div>
        );
        return faceted;
      };
      case 'relation': {
        const relation = (
          <div>关系图</div>
        );
        return relation;
      };
      default: return null;
    }
  }

  render() {
    console.info('render-自定义图表配置');
    const { getFieldDecorator } = this.props.form;
    const comp = this.compBasedOnType(this.props.type.type);
    let xComp = null;
    let yComp = null;
    if (this.options.length > 0) {
      xComp = (<AntDFormItem label='x轴' {...formItemLayout}>
        {getFieldDecorator('xAxis', {
        })(
          <AntDSelect
            onChange={this.xAxisChange}>
            {this.props.setting.xOptions.map(x => <AntDOption key={x}>{x}</AntDOption>)}
          </AntDSelect>
        )}
      </AntDFormItem>);
      yComp = (<AntDFormItem label='y轴' {...formItemLayout}>
        {getFieldDecorator('yAxis', {
        })(
          <AntDSelect
            onChange={this.yAxisChange}>
            {this.props.setting.yOptions.map(y => <AntDOption key={y}>{y}</AntDOption>)}
          </AntDSelect>
        )}
      </AntDFormItem>);
    }
    return (
      <div className={classNames(styles.customChartSetting, this.props.className)} style={this.props.style}>
        <AntDForm onSubmit={this.handleSubmit}>
          <AntDFormItem label='图形类型' {...formItemLayout}>
            {getFieldDecorator('chartType', {
              rules: [{ required: true, message: '请选择图形类型' }],
            })(
              <AntDSelect onChange={this.handleTypeChange}>
                <AntDOption value='line'>折线图</AntDOption>
                <AntDOption value='interval'>柱状图</AntDOption>
                <AntDOption value='intervalStack'>饼图</AntDOption>
                <AntDOption value='point'>点图</AntDOption>
                <AntDOption value='arae'>面积图</AntDOption>
                <AntDOption value='box'>箱形图</AntDOption>
                <AntDOption value='candle'>烛形图</AntDOption>
                <AntDOption value='heatmap'>热力图</AntDOption>
                <AntDOption value='instrument'>仪表盘</AntDOption>
                <AntDOption value='funnel'>漏斗图</AntDOption>
                <AntDOption value='map'>地图</AntDOption>
                <AntDOption value='radar'>雷达图</AntDOption>
                <AntDOption value='faceted'>分面图</AntDOption>
                <AntDOption value='relation'>关系图</AntDOption>
              </AntDSelect>
            )}
          </AntDFormItem>
          <AntDFormItem label='数据源' {...formItemLayout}>
            {getFieldDecorator('dataSoruce', {
            })(
              <AntDSelect
                mode='multiple'
                onChange={this.dataSourceChange}>
                <AntDOption value='1'>11</AntDOption>
                <AntDOption value='2'>22</AntDOption>
                <AntDOption value='3'>33</AntDOption>
                <AntDOption value='4'>44</AntDOption>
              </AntDSelect>
            )}
          </AntDFormItem>
          {xComp}
          {yComp}
          {comp}
        </AntDForm>
      </div>
    );
  }
}

CustomChartSetting.defaultProps = {
};

// const InjectCustomChartSetting = inject(({someStore = {}}) => ({someProps: someStore.attribute}))(CustomChartSetting);
const InjectCustomChartSetting = inject()(CustomChartSetting);

export {
  CustomChartSetting,
  InjectCustomChartSetting
};