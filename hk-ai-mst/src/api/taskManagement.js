import {
  request
} from '../utils/request.axios';

const base = '/hkai-admin/api/rest/ai/v1.0/';

// 获取所有任务
export const  getTaskData = (current, pageSize) => {
  return request(`${base}taskmanager/task/list`, {
    method: 'GET',
    params: {
      current,
      pageSize
    }
  }, {
    errorTitle: '获取所有任务'
  });
};

// 新增数据
export const addTaskData = (data) => {
  console.info('新增数据',data);
  return request(`${base}taskmanager/task/add`, {
    method: 'POST',
    data: data
  }, {
    errorTitle: '添加任务表格数据'
  });
};

// 删除数据
export const deleteTaskData = (taskId) => {
  console.info(`删除数据的id：${taskId}`);
  return request(`${base}taskmanager/task/${taskId}`, {
    method: 'DELETE'
  }, {
    errorTitle: '删除任务表格数据'
  });
};

// 修改数据
export const updateTaskData = (data) => {
  console.info('修改数据',data);
  return request(`${base}datamanager/data/info/${data.get('taskId')}`, {
    method: 'POST',
    data: data
  }, {
    errorTitle: '修改任务表格数据'
  });
};

// 查询数据
export const searchTaskData = (data) => {
  console.info('查询条件',data);
  data.current = 1;
  data.pageSize = 10;
  return request(`${base}datamanager/data/info/query`, {
    method: 'GET',
    params: data
  }, {
    errorTitle: '查询任务表格数据'
  });
};