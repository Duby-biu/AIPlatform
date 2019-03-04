import {observable, action} from 'mobx';

class IsVisible {
  @observable visible = false;

  @action setVisible = (value) => this.visible = value;
}

export {
  IsVisible,
};