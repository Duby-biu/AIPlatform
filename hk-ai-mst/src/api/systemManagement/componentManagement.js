import {
  request
} from '../../utils/request.axios';

const base = '/hkai-admin/api/rest/ai/v1.0/';

// 获取树结构数据
export const  getTreeData = () => {
  return request(`${base}component/componentTree`, {
    method: 'GET'
  }, {
    errorTitle: '获取树结构数据'
  });
};

// 获取节点详细数据
export const  getTreeNodeData = (componentId) => {
  return request(`${base}component/info/${componentId}`, {
    method: 'GET'
  }, {
    errorTitle: '获取节点详细数据'
  });
};

// 新增树节点
export const addTreeNode = (data) => {
  console.info('新增节点',data);
  return request(`${base}component/add`, {
    method: 'POST',
    data: data
  }, {
    errorTitle: '添加树节点'
  });
};

// 删除叶子节点
export const deleteTreeNode = (dataId) => {
  console.info(`删除叶子节点的id：${dataId}`);
  return request(`${base}component/del/${dataId}`, {
    method: 'DELETE'
  }, {
    errorTitle: '删除叶子节点'
  });
};

// 更新节点
export const updateTreeNode = (data) => {
  console.info('修改节点',data);
  return request(`${base}component/update`, {
    method: 'PUT',
    data: data
  }, {
    errorTitle: '修改节点'
  });
};

// 查询节点
export const searchTreeNode = (data) => {
  console.info('查询条件',data);
  return request(`${base}component/componentTree/list`, {
    method: 'GET',
    params: data
  }, {
    errorTitle: '查询节点'
  });
};
