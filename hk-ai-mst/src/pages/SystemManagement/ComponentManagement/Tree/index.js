// 库引入
import React, { Component } from 'react';
import { action, observable, autorun } from 'mobx';
import { inject, observer } from 'mobx-react';
import classNames from 'classnames';
import {
  Tree as AntDTree,
  Button as AntDButton,
  Modal as AntDModal,
  Icon as AntDIcon
} from 'antd';

// 样式引入
import styles from './style.module.less';

// 数据操作引入
import { getTreeData, getTreeNodeData, deleteTreeNode } from '../../../../api/systemManagement/componentManagement';

const AntDTreeNode = AntDTree.TreeNode;
const confirm = AntDModal.confirm;


@observer
class Tree extends Component {
  @observable treeNode = null;
  @observable selectNodes = {
    keys: [],
    info: {}
  };


  // 获取树数据
  getTreeDatas = () => {
    console.info('autorun-getAllTreeNodes', this.props.detailForm.treeRefresh);
    getTreeData().then((response) => {
      console.info("获取树", response.data);
      this.props.detailForm.setRootId(response.data[0].componentId);
      this.showTreeNodes(response.data);
    }).catch(error => {
      console.log(error);
    });
  }

  test = autorun(() => {
    this.getTreeDatas();
  })

  @action showTreeNodes = (data) => {
    this.treeNode = this.renderTreeNodes(data);
  }

  // 渲染树
  renderTreeNodes = (data) => {
    return data.map((item) => {
      if (item.children) {
        return (
          <AntDTreeNode title={item.componentName} key={item.componentId}>
            {this.renderTreeNodes(item.children)}
          </AntDTreeNode>
        );
      }
      return <AntDTreeNode title={item.componentName} key={item.componentId} />;
    });
  }

  // 点击树节点
  @action handleSelect = (selectedKeys, info) => {
    this.props.detailForm.setButtonDisabled(false);
    console.info('选择了节点', selectedKeys);
    this.selectNodes = {
      keys: selectedKeys,
      info: info
    };
    if (!selectedKeys[0]) {
      this.props.detailForm.setVisible('hideDetailForm');
    } else {
      this.props.detailForm.setSelectedNodeKey(selectedKeys[0]);
      this.props.detailForm.setTitle('节点信息');
      // 先隐藏再出现详细框（这样才能重新加载form达到初始化效果）
      this.props.detailForm.setVisible('hideDetailForm');
      getTreeNodeData(selectedKeys[0]).then((response) => {
        this.props.detailForm.setVisible('showDetailForm');
        this.props.detailForm.setDetailFormData(response.data);
      }).catch(error => console.log(error));
    }
  }

  @action showAddForm = () => {
    this.props.detailForm.setButtonDisabled(true);
    this.props.detailForm.setVisible('showDetailForm');
    this.props.detailForm.setDetailFormData({});
    this.props.detailForm.setTitle('新增节点');
  }

  showDeleteConfirm = () => {
    const _this = this;
    const node = this.selectNodes.info.node;
    let key;
    if (this.selectNodes.keys.length !== 0){
      key = this.selectNodes.keys[0];
    }
    const rootId = this.props.detailForm.rootId;
    let content = "您是否要删除此节点";
    let flag = 0;
    if (!key) {
      content = "请选择要删除的节点";
      flag = 1;
    } else if (!node.isLeaf()) {
      if (key === rootId) {
        content = "根节点不可删除";
        flag = 2;
      } else {
        content = "该节点下还有子节点，请删除子节点后再尝试";
        flag = 3;
      }
    }
    confirm({
      title: '注意',
      content: content,
      okText: '确定',
      cancelText: '取消',
      onOk() {
        // 删除节点
        if (flag === 0) {
          deleteTreeNode(key).then(() => {
            _this.props.detailForm.setVisible('hideDetailForm');
            _this.props.detailForm.setTreeRefresh();
          }).catch(error => {
            console.info(error);
          });
        }
        console.log('OK', key);
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  }

  // 这里 做查询高亮，父节点不展开问题
  handleFilterTreeNode = (treeNode) => {
    if(!this.props.detailForm.searchNodes){
      return false;
    }
    console.info(this.props.detailForm.searchNodes, '-------------', treeNode.props.eventKey);
    if (this.props.detailForm.searchNodes.indexOf(treeNode.props.eventKey) !== -1) {
      return true;
    }
    return false;
  }
  render() {
    console.info('render-tree');
    return (
      <div className={classNames(styles.tree, this.props.className)} style={this.props.style}>
        <AntDButton type='primary' onClick={this.showAddForm} icon='plus' disabled={this.props.detailForm.buttonDisabled}>添加节点</AntDButton>
        <AntDButton type='danger' style={{ marginLeft: 12 }} onClick={this.showDeleteConfirm} icon='delete' disabled={this.props.detailForm.buttonDisabled}>删除节点</AntDButton>
        {this.treeNode && this.treeNode.length
          ? <AntDTree
            defaultExpandAll
            filterTreeNode={this.handleFilterTreeNode}
            onSelect={this.handleSelect}
          >
            {this.treeNode}
          </AntDTree>
          : <AntDIcon type="loading" />}
      </div>
    );
  }
}

Tree.defaultProps = {
};

// const InjectTree = inject(({someStore={}}) => ({someProps: someStore.attribute}))(Tree);
const InjectTree = inject()(Tree);

export {
  Tree,
  InjectTree
};