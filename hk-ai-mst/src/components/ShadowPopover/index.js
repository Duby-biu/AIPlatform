// 库引入
import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import classNames from 'classnames';
import { Popover } from 'antd';

// 样式引入
import styles from './style.module.less';

/**
 * 影子Popover
 * 只要渲染就会显示出来,需要指定子元素的大小和位置
 */
@observer
class ShadowPopover extends Component {
  render() {
    return (
      <Popover
        placement={ this.props.placement }
        title={ this.props.title }
        content={ this.props.content }
        visible={ true }
        className={ classNames(styles.shadowPopover, this.props.className) }
        style={ this.props.style }>
        <div className={ classNames(styles.child) } style={ {
          width: this.props.childrenWidth,
          height: this.props.childrenHeight,
          left: this.props.clientX,
          top: this.props.clientY
        } }></div>
      </Popover>
    );
  }
}

ShadowPopover.defaultProps = {
  childrenWidth: 100,
  childrenHeight: 40,
  clientX: 0,
  clientY: 0,
  title: '详细信息',
  content: '内容',
  placement: 'rightBottom'
};

const InjectShadowPopover = inject(({ someStore = {} }) => ({ someProps: someStore.attribute }))(ShadowPopover);

export {
  ShadowPopover,
  InjectShadowPopover
};