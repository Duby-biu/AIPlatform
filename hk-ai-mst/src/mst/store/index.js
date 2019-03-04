import {
  types
} from 'mobx-state-tree';
import {AuthStore} from './AuthStore';
import {UIStore} from './UIStore';
import {LibsStore} from './LibsStore';


const Store = types.model({
  createTime: new Date(),
  authStore: types.optional(AuthStore,{}),
  uiStore: types.optional(UIStore,{}),
  libsStore: types.optional(LibsStore,{}),
});

export const store = Store.create({});

console.log(store.toJSON());