// 库引入
import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import classNames from 'classnames';
import { Icon, Badge, Popover } from 'antd';

// 组件引入
import { NoticeTabs } from './NoticeTabs';

// 样式引入
import styles from './style.module.less';

@observer
class NoticePanel extends Component {
  render() {
    return (
      <div className={ classNames(styles.noticePanel, this.props.className) } style={ this.props.style }>
        <Popover content={ (<NoticeTabs />) } trigger="click" placement="bottomLeft">
          <Badge count={ this.props.badgeCount } offset={ [0, -4] }><Icon className={ classNames(styles.iconNotice) } type="bell" theme="outlined" /></Badge>
        </Popover>
      </div>
    );
  }
}

NoticePanel.defaultProps = {
  badgeCount: 9
};

const InjectNoticePanel = inject(({ someStore = {} }) => ({ someProps: someStore.attribute }))(NoticePanel);

export {
  NoticePanel,
  InjectNoticePanel
};