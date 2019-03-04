import {
  types
} from 'mobx-state-tree';
import storage from 'store2';
import {
  createSimpleFetchModel
} from '../../CreationModel/SimpleFetchModel';
import {
  login as apiLogin,
  logout as apiLogout
} from '../../../api/user';

/**
 * 用户Model
 */
const User = types.model({
  realname: '',
  permission: types.optional(types.frozen, {})
});

/**
 * 当前用户
 */
const CurrentUser = types.compose(createSimpleFetchModel(apiLogin), types.model({
  data: types.maybe(User)
}).actions(self => ({
  setData(json = {}) {
    self.data = User.create(json);
  }
})));

/**
 * 认证信息Store
 */
export const AuthStore = types
  .model({
    currentUser: types.optional(CurrentUser, {})
  })
  .views(self => ({
    /**
     * 当前用户的json信息
     */
    get userInfo() {
      const {
        realname,
        permission
      } = self.currentUser.data || {};
      return {
        realname,
        permission
      };
    },
    /**
     * 当前用户是否已经登录,具体算法还需继续优化
     */
    get logged() {
      return self.userInfo.realname;
      // return true;
    }
  }))
  .actions(self => {
    /**
     * 把当前用户信息保存到localStorage里面
     */
    function setUserInfoToLocalStorage() {
      console.log('setUserInfoToLocalStorage');
      storage('userInfo', self.userInfo);
    }
    /**
     * 从localStorage里面获取用户信息
     */
    function getUserInfoFromLocalStorage() {
      return storage('userInfo');
    }
    /**
     * 从localStorage里面删除用户信息
     */
    function removeUserInfoFromLocalStorage() {
      storage.remove('userInfo');
    }
    /**
     * 把当前用户信息保存到sessionStorage里面
     */
    function setUserInfoToSessionStorage() {
      storage.session('userInfo', self.userInfo);
    }
    /**
     * 从sessionStorage里面获取用户信息
     */
    function getUserInfoFromSessionStorage() {
      return storage.session('userInfo');
    }
    /**
     * 从sessionStorage里面移除用户信息
     */
    function removeUserInfoFromSessionStorage() {
      return storage
        .session
        .remove('userInfo');
    }
    /**
     * 登录
     * @param {Object} params 请求参数
     * @param {string} params.username 用户名
     * @param {string} params.password 密码
     * @param {boolean} params.ifRemember 是否记住当前登录
     * @return {promise} 返回一个promise
     */
    function login(params) {
      // 返回一个promise
      return self
        .currentUser
        .fetchData(params)
        .then(json => {
          if (params.ifRemember) {
            setUserInfoToLocalStorage();
          } else {
            removeUserInfoFromLocalStorage();
          }
          setUserInfoToSessionStorage();
          return json;
        })
        .catch(err => {
          removeUserInfoFromLocalStorage();
          removeUserInfoFromSessionStorage();
          throw err;
        });
    }

    /**
     * 登出
     */
    function logout() {
      apiLogout().then(() => {
        self.currentUser.setData({});
        removeUserInfoFromLocalStorage();
        removeUserInfoFromSessionStorage();
      }).catch(() => {});
    }

    function afterCreate() {
      //优先从sessionStorage获取值,然后设置currentUser的值
      const userInfo = getUserInfoFromSessionStorage() || getUserInfoFromLocalStorage();
      if (userInfo) {
        self
          .currentUser
          .setData(userInfo);
      }
    }

    return {
      login,
      logout,
      afterCreate
    };
  });