// 库引入
import React, { Component } from 'react';
import { observable, action } from 'mobx';
import { inject, observer } from 'mobx-react';
import classNames from 'classnames';
import { Item, ItemPanel } from 'gg-editor';
import { Menu, Icon } from 'antd';

// 组件引入


// 样式引入
import styles from './style.module.less';

// 数据操作引入
import { getCompMenuData } from '../../../../api/processEditor';

const SubMenu = Menu.SubMenu;
const MenuItem = Menu.Item;

const imgStyle = {
  width: 14,
  height: 14,
  marginRight: 10
};

/**
 * ItemPanel
 * 使用Antd.Menu来生成树形结构
 */
@observer
class ProcessEditorItemPanel extends Component {
  @observable.shallow mnueItems = null;

  // 获取构件数据
  @action getMenu = () => {
    getCompMenuData().then((response) => {
      console.info("获取构件菜单", response.data);
      this.showMenu(response.data);
    }).catch(error => {
      console.log(error);
    });
  }

  // 显示构件菜单
  @action showMenu = (data) => {
    this.mnueItems = this.renderMenuItem(data);
  }

  // 渲染构件树菜单
  @action renderMenuItem = (datas) => {
    return datas.map((data) => {
      if (data.children) {
        return (
          <SubMenu
            key={data.componentId}
            title={<span><Icon className={classNames('iconFolder')} type="folder" theme="outlined" /><Icon className={classNames('iconFolderOpen')} type="folder-open" theme="outlined" /><span title={data.componentName}>{data.componentName}</span></span>}>
            {this.renderMenuItem(data.children)}
          </SubMenu>
        );
      }
      const icon = data.icon || "profile";
      let imgComp = null;
      let imgSrc;
      // 自己的图标
      if (icon.indexOf('self_') === 0){
        const realIcon = icon.substring(5, icon.length);
        imgSrc = process.env.PUBLIC_URL + '/img/componentIcon/'+ realIcon +'.png';
        imgComp =  <img style={imgStyle} alt={realIcon} src={imgSrc} />;
      // antd图标
      } else {
        imgComp = <Icon type={icon} theme="outlined" />;
      }
      return (
        <MenuItem key={data.componentId}>
          <Item
            type="node"
            shape="process-node"  //FIXME:shape通过传值？同：形状颜色
            mode='mouseEnterFillRed'
            model={{
              // color: '#FA8C16',
              label: data.componentName,
              componentId: data.componentId,
              componentInParams: data.componentInParams,
              componentOutParams: data.componentOutParams,
              componentIcon: imgSrc,
              componentExecClass: data.componentExecClass,
              componentExecType: data.componentExecType,
              componentType: data.componentType
            }}
            linkable={false}
            >
            {imgComp}<span title={data.componentName}>{data.componentName}</span>
          </Item>
        </MenuItem>);
    });
  }

  @action componentDidMount = () => {
    this.getMenu();
  }

  render() {
    console.info('render-菜单');
    return (
      <div className={classNames(styles.processEditorItemPanel, this.props.className)} style={this.props.style}>
        <ItemPanel>
          <Menu
            style={{ width: '100%' }}
            mode="inline"
            selectable={false}
          >
            {this.mnueItems}
          </Menu>
        </ItemPanel>
      </div>
    );
  }
}

ProcessEditorItemPanel.defaultProps = {
};

const InjectProcessEditorItemPanel = inject(({ someStore = {} }) => ({ someProps: someStore.attribute }))(ProcessEditorItemPanel);

export {
  ProcessEditorItemPanel,
  InjectProcessEditorItemPanel
};