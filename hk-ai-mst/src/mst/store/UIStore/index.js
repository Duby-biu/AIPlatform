// 库引入
import {
  types
} from 'mobx-state-tree';
import fp from 'lodash/fp';
// 工具函数引入
import {
  breakpointDetection
} from '../../../utils/breakpointDetection';
import {
  getUniqueNameSpace
} from '../../../utils/uniqueNameSpace';
import { autorun } from 'mobx';

// 一些值
const {
  $
} = window;

// 全局的ModalLoading
const ModalLoading = types.model({
  count: 0
}).views(self => ({
  get show() {
    return self.count > 0;
  }
})).actions(self => ({
  addCount() {
    self.count = self.count + 1;
  },
  reduceCount() {
    if (self.count > 0) {
      self.count = self.count - 1;
    } else {
      self.count = 0;
    }
  }
}));

// CurrentBreakpoint
const CurrentBreakpoint = types.model({
  // 当前CurrentBreakpoint的值
  value: ''
}).actions(self => {
  // 保证jquery事件的namespace是唯一的,这样才能在合适的时候精确卸载
  const nameSpace = getUniqueNameSpace();

  function setValue(value = '') {
    self.value = value;
  }

  function afterCreate() {
    // 挂载jquery事件
    $(window).on(`resize.${nameSpace}`, fp.debounce(20, function () {
      self.setValue(breakpointDetection());
    }));
  }

  function beforeDestroy() {
    // 理论上来说CurrentBreakpoint可能会被手动销毁,故需要卸载jquery事件
    $(window).off(`resize.${nameSpace}`);
  }
  return {
    setValue,
    afterCreate,
    beforeDestroy
  };
});

//文档的标题
const DocumentTitle = types.model({
  value: '核格人工智能平台'
}).views(self => ({
  get show() {
    return self.count > 0;
  }
})).actions(self => {
  function afterCreate() {
    if(!self.disposers) self.disposers = [];
    self.disposers.push(autorun(()=>{
      document.title = self.value;
    }));
  }
  function beforeDestroy() {
    if(self.disposers) {
      self.disposers.forEach(disposer=>disposer());
    }
  }
  // 设置文档的标题
  function setTitle(value) {
    if(!value) return;
    self.value = value;
  }
  // 重置文档的标题
  function resetTitle(){
    self.value = '核格人工智能平台';
  }
  return {
    afterCreate,
    beforeDestroy,
    setTitle,
    resetTitle
  };
});

export const UIStore = types.model({
  modalLoading: types.optional(ModalLoading, {}),
  currentBreakpoint: types.optional(CurrentBreakpoint, {}),
  documentTitle: types.optional(DocumentTitle, {}),
});