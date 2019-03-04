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
import { GPUChart } from './components/GPUChart';

@observer
class GPUCard extends Component {
  render() {
    return (
      <div className={classNames(styles.GPUCard, this.props.className)} style={this.props.style}>
        <AntDCard title={ this.props.cardTitle}>
          <GPUChart data={this.props.chartData} />
        </AntDCard>
      </div>
    );
  }
}

GPUCard.defaultProps = {
  cardTitle: 'GPU'
};

const InjectUseRatioCard = inject(({someStore={}}) => ({someProps: someStore.attribute}))(GPUCard);

export {
  GPUCard,
  InjectUseRatioCard
};