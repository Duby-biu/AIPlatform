// 库引入
import React, {Component} from 'react';
import {inject, observer} from 'mobx-react';
import classNames from 'classnames';

//组件引入
import {NProgressBar} from '../NProgressBar';

// 样式引入
import styles from './style.module.less';

/**
 * LoadableSpin,典型应用于react-loadable
 */
@observer
class LoadableSpin extends Component {
  render() {
    if (!this.props.isLoading) 
      return null;
    const errorContent = (
      <p className="loadableSpin__error">组件被外星人劫持走了...</p>
    );
    const timedOutContent = (
      <p className="loadableSpin__timedOut">加载超时...</p>
    );
    const pastDelayContent = (<NProgressBar />);
    return (
      <div
        id={this.props.id}
        className={classNames(styles.loadableSpin, this.props.classNames)}>
        {this.props.error
          ? errorContent
          : this.props.timedOut
            ? timedOutContent
            : this.props.pastDelay
              ? pastDelayContent
              : null}
      </div>
    );
  }
}

LoadableSpin.defaultProps = {};

// 此导出是为了兼容不需要inject组件的情况,请参考https://daveceddia.com/what-does-redux-do/,
export {LoadableSpin};

// 因为整个项目是基于mst的,所以默认导出inject组件
export default inject(() => ({}))(LoadableSpin);