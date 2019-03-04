import {
  request,
  request2
} from '../../utils/request.axios';

const base = '/hkai-admin/api/rest/ai/v1.0/';
// 获取表格数据
export const  getTableData = (current, pageSize) => {
  return request(`${base}model/config/list`, {
    method: 'GET',
    params: {
      current,
      pageSize
    }
  }, {
    errorTitle: '获取表格数据'
  });
};

// 新增数据
export const addTableData = (formData) => {
  console.info('新增数据',formData);
  return request2(`${base}datamanager/data/info`, {
    method: 'POST',
    data: formData
  }, {
    errorTitle: '添加表格数据'
  });
};

// 删除数据
export const deleteTableData = (dataId) => {
  console.info(`删除数据的id：${dataId}`);
  return request(`${base}model/config/del/${dataId}`, {
    method: 'DELETE'
  }, {
    errorTitle: '删除表格数据'
  });
};

// 获得指定流程数据
export const getEditDatas = (dataId) => {
  console.info('数据id：',dataId);
  return request2(`${base}model/config/get/${dataId}`, {
    method: 'GET',
  }, {
    errorTitle: '获得指定流程数据'
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

// 数据训练情况
export const getTraining = (dataId) => {
  console.info(`训练情况数据的id：${dataId}`);
  // return request(`${base}model/train/run/${dataId}`, {
  //   method: 'GET'
  // }, {
  //   errorTitle: '数据训练情况',
  //   throwError: true
  // });
};

// 查询数据
export const searchTableData = (data) => {
  console.info('查询条件',data);
  data.current = 1;
  data.pageSize = 10;
  return request(`${base}model/config/query`, {
    method: 'GET',
    params: data
  }, {
    errorTitle: '查询表格数据'
  });
};










// // 查询数据
// export const searchTableData = (data) => {
//   console.info('查询条件',data);
//   data.current = 1;
//   data.pageSize = 10;
//   return request(`${base}datamanager/data/info/query`, {
//     method: 'GET',
//     params: data
//   }, {
//     errorTitle: '查询表格数据'
//   });
// };

// // 更新数据源文件
// export const updateFile = (dataId) => {
//   console.info('更新数据源文件的数据id',dataId);
//   return request(`${base}datamanager/data/local/update/${dataId}`, {
//     method: 'PUT',
//   }, {
//     errorTitle: '更新数据源文件',
//     throwError: true
//   });
// };

// // 数据源连接测试
// export const dataConnectTest = (dataId) => {
//   console.info('数据源连接测试的数据id',dataId);
//   return request(`${base}datamanager/connect/${dataId}`, {
//     method: 'GET',
//   }, {
//     errorTitle: '数据源连接测试',
//     throwError: true
//   });
// };

// `http://localhost:8086/data`