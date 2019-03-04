import React, {Component} from 'react';
import {inject,observer} from 'mobx-react';
import {Link} from 'react-router-dom';
import classNames from 'classnames';

import styles from './style.module.less';

@observer
class PageNotFound extends Component {
  render() {
    return (
      <div className={classNames(styles.pageNotFound, 'page', this.props.className)}>
        <h1 className={classNames(styles.title)}>40<span className={styles.lastLetter}>4</span></h1>
        <p className={classNames(styles.tip)}>很抱歉，页面不存在~</p>
        <Link className={classNames(styles.backHome)} to='/'>返回首页</Link>
      </div>
    );
  }
}

PageNotFound.defaultProps = {
  
};

const InjectPageNotFound =  inject()(PageNotFound);

export {
  PageNotFound,
  InjectPageNotFound
};