// 库引入
import React, {Component} from 'react';
import {inject, observer} from 'mobx-react';
import classNames from 'classnames';

// 样式引入
import styles from './style.module.less';

@observer
class ComponentDemo extends Component {
  render() {
    return (
      <div className={classNames(styles.componentDemo, this.props.className)} style={this.props.style}>
        ComponentDemo Is Comming...
      </div>
    );
  }
}

ComponentDemo.defaultProps = {
};

const InjectComponentDemo = inject(({someStore={}}) => ({someProps: someStore.attribute}))(ComponentDemo);

export {
  ComponentDemo,
  InjectComponentDemo
};