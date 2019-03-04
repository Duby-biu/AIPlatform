import axios from 'axios';
import qs from 'qs';
import {
  notification
} from 'antd';
import codeMessage from '../constants/codeMessage';

/**
 * Requests a URL, returning a promise.
 *
 * @param  {string} url       The URL we want to request
 * @param  {Object} config The options we want to pass to "axios"
 * @param  {Object} payLoad 额外的参数,无关axios的
 * @param  {boolean=} [payLoad.throwError=false] 是否向下传递error
 * @param  {string} [payLoad.errorTitle=''] 自定义错误提示标题
 * @param  {string} [payLoad.errorMsg=''] 自定义错误提示的内容
 * @return {promise}
 */
export const request = (url, config = {}, payLoad = {
  throwError: false,
  errorTitle: '',
  errorMsg: ''
}) => {
  // 默认的axios的config
  const defaultConfig = {
    // withCredentials 表示跨域请求时是否需要使用凭证 默认为false
    // withCredentials: true,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  };
  const newConfig = { ...defaultConfig,
    ...config,
    url
  };
  newConfig.data = qs.stringify(newConfig.data || {});
  // 默认的payLoad
  const defaultPayLoad = {
    // 是否需要将错误throw出去,默认不需要
    throwError: false
  };
  const newPayLoad = {
    ...defaultPayLoad,
    ...payLoad
  };

  return axios(newConfig).then(res => {
    // 需要根据各个项目自身的情况对return进行修改
    // return res.data && res.data.data;
    return res.data;
  }).catch(error => {
    console.log('request error', error);
    if (newPayLoad.throwError) {
      // 直接把错误throw出去由后续程序处理
      throw error;
    } else {
      //先默认处理,再throw错误
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        const {
          status,
          statusText,
          data = {}
        } = error.response;
        const errortext = newPayLoad.errorMsg || data.msg || codeMessage[status] || statusText;
        notification.error({
          message: newPayLoad.errorTitle || `请求错误 ${status}: ${url}`,
          description: errortext,
          maxCount: 3
        });
      } else if (error.request) {
        // The request was made but no response was received
        // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
        // http.ClientRequest in node.js
        notification.error({
          message: newPayLoad.errorTitle || '服务器无响应',
          description: '已经发出请求但是没有收到响应，可能是HTTP方法有误',
          maxCount: 3
        });
      } else {
        // Something happened in setting up the request that triggered an Error
        notification.error({
          message: newPayLoad.errorTitle || '请求数据时发生错误',
          description: '请稍候再试',
          maxCount: 3
        });
      }
      throw error;
    }
  });
};

// 针对文件上传
export const request2 = (url, config = {}, payLoad = {
  throwError: false,
  errorTitle: '',
  errorMsg: ''
}) => {
  // 默认的axios的config
  const defaultConfig = {
    // withCredentials 表示跨域请求时是否需要使用凭证 默认为false
    // withCredentials: true,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  };
  const newConfig = { ...defaultConfig,
    ...config,
    url
  };
  // 默认的payLoad
  const defaultPayLoad = {
    // 是否需要将错误throw出去,默认不需要
    throwError: false
  };
  const newPayLoad = {
    ...defaultPayLoad,
    ...payLoad
  };

  return axios(newConfig).then(res => {
    // 需要根据各个项目自身的情况对return进行修改
    // return res.data && res.data.data;
    return res.data;
  }).catch(error => {
    console.log('request error', error.response);
    if (newPayLoad.throwError) {
      // 直接把错误throw出去由后续程序处理
      throw error;
    } else {
      //先默认处理,再throw错误
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        const {
          status,
          statusText,
          data = {}
        } = error.response;
        const errortext = newPayLoad.errorMsg || data.msg || codeMessage[status] || statusText;
        notification.error({
          message: newPayLoad.errorTitle || `请求错误 ${status}: ${url}`,
          description: errortext,
          maxCount: 3
        });
      } else if (error.request) {
        // The request was made but no response was received
        // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
        // http.ClientRequest in node.js
        notification.error({
          message: newPayLoad.errorTitle || '服务器无响应',
          description: '已经发出请求但是没有收到响应，可能是HTTP方法有误',
          maxCount: 3
        });
      } else {
        // Something happened in setting up the request that triggered an Error
        notification.error({
          message: newPayLoad.errorTitle || '请求数据时发生错误',
          description: '请稍候再试',
          maxCount: 3
        });
      }
      throw error;
    }
  });
};