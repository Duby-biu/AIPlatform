// 库引入
import React, { Component } from 'react';
import { action, toJS } from 'mobx';
import { inject, observer } from 'mobx-react';
import classNames from 'classnames';
import { Tooltip, Divider, Icon, Button, message as Antdmessage } from 'antd';
import { Toolbar, Command, withPropsAPI } from 'gg-editor';

// 组件引入
import { IconFont } from '../../../../components/IconFont';
import { ModalForAdd } from './ModalForAdd.js';

// utils引入
import { f } from '../../../../utils/f2f';
import { formatDatas } from './FormatDatasUtil.js';
import { randomString } from '../../../../utils/randomString';

// 数据操作引入
import { updateProcess, testProcess } from '../../../../api/processEditor';

// 样式引入
import styles from './style.module.less';

// mobx引入
import { IsVisible } from './ProcessAddMobx';

const addVisible = new IsVisible();


/**
 * Editor的顶部导航
 */
@withPropsAPI
@observer
class ProcessEditorToolBar extends Component {
  @action hanldeSaveBtnClick = () => {
    console.log('点击了保存按钮');
    const { propsAPI, processData: pd } = this.props;
    const { save } = propsAPI;

    // 新增流程
    if (!pd.processId) {
      addVisible.setVisible(true);
    // 修改流程
    } else {
      // 连线参数
      const linesInparams = toJS(this.props.processData.lineInparams);
      // 全局参数
      const globalParams = toJS(this.props.processData.globalParams);
      const formatData = formatDatas(save(), this.props.flowTitle.flowTitle, linesInparams, globalParams);
      const name = this.props.flowTitle.flowTitle;
      const content = JSON.stringify(formatData);
      console.info('格式化的数据', formatData);
      const data = {
        content: content,
        name: name,
        processId: pd.processId
      };
      updateProcess(data).then((response) => {
        // 流程是否改变状态置为未改变
        this.props.processData.setHaveChanged(false);
        (() => {
          Antdmessage.success('保存成功');
        })();
      }).catch(error => {
        (() => {
          Antdmessage.error('保存失败');
        })();
        console.info(error.message);
      });
    }
    // this.props.onSaveBtnClick();
  }

  // 点击了检查按钮点击了检查按钮
  @action hanldeCheckBtnClick = () => {
    console.log('点击了检查按钮');
    this.props.onCheckBtnClick();
  }

  // 测试，判断是否打开新窗口
  @action doTest = async(content, testId) => {
    let isOpen = false;
      await testProcess(content, testId).then((response) => {
      (() => {
        Antdmessage.success(response.msg);
      })();
      isOpen = true;
    }).catch(error =>{
      (() => {
        Antdmessage.error(error.message);
      })();
    });
    console.info(isOpen);
    if (isOpen){
      window.open('/admin/training-situation/overview/' + testId);
    }
  }

  // 点击了测试按钮
  @action hanldeTestBtnClick = () => {
    console.log('点击了测试按钮');
    const { save } = this.props.propsAPI;
    // 连线参数
    const linesInparams = toJS(this.props.processData.lineInparams);
    // 全局参数
    const globalParams = toJS(this.props.processData.globalParams);
    const formatData = formatDatas(save(), this.props.flowTitle.flowTitle, linesInparams, globalParams);
    // 模型数据
    const content = JSON.stringify(formatData);
    // 随机生成32为uuid
    const testId = randomString(32);
    this.doTest(content, testId);

    // this.props.onTestBtnClick();
  }


