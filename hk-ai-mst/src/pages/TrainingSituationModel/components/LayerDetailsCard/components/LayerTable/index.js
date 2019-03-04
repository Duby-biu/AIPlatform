// 库引入
import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import classNames from 'classnames';
import { Table } from 'antd';
import { computed }　from 'mobx';
import fp from 'lodash/fp';

// 样式引入
import styles from './style.module.less';

/**
 * 模型和训练详情的表格
 */
@observer
class LayerTable extends Component {
  
  // 指示表格数据是否正在请求
  @computed get loading() {
    return fp.size(this.props.dataSource) === 0;
  }

  render() {
    return (
      <div className={ classNames(styles.LayerTable, this.props.className) } style={ this.props.style }>
        <Table loading={this.loading} dataSource={ this.props.dataSource } columns={ this.props.columns } showHeader={ false } size="small" pagination={false} />
      </div>
    );
  }
}

LayerTable.defaultProps = {
};

const InjectLayerTable = inject(({ someStore = {} }) => ({ someProps: someStore.attribute }))(LayerTable);

export {
  LayerTable,
  InjectLayerTable
};