// 库引入
import React, { Component } from 'react';
import { observable, action } from 'mobx';
import { inject, observer } from 'mobx-react';
import classNames from 'classnames';
import {
  Row as AntDRow,
  Col as AntDCol,
  Card as AntDCard
} from 'antd';

// 样式引入
import styles from './style.module.less';

// 组件引入
import { Tree } from './Tree';
import { Detail } from './Detail';
import { SearchForm } from './SearchForm';

// 节点详细配置表
class DetailForm {
  @observable className = 'hideDetailForm';
  @observable title = '节点信息';
  @observable selectedNodeKey;
  @observable detailFormData = {};
  @observable rootId = '';
  @observable treeRefresh = false;
  @observable searchNodes = "";
  @observable doSearch = false;
  @observable needReset= false;
  @observable buttonDisabled = false

  @action setVisible = (value) => this.className = value;
  @action setTitle = (value) => this.title = value;
  @action setSelectedNodeKey = (value) => this.selectedNodeKey = value;
  @action setDetailFormData = (value) => this.detailFormData = value;
  @action setRootId = (value) => this.rootId = value;
  @action setTreeRefresh = () => this.treeRefresh = !this.treeRefresh;
  @action setSearchNodes = (data) => this.searchNodes = data;
  @action setDoSearch = (value) => this.doSearch = value;
  @action setNeedReset = (value) => this.needReset = value;
  @action setButtonDisabled = (value) => this.buttonDisabled = value;
}
// 节点详细配置表
const detailForm = new DetailForm();

@observer
class ComponentManagement extends Component {
  componentWillMount = () => {
    console.info('will_构件管理');
    // 在重新加载该页面时隐藏表单
    detailForm.setVisible('hideDetailForm');
  }

  render() {
    console.info('render-构件管理');
    return (
      <div className={classNames(styles.componentManagement, this.props.className)} style={this.props.style}>
        <AntDCard>
          <AntDRow gutter={24}>
            <AntDCol span={24}><SearchForm detailForm={detailForm} /></AntDCol>
          </AntDRow>
          <AntDRow gutter={24}>
            <AntDCol span={8}><Tree detailForm={detailForm} /></AntDCol>
            <AntDCol span={16}><Detail detailForm={detailForm} /></AntDCol>
          </AntDRow>
        </AntDCard>
      </div>
    );
  }
}

ComponentManagement.defaultProps = {
};

// const InjectComponentManagement = inject(({someStore={}}) => ({someProps: someStore.attribute}))(ComponentManagement);
const InjectComponentManagement = inject()(ComponentManagement);

export {
  ComponentManagement,
  InjectComponentManagement
};