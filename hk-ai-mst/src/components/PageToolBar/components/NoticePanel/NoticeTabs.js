// 库引入
import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import classNames from 'classnames';
import { Tabs } from 'antd';

// 组件引入
import {TodosNoticeList} from '../../../TodosNoticeList';

// 样式引入
import styles from './noticeTabs.module.less';

// 一些值
const { TabPane } = Tabs;

/**
 * 通知tabs
 */
@observer
class NoticeTabs extends Component {
  render() {
    return (
      <div className={ classNames(styles.noticeTabs, this.props.className) } style={ this.props.style }>
        <Tabs defaultActiveKey="3">
          <TabPane tab="通知" key="1">暂无新的通知</TabPane>
          <TabPane tab="消息" key="2">暂无新的消息</TabPane>
          <TabPane tab="待办" key="3"><TodosNoticeList /></TabPane>
        </Tabs>
      </div>
    );
  }
}

NoticeTabs.defaultProps = {
};

const InjectNoticeTabs = inject(({ someStore = {} }) => ({ someProps: someStore.attribute }))(NoticeTabs);

export {
  NoticeTabs,
  InjectNoticeTabs
};