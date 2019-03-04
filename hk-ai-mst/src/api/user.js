import {
  request
} from '../utils/request.axios';

// 登录
export const login = ({
  username,
  password,
  ifRemember = 'no'
}) => {
  return request(`/hkai-admin/api/rest/ai/v1.0/login`, {
    method: 'POST',
    data: {
      username,
      password,
      ifRemember
    }
  }, {
    errorTitle: '登录'
  });
};


// 注销
export const logout = () => {
  return request(`/hkai-admin/api/rest/ai/v1.0/logout`, {
    method: 'POST',
    data: {

    }
  }, {
    errorTitle: '注销'
  });
};

// 注册
export const register = () => {
  return request(`/hkai-admin/api/rest/ai/v1.0/register`, {
    method: 'POST',
    data: {

    }
  }, {
    errorTitle: '注册'
  });
};