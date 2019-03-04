// 库引入
import React, {Component} from 'react';
import {inject, observer} from 'mobx-react';
import {Icon} from 'antd';

// 一些值
const IconFromIconfontCN = Icon.createFromIconfontCN({
  scriptUrl: '//at.alicdn.com/t/font_863905_fr0m74dze1q.js',
});

/**
 * 自定义使用iconfont图标,参考https://ant.design/components/icon-cn/#components-icon-demo-iconfont
 */
@observer
class IconFont extends Component {
  render() {
    return (
      <IconFromIconfontCN {...this.props}  />
    );
  }
}

IconFont.defaultProps = {
};

const InjectIconFont = inject(({someStore={}}) => ({someProps: someStore.attribute}))(IconFont);

export {
  IconFont,
  InjectIconFont
};