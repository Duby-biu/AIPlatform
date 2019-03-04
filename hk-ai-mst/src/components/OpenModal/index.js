// 库引入
import { action } from 'mobx';
import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import classNames from 'classnames';
import {
  Modal as AntDModal,
} from 'antd';

// 样式引入
import styles from './style.module.less';

@observer
class OpenModal extends Component {
  handleOk = (e) => {
    console.info(e);
    this.props.visible.setVisible(false);
  }
  handleCancel = (e) => {
    console.info(e);
    this.props.visible.setVisible(false);
  }

  // 弹出框关闭回调
  @action handleAfterClose = () => {
    // 是表单则重置表单
    if(this.props.resetFields){
      this.props.resetFields();
    }
    // 是表单且有type，重置type（type用于生成不同表单项）
    console.info(this.props.type);
    if (this.props.type !== undefined) {
      this.props.type.setType("");
    }
  }
  render() {
    console.info('render-openModal');
    return (
      <div className={classNames(styles.componentDemo, this.props.className)} style={this.props.style}>
        <AntDModal
          title={this.props.title}
          visible={this.props.visible.visible}
          onOk={this.props.handleOk || this.handleOk}
          onCancel={this.props.handleCancel || this.handleCancel}
          afterClose={this.props.handleAfterClose || this.handleAfterClose}
        >
        {this.props.children}
        </AntDModal>
      </div>
    );
  }
}

OpenModal.defaultProps = {
  title: '标题',
};

// const InjectOpenModal = inject(({someStore={}}) => ({someProps: someStore.attribute}))(OpenModal);
const InjectOpenModal = inject()(OpenModal);

export {
  OpenModal,
  InjectOpenModal
};