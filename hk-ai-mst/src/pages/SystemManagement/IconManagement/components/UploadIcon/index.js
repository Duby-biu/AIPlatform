// 库引入
import React, { Component } from 'react';
import { observable, action } from 'mobx';
import { inject, observer } from 'mobx-react';
import classNames from 'classnames';
import {
  Card as AntDCard,
  Upload as AntDUpload,
  Icon as AntDIcon,
  Button as AntDButton,
  message as AntDmessage
} from 'antd';

// 样式引入
import styles from './style.module.less';

// 数据操作引入
import { addIcon } from '../../../../../api/systemManagement/iconManagement';

@observer
class UploadIcon extends Component {
  @observable fileList = [];
  @observable uploading = false;

  // 取消图片正在上传标识
  @action setUpload = (value) => {
    this.uploading = value;
  }
  @action cleanFileList = () => {
    this.fileList = [];
  }

  // 提交文件
  @action handleUpload = () => {
    const formData = new FormData();
    this.fileList.forEach((file) => {
      formData.append('file', file);
    });
    console.info(formData.getAll('file'));
      this.setUpload(true);
    addIcon(formData).then((response) => {
      console.log('新增图标', response);
      this.cleanFileList();
      this.setUpload(false);
      AntDmessage.success('上传图标成功');
      // 刷新‘已有图标’列表
      this.props.iconRefresh.setRefresh(true);
      // this.props.refresTable(1, 10);
      // this.props.setNeedReset(true);
    }).catch(error => {
      console.info(error);
      this.setUpload(false);
      AntDmessage.error('上传图标失败');
    });
  }

  // 阻止文件直接上传
  @action handleBeforeUpload = (file) => {
    this.fileList = [...this.fileList, file];
    console.info(this.fileList, file);
    return false;
  }

  // 删除上传文件
  @action handleRemove = (file) => {
    console.info(this.fileList);
    this.fileList.splice(this.fileList.indexOf(file), 1);
    console.info(this.fileList);
  }

  render() {
    console.info('render-上传图标');
    const uploadIconComponent = <AntDIcon type="upload" />;
    return (
      <div className={classNames(styles.uploadIcon, this.props.className)} style={this.props.style}>
        <AntDCard title={this.props.cardTitle}>
          <AntDUpload
          multiple={true}
          beforeUpload={this.handleBeforeUpload}
          onRemove={this.handleRemove}
          accept=".jpg, .jpeg, .png, .svg, .bmp"
          fileList={this.fileList}
          >
            <AntDButton>
              <AntDIcon type="plus" /> 添加图标
            </AntDButton>
          </AntDUpload>
          <AntDButton
            type="primary"
            onClick={this.handleUpload}
            disabled={this.fileList.length === 0}
            loading={this.uploading}
            style={{ marginTop: 16 }}
          >
            {this.uploading ? '正在上传' :  uploadIconComponent}
            {this.uploading ? '' :  '上传图标'}
        </AntDButton>
        </AntDCard>
      </div>
    );
  }
}

UploadIcon.defaultProps = {
  cardTitle: '上传图标'
};

// const InjectUploadIcon = inject(({someStore={}}) => ({someProps: someStore.attribute}))(UploadIcon);
const InjectUploadIcon = inject()(UploadIcon);

export {
  UploadIcon,
  InjectUploadIcon
};