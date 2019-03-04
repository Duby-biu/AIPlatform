// 库引入
import React, {Component} from 'react';
import {inject, observer} from 'mobx-react';
import classNames from 'classnames';

// 样式引入
import styles from './style.module.less';

@observer
class Logo extends Component {
  render() {
    return (
      <div className={classNames(styles.Logo, this.props.className)} style={this.props.style}>
        <h1 className={classNames(styles.title)}>核格人工智能平台</h1>
      </div>
    );
  }
}

Logo.defaultProps = {
};

const InjectLogo = inject(({someStore={}}) => ({someProps: someStore.attribute}))(Logo);

export {
  Logo,
  InjectLogo
};