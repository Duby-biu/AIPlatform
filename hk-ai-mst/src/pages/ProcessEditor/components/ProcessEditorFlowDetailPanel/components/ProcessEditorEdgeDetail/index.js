// 库引入
import React, { Component } from 'react';
import { action, computed, toJS } from 'mobx';
import { inject, observer } from 'mobx-react';
import classNames from 'classnames';
import {
  Row as AntDRow,
  Col as AntDCol,
  Card as AntDCard,
  Form as AntdForm,
  Input as AntDInput,
  Button as AntDButton,
  Icon as AntDIcon
} from 'antd';
import { withPropsAPI } from 'gg-editor';

// 样式引入
import styles from './style.module.less';

// 工具引入
import { randomString } from '../../../../../../utils/randomString';

// 一些值
const { Item: AntDFormItem } = AntdForm;

// key
const inlineFormItemKeyLayout = {
  wrapperCol: {
    xs: { span: 24 },
  },
};

// value
const inlineFormItemValueLayout = {
  wrapperCol: {
    xs: { span: 24 },
  },
};

let shouldNewRender = true;
let oldLineInparams = null;
let id = null;
/**
 * 流程编辑节点的可编辑详细信息
 */
@AntdForm.create()
@withPropsAPI
@observer
class ProcessEditorEdgeDetail extends Component {
  @action handleSubmit = (e) => {
    e.preventDefault();
    const { form, propsAPI } = this.props;
    const { getSelected } = propsAPI;

    form.validateFieldsAndScroll((err, values) => {
      if (err) {
        return;
      }

      const item = getSelected()[0];

      if (!item) {
        return;
      }

      console.info('触发失焦保存事件values', values);
      // 流程是否改变状态置为改变
      this.props.processData.setHaveChanged(true);
      const lineInparams = [];
      const keys = Object.keys(values.names);
      keys.forEach(key => {
        const lineInparam = {
          key: key,
          value: values.names[key]
        };
        lineInparams.push(lineInparam);
      });
      console.info('组合好line输入参数', lineInparams);
      this.props.processData.setLineInparams(id, lineInparams);
    });
  }
  
  // key值唯一
  // FIXME:验证提示有问题
  @action handleUniqueValue = (rule, value, callback) => {
    const { getFieldsValue } = this.props.form;
    const fieldsvalues = getFieldsValue();
    const keys = Object.keys(fieldsvalues.names).filter((key, index) => index % 2 === 0 );
    let values = keys.map(key => fieldsvalues.names[key]);
    const index = values.indexOf(value);
    if (index !== -1) {
      if (values.indexOf(value, index+1) !== -1) {
        callback('key值需唯一');
      }
    }
    // 必须总是返回一个 callback，否则 validateFieldsAndScroll 无法响应
    callback();
  }

  // 解析输入参数为输入框
  // 解析的数据为点击连线时已存在的参数和新增参数
  @computed get formatLineInParams() {
    const { getFieldDecorator } = this.props.form;
    const lineInparams = oldLineInparams;
    console.info('解析连线输入参数：', lineInparams);
    let formatLineInparams = null;
    if (lineInparams) {
      formatLineInparams = lineInparams.map((inparam, index) => {
        let item = null;
        let keyItem = null;
        let valueItem = null;
        // 输入框
        if (index % 2 === 1) {
          // key
          keyItem = (<AntDCol key={index - 1} span={8}>
            <AntDFormItem
              required={false}
              {...inlineFormItemKeyLayout}
              key={lineInparams[index - 1].key}
            >
              {getFieldDecorator(`names[${lineInparams[index - 1].key}]`, {
                validateTrigger: ['onBlur'],
                initialValue: `${lineInparams[index - 1].value}`,
                rules: [{
                  required: true,
                  whitespace: true,
                  message: "请输入参数名",
                }, {
                  validator: this.handleUniqueValue
                }],
              })(
                <AntDInput placeholder="参数名" onBlur={this.handleSubmit} />
              )}
            </AntDFormItem>
          </AntDCol>);
          // value
          valueItem = (<AntDCol key={index} span={16}>
            <AntDFormItem
              required={false}
              {...inlineFormItemValueLayout}
              key={inparam.key}
            >
              {getFieldDecorator(`names[${inparam.key}]`, {
                validateTrigger: ['onBlur'],
                initialValue: `${inparam.value}`,
                rules: [{
                  required: true,
                  whitespace: true,
                  message: "请输入参数值",
                }],
              })(
                <AntDInput placeholder="参数值" style={{ width: '80%' }} onBlur={this.handleSubmit} />
              )}
              <AntDIcon
                className="dynamic-delete-button"
                type="minus-circle-o"
                onClick={() => this.removeLineParams(index, inparam.key, lineInparams[index - 1].key)}
              />
            </AntDFormItem>
          </AntDCol>);
          item = <AntDRow key={index} gutter={24} className={classNames(styles.row)}>{keyItem}{valueItem}</AntDRow>;
        }
        return item;
      });
    }
    return formatLineInparams;
  }

