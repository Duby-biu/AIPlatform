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
class DetailsTable extends Component {
  
  // 指示表格数据是否正在请求
  @computed get loading() {
    return fp.size(this.props.dataSource) === 0;
  }

  render() {
    return (
      <div className={ classNames(styles.detailsTable, this.props.className) } style={ this.props.style }>
        <Table height={300} loading={this.loading} dataSource={ this.props.dataSource } columns={ this.props.columns } showHeader={ false } size="small" pagination={false} />
      </div>
    );
  }
}

DetailsTable.defaultProps = {
  dataSource: [{
    key: '1',
    name: '模型类型',
    value: 'MultiLayerNetwork'
  },{
    key: '2',
    name: '层',
    value: '6'
  },{
    key: '3',
    name: '开始时间',
    value: '2018-10-15 19:13:07'
  },{
    key: '4',
    name: '总运行时间',
    value: '3天2小时53分'
  },{
    key: '5',
    name: '最后更新',
    value: '2018-10-15 19:13:07'
  },{
    key: '6',
    name: '总参数更新',
    value: '938'
  },{
    key: '7',
    name: '更新 / 秒',
    value: '938'
  },{
    key: '8',
    name: '例子 / 秒',
    value: '118.08'
  }],
  columns: [{
    title: '名称',
    dataIndex: 'name',
    key: 'name',
  }, {
    title: '状态(值)',
    dataIndex: 'value',
    key: 'value',
  }]
};

const InjectDetailsTable = inject(({ someStore = {} }) => ({ someProps: someStore.attribute }))(DetailsTable);

export {
  DetailsTable,
  InjectDetailsTable
};