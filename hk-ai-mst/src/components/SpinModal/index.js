import React, {Component} from 'react';
import {Modal, Spin} from 'antd';
import {inject, observer} from 'mobx-react';
import classNames from 'classnames';

import styles from './style.module.less';

@observer
class SpinModal extends Component {
  render() {
    return (
      <Modal
        id={this.props.id}
        className={classNames(styles.spinModal, this.props.classNames)}
        visible={this.props.visible}
        width={[60, 50, 80, 80]}
        closable={false}
        footer={null}
        maskStyle={{
        transition: 'none',
        animate: 'none',
        background: 'rgba(0,0,0,0.2)'
      }}>
        <Spin tip={this.props.tip}/>
      </Modal>
    );
  }
}

SpinModal.defaultProps = {
  tip: '请稍候...'
};

// 此导出是为了兼容不需要inject组件或者需要另外的inject组件的情况,请参考https://daveceddia.com/what-does-red
// ux-do/
export {SpinModal};

// 因为整个项目是基于mst的,所以默认导出inject组件
export default inject(({someStore}) => ({someProps: someStore.attribute}))(SpinModal);