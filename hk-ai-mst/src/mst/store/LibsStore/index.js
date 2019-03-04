// 库引入
import {
  types
} from 'mobx-state-tree';
import fp from 'lodash/fp';

// CreationModel引入
import {
  createSimpleFetchModel
}　 from '../../CreationModel/SimpleFetchModel';

// api引入
import {
  getLibraries,
  getLibDetialsByName
} from '../../../api/libs';

/**
 * 所有开源库的信息
 */
const AllLibs = types.compose(createSimpleFetchModel(getLibraries), types.model({
  data: types.optional(types.frozen, [])
}).views(self => ({
  get top100() {
    return self.data.slice(0, 100);
  },
  top(num = 100) {
    return self.data.slice(0, num);
  }
})).actions(self => ({
  setData(arr = []) {
    self.data = fp.uniqBy('[0]', arr);
  }
})));

/**
 * 某个库的详细信息
 */
const libDetails = types.compose(createSimpleFetchModel(getLibDetialsByName), types.model({
  data: types.optional(types.frozen, {})
})).actions(self=>({
  setData(json = {}) {
    self.data = json;
  }
}));

/**
 * 库的信息
 */
export const LibsStore = types.model({
  filters: '',
  showAll: false,
  pageNum: 100,
  allLibs: types.optional(AllLibs, {}),
  libDetails: types.optional(libDetails, {})
}).views(self => ({
  get visibleLibs() {
    if (self.filters !== '') {
      return fp.filter(v => fp.includes(self.filters, fp.get(0, v)))(self.allLibs.data);
    }else if (self.showAll) {
      // 应该显示全部的,但是全部太多了,渲染会很卡.实际工程中会有其他解决办法,比如说react-virtualized
      return self.allLibs.top(1000);
    }  else {
      return self.allLibs.top(self.pageNum);
    }
  },
  get totalNum() {
    return self.allLibs.data.length;
  }
})).actions(self => ({
  setFilters(filters = "") {
    self.filters = filters;
  },
  setShowAll(showAll = false) {
    self.showAll = showAll;
  }
}));