// 库引入
import React, { Component } from 'react';
import { observable, action } from 'mobx';
import { inject, observer } from 'mobx-react';
import classNames from 'classnames';
import { Link } from 'react-router-dom';
import { Form, Input, Icon, Checkbox, Button, message } from 'antd';
import QueueAnim from 'rc-queue-anim';

// utils 引入
import {fPromise} from '../../../../utils/f2f';

// 样式引入
import styles from './style.module.less';

// 一些值
const FormItem = Form.Item;

@Form.create()
@observer
class LoginForm extends Component {
  // 指示是否正在登录
  @observable loading = false;

  // 设置是否正在登录
  @action setLoading = (loading = false) => {
    this.loading = loading;
  }

  // 表单提交的方法
  @action handleSubmit = (e) => {
    e.preventDefault();
    // 验证表单是否有错误
    this.props.form.validateFields((err, values) => {
      if (!err) {
        // 设置正在登陆
        this.setLoading(true);
        console.log('登录表单的值为: ', values);
        // 调用mst登录接口
        this.props.login(values).then((res)=>{
          message.success('登录成功');
          this.setLoading(false);
        }).catch(()=>{
          this.setLoading(false);
        });
      }
    });
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <div className={ classNames(styles.loginFormPanel, this.props.className, 'clearfix') } style={ this.props.style }>
        {/* 进出场动画 */ }
        <QueueAnim type="scale" interval={ 0 }>
          <h1 key="a" className={ styles.title }>管理员登录</h1>
          <Form key="b" onSubmit={ this.handleSubmit }>
            <FormItem>
              { getFieldDecorator('username', {
                rules: [{ required: true, message: '请输入用户名' }],
              })(
                <Input className={ styles.input } prefix={ <Icon type="user" /> } placeholder="用户名" />
              ) }
            </FormItem>
            <FormItem>
              { getFieldDecorator('password', {
                rules: [{ required: true, message: '请输入密码' }],
              })(
                <Input className={ styles.input } prefix={ <Icon type="lock" /> } type="password" placeholder="密码" />
              ) }
            </FormItem>
            <FormItem>
              { getFieldDecorator('ifRemember', {
                valuePropName: 'checked',
                initialValue: true,
              })(
                <Checkbox className={ styles.checkbox }>记住密码</Checkbox>
              ) }
              <Link className={ styles.textLink } to="/">忘记密码</Link>
            </FormItem>
            <FormItem>
              <div className={ styles.handleRow }>
                <div className={ styles.handleButtonCol }>
                  <Button block loading={ this.loading } className={ styles.handleButton } ghost type="primary" htmlType="submit">登录</Button>
                </div>
                <Link className={ styles.textLink } to="/register">注册</Link>
              </div>
            </FormItem>
          </Form>
          <p key="c">欢迎使用核格人工智能平台</p>
        </QueueAnim>
      </div>
    );
  }
}

LoginForm.defaultProps = {
  // 登录,表单验证成功后调用
  login: fPromise,
};

const InjectLoginForm = inject(({ authStore = {} }) => ({
  login: authStore.login,
  logged: authStore.logged,
}))(LoginForm);

export {
  LoginForm,
  InjectLoginForm
};