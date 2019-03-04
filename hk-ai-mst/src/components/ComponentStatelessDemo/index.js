import React from 'react';
import {inject, observer} from 'mobx-react';
import classNames from 'classnames';

import styles from './style.module.less';

const ComponentStatelessDemo = observer(({attr}) => (
  <div className={classNames(styles.componentStatelessDemo, this.props.classNames)}>
    ComponentStatelessDemo Is Comming...
  </div>
));

ComponentStatelessDemo.defaultProps = {};

export {ComponentStatelessDemo};

export default inject(({
  someStore = {}
}) => ({someProps: someStore.attribute}))(ComponentStatelessDemo);