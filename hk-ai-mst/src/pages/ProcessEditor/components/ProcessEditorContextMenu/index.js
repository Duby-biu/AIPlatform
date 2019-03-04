// 库引入
import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import classNames from 'classnames';
import { ContextMenu, NodeMenu, CanvasMenu, EdgeMenu, Command } from 'gg-editor';
import { Menu, Icon } from 'antd';

//组件引入
import { IconFont } from '../../../../components/IconFont';

// 样式引入
import styles from './style.module.less';

// 一些值
const { Item: MenuItem } = Menu;

/**
 * Editor的右键菜单
 * 考虑到可能会有二级菜单,故使用antd.Menu
 */
@observer
class ProcessEditorContextMenu extends Component {
  render() {
    return (
      <ContextMenu className={ classNames(styles.processEditorContextMenu, this.props.className) } style={ this.props.style }>
        {/* 节点的右键菜单 */ }
        <NodeMenu>
          <Menu
            mode="vertical"
            selectable={ false }>
            <MenuItem><Command name="copy"><Icon type="copy" theme="outlined" /><span>复制</span></Command></MenuItem>
            <MenuItem><Command name="delete"><Icon type="delete" theme="outlined" /><span>删除</span></Command></MenuItem>
          </Menu>
        </NodeMenu>
        {/* 画布的右键菜单 */ }
        <CanvasMenu>
          <Menu
            mode="vertical"
            selectable={ false }>
            <MenuItem><Command name="undo"><Icon type="undo" theme="outlined" /><span>撤销</span></Command></MenuItem>
            <MenuItem><Command name="redo"><Icon type="redo" theme="outlined" /><span>重做</span></Command></MenuItem>
            <MenuItem><Command name="pasteHere"><IconFont type="icon-paste" /><span>粘贴</span></Command></MenuItem>
          </Menu>
        </CanvasMenu>
        {/* 连线的右键菜单 */ }
        <EdgeMenu>
          <Menu
            mode="vertical"
            selectable={ false }>
            <MenuItem><Command name="delete"><Icon type="delete" theme="outlined" /><span>删除</span></Command></MenuItem>
          </Menu>
        </EdgeMenu>
      </ContextMenu>
    );
  }
}

ProcessEditorContextMenu.defaultProps = {
};

const InjectProcessEditorContextMenu = inject(({ someStore = {} }) => ({ someProps: someStore.attribute }))(ProcessEditorContextMenu);

export {
  ProcessEditorContextMenu,
  InjectProcessEditorContextMenu
};