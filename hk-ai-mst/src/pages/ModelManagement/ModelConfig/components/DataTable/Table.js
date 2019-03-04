// 库引入
import React, { Component } from 'react';
import { action } from 'mobx';
import { inject, observer } from 'mobx-react';
import classNames from 'classnames';
import { Link } from 'react-router-dom';
import {
  Table as AntDTable,
  Divider as AntDDivider,
  Modal as AntDModal,
} from 'antd';

// 样式引入
import styles from './style.module.less';

// 数据操作引入
import { getTableData, deleteTableData, getTraining } from '../../../../../api/modelManagement/modelConfig';
import { verify, verifyResult } from '../../../../../api/modelManagement/modelVerification';
import { getTrain } from '../../../../../api/modelManagement/modelTrain';

const confirm = AntDModal.confirm;

@observer
class Table extends Component {
  @action showTableData = (data) => this.props.ds.setData(data);
  @action showTableDataSource = (data) => this.props.ds.setDataSource(data);

  // 训练
  @action doGetTrain = (historyId) => {
    const _this = this;
    getTrain(historyId).then((response) => {
      console.info(response);
      AntDModal.success({
        title: '成功',
        content: response.msg,
        onOk() {
          _this.getTableDatas(1, 10);
        }
      });
    }).catch(error => {
      AntDModal.error({
        title: '失败',
        content: error.response.data.msg,
        onOk() {
          _this.getTableDatas(1, 10);
        }
      });
    });
  }

  // 训练情况
  @action doGetTraining = (batchId) => {
    window.open('/admin/training-situation/overview/' + batchId);
  }

  // 验证
  @action doVerify = (batchId, verifyId) => {
    const _this = this;
    verify(batchId, verifyId).then((response) => {
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
            let rowIndex = index;
            opKeyArray.map((operation, index) => {
              if (operation === 'del') {
                opList.push(<a onClick={this.showDeleteConfirm.bind(this, record.historyId)} key={operation}>{response.data.op.del}</a>);
                if (++opCount < opNumber){
                    opList.push(<AntDDivider type="vertical" key={index} />);
                  };
              } else if (operation === 'update') {
                opList.push(<Link to={{ pathname: '/admin/model-management/config/editor', state: { historyId: record.historyId } }} key={operation}>{response.data.op.update}</Link>);
                if (++opCount < opNumber){
                  opList.push(<AntDDivider type="vertical" key={index} />);
                };
              } else if (operation === 'train') {
                const state = response.data.dataSource[rowIndex].state;
                if (state === '已配置' || state === '已训练' || state === '中止训练') {
                  // 训练
                  opList.push(<a onClick={this.doGetTrain.bind(this, record.historyId)} key={operation}>{response.data.op.train}</a>);
                  if (++opCount < opNumber){
                    opList.push(<AntDDivider type="vertical" key={index} />);
                  };
                }
              } else if (operation === 'training') {
                const state = response.data.dataSource[rowIndex].state;
                if (state === '训练中' || state === '已训练' || state === '中止训练') {
                  // 训练情况
                  opList.push(<a onClick={this.doGetTraining.bind(this, record.batchId)} key={operation}>{response.data.op.training}</a>);
                  if (++opCount < opNumber){
                    opList.push(<AntDDivider type="vertical" key={index} />);
                  };
                }
              } else if (operation === 'verify') {
                const state = response.data.dataSource[rowIndex].state;
                if (state === '已训练' || state === '中止训练') {
                  // 验证
                  opList.push(<a onClick={this.doVerify.bind(this, record.batchId, record.verifyId)} key={operation}>{response.data.op.verify}</a>);
                  if (++opCount < opNumber){
                    opList.push(<AntDDivider type="vertical" key={index} />);
                  };
                }
              } else if (operation === 'verifyResult') {
                const state = response.data.dataSource[rowIndex].state;
                if (state === '验证完成') {
                  // 验证情况
                  opList.push(<a onClick={this.doVerifyResult.bind(this, record.verifyId)} key={operation}>{response.data.op.verifyResult}</a>);
                  if (++opCount < opNumber){
                    opList.push(<AntDDivider type="vertical" key={index} />);
                  };
                }
              }
              return opList;
            });
            return <span>{opList}</span>;
          };
        }
        return col;
      });
      // 改变表格数据的显示
      response.data.dataSource.map((data) => {
        switch (data.state) {
          case 0: data.state = '已配置'; break;
          case 1: data.state = '训练中'; break;
          case 2: data.state = '中止训练'; break;
          case 3: data.state = '训练完成'; break;
          case 4: data.state = '验证中'; break;
          case 5: data.state = '验证完成'; break;
          case 6: data.state = '发布成功'; break;
          case 7: data.state = '停止发布'; break;
          case 8: data.state = '服务中'; break;
          case -1: data.state = '异常'; break;
          default: data.state = '无状态';
        }
        return data.key = data.historyId;
      });
      this.showTableData(response.data);
    }).catch(error => {
      console.log(error);
    });
  }

  showDeleteConfirm = (historyId) => {
    const _this = this;
    confirm({
      title: '注意',
      content: '您是否要删除此项',
      okText: '确定',
      cancelText: '取消',
      onOk() {
        deleteTableData(historyId).then(() => {
          _this.getTableDatas(1, 10);
        }).catch(error => {
          console.info(error);
        });
        console.log('OK');
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  }

  componentDidMount = () => {
    this.getTableDatas(1, 10);
  }

  render() {
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