import { observable, action } from 'mobx';

class Monitoring {
  @observable batchId = '123456';

  @action setBatchId = (id) => this.batchId = id;
}

export {
  Monitoring
};