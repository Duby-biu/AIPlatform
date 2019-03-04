// 库引入
import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import classNames from 'classnames';
import fp from 'lodash/fp';
import { Avatar, Icon, Menu, Dropdown } from 'antd';

// 样式引入
import styles from './style.module.less';

/**
 * 当前用户信息
 */
@observer
class UserInfoDropDown extends Component {
  renderMenu = () => {
    return (
      <Menu>
        <Menu.Item>
          <Icon type="user" theme="outlined" /><span>个人中心</span>
        </Menu.Item>
        <Menu.Item>
          <Icon type="setting" theme="outlined" /><span>个人设置</span>
        </Menu.Item>
        <Menu.Divider />
        <Menu.Item>
          <Icon type="logout" theme="outlined" /><span>退出登录</span>
        </Menu.Item>
      </Menu>
    );
  }
  render() {
    return (
      <div className={ classNames(styles.userInfoDropDown, this.props.className) } style={ this.props.style }>
        <Dropdown overlay={ this.renderMenu() }>
          <div className={ classNames(styles.dropdownHanlde) }>
            {
              this.props.avatar ? (<Avatar src={ this.props.avatarImg } size="small" />) : (<Icon className={classNames(styles.iconAvatar)} type="user" theme="outlined" />)
            }
            <span className={ classNames(styles.userName) }>{ this.props.userName }</span>
          </div>
        </Dropdown>
      </div>
    );
  }
}

UserInfoDropDown.defaultProps = {
  // 头像url
  avatar: '',
  // 当前用户名
  userName: '当前用户',
};

const InjectUserInfoDropDown = inject(({ authStore = {} }) =>
  ({ userName: fp.get('currentUser.data.realname', authStore) }))(UserInfoDropDown);

export {
  UserInfoDropDown,
  InjectUserInfoDropDown
};