import { observable, action } from 'mobx';

class IsVisible {
  @observable visible = false;

  @action setVisible = (value) => this.visible = value;
}

// type改变
class Type {
  @observable type = "";
  @action setType = (value) => this.type = value;
}

// 图表配置项(除了type下拉框)
class ChartSetting {
  @observable coordType = 'rect';
  // 数据源的值
  // @observable options = [];
  // x轴的值
  @observable xOptions = [];
  // y轴的值
  @observable yOptions = [];
  
  @action setCoordType = (value) => this.coordType = value;
  // @action setOptions = (value) => this.options = value;
  @action setXOptions = (value) => this.xOptions = value;
  @action setYOptions = (value) => this.yOptions = value;
}


export { 
  IsVisible,
  Type,
  ChartSetting
};