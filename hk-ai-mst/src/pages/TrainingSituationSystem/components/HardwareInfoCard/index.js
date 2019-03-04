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
import { HardwareTable } from './components/HardwareTable';

@observer
class HardwareInfoCard extends Component {
  render() {
    return (
      <div className={classNames(styles.hardwareInfoCard, this.props.className)} style={this.props.style}>
        <AntDCard title={ this.props.cardTitle}>
          <HardwareTable dataSource={this.props.tableDataSource} columns={this.props.tableColumns} />
        </AntDCard>
      </div>
    );
  }
}

HardwareInfoCard.defaultProps = {
  cardTitle: '硬件信息'
};

const InjectComponentDemo = inject(({someStore={}}) => ({someProps: someStore.attribute}))(HardwareInfoCard);

export {
  HardwareInfoCard,
  InjectComponentDemo
};