  // 删除一组参数输入框
  @action removeLineParams = (index, valueKey, nameKey) => {
    shouldNewRender = false;
    const { form } = this.props;
    let lineInparams = toJS(this.props.processData.lineInparams[id]) || [];
    let keys = lineInparams.map(param => param.key);
    // 判断删除的是新增的而且为空的输入框还是已保存的输入框
    let flag = false;
    form.setFieldsValue({
      keys: keys.filter(key => {
        // 如果删除的是已保存的值
        if( !flag && (key === valueKey)){
          flag = true;
        }
        return ((key !== valueKey) && (key !== nameKey));
      })
    });
    if (flag) {
      lineInparams.splice(index - 1, 2);
    }
    oldLineInparams = lineInparams;
    this.props.processData.setLineInparams(id, lineInparams);
  }

  // 新增一组参数输入框
  @action addLineParams = () => {
    shouldNewRender = true;
    const { form } = this.props;
    const keys = form.getFieldValue('keys') || [];
    console.info('本次点击连线后新增的keys', keys);
    const keyId = randomString(8);
    const valueId = randomString(8);
    const nextKeys = keys.concat(keyId, valueId);
    form.setFieldsValue({
      keys: nextKeys,
    });
  }

  // 生成参数输入框
  @computed get newFormItems() {
    const { getFieldDecorator, getFieldValue } = this.props.form;
    getFieldDecorator('keys', { initialValue: [] });
    const keys = getFieldValue('keys');
    console.info('生成参数输入框', keys);
    // const keys =
    const formItems = keys.map((k, index) => {
      let item = null;
      let keyItem = null;
      let valueItem = null;
      if (index % 2 === 1) {
        // key
        keyItem = (<AntDCol key={index - 1} span={8}>
          <AntDFormItem
            required={false}
            key={keys[index - 1]}
            {...inlineFormItemKeyLayout}
          >
            {getFieldDecorator(`names[${keys[index - 1]}]`, {
              validateTrigger: ['onBlur'],
              rules: [{
                required: true,
                whitespace: true,
                message: "请输入参数名",
              }, {
                validator: this.handleUniqueValue
              }],
            })(
              <AntDInput placeholder="参数名" onBlur={this.handleSubmit} />
            )}
          </AntDFormItem>
        </AntDCol>);
        // value
        valueItem = (<AntDCol key={index} span={16}>
          <AntDFormItem
            required={false}
            key={k}
            {...inlineFormItemValueLayout}
          >
            {getFieldDecorator(`names[${k}]`, {
              validateTrigger: ['onBlur'],
              rules: [{
                required: true,
                whitespace: true,
                message: "请输入参数值",
              }],
            })(
              <AntDInput placeholder="参数值" style={{ width: '80%' }} onBlur={this.handleSubmit} />
            )}
            <AntDIcon
              className="dynamic-delete-button"
              type="minus-circle-o"
              onClick={() => this.removeLineParams(index, k, keys[index - 1])}
            />
          </AntDFormItem>
        </AntDCol>);
        item = <AntDRow key={index} gutter={24} className={classNames(styles.row)}>{keyItem}{valueItem}</AntDRow>;
      }
      return item;
    });
    return formItems;
  }

  @action componentWillMount = () => {
    const item = this.props.propsAPI.getSelected()[0];
    if (!item) {
      return null;
    }
    id = item.id;
    oldLineInparams = toJS(this.props.processData.lineInparams[id]) || [];
    shouldNewRender = true;
  }
  render() {
    console.info('render-连线参数编辑');
    const item = this.props.propsAPI.getSelected()[0];
    if (!item) {
      return null;
    }
    return (
      <div className={classNames(styles.ProcessEditorEdgeDetail, 'height100', this.props.className)} style={this.props.style}>
        <AntDCard title="连线参数">
          <AntdForm onSubmit={this.handleSubmit}>
            {this.formatLineInParams}
            {shouldNewRender && this.newFormItems}
            <AntDFormItem>
              <AntDButton type="dashed" onClick={this.addLineParams} style={{ width: '100%' }}>
                <AntDIcon type="plus" /> 添加参数
              </AntDButton>
            </AntDFormItem>
          </AntdForm>
        </AntDCard>
      </div>
    );
  }
}

ProcessEditorEdgeDetail.defaultProps = {
};

const InjectProcessEditorEdgeDetail = inject(({ someStore = {} }) => ({ someProps: someStore.attribute }))(ProcessEditorEdgeDetail);

export {
  ProcessEditorEdgeDetail,
  InjectProcessEditorEdgeDetail
};