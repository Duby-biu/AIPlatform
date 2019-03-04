// 库引入
import React, { Component } from 'react';
import { action } from 'mobx';
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
import { searchTableData } from '../../../../../api/modelManagement/modelRelease';

const AntDFormItem = AntDForm.Item;
const AntDOption = AntDSelect.Option;

@AntDForm.create()
@observer
class SearchForm extends Component {
  @action handleSearch = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      for (let key in values) {
        if (!values[key]) {
          values[key] = "";
        }
      }
      searchTableData(values).then((response) => {
        console.info(response);
        response.data.dataSource.map((item) => {
          switch(item.state) {
            case 0: item.state = '已配置';break;
            case 1: item.state = '训练中';break;
            case 2: item.state = '中止训练';break;
            case 3: item.state = '训练完成';break;
            case 4: item.state = '验证中';break;
            case 5: item.state = '验证完成';break;
            case 6: item.state = '发布成功';break;
            case 7: item.state = '停止发布';break;
            case 8: item.state = '服务中';break;
            case -1: item.state = '异常';break;
            default: item.state = '无状态';
          }
          item.releaseState === 0 ?  item.releaseState = '未发布' :  item.releaseState = '已发布';
          return item.key = item.verifyId;
        });
        this.props.ds.setDataSource(response.data.dataSource);
        this.props.ds.setTotal(response.data.total);
      }).catch(error => {
        console.info(error);
      });
      console.info('查询数据');
    });
  }

  @action handleReset = () => {
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
                {getFieldDecorator('name')(
                  <AntDInput placeholder='请输入' />
                )}
              </AntDFormItem>
            </AntDCol>
            <AntDCol span={8}>
              <AntDFormItem label='发布状态'>
                {getFieldDecorator('releaseState')(
                  <AntDSelect allowClear={true}>
                    <AntDOption value='0'>未发布</AntDOption>
                    <AntDOption value='1'>已发布</AntDOption>
                  </AntDSelect>
                )}
              </AntDFormItem>
            </AntDCol>
            <AntDCol span={8}>
              <AntDFormItem label='版本号'>
                {getFieldDecorator('version')(
                  <AntDInput placeholder='请输入' />
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