// 库引入
import React, { Component } from 'react';
import { observable, action } from 'mobx';
import { inject, observer } from 'mobx-react';
import classNames from 'classnames';
import {
  Row as AntDRow,
  Col as AntDCol,
  Card as AntDCard
} from 'antd';

// 样式引入
import styles from './style.module.less';

// 组件引入
import { ExistingIcon } from './components/ExistingIcon';
import { UploadIcon } from './components/UploadIcon';

// Mobx引入
import { IconRefresh } from './IconManagementMobx';

const iconRefresh = new IconRefresh();

@observer
class IconManagement extends Component {
  componentWillMount = () => {
  }

  render() {
    console.info('render_图标管理');
    return (
      <div className={classNames(styles.iconManagement, this.props.className)} style={this.props.style}>
        <AntDCard>
          <AntDRow gutter={24}>
            <AntDCol span={12}><UploadIcon iconRefresh={iconRefresh} /></AntDCol>
            <AntDCol span={12}><ExistingIcon iconRefresh={iconRefresh} /></AntDCol>
          </AntDRow>
        </AntDCard>
      </div>
    );
  }
}

IconManagement.defaultProps = {
};

// const InjectIconManagement = inject(({someStore={}}) => ({someProps: someStore.attribute}))(IconManagement);
const InjectIconManagement = inject()(IconManagement);

export {
  IconManagement,
  InjectIconManagement
};