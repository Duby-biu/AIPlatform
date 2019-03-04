import {
  request,
  request2
} from '../../utils/request.axios';

const base = '/hkai-admin/api/rest/ai/v1.0/';
// 获取表格数据
export const  getTableData = (current, pageSize) => {
  return request(`${base}model/train/info/list`, {
    method: 'GET',
    params: {
      current,
      pageSize
    }
  }, {
    errorTitle: '获取表格数据'
  });
};

// 数据训练
export const getTrain = (dataId) => {
  console.info(`训练数据的id：${dataId}`);
  return request(`${base}model/train/run/${dataId}`, {
    method: 'GET'
  }, {
    errorTitle: '数据训练',
    throwError: true
  });
};

// 数据中止
export const stopModel = (dataId) => {
  console.info(`数据中止：${dataId}`);
  return request(`${base}model/train/stop/${dataId}`, {
    method: 'GET'
  }, {
    errorTitle: '数据中止',
    throwError: true
  });
};

// 查询数据
export const searchTableData = (data) => {
  console.info('查询条件',data);
  data.current = 1;
  data.pageSize = 10;
  return request(`${base}model/train/info/query`, {
    method: 'GET',
    params: data
  }, {
    errorTitle: '查询表格数据'
  });
};