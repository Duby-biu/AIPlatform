// 库引入
import React, {Component} from 'react';
import { RegisterBehaviour } from 'gg-editor';

class RegisterProcessMouseEnterFillRedBehaviour extends Component {
  mouseEnterFillRed = page =>{
    console.info('page----',page);
    page.behaviourOn('node:mouseenter', ev=>{
      console.log('node:mouseenter');
      // page.update(ev.item, {
      //   color: 'red'
      // });
    });
  };
  render() {
    console.info('render-注册行为');
    return (
      <RegisterBehaviour name="mouseEnterFillRed" behaviour={this.mouseEnterFillRed} />
    );
  }
}

RegisterProcessMouseEnterFillRedBehaviour.defaultProps = {
};

export {
  RegisterProcessMouseEnterFillRedBehaviour,
};