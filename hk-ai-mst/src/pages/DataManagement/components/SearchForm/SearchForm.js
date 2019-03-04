// 库引入
import React, { Component } from 'react';
import { action, autorun } from 'mobx';
import { inject, observer } from 'mobx-react';
import classNames from 'classnames';
import {
  Form as AntDForm,
  Input as AntDInput,
  Button as AntDButton,
  Row as AntDRow,
  Col as AntDCol,
  Select as AntDSelect

} from 'antd';

// 样式引入
import styles from './style.module.less';

// 数据操作引入
import { searchTableData } from '../../../../api/dataManagement';

const AntDFormItem = AntDForm.Item;
const AntDOption = AntDSelect.Option;

@AntDForm.create()
@observer
class SearchForm extends Component {
  test = autorun(()=>{
    if(this.props.ds.needReset) {
      this.props.form.resetFields();
    }
  })

  @action handleSearch = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      for(let key in values) {
        if(!values[key]){
          values[key] = "";
        }
      }
      searchTableData(values).then((response) => {
        console.info(response);
        response.data.dataSource.map((item) => {
          return item.key = item.dataId;
        });
        this.props.ds.setDoSearch(true);
        this.props.ds.setDataSource(response.data.dataSource);
        this.props.ds.setTotal(response.data.total);
      }).catch(error => {
        console.info(error);
      });
      console.info('查询数据');
    });
  }

  @action handleReset = () => {
    this.props.ds.setDoSearch(false);
    this.props.form.resetFields();
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <div className={classNames(styles.componentDemo, this.props.className)} style={this.props.style}>
        <AntDForm className={classNames(styles.searchForm)} onSubmit={this.handleSearch}>
          <AntDRow gutter={24}>
            <AntDCol span={8}>
              <AntDFormItem label='名称'>
                {getFieldDecorator('dataName')(
                  <AntDInput placeholder='请输入' />
                )}
              </AntDFormItem>
            </AntDCol>
            <AntDCol span={8}>
              <AntDFormItem label='状态'>
                {getFieldDecorator('state')(
                  <AntDSelect allowClear={true}>
                    <AntDOption value='normal'>正常</AntDOption>
                    <AntDOption value='exception'>异常</AntDOption>
                    <AntDOption value='updating'>更新中</AntDOption>
                  </AntDSelect>
                )}
              </AntDFormItem>
            </AntDCol>
            <AntDCol span={8}>
              <AntDFormItem label='类型'>
                {getFieldDecorator('type')(
                  <AntDSelect allowClear={true}>
                    <AntDOption value='Local'>Local</AntDOption>
                    <AntDOption value='Mysql'>Mysql</AntDOption>
                    <AntDOption value='Oracle'>Oracle</AntDOption>
                    <AntDOption value='PostgreSQL'>PostgreSQL</AntDOption>
                    <AntDOption value='HDFS'>HDFS</AntDOption>
                    <AntDOption value='API'>API</AntDOption>
                    <AntDOption value='FTP'>FTP</AntDOption>
                  </AntDSelect>
                )}
              </AntDFormItem>
            </AntDCol>
          </AntDRow>
          <AntDRow>
            <AntDCol span={24} style={{ textAlign: 'right' }}>
              <AntDButton type="primary" htmlType="submit">查询</AntDButton>
              <AntDButton style={{ marginLeft: 8 }} onClick={this.handleReset}>重置</AntDButton>
            </AntDCol>
          </AntDRow>
        </AntDForm>
      </div>
    );
  }
}

SearchForm.defaultProps = {
};

// const InjectSearchForm = inject(({someStore={}}) => ({someProps: someStore.attribute}))(SearchForm);
const InjectSearchForm = inject()(SearchForm);

export {
  SearchForm,
  InjectSearchForm
};