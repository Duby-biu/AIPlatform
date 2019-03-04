// 库引入
import React, { Component } from 'react';
import { action, observable, computed } from 'mobx';
import { inject, observer } from 'mobx-react';
import classNames from 'classnames';
import {
  Form as AntDForm,
  Input as AntDInput,
  Card as AntDCard,
  Button as AntDButton,
  Select as AntDSelect,
  Icon as AntDIcon
} from 'antd';

// 样式引入
import styles from './style.module.less';

// 数据操作引入
import { updateTreeNode, addTreeNode } from '../../../../api/systemManagement/componentManagement';

// 图标图片引入
const requireContext = require.context('../../../../../public/img/componentIcon', false, /^\.\/.*\.png$/);

const AntDFormItem = AntDForm.Item;
const AntDOption = AntDSelect.Option;
const AntDTextArea = AntDInput.TextArea;

@AntDForm.create()
@observer
class Detail extends Component {
  @observable iconVisible = false;


  @action handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        // 新增
        if (this.props.detailForm.title === '新增节点') {
          const rootId = this.props.detailForm.rootId;
          values.parentId = this.props.detailForm.selectedNodeKey || rootId;
          values.status = '0';
          addTreeNode(values).then(() => {
            if (this.props.detailForm.doSearch) {
              this.props.detailForm.setSearchNodes("");
              this.props.detailForm.setDoSearch(false);
              this.props.detailForm.setNeedReset(true);
            }
            this.props.detailForm.setVisible('hideDetailForm');
            this.props.detailForm.setButtonDisabled(false);
            this.props.detailForm.setTreeRefresh();
          }).catch(error => console.info(error));
          // 修改
        } else {
          const { parentId, status, componentId } = this.props.detailForm.detailFormData;
          values = {
            ...values,
            parentId,
            status,
            componentId
          };
          updateTreeNode(values).then(() => {
            if (this.props.detailForm.doSearch) {
              this.props.detailForm.setSearchNodes("");
              this.props.detailForm.setDoSearch(false);
            }
            this.props.detailForm.setTreeRefresh();
          }).catch(error => console.info(error));
        }
        console.log('保存');
      }
    });
  }

  @action handleReset = () => {
    if (this.props.detailForm.title === '新增节点') {
      this.props.form.resetFields();
    } else {
      const data = this.props.detailForm.detailFormData;
      this.props.form.setFieldsValue({
        componentName: data.componentName || "",
        componentType: data.componentType || "",
        componentExecType: data.componentExecType || "",
        componentExecClass: data.componentExecClass || "",
        lastDetectionType: data.lastDetectionType || "",
        nextDetectionType: data.nextDetectionType || "",
        icon: data.icon || "",
        componentInParams: data.componentInParams || "",
        componentOutParams: data.componentOutParams || "",
        componentDescription: data.componentDescription || "",
        creator: data.creator || "",
        componenSourceCode: data.componenSourceCode || "",
      });
    }
  }

  // 图标框显隐切换
  @action switchIcon = () => {
    this.iconVisible = !this.iconVisible;
  }

  // 选择图标
  @action choiceIcon = (iconName) => {
    console.info('点击', iconName);
    this.iconVisible = !this.iconVisible;
    console.info(iconName);
    this.props.form.setFieldsValue({
      icon: iconName
    });
  }

  @computed get iconComponents() {
    // 自定义图片图标
    const selfIconComponents = requireContext.keys().map((r, index) => {
      const iconName = r.substr(2, r.length - 6);
      return <img key={index} alt={iconName} src={requireContext(r)} onClick={this.choiceIcon.bind(this,'self_' + iconName)} />;
    });
    // antd自带图标
    const antdIcon = ['heat-map', 'cloud', 'database'];
    const antdIconComponents = antdIcon.map((iconName, index) => {
      return <AntDIcon key={index} width={25} height={25} type={iconName} theme="outlined" onClick={this.choiceIcon.bind(this, iconName)}/>;
    });

    let display = {
      display: 'none'
    };
    if (this.iconVisible) {
      display = {
        display: 'block'
      };
    }
    return (
      <div className={classNames(styles.iconFormItem, 'ant-form-item')} style={display} >
        <div className={classNames(styles.iconWrapper, 'ant-col-offset-6', 'ant-col-16')} >
          {selfIconComponents}
          {antdIconComponents}
        </div>
      </div>
    );
  }

  render() {
    console.info('render-detail');
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 16 }
    };
    const {
      componentName,
      componentType,
      componentExecType,
      componentExecClass,
      lastDetectionType,
      nextDetectionType,
      icon,
      componentInParams,
      componentOutParams,
      componentDescription,
      creator,
      componentSourceCode,
    } = this.props.detailForm.detailFormData;

    const visible = (this.props.detailForm.className === 'showDetailForm');
    return (
      visible && <div className={classNames(styles.componentDemo, this.props.detailForm.className)} style={this.props.style}>
        <AntDCard title={this.props.detailForm.title}>
          <AntDForm className={classNames(styles.Detail)} onSubmit={this.handleSubmit}>
            <AntDFormItem label='构件名称' {...formItemLayout}>
              {getFieldDecorator('componentName', {
                rules: [{ required: true, message: '请输入构件名称！' }],
                initialValue: componentName
              })(
                <AntDInput />
              )}
            </AntDFormItem>
            <AntDFormItem label='构件类型' {...formItemLayout}>
              {getFieldDecorator('componentType', {
                initialValue: componentType
              })(
                <AntDSelect allowClear>
                  <AntDOption value='DL4J_DATA'>DL4J_DATA</AntDOption>
                  <AntDOption value='DL4J_LAYER'>DL4J_LAYER</AntDOption>
                </AntDSelect>
              )}
            </AntDFormItem>
            <AntDFormItem label='构件执行类型' {...formItemLayout}>
              {getFieldDecorator('componentExecType', {
                initialValue: componentExecType
              })(
                <AntDSelect allowClear>
                  <AntDOption value='jave'>Java</AntDOption>
                  <AntDOption value='python'>Python</AntDOption>
                </AntDSelect>
              )}
            </AntDFormItem>
            <AntDFormItem label='构件执行类' {...formItemLayout}>
              {getFieldDecorator('componentExecClass', {
                initialValue: componentExecClass
              })(
                <AntDInput />
              )}
            </AntDFormItem>
            <AntDFormItem label='上一构件类型' {...formItemLayout}>
              {getFieldDecorator('lastDetectionType', {
                initialValue: lastDetectionType
              })(
                <AntDSelect allowClear>
                  <AntDOption value='DL4J_DATA'>DL4J_DATA</AntDOption>
                  <AntDOption value='DL4J_LAYER'>DL4J_LAYER</AntDOption>
                </AntDSelect>
              )}
            </AntDFormItem>
            <AntDFormItem label='下一构件类型' {...formItemLayout}>
              {getFieldDecorator('nextDetectionType', {
                initialValue: nextDetectionType
              })(
                <AntDSelect allowClear>
                  <AntDOption value='DL4J_DATA'>DL4J_DATA</AntDOption>
                  <AntDOption value='DL4J_LAYER'>DL4J_LAYER</AntDOption>
                </AntDSelect>
              )}
            </AntDFormItem>
            <AntDFormItem label='构件图标' {...formItemLayout}>
              {getFieldDecorator('icon', {
                initialValue: icon
              })(
                <AntDInput onClick={this.switchIcon} readOnly />
              )}
            </AntDFormItem>
            {this.iconComponents}
            <AntDFormItem label='输入参数' {...formItemLayout}>
              {getFieldDecorator('componentInParams', {
                initialValue: componentInParams
              })(
                <AntDTextArea rows={3} />
              )}
            </AntDFormItem>
            <AntDFormItem label='输出参数' {...formItemLayout}>
              {getFieldDecorator('componentOutParams', {
                initialValue: componentOutParams
              })(
                <AntDTextArea rows={3} />
              )}
            </AntDFormItem>
            <AntDFormItem label='构件描述' {...formItemLayout}>
              {getFieldDecorator('componentDescription', {
                initialValue: componentDescription
              })(
                <AntDTextArea rows={3} />
              )}
            </AntDFormItem>
            <AntDFormItem label='创建者' {...formItemLayout}>
              {getFieldDecorator('creator', {
                initialValue: creator
              })(
                <AntDInput />
              )}
            </AntDFormItem>
            <AntDFormItem label='源码' {...formItemLayout}>
              {getFieldDecorator('componentSourceCode', {
                initialValue: componentSourceCode
              })(
                <AntDTextArea rows={3} />
              )}
            </AntDFormItem>
            <AntDFormItem style={{ textAlign: 'right' }} >
              <AntDButton type="primary" htmlType="submit">保存</AntDButton>
              <AntDButton style={{ marginLeft: 15 }} onClick={this.handleReset}>重置</AntDButton>
            </AntDFormItem>
          </AntDForm>
        </AntDCard>
      </div>
    );
  }
}
Detail.defaultProps = {
};

// const InjectDetail = inject(({someStore={}}) => ({someProps: someStore.attribute}))(Detail);
const InjectDetail = inject()(Detail);

export {
  Detail,
  InjectDetail
};
