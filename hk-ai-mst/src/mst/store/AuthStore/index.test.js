import {AuthStore} from './index';

it('test AuthStore',()=>{
  const store = AuthStore.create({});
  console.log(store.toJSON()); 
});