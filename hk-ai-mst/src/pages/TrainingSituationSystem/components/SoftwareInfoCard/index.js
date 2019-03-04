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
import { SoftwareTable } from './components/SoftwareTable';

@observer
class SoftwareInfoCard extends Component {
  render() {
    return (
      <div className={classNames(styles.softwareInfoCard, this.props.className)} style={this.props.style}>
        <AntDCard title={ this.props.cardTitle}>
          <SoftwareTable dataSource={this.props.tableDataSource} columns={this.props.tableColumns} />
        </AntDCard>
      </div>
    );
  }
}

SoftwareInfoCard.defaultProps = {
  cardTitle: '软件信息'
};

const InjectSoftwareInfoCard = inject(({someStore={}}) => ({someProps: someStore.attribute}))(SoftwareInfoCard);

export {
  SoftwareInfoCard,
  InjectSoftwareInfoCard
};