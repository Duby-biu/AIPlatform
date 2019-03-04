// 登录界面参考http://www.jq22.com/yanshi15518
// 库引入
import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import classNames from 'classnames';
import { Redirect } from 'react-router-dom';

// 组件引入
import { InjectLoginForm as LoginForm } from './components/LoginForm';

// 样式引入
import styles from './style.module.less';

@observer
class Login extends Component {
  render() {
    console.log('login有没',this.props.logged);
    // 从哪里来,默认从'/'
    const { from } = this.props.location.state || {
      from: {
        pathname: "/"
      }
    };
    if (this.props.logged) {
      console.log('已经登录');
      // 如果已经登录,从哪里来就到哪里去
      return (<Redirect to={ from } />);
    }
    return (
      <div className={ classNames(styles.login, 'page', this.props.className) }>
        <div className={ styles.loginCard }>
          <LoginForm />
        </div>
      </div>
    );
  }
}

Login.defaultProps = {
  // 是否已经登录
  logged: false
};

const InjectLogin = inject(({ authStore = {} }) => ({
  logged: !!authStore.logged,
}))(Login);

export {
  Login,
  InjectLogin
};