// 库引入
import React, {Component} from 'react';
import {inject, observer} from 'mobx-react';
import classNames from 'classnames';
import { Button as AntDButton } from 'antd';
import { Link } from 'react-router-dom';

// 样式引入
import styles from './style.module.less';

@observer
class AddModelButton extends Component {
  render() {
    return (
      <div className={classNames(styles.addModelButton, this.props.className)} style={this.props.style}>
        <AntDButton type='primary'>
        {/* state不能去掉，用于新增模型画布初始化 */}
          <Link to={{pathname:'/admin/model-management/config/editor', state:{}}}>新增模型</Link>
        </AntDButton>
      </div>
    );
  }
}

AddModelButton.defaultProps = {
};

const InjectAddModelButton = inject(({someStore={}}) => ({someProps: someStore.attribute}))(AddModelButton);

export {
  AddModelButton,
  InjectAddModelButton
};