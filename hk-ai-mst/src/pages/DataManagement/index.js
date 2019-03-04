// 库引入
import React, { Component } from 'react';
import { observable, action } from 'mobx';
import { inject, observer } from 'mobx-react';
import classNames from 'classnames';
import { Card as AntDCard } from 'antd';

// 样式引入
import styles from './style.module.less';

// 组件引入
import { SearchForm } from './components/SearchForm/SearchForm';
import { Table } from './components/DataTable/Table';

class DataSource {
  @observable.shallow data = {
    dataColumns: null,
    dataSource: null,
    total: 0
  };
  // 进行了查询数据
  @observable doSearch = false;
  // 是否需要置空查询表单
  @observable needReset = null;

  @action setData = (data) => {
    this.data.dataColumns = data.columns;
    this.data.dataSource = data.dataSource;
    this.data.total = data.total;
  }
  @action setDataSource = (data) => this.data.dataSource = data;
  @action setTotal = (data) => this.data.total = data;
  @action setDoSearch = (value) => this.doSearch = value;
  @action setNeedReset = (value) => this.needReset = value;
}
const ds = new DataSource();

@observer
class DataManagement extends Component {
  componentWillMount = () => {
    console.info('挂载数据管理，清空数据');
    ds.setDataSource(null);
  }
  render() {
    console.info('render-index');
    return (
      <div className={classNames(styles.dataManagement, 'page', this.props.className)}>
        <AntDCard>
          <SearchForm ds={ds}/>
          <Table ds={ds}/>
        </AntDCard>
      </div>
    );
  }
}

DataManagement.defaultProps = {

};

const InjectDataManagement = inject()(DataManagement);

export {
  DataManagement,
  InjectDataManagement
};