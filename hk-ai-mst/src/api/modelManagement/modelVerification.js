import {
  request
} from '../../utils/request.axios';

const base = '/hkai-admin/api/rest/ai/v1.0/';

// FIXME：userId为用户id
const userId = 'justForTest';


// 获取表格数据
export const  getTableData = (current, pageSize) => {
  return request(`${base}model/verify/list/${userId}`, {
    method: 'GET',
    params: {
      current,
      pageSize
    }
  }, {
    errorTitle: '获取表格数据'
  });
};

// 验证--获得数据源
export const getDataSource = (dataId) => {
  console.info(`数据验证情况：${dataId}`);
  return request(`${base}datamanager/data/info/combobox`, {
    method: 'GET'
  }, {
    errorTitle: '验证--获得数据源'
  });
};

// 数据验证
export const verify = (batchId, dataId,verifyId) => {
  let data = {
    batchId,
    dataId
  };
  console.info(`模型训练批次id：${batchId}，数据验证的id：${dataId}，验证信息id:${verifyId}`);
  if(!verifyId) {
    data = {
      batchId,
      dataId,
      verifyId
    };
  }
  return request(`${base}model/verify/start/${batchId}`, {
    method: 'GET',
    params: data
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
  return request(`${base}model/verify/query/${userId}`, {
    method: 'GET',
    params: data
  }, {
    errorTitle: '查询表格数据'
  });
};

// 获得生成图表的数据
// 参数：用户选择的
export const getChartData = () => {
  console.info('获得生成图表的数据');
  return request(`http://localhost:8086/data`, {
    method: 'GET',
  }, {
    errorTitle: '获得生成图表的数据',
  });
};
