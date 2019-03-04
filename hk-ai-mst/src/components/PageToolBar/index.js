// 库引入
import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import classNames from 'classnames';
import { Icon, Tooltip } from 'antd';

// 组件引入
import { FoldableSearch } from './components/FoldableSearch';
import { NoticePanel } from './components/NoticePanel';
import { InjectUserInfoDropDown as UserInfoDropDown } from '../../components/UserInfoDropDown';

// 样式引入
import styles from './style.module.less';

/**
 * 页面的工具条
 */
@observer
class PageToolBar extends Component {
  render() {
    return (
      <div className={ classNames(styles.pageToolBar, this.props.className) } style={ this.props.style }>
        <FoldableSearch />
        <Tooltip title="帮助">
          <Icon type="question-circle" theme="outlined" />
        </Tooltip>
        <NoticePanel />
        <UserInfoDropDown />
      </div>
    );
  }
}

PageToolBar.defaultProps = {
};

const InjectPageToolBar = inject(({ someStore = {} }) => ({ someProps: someStore.attribute }))(PageToolBar);

export {
  PageToolBar,
  InjectPageToolBar
};