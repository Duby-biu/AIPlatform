// 库引入
import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import classNames from 'classnames';
import { Card } from 'antd';

// 组件引入
import { DetailsTable } from './components/DetailsTable';

// 样式引入
import styles from './style.module.less';

@observer
class ModelAndTrainingDetailsCard extends Component {
  render() {
    return (
      <div className={ classNames(styles.modelAndTrainingDetailsCard, this.props.className) } style={ this.props.style }>
        <Card title={ this.props.cardTitle }>
          <DetailsTable dataSource={this.props.tableDataSource} columns={this.props.tableColumns} />
        </Card>
      </div>
    );
  }
}

ModelAndTrainingDetailsCard.defaultProps = {
  // card的标题
  cardTitle: '模型和训练详情',
  // 表格的数据
  tableDataSource: [],
  // 表头
  tableColumns: []
};

const InjectModelAndTrainingDetailsCard = inject(({ someStore = {} }) => ({ someProps: someStore.attribute }))(ModelAndTrainingDetailsCard);

export {
  ModelAndTrainingDetailsCard,
  InjectModelAndTrainingDetailsCard
};