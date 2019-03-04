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
import { Table } from './components/DataTable';

// mobx引入
import { IsVisible, Type, ChartSetting } from './ModelVerificationMobx.js';

// 验证数据源选择弹出框--显隐
const dataSourceVisible = new IsVisible();
// 自定义图表设置弹出框--显隐
const chartSettingVisible = new IsVisible();
// 自定义图表展示弹出框--显隐
const chartVisible = new IsVisible();
// 自定义图片设置--下拉type
const chartType = new Type();
// 自定义图表设置--配置项
const setting = new ChartSetting();

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
class ModelVerification extends Component {
  @action componentWillMount = () => {
    console.info('挂载模型验证，清空数据');
    ds.setDataSource(null);
  }
  render() {
    return (
      <div className={classNames(styles.ModelVerification, 'page', this.props.className)}>
        <AntDCard>
          <SearchForm ds={ds} />
          <Table
            ds={ds}
            dataSourceVisible={dataSourceVisible}
            chartSettingVisible={chartSettingVisible}
            chartVisible={chartVisible}
            type={chartType}
            setting={setting} />
        </AntDCard>
      </div>
    );
  }
}

ModelVerification.defaultProps = {

};

const InjectModelVerification = inject()(ModelVerification);

export {
  ModelVerification,
  InjectModelVerification
};