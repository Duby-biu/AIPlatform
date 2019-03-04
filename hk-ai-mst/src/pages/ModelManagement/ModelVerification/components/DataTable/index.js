// 库引入
import React, { Component } from 'react';
import { action, observable } from 'mobx';
import { inject, observer } from 'mobx-react';
import classNames from 'classnames';
import {
  Table as AntDTable,
  Divider as AntDDivider,
  Modal as AntDModal,
  message as AntDmessage
} from 'antd';

// 样式引入
import styles from './style.module.less';

// 数据操作引入
import { getTableData, verify, verifyResult, getChartData } from '../../../../../api/modelManagement/modelVerification';

// 组件引入
import { OpenModal } from '../../../../../components/OpenModal';
import { DataSourceForm } from './DataSourceForm';
import { CustomChartSetting } from '../../../../../components/CustomChartSetting';
import { CustomChart } from '../../../../../components/CustomChart';

const confirm = AntDModal.confirm;

@observer
class Table extends Component {
  @observable chartData = null;
  @observable settingChild = {};
  @observable dataSourceChild = {};
  @observable verifyData = {};

  @action showTableData = (data) => this.props.ds.setData(data);
  @action showTableDataSource = (data) => this.props.ds.setDataSource(data);
  @action setChartData = (data) => this.chartData = data;

  // 获取table数据
  getTableDatas = (current, pageSize) => {
    getTableData(current, pageSize).then(response => {
      console.info("获取table数据", response);
      response.data.columns.map((col) => {
        if (col.key === "op") {
          const opNumber = Object.keys(response.data.op).length;
          col.render = (text, record, index) => {
            let opCount = 0;
            const opList = [];
            const opKeyArray = Object.keys(response.data.op);
            opKeyArray.map((operation, index) => {
              if (operation === 'verify') {
                // 验证
                opList.push(<a onClick={this.beforeDoVerify.bind(this, record.batchId, 'FIXME', record.verifyId)} key={operation}>{response.data.op.verify}</a>);
                if (++opCount < opNumber) {
                  opList.push(<AntDDivider type="vertical" key={index} />);
                };
              } else if (operation === 'verifyResult') {
                // 验证情况
                opList.push(<a onClick={this.doVerifyResult.bind(this, record.verifyId)} key={operation}>{response.data.op.verifyResult}</a>);
                if (++opCount < opNumber) {
                  opList.push(<AntDDivider type="vertical" key={index} />);
                };
              }
              return opList;
            });
            // 自定义图表
            opList.push(<a onClick={this.setChartSettingVisible.bind(this, record.verifyId)} key='customChart'>自定义图表</a>);
            return <span>{opList}</span>;
          };
        }
        return col;
      });
      // 改变表格数据的显示
      // response.data.dataSource.map((data) => {
      //   switch(data.state) {
      //     case 0: data.state = '已配置';break;
      //     case 1: data.state = '训练中';break;
      //     case 2: data.state = '中止训练';break;
      //     case 3: data.state = '训练完成';break;
      //     case 4: data.state = '验证中';break;
      //     case 5: data.state = '验证完成';break;
      //     case 6: data.state = '发布成功';break;
      //     case 7: data.state = '停止发布';break;
      //     case 8: data.state = '服务中';break;
      //     case -1: data.state = '异常';break;
      //     default: data.state = '无状态';
      //   }
      //   return data.key = data.verifyId;
      // });
      this.showTableData(response.data);
    }).catch(error => {
      console.log(error);
    });
  }

  // 显示选择数据源（验证）弹出框，保存该行部分数据
  @action beforeDoVerify = (batchId, dataId, verifyId) => {
    this.props.dataSourceVisible.setVisible(true);
    this.verifyData = { batchId, dataId, verifyId };
  }
  // 验证--选择数据源弹出框--确定按钮
  @action handleDataSourceOk = () => {
    this.dataSourceChild.validateFields((err, values) => {
      if (!err) {
        this.props.dataSourceVisible.setVisible(false);
        const { batchId, dataId, verifyId } = this.verifyData;
        this.doVerify(batchId, dataId, verifyId);
      } else {
        this.props.dataSourceVisible.setVisible(true);
      }
    });
  }

