// 库引入
import React, { Component } from 'react';
import { action } from 'mobx';
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
import { updateTaskData } from '../../../../api/taskManagement';

// 组件引入
import { OpenModal } from '../../../../components/OpenModal';

const AntDFormItem = AntDForm.Item;
const AntDTextArea = AntDInput.TextArea;

const AntDRadioGroup = AntDRadio.Group;
const AntDOption = AntDSelect.Option;

@AntDForm.create()
@observer
class UpdateModal extends Component {
  handleOk = () => {
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.info('修改数据', values);
        updateTaskData(values).then(() => {
          this.props.refresTable(1, 10);
        }).catch(error => {
          console.info(error);
        });
        console.log('修改数据');
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
    const initialValues = this.props.initialValues;
    const initialFormatValues = {};
    // if (initialValues !== null) {
    //   // 任务名称需要改 taskType
    //   initialValues.isStore === '是' ? initialFormatValues.isStore = '1' : initialFormatValues.isStore = '0';
    // }
    const { taskName = "", taskType = "", taskDescription = "" } = { ...initialValues };
    // const { taskType = "" } = initialFormatValues;
    return (
      <div className={classNames(styles.componentDemo, this.props.className)} style={this.props.style}>
        <OpenModal
          title='修改数据'
          visible={this.props.visible}
          handleOk={this.handleOk}
          resetFields={resetFields}
          type={this.props.type}
        >
          <AntDForm layout='vertical' className={classNames(styles.addForm)}>
            <AntDFormItem label='任务名称：' {...formItemLayout}>
              {getFieldDecorator('taskName', {
                initialValue: taskName,
                rules: [{ required: true, message: '请输入名称！' }],
              })(
                <AntDInput />
              )}
            </AntDFormItem>
            <AntDFormItem label='任务类型' {...formItemLayout}>
              {getFieldDecorator('taskType', {
                initialValue: taskType
                // rules: [{ required: true, message: '请选择使用范围！' }],
              })(
                <AntDInput />
              )}
            </AntDFormItem>
            <AntDFormItem label='任务描述' {...formItemLayout}>
              {getFieldDecorator('taskDescription', {
                initialValue: taskDescription
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

UpdateModal.defaultProps = {
};

// const InjectUpdateModal = inject(({someStore={}}) => ({someProps: someStore.attribute}))(UpdateModal);
const InjectUpdateModal = inject()(UpdateModal);

export {
  UpdateModal,
  InjectUpdateModal
};