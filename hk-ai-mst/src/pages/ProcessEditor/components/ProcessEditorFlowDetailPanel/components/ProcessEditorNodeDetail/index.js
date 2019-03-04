// 库引入
import React, { Component } from 'react';
import { action } from 'mobx';
import { inject, observer } from 'mobx-react';
import classNames from 'classnames';
import {
  Card as AntDCard,
  Form as AntdForm,
  Input as AntdInput,
  Select as AntDSelect
} from 'antd';
import { withPropsAPI } from 'gg-editor';

// 样式引入
import styles from './style.module.less';

// 工具引入
import { getObjKeyArr } from '../../../../../../utils/getObjKeyArr';

// 一些值
const { Item: AntDFormItem } = AntdForm;
const AntDOption = AntDSelect.Option;


const inlineFormItemLayout = {
  labelCol: {
    sm: { span: 11 }
  },
  wrapperCol: {
    sm: { span: 11 }
  },
};

/**
 * 流程编辑节点的可编辑详细信息
 */
@AntdForm.create()
@withPropsAPI
@observer
class ProcessEditorNodeDetail extends Component {
  @action handleSubmit = (e) => {
    // e.preventDefault();
    console.info(this.props);
    const { form, propsAPI } = this.props;
    const { getSelected, update } = propsAPI;

    form.validateFieldsAndScroll((err, values) => {
      if (err) {
        return;
      }

      const item = getSelected()[0];

      if (!item) {
        return;
      }

      console.info('更新', 'item', item, 'values', values);
      // 流程是否改变状态置为改变
      console.info('触发失焦保存事件');
      this.props.processData.setHaveChanged(true);
      
      
      const valueArr = Object.keys(values);
      // 更新输入参数
      if (item.model.componentInParams) {
        const inParamsIndexArr = [];
        const objKeyArr = getObjKeyArr(item.model.componentInParams, 'key');
        valueArr.map(item => {
          // values对应在输入参数里的位置
          inParamsIndexArr.push(objKeyArr.indexOf(item));
          return true;
        });
        let count = -1;
        inParamsIndexArr.map(index => {
          count++;
          if (index === -1) {
            return false;
          }
          // 将数组转化为字符串
          if (typeof(values[valueArr[count]]) === 'object' ) {
            values[valueArr[count]] = values[valueArr[count]].join(',');
          }
          item.model.componentInParams[index].value = values[valueArr[count]];
          return true;
        });
      }
      // 更新节点图上的名称（这样写是避免保存时生成以构建名分割后形成的key）
      item.model.label = values.label;
      const label = {
        label: values.label
      };
      update(item, label);
    });
  }

  // 下拉框
  @action getSelect = (data, key, name, value, mode = '') => {
    const { getFieldDecorator } = this.props.form;
    const selectChildren = [];
    const keys = Object.keys(data);
    keys.map((key) => {
      selectChildren.push(<AntDOption value={key} key={key}>{data[key]}</AntDOption>);
      return true;
    });
    let initValue = value;
    if (typeof (initValue) === 'string') {
      initValue = initValue.split(',');
    }
    return (
      <AntDFormItem
        key={key}
        label={name}
        {...inlineFormItemLayout}
      >
        {
          getFieldDecorator(key, {
            initialValue: initValue,
          })(
            <AntDSelect
              allowClear
              mode={mode}
              onBlur={this.handleSubmit}>
              {selectChildren}
            </AntDSelect>
          )
        }
      </AntDFormItem>
    );
  }
  // 解析输入参数为组件
  @action formatInParams = (componentInParams) => {
    const children = [];
    const { getFieldDecorator } = this.props.form;
    if (componentInParams) {
      componentInParams.map(inParam => {
        const { key, name, value, type, placeholder } = inParam;
        let inParamsComp = null;
        // 输入框
        if (type === 'input') {
          inParamsComp = (
            <AntDFormItem
              key={key}
              label={name}
              {...inlineFormItemLayout}
            >
              {
                getFieldDecorator(key, {
                  initialValue: value,
                })(<AntdInput placeholder={placeholder} onBlur={this.handleSubmit} />)
              }
            </AntDFormItem>
          );
          // 描述
        } else if (type === 'describe') {
          inParamsComp = (
            <AntDFormItem
              key={key}
              label={name}
              {...inlineFormItemLayout}
            >
              {
                getFieldDecorator(key, {
                  initialValue: value,
                })(<span>{value}</span>)
              }
            </AntDFormItem>
          );
          // 多选下拉
        } else if (type === 'multiple') {
          inParamsComp = this.getSelect(inParam.data, key, name, value, 'multiple');
        } else if (type === 'combobox') {
          inParamsComp = this.getSelect(inParam.data, key, name, value);
        }
        children.push(inParamsComp);
        // console.info(children);
        return true;
      });
    }

    if (children.length) {
      return children;
    } else {
      return null;
    }
  }
  render() {
    console.info('render-节点属性编辑');
    const { form, propsAPI } = this.props;
    const { getFieldDecorator } = form;
    const { getSelected } = propsAPI;
    const item = getSelected()[0];
    if (!item) {
      return null;
    }
    const { label, componentInParams, componentOutParams, componentIcon, } = item.getModel();
    return (
      <div className={classNames(styles.processEditorNodeDetail, 'height100', this.props.className)} style={this.props.style}>
        <AntDCard title="节点属性">
          <AntdForm onSubmit={this.handleSubmit}>
            <AntDFormItem
              label="构件名"
              {...inlineFormItemLayout}
            >
              {
                getFieldDecorator('label', {
                  initialValue: label,
                })(<AntdInput onBlur={this.handleSubmit} />)
              }
            </AntDFormItem>
            {this.formatInParams(componentInParams)}
          </AntdForm>
        </AntDCard>
      </div>
    );
  }
}

ProcessEditorNodeDetail.defaultProps = {
};

const InjectProcessEditorNodeDetail = inject(({ someStore = {} }) => ({ someProps: someStore.attribute }))(ProcessEditorNodeDetail);

export {
  ProcessEditorNodeDetail,
  InjectProcessEditorNodeDetail
};