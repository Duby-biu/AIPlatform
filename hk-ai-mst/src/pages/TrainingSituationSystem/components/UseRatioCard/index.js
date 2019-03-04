// 库引入
import React, {Component} from 'react';
import {inject, observer} from 'mobx-react';
import classNames from 'classnames';
import {
  Card as AntDCard
} from 'antd';

// 样式引入
import styles from './style.module.less';

// 组件引入
import { UseRatioChart } from './components/UseRatioChart';

@observer
class UseRatioCard extends Component {
  render() {
    return (
      <div className={classNames(styles.useRatioCard, this.props.className)} style={this.props.style}>
        <AntDCard title={ this.props.cardTitle}>
          <UseRatioChart data={this.props.chartData} />
        </AntDCard>
      </div>
    );
  }
}

UseRatioCard.defaultProps = {
  cardTitle: 'JVM和堆外内存利用率%'
};

const InjectUseRatioCard = inject(({someStore={}}) => ({someProps: someStore.attribute}))(UseRatioCard);

export {
  UseRatioCard,
  InjectUseRatioCard
};