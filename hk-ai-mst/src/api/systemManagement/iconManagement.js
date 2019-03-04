import {
  request,
  request2
} from '../../utils/request.axios';

const base = '/hkai-admin/api/rest/ai/v1.0/';

// 新增图标
export const addIcon = (formData) => {
  console.info('新增图标',formData.getAll('files[]'));
  return request2(`${base}model/config/fileUpload`, {
    method: 'POST',
    data: formData
  }, {
    errorTitle: '新增图标'
  });
};

// 获取已有图标
export const getIcon = (current, pageSize) => {
  console.info('获得图标');
  return request(`${base}model/config/fileList`, {
    method: 'GET',
    params: {
      current,
      pageSize
    }
  }, {
    errorTitle: '获取已有图标'
  });
};