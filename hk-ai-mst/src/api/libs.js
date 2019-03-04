import {
  request
} from '../utils/request.axios';

export const getLibraries = () => {
  return request('https://api.bootcdn.cn/libraries.min.json', {}, {
    errorTitle: '获取所有开源库信息'
  });
};

export const getLibDetialsByName = ({name = ''}) => {
  return request(`https://api.bootcdn.cn/libraries/${name}.min.json`, {}, {
    errorTitle: `获取${name}的详细信息`
  });
};