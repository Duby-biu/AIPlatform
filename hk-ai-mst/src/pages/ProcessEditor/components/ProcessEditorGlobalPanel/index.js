// 库引入
import React, { Component } from 'react';
import { observable, action, computed, toJS } from 'mobx';
import { inject, observer } from 'mobx-react';
import classNames from 'classnames';
import {
  Form as AntDForm,
  Input as AntDInput,
  InputNumber as AntDInputNumber,
  Select as AntDSelect
} from 'antd';

// 样式引入
import styles from './style.module.less';

// 数据操作引入
import { getGlobalParam } from '../../../../api/processEditor';

const { Item: AntDFormItem } = AntDForm;
const AntDOption = AntDSelect.Option;


const inlineFormItemLayout = {
  labelCol: {
    sm: { span: 11 },
  },
  wrapperCol: {
    sm: { span: 11 },
  },
};

/**
 * ItemPanel
 * 使用Antd.Menu来生成树形结构
 */
@AntDForm.create()
@observer
class ProcessEditorGlobalPanel extends Component {
  @observable globalData = null;

  @action setGloablData = (data) => {
    this.globalData = data;
  }

  @action handleSubmit = (e) => {
    const { form } = this.props;

    form.validateFieldsAndScroll((err, values) => {
      if (err) {
        return;
      }
      console.info('触发失焦保存事件', values);
      // 流程是否改变状态置为改变
      this.props.processData.setHaveChanged(true);
      this.props.processData.setGlobalParams(values);
      console.info(this.props.processData);
    });
  }

  // 父下拉框改变选择项（改变显隐）
  @action handleChange = (index, value) => {
    console.info('change----------------', index, value);
    this.globalData[index].children.forEach(child => {
      const parentArr = child.parent.split(',');
      if (parentArr.indexOf(value) === -1) {
        child.hide = true;
      } else {
        child.hide = false;
      }
    });
  }

  // 初始化hide
  @action initHide = (datas) => {
    console.info('改变hide',toJS(this.props.processData));
    const saveData = this.props.processData.globalParams;
    datas.forEach(data => {
      if (data.children) {
        data.children.forEach(child => {
          const parents = child.parent.split(',');
          const key = data.key;
          for (let parent of parents) {
            // 去掉前后空格
            parent = parent.replace(/(^\s*)|(\s*$)/g, "");
            if (parent === saveData[key]) {
              console.info('改为false');
              child.hide = false;
              break;
            }
          }
        });
      }
    });
    return datas;
  }

  // 获得全局属性数据
  @action getGlobalDatas = () => {
    getGlobalParam().then(response => {
      console.info('获得全局属性，', response);
      // 改变hide
      const data = this.initHide(response);
      this.setGloablData(data);
    }).catch(error => console.info(error.message));
  }

  // 生成下拉框
  @action getSelect = (data, key, name, value, children, hide, index) => {
    const { getFieldDecorator } = this.props.form;
    const selectChildren = [];
    const keys = Object.keys(data);
    keys.forEach((key) => {
      selectChildren.push(<AntDOption value={key} key={key}>{data[key]}</AntDOption>);
    });
    let style = {};
    if (hide) {
      style = {
        display: 'none'
      };
    } else {
      style = {
        display: 'block'
      };
    }
    return (
      <React.Fragment key={key}>
        <AntDFormItem
          key={key}
          label={name}
          {...inlineFormItemLayout}
          style={style}
        >
          {
            getFieldDecorator(key, {
              initialValue: value,
            })(
              <AntDSelect
                onChange={children ? this.handleChange.bind(this, index) : () => { }}
                onBlur={this.handleSubmit}>
                {selectChildren}
              </AntDSelect>
            )
          }
        </AntDFormItem>
        {children ? this.formatGlobalParams(children) : null}
      </React.Fragment>
    );
  }



  @action formatGlobalParams(data) {
    console.info('解构', toJS(data));
    const childrenComp = [];
    const { getFieldDecorator } = this.props.form;

    if (data) {
      const saveData = this.props.processData.globalParams;
      data.forEach((globalParams, index) => {
        const { data, key, name, value, type, placeholder, children, hide } = globalParams;
        let style = {};
        // hide为true且value为空
        if (hide && value === "") {
          style = {
            display: 'none'
          };
        } else {
          style = {
            display: 'block'
          };
        }

        let globalParamsComp = null;
        // 数字输入框
        if (type === 'number') {
          globalParamsComp = (
            <AntDFormItem
              key={key}
              label={key}
              {...inlineFormItemLayout}
              style={style}
            >
              {getFieldDecorator(key, {
                initialValue: saveData[key],
                rules: [{
                  // type: 'number',
                  // required: true,
                  // message: '请输入数字'
                }]
              })(
                <AntDInputNumber placeholder={placeholder} onBlur={this.handleSubmit} />
              )}
            </AntDFormItem>
          );
          // 单选下拉
        } else if (type === 'combobox') {
          globalParamsComp = this.getSelect(data, key, name, saveData[key], children, hide, index);
          // 普通输入框
        } else if (type === 'input') {
          globalParamsComp = (
            <AntDFormItem
              key={key}
              label={name}
              {...inlineFormItemLayout}
              style={style}
            >
              {
                getFieldDecorator(key, {
                  initialValue: saveData[key],
                })(<AntDInput placeholder={placeholder} onBlur={this.handleSubmit} />)
              }
            </AntDFormItem>
          );
        }
        childrenComp.push(globalParamsComp);
      });
    }

    if (childrenComp.length) {
      return childrenComp;
    } else {
      return null;
    }
  }

  @action componentDidMount = () => {
    this.getGlobalDatas();
  }

  render() {
    console.info('render-全局属性');
    return (
      <div className={classNames(styles.processEditorGlobalPanel, this.props.className)} style={this.props.style}>
        <AntDForm onSubmit={this.handleSubmit}>
          {this.formatGlobalParams(this.globalData)}
        </AntDForm>
      </div>
    );
  }
}

ProcessEditorGlobalPanel.defaultProps = {
};

const InjectProcessEditorGlobalPanel = inject(({ someStore = {} }) => ({ someProps: someStore.attribute }))(ProcessEditorGlobalPanel);

export {
  ProcessEditorGlobalPanel,
  InjectProcessEditorGlobalPanel
};