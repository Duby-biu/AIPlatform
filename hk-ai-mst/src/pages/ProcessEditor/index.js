// 库引入
import React, { Component } from 'react';
import { action, observable, autorun, computed } from 'mobx';
import { inject, observer } from 'mobx-react';
import classNames from 'classnames';
import GGEditor from 'gg-editor';
import { Card, Input, Modal } from 'antd';
import { Prompt } from 'react-router-dom';

// 组件引入
import { ProcessEditorToolBar } from './components/ProcessEditorToolBar';
import { ProcessEditorItemPanel } from './components/ProcessEditorItemPanel';
import { ProcessEditorFlow } from './components/ProcessEditorFlow';
import { RegisterProcessCardNode } from './components/RegisterProcessCardNode';
import { ProcessEditorContextMenu } from './components/ProcessEditorContextMenu';
import { ProcessEditorFlowDetailPanel } from './components/ProcessEditorFlowDetailPanel';
import { ProcessEditorGlobalPanel } from './components/ProcessEditorGlobalPanel';
import { RegisterProcessMouseEnterFillRedBehaviour } from './components/RegisterProcessMouseEnterFillRedBehaviour';

import { InjectDocumentTitle as DocumentTitle } from '../../components/DocumentTitle';

// utils引入
import { f } from '../../utils/f2f';

// 样式引入
// import styles from './style.module.less';
import styles from './test.module.less';

// Mobx引入
import { ProcessData, FlowTitle } from './ProcessMobx.js';

// const confirm = Modal.confirm;

const processData = new ProcessData();
const flowTitle = new FlowTitle();

@observer
class ProcessEditor extends Component {
  // 判断画布是否被加载过
  @observable haveInit = false;
  // 流程名称（点击修改）
  @observable editTitle = false;

  @action setHaveInit = () => this.haveInit = true;

  changeId = autorun(() => {
    console.info('auto-编辑器,流程id',this.props.location.state.historyId);
    // 已有流程，初始化画布、设置流程id、不渲染全局属性
    if (this.props.location.state.historyId) {
      this.setHaveInit();
      processData.setProcessId(this.props.location.state.historyId);
      processData.setGlobalVisible(false);
    // 新增流程，清空流程id、清空并渲染全局属性、清空连线属性、初始化流程名字
    } else {
      processData.setProcessId(null);
      processData.setGlobalParams({});
      processData.setGlobalVisible(true);
      processData.setLineInparams({});
      flowTitle.setFlowTitle('未命名');
    }
  })

  @action componentWillMount = () => {
    console.info('will-编辑器');
    // 流程是否改变状态置为未改变
    processData.setHaveChanged(false);
  }

  @action handleClick = (e) => {
    this.editTitle = !this.editTitle;
    if (e.target.value) {
      // 流程是否改变状态置为已改变
      processData.setHaveChanged(true);
      flowTitle.setFlowTitle(e.target.value);
    }
  }

  // @action leave = async () => {
  //   let leave = false;
  //   confirm({
  //     title: '数据未保存',
  //     content: '您确定要离开当前页面吗？',
  //     okText: '确定',
  //     okType: 'danger',
  //     cancelText: '取消',
  //     onOk(e) {
  //       leave = true;
  //     },
  //     onCancel() {
  //       leave = false;
  //     }
  //   });
  //   console.info('-------------------',leave);
  //   return leave;
  // }


  render() {
    console.info('render-编辑器');
    const editableTitle = <Input onBlur={this.handleClick} defaultValue={flowTitle.flowTitle} />;
    const h1Ttile = <h1 onClick={this.handleClick} className={classNames(styles.title)}>{flowTitle.flowTitle}</h1>;
    return (
      <div className={classNames(styles.processEditor, 'page', this.props.className)}>
        <Card>
          <GGEditor className={classNames(styles.ggEditor, 'height100')} >
            <div className={classNames(styles.header)}>
              <ProcessEditorToolBar processData={processData} flowTitle={flowTitle} />
              {this.editTitle ? editableTitle : h1Ttile}
            </div>
            <div className={classNames(styles.main)}>
              <div className={classNames(styles.asideLeft)} >
                <Card title="流程构件">
                  <ProcessEditorItemPanel />
                </Card>
              </div>
              <div className={classNames(styles.content)}>
                <ProcessEditorFlow processData={processData} haveInit={this.haveInit} flowTitle={flowTitle} />
              </div>
              <div className={classNames(styles.asideRight)}>
                <div className={classNames(styles.thumbnailPanel)}>
                  <Card title="全局属性">
                    {processData.globalVisible && <ProcessEditorGlobalPanel processData={processData} /> }
                  </Card>
                </div>
                <div className={classNames(styles.attributeConfigurationPanel)}>
                  <ProcessEditorFlowDetailPanel processData={processData} />
                </div>
              </div>
            </div>
            {/* 以下组件在页面上是不会或者有条件显示的 */}
            <RegisterProcessCardNode />
            <RegisterProcessMouseEnterFillRedBehaviour />
            <ProcessEditorContextMenu />
          </GGEditor>
          <DocumentTitle documentTitle="算法配置器-核格人工智能平台" />
        </Card>
        <Prompt
          message={() => {
            // FIXME:输入参数那里失焦不一定做修改，是否修改还需判断; 离开弹出框样式还需修改
            console.info(processData.haveChanged, '离开弹出');
            if (processData.haveChanged) {
              let leave = window.confirm("数据未保存，您确定要离开该页面吗?");
              return leave;
            }
          }} />
      </div>
    );
  }
}

ProcessEditor.defaultProps = {
  onBtnLogoutClick: f
};

const InjectProcessEditor = inject(({ authStore = {} }) => ({
  onBtnLogoutClick: authStore.logout,
}))(ProcessEditor);

export {
  ProcessEditor,
  InjectProcessEditor
};