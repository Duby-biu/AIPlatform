// 库引入
import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import classNames from 'classnames';
import { Card } from 'antd';

// 组件引入
import { UpdateRatiosChart } from './components/UpdateRatiosChart';

// 样式引入
import styles from './style.module.less';

@observer
class UpdateRatiosCard extends Component {
  
  render() {
    return (
      <div className={ classNames(styles.updateRatiosCard, this.props.className) } style={ this.props.style }>
        <Card title={ this.props.cardTitle }>
          <UpdateRatiosChart data={this.props.chartData} />
        </Card>
      </div>
    );
  }
}

UpdateRatiosCard.defaultProps = {
  // 卡片标题
  cardTitle: (<span>更新：参数比率（平均幅度): log<sub>10</sub></span>),
  // 图表的数据
  chartData: []
};

const InjectUpdateRatiosCard = inject(({ someStore = {} }) => ({ someProps: someStore.attribute }))(UpdateRatiosCard);

export {
  UpdateRatiosCard,
  InjectUpdateRatiosCard
};