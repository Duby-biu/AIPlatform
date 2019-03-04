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

  @action setData = (data) => {
    this.data.dataColumns = data.columns;
    this.data.dataSource = data.dataSource;
    this.data.total = data.total;
  }
  @action setDataSource = (data) => this.data.dataSource = data;
  @action setTotal = (data) => this.data.total = data;
}
const ds = new DataSource();

@observer
class ModelRelease extends Component {
  componentWillMount = () => {
    console.info('挂载模型发布，清空数据');
    ds.setDataSource(null);
  }
  render() {
    return (
      <div className={classNames(styles.ModelRelease, 'page', this.props.className)}>
        <AntDCard>
          <SearchForm ds={ds}/>
          <Table ds={ds}/>
        </AntDCard>
      </div>
    );
  }
}

ModelRelease.defaultProps = {

};

const InjectModelRelease = inject()(ModelRelease);

export {
  ModelRelease,
  InjectModelRelease
};