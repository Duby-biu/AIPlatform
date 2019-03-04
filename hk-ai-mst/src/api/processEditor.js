import {
  request
} from '../utils/request.axios';

const base = '/hkai-admin/api/rest/ai/v1.0/';

// 获取构件菜单数据
export const  getCompMenuData = () => {
  return request(`${base}model/config/componentTree`, {
    method: 'GET'
  }, {
    errorTitle: '获取构件菜单数据'
  });
};

// 保存流程数据
export const saveProcess = (data) => {
  console.info('保存流程数据',data);
  return request(`${base}model/config/add`, {
    method: 'POST',
    data: data
  }, {
    errorTitle: '保存流程数据'
  });
};

// 修改流程数据
export const updateProcess = (data) => {
  console.info('修改流程数据',data);
  return request(`${base}model/config/update`, {
    method: 'PUT',
    data:data
  }, {
    errorTitle: '修改流程数据'
  });
};

// 测试模型配置
export const testProcess = (content, testId) => {
  console.info('测试模型配置', testId);
  return request(`${base}model/train/test/${testId}`, {
    method: 'POST',
    data: {
      content
    }
  }, {
    errorTitle: '测试模型配置',
    throwError: true
  });
};

// 获取全局属性
export const getGlobalParam = () => {
  console.info('获取全局属性');
  return request(`http://localhost:8086/data`, {
    method: 'GET',
  }, {
    errorTitle: '获取全局属性',
  });
};