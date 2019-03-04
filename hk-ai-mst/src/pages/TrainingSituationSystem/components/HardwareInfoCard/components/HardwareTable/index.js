// 库引入
import React, {Component} from 'react';
import { computed }　from 'mobx';
import {inject, observer} from 'mobx-react';
import classNames from 'classnames';
import {
  Table as AntDTable
} from 'antd';
import fp from 'lodash/fp';

// 样式引入
import styles from './style.module.less';

@observer
class HardwareTable extends Component {
  // 指示表格数据是否正在请求
  @computed get loading() {
    return fp.size(this.props.dataSource) === 0;
  }

  render() {
    return (
      <div className={classNames(styles.hardwareTable, this.props.className)} style={this.props.style}>
        <AntDTable loading={this.loading} dataSource={ this.props.dataSource } columns={ this.props.columns } size="small" pagination={false} />
      </div>
    );
  }
}

HardwareTable.defaultProps = {
};

const InjectHardwareTable = inject(({someStore={}}) => ({someProps: someStore.attribute}))(HardwareTable);

export {
  HardwareTable,
  InjectHardwareTable
};