// 库引入
import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import classNames from 'classnames';
import { Card } from 'antd';

// 组件引入
import { ScoresChart } from './components/ScoresChart';

// 样式引入
import styles from './style.module.less';

@observer
class ScoresCard extends Component {
  
  render() {
    return (
      <div className={ classNames(styles.scoresCard, this.props.className) } style={ this.props.style }>
        <Card title={ this.props.cardTitle }>
          <ScoresChart data={this.props.chartData} />
        </Card>
      </div>
    );
  }
}

ScoresCard.defaultProps = {
  // 卡片标题
  cardTitle: '模型评分与迭代',
  // 图表的数据
  chartData: []
};

const InjectScoresCard = inject(({ someStore = {} }) => ({ someProps: someStore.attribute }))(ScoresCard);

export {
  ScoresCard,
  InjectScoresCard
};