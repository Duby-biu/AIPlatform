// 库引入
import React, { Component } from 'react';
import { observable, action } from 'mobx';
import { inject, observer } from 'mobx-react';
import classNames from 'classnames';
import {
  Card as AntDCard
} from 'antd';

// 组件引入
import { TaskTable } from './components/TaskTable';
import { SearchForm } from './components/SearchForm';

// 样式引入
import styles from './style.module.less';
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
class TaskManagement extends Component {
  componentWillMount = () => {
    console.info('挂载任务管理，清空数据');
    ds.setDataSource(null);
  }
  render() {
    return (
      <div className={classNames(styles.taskManagement, 'page', this.props.className)}>
        <AntDCard>
          <SearchForm ds={ds}/>
          <TaskTable ds={ds}/>
        </AntDCard>
      </div>
    );
  }
}

TaskManagement.defaultProps = {

};

const InjectTaskManagement = inject()(TaskManagement);

export {
  TaskManagement,
  InjectTaskManagement
};