  // 验证
  @action doVerify = (batchId, dataId, verifyId) => {
    console.info('验证参数：', batchId, dataId, verifyId);
    verify(batchId, dataId, verifyId).then((response) => {
      console.info(response);
      (() => {
        AntDmessage.success(response.msg);
      })();
    }).catch(error => {
      (() => {
        AntDmessage.success(error.response.data.msg);
      })();
    });
  }

  // 验证情况
  @action doVerifyResult = (verifyId) => {
    const _this = this;
    verifyResult(verifyId).then((response) => {
      console.info(response);
      AntDModal.success({
        title: '成功',
        content: response.msg,
        // onOk() {
        //   _this.getTableDatas(1, 10);
        // }
      });
    }).catch(error => {
      AntDModal.error({
        title: '失败',
        content: error.response.data.msg,
        // onOk() {
        //   _this.getTableDatas(1, 10);
        // }
      });
    });
  }

  // 显示自定义图表设置弹出框
  @action setChartSettingVisible = () => {
    this.props.chartSettingVisible.setVisible(true);
  }

  // 自定义图表--确定按钮
  @action handleSettingOk = () => {
    this.settingChild.validateFields((err, values) => {
      // 
      if (!err) {
        // addTableData(values).then((response) => {
        //   console.log('新增数据', response);
        //   this.props.refresTable(1, 10);
        //   this.props.setNeedReset(true);
        // }).catch(error => console.info(error));
        this.props.chartSettingVisible.setVisible(false);
        this.getChartDatas();
      } else {
        this.props.chartSettingVisible.setVisible(true);
      }
    });
  }

  // 弹出框关闭回调
  @action handleAfterClose = () => {
    // 则重置表单
    this.settingChild.resetFields();
    // 重置type（type用于生成不同表单项）
    this.props.type.setType("");
    // 重置setting中的数据源（options）、x轴、y轴
    this.props.setting.setXOptions([]);
    this.props.setting.setYOptions([]);
  }

  // 获得绘图数据（需要修改，传参，表单项的值）
  @action getChartDatas = () => {
    getChartData().then(response => {
      this.setChartData(response);
      this.props.chartVisible.setVisible(true);
    }).catch(error => console.info(error.message));
  }

  // 获得子组件（图表设置表单）表单方法
  @action getSettingChild = (ref) => {
    this.settingChild = ref;
  }

  // 获得子组件（验证，数据源选择表单）表单方法
  @action getDataSourceChild = (ref) => {
    this.dataSourceChild = ref;
  }

  // 获取数据
  @action componentDidMount = () => {
    this.getTableDatas(1, 10);
  }

  render() {
    console.info('render-模型验证');
    const rowSelection = {
      onChange: (selectedRowKeys, selectedRows) => {
        console.info(`所选行keys：${selectedRowKeys}，所选行：`, selectedRows);
      }
    };
    const pagination = {
      total: this.props.ds.data.total,
      pageSizeOptions: ['5', '10', '20', '30'],
      showSizeChanger: true,
      onChange: (page, pageSize) => {
        this.getTableDatas(page, pageSize);
      }
    };
    return (
      <div className={classNames(styles.componentDemo, this.props.className)} style={this.props.style}>
        <AntDTable
          rowSelection={rowSelection}
          columns={this.props.ds.data.dataColumns}
          dataSource={this.props.ds.data.dataSource}
          pagination={pagination}
        />
        <OpenModal
          title='数据源选择'
          visible={this.props.dataSourceVisible}
          handleOk={this.handleDataSourceOk}
          resetFields={this.dataSourceChild.resetFields}
        >
          <DataSourceForm getChild={this.getDataSourceChild} />
        </OpenModal>
        <OpenModal
          title='自定义图表'
          visible={this.props.chartSettingVisible}
          handleOk={this.handleSettingOk}
          handleAfterClose={this.handleAfterClose}
          resetFields={this.settingChild.resetFields}
        >
          <CustomChartSetting getChild={this.getSettingChild} type={this.props.type} setting={this.props.setting} />
        </OpenModal>
        <OpenModal
          title='图形展示'
          visible={this.props.chartVisible}
          type={this.props.type}
        // handleOk={this.handleOk}
        >
          <CustomChart data={this.chartData} type={this.props.type} setting={this.props.setting} />
        </OpenModal>
      </div>
    );
  }
}

Table.defaultProps = {
};

// const InjectSearchForm = inject(({someStore={}}) => ({someProps: someStore.attribute}))(Table);
const InjectSearchForm = inject()(Table);

export {
  Table,
  InjectSearchForm
};