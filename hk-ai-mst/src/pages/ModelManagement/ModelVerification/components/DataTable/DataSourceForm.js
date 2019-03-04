// 库引入
import React, { Component } from 'react';
import { action, observable } from 'mobx';
import { inject, observer } from 'mobx-react';
import classNames from 'classnames';
import {
  Form as AntDForm,
  Input as AntDInput,
  Button as AntDButton,
  Row as AntDRow,
  Col as AntDCol,
  Select as AntDSelect,
  Radio as AntDRadio,
} from 'antd';
import fp from 'lodash/fp';

// 样式引入
import styles from './style.module.less';

// 数据操作引入
import { getDataSource} from '../../../../../api/modelManagement/modelVerification';



const AntDFormItem = AntDForm.Item;
const AntDOption = AntDSelect.Option;

const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 16 }
};

@AntDForm.create()
@observer
class DataSourceForm extends Component {
  @observable dataSource = [];

  @action setDataSource = (data) => {
    if (data){
      this.dataSource = data;
    }
  }

  // 暴露表单方法给父组件
  @action componentDidMount = () => {
    this.props.getChild(this.props.form);
  }

  @action componentWillMount = () => {
    getDataSource().then(response => {
      console.info(response);
      this.setDataSource(response.data.dataSource);
    }).catch(error => {
      console.info(error.message);
    });
  }

  render() {
    console.info('render-验证-数据源选择');
    const { getFieldDecorator } = this.props.form;
    const comp = this.dataSource.map(data => <AntDOption key={data.dataId}>{data.dataName}</AntDOption>);
    return (
      <div className={classNames(styles.DataSourceForm, this.props.className)} style={this.props.style}>
        <AntDForm onSubmit={this.handleSubmit}>
          <AntDFormItem label='数据源' {...formItemLayout}>
            {getFieldDecorator('dataSource', {
              rules: [{ required: true, message: '请选择数据源' }],
            })(
              <AntDSelect>
                {comp}
              </AntDSelect>
            )}
          </AntDFormItem>
        </AntDForm>
      </div>
    );
  }
}

DataSourceForm.defaultProps = {
};

// const InjectDataSourceForm = inject(({someStore = {}}) => ({someProps: someStore.attribute}))(DataSourceForm);
const InjectDataSourceForm = inject()(DataSourceForm);

export {
  DataSourceForm,
  InjectDataSourceForm
};