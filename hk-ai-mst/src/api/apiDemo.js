import {
  request
} from '../utils/request.axios';

export const getLibraries = () => {
  return request('https://api.bootcdn.cn/libraries.min.json', {}, {
    errorTitle: '获取所有开源库信息'
  });
};