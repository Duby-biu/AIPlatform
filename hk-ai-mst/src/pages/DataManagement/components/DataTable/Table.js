// 库引入
import React, { Component } from 'react';
import { action, observable } from 'mobx';
import { inject, observer } from 'mobx-react';
import classNames from 'classnames';
import {
  Table as AntDTable,
  Divider as AntDDivider,
  Modal as AntDModal,
  Button as AntDButton,
  Icon as AntDIcon,
  message as AntDmessage
} from 'antd';

// 样式引入
import styles from './style.module.less';

// 数据操作引入
import { getTableData, deleteTableData, updateFile, dataConnectTest } from '../../../../api/dataManagement';

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

// type改变
class Type {
  @observable type = "";

  @action setType = (value) => this.type = value;
}
const type = new Type();

@observer
class Table extends Component {
  @observable initialValues = null;

  @action showModal = () => addVisible.setVisible(true);

  @action showTableData = (data) => this.props.ds.setData(data);
  @action showTableDataSource = (data) => this.props.ds.setDataSource(data);

  @action showUpdate = (record) => {
    this.initialValues = record;
    type.setType(record.type);
    updateVisible.setVisible(true);
  }

  // 更新数据文件
  doUpdateFile = (dataId) => {
    updateFile(dataId).then((response) => {
      console.info(response);
      (() => {
        AntDmessage.success(response.msg);
      })();
      this.getTableDatas(1, 10);
    }).catch(error => {
      (() => {
        AntDmessage.error(error.response.data.msg);
      })();
      console.info(error.response);
    });
  }

  // 数据源连接测试
  doConnectTest = (dataId) => {
    dataConnectTest(dataId).then((response) => {
      console.info(response);
      (() => {
        AntDmessage.success(response.msg);
      })();
    }).catch(error => {
      (() => {
        AntDmessage.error(error.response.data.msg);
      })();
      console.info(error.response);
    });
  }

  // 获取table数据
  getTableDatas = (current, pageSize, op = 'init', dataId = null) => {
    if (op === 'init') {
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
                  opList.push(<a onClick={this.showDeleteConfirm.bind(this, record.dataId)} key={operation}>{response.data.op.del}</a>);
                  if (++opCount < opNumber){
                    opList.push(<AntDDivider type="vertical" key={index} />);
                  };
                } else if (operation === 'update') {
                  opList.push(<a onClick={this.showUpdate.bind(this, record)} key={operation}>{response.data.op.update}</a>);
                  if (++opCount < opNumber){
                    opList.push(<AntDDivider type="vertical" key={index} />);
                  };
                } else if (operation === 'updateFile') {
                  if (response.data.dataSource[rowIndex].isStore === '是') {
                    opList.push(<a onClick={this.doUpdateFile.bind(this, record.dataId)} key={operation}>{response.data.op.updateFile}</a>);
                    if (++opCount < opNumber){
                      opList.push(<AntDDivider type="vertical" key={index} />);
                    };
                  }
                } else if (operation === 'connectTest') {
                  opList.push(<a onClick={this.doConnectTest.bind(this, record.dataId)} key={operation}>{response.data.op.connectTest}</a>);
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
        response.data.dataSource.map((data) => {
          data.isStore === 1 ? data.isStore = '是' : data.isStore = '否';
          data.range === 'public' ? data.range = '公共' : data.range = '私有';
          return data.key = data.dataId;
        });
        this.props.ds.setNeedReset(false);
        this.showTableData(response.data);
      }).catch(error => {
        console.log(error);
      });
    } else if (op === 'delete') {
      const dataSource = this.props.ds.data.dataSource.filter((data) => {
        return data.dataId !== dataId;
      });
      this.showTableDataSource(dataSource);
    }
  }

  @action showDeleteConfirm = (dataId) => {
    const _this = this;
    confirm({
      title: '注意',
      content: '您是否要删除此项',
      okText: '确定',
      cancelText: '取消',
      onOk() {
        deleteTableData(dataId).then(() => {
          if (_this.props.ds.doSearch) {
            _this.props.ds.setDoSearch(false);
            _this.getTableDatas(1, 10, 'delete', dataId);
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
        <AntDButton className={classNames(styles.btnRadius, styles.btnMarginBottom)} type="primary" onClick={this.showModal}><AntDIcon type="plus" />新建</AntDButton>
        <AntDTable
          rowSelection={rowSelection}
          columns={this.props.ds.data.dataColumns}
          dataSource={this.props.ds.data.dataSource}
          pagination={pagination}
        />
        <AddModal visible={addVisible} refresTable={this.getTableDatas} setNeedReset={this.props.ds.setNeedReset} />
        <UpdateModal visible={updateVisible} initialValues={this.initialValues} type={type} refresTable={this.getTableDatas} />
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