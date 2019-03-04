// 库引入
import React, {Component} from 'react';
import {inject,observer} from 'mobx-react';
import classNames from 'classnames';

// 样式引入
import styles from './style.module.less';

@observer
class PageDemo extends Component {
  render() {
    return (
      <div className={classNames(styles.pageDemo, 'page', this.props.className)}>
        Page PageDemo Is Comming
      </div>
    );
  }
}

PageDemo.defaultProps = {

};

const InjectPageDemo = inject()(PageDemo);

export {
  PageDemo,
  InjectPageDemo
};