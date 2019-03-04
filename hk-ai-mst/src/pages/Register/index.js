// 登录界面参考http://www.jq22.com/yanshi15518
// 库引入
import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import classNames from 'classnames';

// 组件引入
import { RegisterForm } from './components/RegisterForm';
import {InjectDocumentTitle as DocumentTitle} from '../../components/DocumentTitle';

// 样式引入
import styles from './style.module.less';

/**
 * 注册页面
 */
@observer
class Register extends Component {
  render() {
    return (
      <div className={ classNames(styles.register, 'page', this.props.className) }>
        <div className={ styles.registerCard }>
          <RegisterForm />
        </div>
        <DocumentTitle documentTitle="注册-核格人工智能平台" />
      </div>
    );
  }
}

Register.defaultProps = {

};

const InjectRegister = inject()(Register);

export {
  Register,
  InjectRegister
};