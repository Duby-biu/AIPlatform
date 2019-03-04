import {
  types
} from 'mobx-state-tree';
import {
  INITIAL,
  SUCCESS,
  ERROR,
  FETCHING
} from '../../constants/fetchStatus';
import fp from 'lodash/fp';
/**
 * 返回一个types.model,这个model有fetch方法可以修改self.data
 * @param {function} getApi 
 */
export const createSimpleFetchModel = (getApi) => types.model({
  fetchStatus: INITIAL,
  data: types.frozen
}).actions(self => {
  /**
   * 一次性接口调用函数
   */
  const onceFetchData = fp.once(()=>{self.fetchData();});
  /**
   * 调用接口获取数据
   * @param {params} params fetch的参数
   */
  function fetchData(params = self.params) {
    if (self.fetchStatus === FETCHING) {
      // 如果真在获取数据就不要再获取了(UI可以根据fetchStatus做一些必要的处理)
      return FETCHING;
    }
    //设置正在获取数据
    self.setFetchStatus(FETCHING);
    //调用获取数据的接口
    return getApi(params).then(json => {
      self.setData(json);
      self.setFetchStatus(SUCCESS);
      return json;
    }).catch(err => {
      self.setFetchStatus(ERROR);
      throw err;
    });
  }
  /**
   * 设置fetchStatus的值
   * @param {string} status 
   */
  function setFetchStatus(status) {
    self.fetchStatus = status;
  }
  /**
   * 设置data的值
   * @param {object} json 
   */
  function setData(json) {
    // applySnapshot(self.data, json);
    // 好像和上面用applySnapshot的效果是一样的
    self.data = json;
  }
  return {
    fetchData,
    onceFetchData,
    setFetchStatus,
    setData
  };
});