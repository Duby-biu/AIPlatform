// 库引入
import React, { Component } from 'react';
import { observable, action } from 'mobx';
import { inject, observer } from 'mobx-react';
import classNames from 'classnames';
import { Form, Input, Icon, Button } from 'antd';
import QueueAnim from 'rc-queue-anim';
import {Link} from 'react-router-dom';

// utils引入
import {fPromise} from '../../../../utils/f2f';

// 样式引入
import styles from './style.module.less';

// 一些值
const FormItem = Form.Item;

@Form.create()
@observer
class RegisterForm extends Component {
  // 指示是否正在注册
  @observable loading = false;

  @action setLoading = (loading = false) => {
    this.loading = loading;
  }

  // 校验确认密码的函数
  @action validateConfirmedPassword = (rule, value, callback) => {
    const { getFieldValue } = this.props.form;
    if (value !== getFieldValue('password')) {
      callback('确认密码和密码不一致');
    } else {
      callback();
    }
  }

  @action handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.setLoading(true);
        console.log('注册表单的值为: ', values);
        this.props.register();
      }
    });
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <div className={ classNames(styles.registerFormPanel, this.props.className, 'clearfix') } style={ this.props.style }>
        <QueueAnim type="scale" interval={ 0 }>
          <h1 key="a" className={ styles.title }>注册</h1>
          <Form key="b" onSubmit={ this.handleSubmit }>
            <FormItem>
              { getFieldDecorator('userName', {
                rules: [{ required: true, message: '请输入用户名' }],
              })(
                <Input className={ styles.input } prefix={ <Icon type="user" /> } placeholder="用户名" />
              ) }
            </FormItem>
            <FormItem>
              { getFieldDecorator('realname', {
                rules: [{ required: true, message: '请输入真实姓名' }],
              })(
                <Input className={ styles.input } prefix={ <Icon type="user" /> } placeholder="真实姓名" />
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
              { getFieldDecorator('confirmedPassword', {
                rules: [{ required: true, message: '请输入确认密码' }, {
                  validator: this.validateConfirmedPassword
                }],
              })(
                <Input className={ styles.input } prefix={ <Icon type="lock" /> } type="password" placeholder="确认密码" />
              ) }
            </FormItem>
            <FormItem>
            <div className={ styles.handleRow }>
                <div className={ styles.handleButtonCol }>
                  <Button block loading={ this.loading } className={ styles.handleButton } ghost type="primary" htmlType="submit">注册</Button>
                </div>
                <Link className={ styles.textLink } to="/login">登录</Link>
              </div>
            </FormItem>
          </Form>
          <p key="c">欢迎使用核格人工智能平台</p>
        </QueueAnim>
      </div>
    );
  }
}

RegisterForm.defaultProps = {
  register: fPromise
};

const InjectRegisterForm = inject(({ someStore = {} }) => ({ someProps: someStore.attribute }))(RegisterForm);

export {
  RegisterForm,
  InjectRegisterForm
};