  render() {
    return (
      <div className={classNames(styles.componentDemo, this.props.className)} style={this.props.style}>

        <Toolbar className={classNames(styles.processEditorToolBar, this.props.className)} style={this.props.style}>
          {/* <Command name="selectAll">
          <Tooltip title="全选" placement="bottom" overlayClassName={ styles.tooltip }>
            <Button><Icon type="undo" theme="outlined" /></Button>
          </Tooltip>
        </Command> */}
          <Tooltip title="保存" placement="bottom" overlayClassName={styles.tooltip}>
            <Button onClick={this.hanldeSaveBtnClick}><Icon type="save" theme="outlined" /></Button>
          </Tooltip>
          <Tooltip title="检查(在线)" placement="bottom" overlayClassName={styles.tooltip}>
            <Button onClick={this.hanldeCheckBtnClick}><Icon type="check-circle" theme="outlined" /></Button>
          </Tooltip>
          <Tooltip title="测试(本地)" placement="bottom" overlayClassName={styles.tooltip}>
            <Button onClick={this.hanldeTestBtnClick}><Icon type="check" theme="outlined" /></Button>
          </Tooltip>
          <Divider type="vertical" />
          <Command name="undo">
            <Tooltip title="撤销" placement="bottom" overlayClassName={styles.tooltip}>
              <Button><Icon type="undo" theme="outlined" /></Button>
            </Tooltip>
          </Command>
          <Command name="redo">
            <Tooltip title="重做" placement="bottom" overlayClassName={styles.tooltip}>
              <Button><Icon type="redo" theme="outlined" /></Button>
            </Tooltip>
          </Command>
          <Command name="delete">
            <Tooltip title="删除" placement="bottom" overlayClassName={styles.tooltip}>
              <Button><Icon type="delete" theme="outlined" /></Button>
            </Tooltip>
          </Command>
          <Divider type="vertical" />
          <Command name="zoomIn">
            <Tooltip title="放大" placement="bottom" overlayClassName={styles.tooltip}>
              <Button><Icon type="zoom-in" theme="outlined" /></Button>
            </Tooltip>
          </Command>
          <Command name="zoomOut">
            <Tooltip title="缩小" placement="bottom" overlayClassName={styles.tooltip}>
              <Button><Icon type="zoom-out" theme="outlined" /></Button>
            </Tooltip>
          </Command>
          <Command name="autoZoom">
            <Tooltip title="适应画布" placement="bottom" overlayClassName={styles.tooltip}>
              <Button><IconFont type="icon-huanyuanpingmudaxiao" /></Button>
            </Tooltip>
          </Command>
          <Command name="resetZoom">
            <Tooltip title="实际尺寸" placement="bottom" overlayClassName={styles.tooltip}>
              <Button><IconFont type="icon-shijidaxiao" /></Button>
            </Tooltip>
          </Command>
          <Divider type="vertical" />
          <Command name="zoomOut">
            <Tooltip title="左对齐" placement="bottom" overlayClassName={styles.tooltip}>
              <Button><Icon type="align-left" theme="outlined" /></Button>
            </Tooltip>
          </Command>
          <Command name="zoomOut">
            <Tooltip title="右对齐" placement="bottom" overlayClassName={styles.tooltip}>
              <Button><Icon type="align-right" theme="outlined" /></Button>
            </Tooltip>
          </Command>
          <Command name="zoomOut">
            <Tooltip title="上对齐" placement="bottom" overlayClassName={styles.tooltip}>
              <Button><Icon type="align-left" theme="outlined" className={classNames(styles.iconAlignTop)} /></Button>
            </Tooltip>
          </Command>
          <Command name="zoomOut">
            <Tooltip title="下对齐" placement="bottom" overlayClassName={styles.tooltip}>
              <Button><Icon type="align-left" theme="outlined" className={classNames(styles.iconAlignBottom)} /></Button>
            </Tooltip>
          </Command>
        </Toolbar>
        <ModalForAdd visible={addVisible} processData={this.props.processData} disabled={this.props.disabled} flowTitle={this.props.flowTitle}/>
      </div>
    );
  }
}

ProcessEditorToolBar.defaultProps = {
  onSaveBtnClick: f,
  onCheckBtnClick: f,
  onTestBtnClick: f,
};

const InjectProcessEditorToolBar = inject(({ someStore = {} }) => ({ someProps: someStore.attribute }))(ProcessEditorToolBar);

export {
  ProcessEditorToolBar,
  InjectProcessEditorToolBar
};