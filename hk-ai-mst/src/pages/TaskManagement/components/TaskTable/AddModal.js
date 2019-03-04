// 库引入
import React, { Component } from 'react';
import { action, observable } from 'mobx';
import { inject, observer } from 'mobx-react';
import classNames from 'classnames';
import {
  Form as AntDForm,
  Input as AntDInput,
  Radio as AntDRadio,
  Upload as AntDUpload,
  Button as AntDButton,
  Icon as AntDIcon,
  Select as AntDSelect
} from 'antd';

// 样式引入
import styles from './style.module.less';

// 数据操作引入
import { addTaskData } from '../../../../api/taskManagement';

// 组件引入
import { OpenModal } from '../../../../components/OpenModal';

const AntDFormItem = AntDForm.Item;
const AntDTextArea = AntDInput.TextArea;

// type改变
class Type {
  @observable type = "";

  @action setType = (value) => this.type = value;

}
const type = new Type();


@AntDForm.create()
@observer
class AddModal extends Component {
  handleOk = () => {
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.info('新增数据', values);
        // FIXME:userID待修改
        values.id = '1c71d55abd624f39932232a6e45c11ab';
        addTaskData(values).then((response) => {
          console.log('新增数据', response);
          this.props.refresTable(1, 10);
          this.props.setNeedReset(true);
        }).catch(error => console.info(error));
        this.props.visible.setVisible(false);
      } else {
        this.props.visible.setVisible(true);
      }
    });
  }

  render() {
    const { getFieldDecorator, resetFields } = this.props.form;
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14 }
    };
    return (
      <div className={classNames(styles.componentDemo, this.props.className)} style={this.props.style}>
        <OpenModal
          title='新增数据'
          visible={this.props.visible}
          handleOk={this.handleOk}
          resetFields={resetFields}
          type={type}
        >
          <AntDForm layout='vertical' className={classNames(styles.addForm)}>
            <AntDFormItem label='任务名称：' {...formItemLayout}>
              {getFieldDecorator('taskName', {
                rules: [{ required: true, message: '请输入名称！' }],
              })(
                <AntDInput />
              )}
            </AntDFormItem>
            <AntDFormItem label='任务类型' {...formItemLayout}>
              {getFieldDecorator('taskType', {
                // rules: [{ required: true, message: '请选择使用范围！' }],
              })(
                <AntDInput />
              )}
            </AntDFormItem>
            <AntDFormItem label='任务描述' {...formItemLayout}>
              {getFieldDecorator('taskDescription', {
                // rules: [{ required: true, message: '请选择是否存储！' }],
              })(
                <AntDTextArea rows={3} />
              )}
            </AntDFormItem>
          </AntDForm>
        </OpenModal>
      </div>
    );
  }
}

AddModal.defaultProps = {
};

// const InjectAddModal = inject(({someStore={}}) => ({someProps: someStore.attribute}))(AddModal);
const InjectAddModal = inject()(AddModal);

export {
  AddModal,
  InjectAddModal
};