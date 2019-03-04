// 库引入
import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import classNames from 'classnames';
import { Tag } from 'antd';

// constants引入
import todosNoticeStatus from '../../constants/todosNoticeStatus';

// 样式引入
import styles from './item.module.less';

/**
 * 待办通知列表项
 */
@observer
class Item extends Component {
  render() {
    const { title, statusCode, statusText, content } = this.props.dataSource;
    return (
      <div className={ classNames(styles.item, this.props.className) } style={ this.props.style }>
        <h4 className={ classNames(styles.title) }>
          <span className={ classNames(styles.titleText) }>{ title }</span>
          <Tag color={ todosNoticeStatus[statusCode].color }>{ statusText || todosNoticeStatus[statusCode].text }</Tag>
        </h4>
        <p>{ content }</p>
      </div>
    );
  }
}

Item.defaultProps = {
  dataSource: {}
};

const InjectItem = inject(({ someStore = {} }) => ({ someProps: someStore.attribute }))(Item);

export {
  Item,
  InjectItem
};