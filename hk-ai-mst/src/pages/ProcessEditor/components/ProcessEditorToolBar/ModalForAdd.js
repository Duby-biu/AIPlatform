// 库引入
import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { action, toJS } from 'mobx';
import classNames from 'classnames';
import { withPropsAPI } from 'gg-editor';
import {
  Form as AntDForm,
  Input as AntDInput,
  message as Antdmessage
} from 'antd';

// 样式引入
import styles from './style.module.less';

// 组件引入
import { OpenModal } from '../../../../components/OpenModal';

// 数据操作引入
import { saveProcess } from '../../../../api/processEditor';

// 工具引入
import { formatDatas } from './FormatDatasUtil';

const AntDFormItem = AntDForm.Item;

@withPropsAPI
@AntDForm.create()
@observer
class ModalForAdd extends Component {
  @action handleOk = () => {
    const { propsAPI, processData: pd } = this.props;
    const { save } = propsAPI;
    this.props.form.validateFields((err, values) => {
      // 新增流程
      if (!err) {
        console.info('新增---获取所有数据', save());
        // 连线参数
        const linesInparams = toJS(this.props.processData.lineInparams);
        // 全局参数
        const globalParams = toJS(this.props.processData.globalParams);
        // 流程名称
        const name = values.name;
        const formatData = formatDatas(save(), name, linesInparams, globalParams);
        const content = JSON.stringify(formatData);
        const data = {
          content: content,
          name: name,
          processId: pd.processId
        };
        saveProcess(data).then((response) => {
          // 流程是否改变状态置为未改变
          this.props.processData.setHaveChanged(false);
          // 赋值新id
          pd.setProcessId(response.data.processId);
          // 修改流程编辑器界面上流程名称
          this.props.flowTitle.setFlowTitle(name);
          (() => {
            Antdmessage.success('保存成功');
          })();
        }).catch(error => {
          (() => {
            Antdmessage.error('保存失败');
          })();
          console.info(error.message);
        });
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
      <div className={classNames(styles.ModalForAdd, this.props.className)} style={this.props.style}>
        <OpenModal
          title='保存流程'
          visible={this.props.visible}
          handleOk={this.handleOk}
          resetFields={resetFields}
        >
          <AntDForm layout='vertical' className={classNames(styles.addForm)}>
            <AntDFormItem label='模型名称：' {...formItemLayout}>
              {getFieldDecorator('name', {
                rules: [{ required: true, message: '请输入模型名称！' }],
              })(
                <AntDInput />
              )}
            </AntDFormItem>
          </AntDForm>
        </OpenModal>
      </div>
    );
  }
}

ModalForAdd.defaultProps = {
};

const InjectModalForAdd = inject(({ someStore = {} }) => ({ someProps: someStore.attribute }))(ModalForAdd);

export {
  ModalForAdd,
  InjectModalForAdd
};