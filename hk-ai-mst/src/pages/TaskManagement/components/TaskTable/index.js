// 库引入
import React, { Component } from 'react';
import { action, observable } from 'mobx';
import { inject, observer } from 'mobx-react';
import classNames from 'classnames';
import { Link } from 'react-router-dom';
import {
  Table as AntDTable,
  Divider as AntDDivider,
  Modal as AntDModal,
  Button as AntDButton,
  Icon as AntDIcon,

} from 'antd';

// 样式引入
import styles from './style.module.less';

// 数据操作引入
// import { getTableData, verify, verifyResult } from '../../../../api/modelManagement/modelRelease';
import { getTaskData, deleteTaskData } from '../../../../api/taskManagement';


// 组件引入
import { AddModal } from './AddModal';
import { UpdateModal } from './UpdateModal';


const confirm = AntDModal.confirm;

// 新增模态框 visible属性
class IsVisible {
  @observable visible = false;

  @action setVisible = (value) => this.visible = value;
}
// 新增模态框
const addVisible = new IsVisible();
// 修改模态框
const updateVisible = new IsVisible();
@observer
class TaskTable extends Component {
  @observable initialValues = null;

  @action showModal = () => addVisible.setVisible(true);
  @action showTableData = (data) => this.props.ds.setData(data);
  @action showTableDataSource = (data) => this.props.ds.setDataSource(data);

  @action showUpdate = (record) => {
    this.initialValues = record;
    updateVisible.setVisible(true);
  }
  
  @action showDeleteConfirm = (taskId) => {
    const _this = this;
    confirm({
      title: '注意',
      content: '您是否要删除此项',
      okText: '确定',
      cancelText: '取消',
      onOk() {
        deleteTaskData(taskId).then(() => {
          if (_this.props.ds.doSearch) {
            _this.props.ds.setDoSearch(false);
            _this.getTableDatas(1, 10, 'delete', taskId);
          } else {
            _this.getTableDatas(1, 10);
          }
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

  // 获取table数据
  getTableDatas = (current, pageSize) => {
    getTaskData(current, pageSize).then(response => {
      console.info("获取table数据", response);
      response.data.columns.map((col) => {
        if (col.key === "op") {
          const opNumber = Object.keys(response.data.op).length;
          col.render = (text, record, index) => {
            let opCount = 0;
            const opList = [];
            const opKeyArray = Object.keys(response.data.op);
            opKeyArray.map((operation, index) => {
              if (operation === 'update') {
                opList.push(<a onClick={this.showUpdate.bind(this, record)} key={operation}>{response.data.op.update}</a>);
                if (++opCount < opNumber){
                  opList.push(<AntDDivider type="vertical" key={index} />);
                };
              } else if (operation === 'del') {
                opList.push(<a onClick={this.showDeleteConfirm.bind(this, record.taskId)} key={operation}>{response.data.op.del}</a>);
                if (++opCount < opNumber){
                  opList.push(<AntDDivider type="vertical" key={index} />);
                };
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
        return data.key = data.taskId;
      });
      this.showTableData(response.data);
    }).catch(error => {
      console.log(error);
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
        <AntDButton className={classNames(styles.btnRadius, styles.btnMarginBottom)} type="primary" onClick={this.showModal}><AntDIcon type="plus" />新建任务</AntDButton>
        <AntDTable
          rowSelection={rowSelection}
          columns={this.props.ds.data.dataColumns}
          dataSource={this.props.ds.data.dataSource}
          pagination={pagination}
        />
        <AddModal visible={addVisible} refresTable={this.getTableDatas} setNeedReset={this.props.ds.setNeedReset} />
        <UpdateModal visible={updateVisible} initialValues={this.initialValues} refresTable={this.getTableDatas} />
      </div>
    );
  }
}

TaskTable.defaultProps = {
};

// const InjectTaskTable = inject(({someStore={}}) => ({someProps: someStore.attribute}))(TaskTable);
const InjectTaskTable = inject()(TaskTable);

export {
  TaskTable,
  InjectTaskTable
};