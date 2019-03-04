import {observable, action} from 'mobx';

// 流程数据
class ProcessData {
  // 流程id
  @observable processId = null;
  // 线 输入参数
  @observable lineInparams = {};
  // 全局属性
  @observable globalParams = {};

  // 流程是否被改变
  @observable haveChanged = false;
  // 全局属性渲染时机
  @observable globalVisible = false;

  @action setProcessId = (id) => this.processId = id;
  @action setLineInparams = (id, value) => this.lineInparams[id] = value;
  @action setGlobalParams = (value) => this.globalParams = value;
  
  @action setHaveChanged = (value) => this.haveChanged = value;
  @action setGlobalVisible = (value) => this.globalVisible = value;
  
}

// 流程标题
class FlowTitle {
  @observable flowTitle = "未命名";
  @action setFlowTitle = (value) => this.flowTitle = value;
}

export {
  ProcessData,
  FlowTitle
};
