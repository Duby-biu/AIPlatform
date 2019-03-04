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
import { searchTreeNode } from '../../../../api/systemManagement/componentManagement';

const AntDFormItem = AntDForm.Item;
const AntDOption = AntDSelect.Option;

@AntDForm.create()
@observer
class SearchForm extends Component {
  test = autorun(()=>{
    if(this.props.detailForm.needReset) {
      this.props.form.resetFields();
    }
  })

  @action handleSearch = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      let count = 0;
      for (let key in values) {
        if (!values[key]) {
          count++;
          values[key] = "";
        }
      }
      // 查询输入为空
      if (count === 3){
        this.props.detailForm.setSearchNodes("");
        this.props.detailForm.setTreeRefresh();
        return;
      }
      searchTreeNode(values).then((response) => {
        console.info(response);
        const searchNodes = [];
        response.data.map((node) => {
          return searchNodes.push(node.componentId);
        });
        const data = searchNodes.join();
        this.props.detailForm.setDoSearch(true);
        this.props.detailForm.setSearchNodes(data);
        this.props.detailForm.setTreeRefresh();
      }).catch(error => {
        console.info(error);
      });
      console.info('查询数据');
    });
  }

  @action handleReset = () => {
    this.props.detailForm.setDoSearch(false);
    this.props.form.resetFields();
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <div className={classNames(styles.componentDemo, this.props.className)} style={this.props.style}>
        <AntDForm className={classNames(styles.searchForm)} onSubmit={this.handleSearch}>
          <AntDRow gutter={24}>
            <AntDCol span={8}>
              <AntDFormItem label='构件名称'>
                {getFieldDecorator('componentName')(
                  <AntDInput placeholder='请输入' />
                )}
              </AntDFormItem>
            </AntDCol>
            <AntDCol span={8}>
              <AntDFormItem label='构件类型'>
                {getFieldDecorator('componentType')(
                  <AntDSelect allowClear>
                    <AntDOption value='DL4J_DATA'>DL4J_DATA</AntDOption>
                    <AntDOption value='DL4J_LAYER'>DL4J_LAYER</AntDOption>
                  </AntDSelect>
                )}
              </AntDFormItem>
            </AntDCol>
            <AntDCol span={8}>
              <AntDFormItem label='构件执行类型'>
                {getFieldDecorator('componentExecType')(
                  <AntDSelect allowClear>
                    <AntDOption value='jave'>Java</AntDOption>
                    <AntDOption value='python'>Python</AntDOption>
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