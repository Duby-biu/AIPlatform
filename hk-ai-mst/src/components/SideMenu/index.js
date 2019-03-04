// 库引入
import React, {Component} from 'react';
import {inject, observer} from 'mobx-react';
import classNames from 'classnames';
import {withRouter, Link} from 'react-router-dom';
import {computed, action} from 'mobx';
import {Menu, Icon} from 'antd';

// 工具类引入
import {trimUrlSpritCharsEndInProps} from '../../utils/trimSpritCharsEnd';

// 样式引入
import styles from './style.module.less';

//常量引入
import {navList} from '../../constants/navList';

//一些值
const {SubMenu, Item} = Menu;

/**
 * 侧边导航菜单
 */
@withRouter
@observer
class SideMenu extends Component {
  // 当前需要打开的菜单项
  defaultOpenKeys = [];

  // 当前选中的菜单项,去掉this.matchUrl(因为key里面可能不包括this.matchUrl),所以用slice
  defaultSelectedKeys = this.props.defaultSelectedKeys || [this
    .props
    .location
    .pathname
    .slice(this.matchUrl.length)];
  
  // matchUrl,去掉结尾的/
  @computed get matchUrl() {
    return trimUrlSpritCharsEndInProps(this.props);
  }

  // 渲染菜单项的方法
  @action renderMenuNodes = (data) => {
    // 每个导航项的dom结构都是有要求的,请谨慎修改
    return data.map(item => {
      const iconType = item.iconType || 'profile';
      if (item.children) {
        // 计算defaultOpenKeys
        this
          .props
          .location
          .pathname
          .indexOf(`${this.matchUrl}${item.key}`) === 0 && this
          .defaultOpenKeys
          .push(item.key);
        return (
          <SubMenu
            key={item.key}
            title={(
            <span><Icon type={iconType}/>
              <span>{item.title}</span>
            </span>
          )}>
            {this.renderMenuNodes(item.children)}
          </SubMenu>
        );
      } else {
        return (
          <Item key={item.key}>
            {item.to
              ? (
                <Link to={`${this.matchUrl}${item.to}` || this.matchUrl}><Icon type={iconType}/>
                  <span>{item.title}</span>
                </Link>
              )
              : (
                <span><Icon type={iconType}/>
                  <span>{item.title}</span>
                </span>
              )}
          </Item>
        );
      }
    });
  }

  render() {
    return (
      <div
        className={classNames(styles.sideMenu, this.props.className)}
        style={this.props.style}>
        <Menu
          className={classNames(styles.menu)}
          theme="dark"
          mode="inline"
          defaultOpenKeys={this.defaultOpenKeys}
          defaultSelectedKeys={this.defaultSelectedKeys}>
          {this.renderMenuNodes(this.props.dataSource)}
        </Menu>
      </div>
    );
  }
  
  shouldComponentUpdate(nextProps, nextState){
    return true;
  }
}

SideMenu.defaultProps = {
  // 菜单的数据
  dataSource: navList
};

const InjectSideMenu = inject(({
  someStore = {}
}) => ({someProps: someStore.attribute}))(SideMenu);

export {SideMenu, InjectSideMenu};