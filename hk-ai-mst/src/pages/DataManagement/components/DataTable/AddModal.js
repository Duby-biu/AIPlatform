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
import { addTableData } from '../../../../api/dataManagement';

// 组件引入
import { OpenModal } from '../../../../components/OpenModal';

const AntDFormItem = AntDForm.Item;
const AntDRadioGroup = AntDRadio.Group;
const AntDOption = AntDSelect.Option;

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
        const formData = new FormData();
        console.info('新增数据', values);
        Object.keys(values).map((value) => {
          if (value === 'upload') {
            console.info(values[value][0]);
            return formData.append(value, values[value][0].originFileObj);
          } else if (values[value]) {
            return formData.append(value, values[value]);
          }
          return  null;
        });
        // FIXME:userID待修改
        formData.append('userId', '1c71d55abd624f39932232a6e45c11ab');
        addTableData(formData).then((response) => {
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

  @action handleTypeOnChange = (value) => {
    type.setType(value);
  }

  // 根据选择的类型返回不同组件
  compBasedOnType(type) {
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14 }
    };
    const normFile = (e) => {
      console.log('文件上传事件:', e);
      if (Array.isArray(e)) {
        return e;
      }
      return e && e.fileList;
    };
    // 阻止文件立刻上传
    const beforeUpload = (file) => {
      return false;
    };
    // 只能上传一个文件
    const handleFileChange = (info) => {
      info.fileList = info.fileList.slice(-1);
      console.info('fileList', info.fileList[0]);
    };

    // 什么都没选
    if (type === "") {
      return null;
      // 类型选择Local后的组件
    } else if (type === "Local") {
      const filesUpload = (
        <AntDFormItem label="文件上传：" {...formItemLayout}>
          {getFieldDecorator('upload', {
            valuePropName: 'fileList',
            getValueFromEvent: normFile,
            rules: [{ required: true, message: '请上传文件！' }],
          })(
            <AntDUpload
              beforeUpload={beforeUpload}
              onChange={handleFileChange}
              name="files"
              action="">
              <AntDButton>
                <AntDIcon type="upload" />点击上传
              </AntDButton>
            </AntDUpload>
          )}
        </AntDFormItem>
      );
      return filesUpload;
      // 类型选择MySQL, Oracle, PostgreSQL后的组件
    } else if (type === 'MySQL' || type === 'Oracle' || type === 'PostgreSQL') {
      const dbType = (() => {
        const children = [];
        const requiredLabel = ['IP地址', '端口', '数据库名', '查询语句或表名', '用户账号', '用户密码'];
        const requiredKey = ['ip', 'port', 'method', 'args', 'userName', 'password'];
        for (let i = 0; i < requiredLabel.length; i++) {
          children.push(
            <AntDFormItem key={i} label={requiredLabel[i] + "："} {...formItemLayout}>
              {getFieldDecorator(requiredKey[i], {
                rules: [{ required: true, message: `请输入${requiredLabel[i]}！` }],
              })(
                <AntDInput />
              )}
            </AntDFormItem>
          );
        }
        return children;
      })();
      return dbType;
      // 类型选择HDFS后的组件
    } else if (type === 'HDFS') {
      const hdfsType = (() => {
        const children = [];
        const requiredLabel = ['IP地址', '端口', '目录'];
        const requiredKey = ['ip', 'port', 'method'];
        const label = ['参数', '用户账号', '用户密码'];
        const key = ['args', 'userName', 'password'];
        for (let i = 0; i < requiredLabel.length; i++) {
          children.push(
            <AntDFormItem key={i} label={requiredLabel[i] + "："} {...formItemLayout}>
              {getFieldDecorator(requiredKey[i], {
                rules: [{ required: true, message: `请输入${requiredLabel[i]}！` }],
              })(
                <AntDInput />
              )}
            </AntDFormItem>
          );
        }
        for (let i = 0; i < label.length; i++) {
          children.push(
            <AntDFormItem key={i + 3} label={label[i] + "："} {...formItemLayout}>
              {getFieldDecorator(key[i])(
                <AntDInput />
              )}
            </AntDFormItem>
          );
        }
        return children;
      })();
      return hdfsType;
      // 类型选择API后的组件
    } else if (type === 'API') {
      const apiType = (() => {
        const children = [];
        const requiredLabel = ['url地址'];
        const requiredKey = ['ip'];
        const label = ['端口', '参数', '用户账号', '用户密码'];
        const key = ['port', 'args', 'userName', 'password'];
        for (let i = 0; i < requiredLabel.length; i++) {
          children.push(
            <AntDFormItem key={i} label={requiredLabel[i] + "："} {...formItemLayout}>
              {getFieldDecorator(requiredKey[i], {
                rules: [{ required: true, message: `请输入${requiredLabel[i]}！` }],
              })(
                <AntDInput />
              )}
            </AntDFormItem>
          );
        }
        children.push(
          <AntDFormItem key={1} label={"Method："} {...formItemLayout}>
            {getFieldDecorator('method', {
              rules: [{ required: true }],
              initialValue: 'GET'
            })(
              <AntDSelect>
                <AntDOption value='GET'>GET</AntDOption>
                <AntDOption value='POST'>POST</AntDOption>
                <AntDOption value='PUT'>PUT</AntDOption>
              </AntDSelect>
            )}
          </AntDFormItem>
        );
        for (let i = 0; i < label.length; i++) {
          children.push(
            <AntDFormItem key={i + 2} label={label[i] + "："} {...formItemLayout}>
              {getFieldDecorator(key[i])(
                <AntDInput />
              )}
            </AntDFormItem>
          );
        }
        return children;
      })();
      return apiType;
      // 类型选择FTP后的组件
    } else if (type === 'FTP') {
      const ftpType = (() => {
        const children = [];
        const requiredLabel = ['IP地址', '目录'];
        const requiredKey = ['ip', 'method'];
        const label = ['端口', '参数', '用户账号', '用户密码'];
        const key = ['port', 'args', 'userName', 'password'];
        for (let i = 0; i < requiredLabel.length; i++) {
          children.push(
            <AntDFormItem key={i} label={requiredLabel[i] + "："} {...formItemLayout}>
              {getFieldDecorator(requiredKey[i], {
                rules: [{ required: true, message: `请输入${requiredLabel[i]}！` }],
              })(
                <AntDInput />
              )}
            </AntDFormItem>
          );
        }
        for (let i = 0; i < label.length; i++) {
          children.push(
            <AntDFormItem key={i + 2} label={label[i] + "："} {...formItemLayout}>
              {getFieldDecorator(key[i])(
                <AntDInput />
              )}
            </AntDFormItem>
          );
        }
        return children;
      })();
      return ftpType;
    }
  }

  render() {
    const { getFieldDecorator, resetFields } = this.props.form;
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14 }
    };
    const comp = this.compBasedOnType(type.type);
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
            <AntDFormItem style={{ display: 'none' }}>
              {getFieldDecorator('state', {
                initialValue: "normal"
              })(
                <AntDInput />
              )}
            </AntDFormItem>
            <AntDFormItem label='名称：' {...formItemLayout}>
              {getFieldDecorator('dataName', {
                rules: [{ required: true, message: '请输入名称！' }],
              })(
                <AntDInput />
              )}
            </AntDFormItem>
            <AntDFormItem label='使用范围：' {...formItemLayout}>
              {getFieldDecorator('dataRange', {
                rules: [{ required: true, message: '请选择使用范围！' }],
              })(
                <AntDRadioGroup>
                  <AntDRadio value="public">公开</AntDRadio>
                  <AntDRadio value="private">私有</AntDRadio>
                </AntDRadioGroup>
              )}
            </AntDFormItem>
            <AntDFormItem label='是否存储：' {...formItemLayout}>
              {getFieldDecorator('isStore', {
                rules: [{ required: true, message: '请选择是否存储！' }],
              })(
                <AntDRadioGroup>
                  <AntDRadio value="1">是</AntDRadio>
                  <AntDRadio value="0">否</AntDRadio>
                </AntDRadioGroup>
              )}
            </AntDFormItem>
            <AntDFormItem label='类型：' {...formItemLayout}>
              {getFieldDecorator('type', {
                rules: [{ required: true, message: '请选择类型！' }],
              })(
                <AntDSelect onChange={this.handleTypeOnChange}>
                  <AntDOption value='Local'>Local</AntDOption>
                  <AntDOption value='MySQL'>MySQL</AntDOption>
                  <AntDOption value='Oracle'>Oracle</AntDOption>
                  <AntDOption value='PostgreSQL'>PostgreSQL</AntDOption>
                  <AntDOption value='HDFS'>HDFS</AntDOption>
                  <AntDOption value='API'>API</AntDOption>
                  <AntDOption value='FTP'>FTP</AntDOption>
                </AntDSelect>
              )}
            </AntDFormItem>
            {comp}

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