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
import { updateTableData } from '../../../../api/dataManagement';

// 组件引入
import { OpenModal } from '../../../../components/OpenModal';

const AntDFormItem = AntDForm.Item;
const AntDRadioGroup = AntDRadio.Group;
const AntDOption = AntDSelect.Option;

@AntDForm.create()
@observer
class UpdateModal extends Component {
  handleOk = () => {
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const formData = new FormData();
        console.info('修改数据', values);
        Object.keys(values).map((value) => {
          if (value === 'upload' && values[value]) {
            return formData.append(value, values[value][0].originFileObj);
          }
          return formData.append(value, values[value]);
        });
        console.info('修改的upload',formData.get('upload'));
        // FIXME:userid待修改
        formData.append('userId', '1c71d55abd624f39932232a6e45c11ab');
        updateTableData(formData).then(() => {
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

  @action handleTypeOnChange = (value) => {
    this.props.type.setType(value);
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
    // 初始值
    const { ip = "", port = "", method = "", args = "", userName = "", password = "" } = { ...this.props.initialValues };
    const initialFormatValues = [];
    initialFormatValues.push(ip, port, method, args, userName, password);

    // 类型选择Local后的组件
    if (type === "Local") {
      const filesUpload = (
        <AntDFormItem label="文件上传：" {...formItemLayout}>
          {getFieldDecorator('upload', {
            valuePropName: 'fileList',
            getValueFromEvent: normFile
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
                initialValue: initialFormatValues[i]
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
                initialValue: initialFormatValues[i]
              })(
                <AntDInput />
              )}
            </AntDFormItem>
          );
        }
        for (let i = 0; i < label.length; i++) {
          children.push(
            <AntDFormItem key={i + 3} label={label[i] + "："} {...formItemLayout}>
              {getFieldDecorator(key[i], {
                initialValue: initialFormatValues[i+3]
              })(
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
        const initialFormatValues = [ip, method, port, args, userName, password];
        for (let i = 0; i < requiredLabel.length; i++) {
          children.push(
            <AntDFormItem key={i} label={requiredLabel[i] + "："} {...formItemLayout}>
              {getFieldDecorator(requiredKey[i], {
                rules: [{ required: true, message: `请输入${requiredLabel[i]}！` }],
                initialValue: initialFormatValues[i]
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
              initialValue: initialFormatValues[1]
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
              {getFieldDecorator(key[i], {
                initialValue: initialFormatValues[i+2]
              })(
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
        const initialFormatValues = [ip, method, port, args, userName, password];
        for (let i = 0; i < requiredLabel.length; i++) {
          children.push(
            <AntDFormItem key={i} label={requiredLabel[i] + "："} {...formItemLayout}>
              {getFieldDecorator(requiredKey[i], {
                rules: [{ required: true, message: `请输入${requiredLabel[i]}！` }],
                initialValue: initialFormatValues[i]
              })(
                <AntDInput />
              )}
            </AntDFormItem>
          );
        }
        for (let i = 0; i < label.length; i++) {
          children.push(
            <AntDFormItem key={i + 2} label={label[i] + "："} {...formItemLayout}>
              {getFieldDecorator(key[i], {
                initialValue: initialFormatValues[i+2]
              })(
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
    const comp = this.compBasedOnType(this.props.type.type);
    const initialValues = this.props.initialValues;
    const initialFormatValues = {};
    if (initialValues !== null) {
      initialValues.isStore === '是' ? initialFormatValues.isStore = '1' : initialFormatValues.isStore = '0';
      initialValues.dataRange === '私有' ? initialFormatValues.dataRange = 'private' : initialFormatValues.dataRange = 'public';
    }
    const { dataId = "", state = "", dataName = "", type = "" } = { ...initialValues };
    const { dataRange = "", isStore = "" } = initialFormatValues;
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
            <AntDFormItem style={{ 'display': 'none' }}>
              {getFieldDecorator('dataId', {
                initialValue: dataId
              })(
                <AntDInput />
              )}
            </AntDFormItem>
            <AntDFormItem style={{ display: 'none' }}>
              {getFieldDecorator('state', {
                initialValue: state
              })(
                <AntDInput />
              )}
            </AntDFormItem>
            <AntDFormItem label='名称：' {...formItemLayout}>
              {getFieldDecorator('dataName', {
                rules: [{ required: true, message: '请输入名称！' }],
                initialValue: dataName
              })(
                <AntDInput />
              )}
            </AntDFormItem>
            <AntDFormItem label='使用范围：' {...formItemLayout}>
              {getFieldDecorator('dataRange', {
                rules: [{ required: true, message: '请选择使用范围！' }],
                initialValue: dataRange
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
                initialValue: isStore
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
                initialValue: type
              })(
                <AntDSelect disabled>
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

UpdateModal.defaultProps = {
};

// const InjectUpdateModal = inject(({someStore={}}) => ({someProps: someStore.attribute}))(UpdateModal);
const InjectUpdateModal = inject()(UpdateModal);

export {
  UpdateModal,
  InjectUpdateModal
};