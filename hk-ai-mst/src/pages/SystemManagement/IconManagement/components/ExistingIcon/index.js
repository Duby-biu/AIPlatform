// 库引入
import React, { Component } from 'react';
import { observable, action, computed, isComputed } from 'mobx';
import { inject, observer } from 'mobx-react';
import classNames from 'classnames';
import {
  Card as AntDCard,
  Pagination as AntDPagination
} from 'antd';

// 样式引入
import styles from './style.module.less';

// 数据操作引入
import { getIcon } from '../../../../../api/systemManagement/iconManagement';


@observer
class ExistingIcon extends Component {
  @observable iconData = [];
  @observable total = null;

  @action showTableData = (data) => this.iconData = data;

  // 获取图片数据
  @action getIconData = (current, pageSize) => {
    getIcon(current, pageSize).then(response => {
      console.info(response);
      this.showTableData(response.data.dataSource);
      this.total = response.data.total;
    }).catch(error => console.info(error.message));
  }

  // 页码改变的回调（页码， 每页条数）
  @action handleChange = (page, pageSize) => {
    console.info('获取已有图标',page, pageSize);
    // 请求新数据
    this.getIconData(page, pageSize);
  }

  @computed get renderIconsList() {
    // this.getIconData(1,50);
    // 获取图片路径（数组）
    if (!this.iconData) return null;
    const iconsComp = this.iconData.map((icon, index) => {
      // 获取图片名字
      const iconName = icon.name;
      const iconPath = icon.path;
      console.info(iconName,'----',iconPath);
      return <img key={index} alt={iconName} src={iconPath} />;
    });
    return (
      <div className={classNames(styles.iconWrapper)}>
        {iconsComp}
        <AntDPagination
        pageSize={50}
        total={this.total}
        onChange={this.handleChange}
        />
    </div>);
  }

  @action componentWillMount = () => {
    console.info('will-已有图标');
    this.getIconData(1,50);
  }

  // FIXME:图标上传后（左侧），已有图标（右侧）的刷新功能待添加
  render() {
    console.info('render-已存在图标',this.iconData);
    return (
      <div className={classNames(styles.existingIcon, this.props.className)} style={this.props.style}>
        <AntDCard title={this.props.cardTitle}>
          {this.renderIconsList}
        </AntDCard>
      </div>
    );
  }
}

ExistingIcon.defaultProps = {
  cardTitle: '已有图标'
};

// const InjectExistingIcon = inject(({someStore={}}) => ({someProps: someStore.attribute}))(ExistingIcon);
const InjectExistingIcon = inject()(ExistingIcon);

export {
  ExistingIcon,
  InjectExistingIcon
};