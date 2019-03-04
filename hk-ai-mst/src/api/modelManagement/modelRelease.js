import {
  request,
  request2
} from '../../utils/request.axios';

const base = '/hkai-admin/api/rest/ai/v1.0/';

// 获取表格数据
export const  getTableData = (current, pageSize) => {
  return request(`${base}model/release/list`, {
    method: 'GET',
    params: {
      current,
      pageSize
    }
  }, {
    errorTitle: '获取表格数据'
  });
};

// // 新增数据
// export const addTableData = (formData) => {
//   console.info('新增数据',formData);
//   return request2(`${base}datamanager/data/info`, {
//     method: 'POST',
//     data: formData
//   }, {
//     errorTitle: '添加表格数据'
//   });
// };

// // 删除数据
// export const deleteTableData = (dataId) => {
//   console.info(`删除数据的id：${dataId}`);
//   return request(`${base}model/config/del/${dataId}`, {
//     method: 'DELETE'
//   }, {
//     errorTitle: '删除表格数据'
//   });
// };

// // 获得指定流程数据
// export const getEditDatas = (dataId) => {
//   console.info('数据id：',dataId);
//   return request2(`${base}model/config/get/${dataId}`, {
//     method: 'GET',
//   }, {
//     errorTitle: '获得指定流程数据'
//   });
// };

// 数据验证
export const verify = (dataId) => {
  console.info(`数据验证的id：${dataId}`);
  const batchId = '版本号';
  return request(`${base}model/verify/${batchId}/${dataId}`, {
    method: 'GET'
  }, {
    errorTitle: '数据验证',
    throwError: true
  });
};

// 数据验证情况
export const verifyResult = (dataId) => {
  console.info(`数据验证情况：${dataId}`);
  return request(`${base}model/verify/${dataId}`, {
    method: 'GET'
  }, {
    errorTitle: '数据验证情况',
    throwError: true
  });
};

// 查询数据
export const searchTableData = (data) => {
  console.info('查询条件',data);
  data.current = 1;
  data.pageSize = 10;
  return request(`${base}model/release/query/`, {
    method: 'GET',
    params: data
  }, {
    errorTitle: '查询表格数据'
  });
};