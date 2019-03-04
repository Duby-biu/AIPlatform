import { observable, action } from 'mobx';

class IconRefresh {
  @observable refresh = false;

  @action setRefresh = (value) => this.refresh = value;
}

export {
  IconRefresh
};