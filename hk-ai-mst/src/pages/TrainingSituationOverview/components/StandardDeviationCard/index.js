// 库引入
import React, { Component } from 'react';
import { action, observable } from 'mobx';
import { inject, observer } from 'mobx-react';
import classNames from 'classnames';
import { Card } from 'antd';

// 组件引入
import { StandardDeviationChart } from './components/StandardDeviationChart';

// 样式引入
import styles from './style.module.less';

const tabList =[{
  key: 'stdevUpdates',
  tab: '更新',
}, {
  key: 'stdevGradients',
  tab: '梯度',
}, {
  key: 'stdevActivations',
  tab: '激活',
}];

@observer
class StandardDeviationCard extends Component {
  @observable chartData = null;

  @action handleTabChange = (key) => {
    console.info('key',key);
    if (key === 'stdevUpdates') {
      this.chartData =  this.props.chartData.stdevUpdates;
    } else if (key === 'stdevGradients') {
      this.chartData =  this.props.chartData.stdevGradients;
    }else if (key === 'stdevActivations') {
      this.chartData =  this.props.chartData.stdevActivations;
    }
  }

  render() {
    return (
      <div className={ classNames(styles.standardDeviationCard, this.props.className) } style={ this.props.style }>
        <Card
        title={ this.props.cardTitle }
        tabList={tabList}
        onTabChange = {this.handleTabChange}
        >
          <StandardDeviationChart data={this.chartData || this.props.chartData.stdevUpdates} />
        </Card>
      </div>
    );
  }
}

StandardDeviationCard.defaultProps = {
  // 卡片标题
  cardTitle: (<span>标准差: log<sub>10</sub></span>),
  // 图表的数据
  chartData: []
};

const InjectStandardDeviationCard = inject(({ someStore = {} }) => ({ someProps: someStore.attribute }))(StandardDeviationCard);

export {
  StandardDeviationCard,
  InjectStandardDeviationCard
};