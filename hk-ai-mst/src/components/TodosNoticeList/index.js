// 库引入
import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import classNames from 'classnames';
import { List } from 'antd';

// 组件引入
import { Item } from './Item';

// 样式引入
import styles from './style.module.less';

/**
 * 待办通知列表
 */
@observer
class TodosNoticeList extends Component {
  render() {
    return (
      <div className={ classNames(styles.todosNoticeList, this.props.className) } style={ this.props.style }>
        <List
          dataSource={ this.props.dataSource }
          renderItem={ item => (<Item dataSource={ item } />) }
        />
      </div>
    );
  }
}

TodosNoticeList.defaultProps = {
  dataSource: [{
    id: 0,
    statusCode: 0,
    statusText: '未开始',
    title: '安排网页平台会议',
    content: '任务需要在 2017-01-12 20:00 前启动'
  },
  {
    id: 1,
    statusCode: 1,
    statusText: '进行中',
    title: 'ABCD 版本发布',
    content: '冠霖提交于 2017-01-06，需在 2017-01-07 前完成代码变更任务'
  },
  {
    id: 2,
    statusCode: 2,
    statusText: '已经耗时8天',
    title: '信息安全考试',
    content: '指派竹尔于 2017-01-09 前完成更新并发布'
  },
  {
    id: 3,
    statusCode: 3,
    statusText: '快要到期',
    title: '第三方紧急代码变更',
    content: '冠霖提交于 2017-01-06，需在 2017-01-07 前完成代码变更任务'
  }]
};

const InjectTodosNoticeList = inject(({ someStore = {} }) => ({ someProps: someStore.attribute }))(TodosNoticeList);

export {
  TodosNoticeList,
  InjectTodosNoticeList
};