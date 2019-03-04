// 库引入
import {Component} from 'react';
import {inject, observer} from 'mobx-react';
import NProgress from 'nprogress';

import 'nprogress/nprogress.css';

@observer
class NProgressBar extends Component {

  componentDidMount() {
    NProgress.start();
    // NProgress.inc();
  }

  componentWillUnmount() {
    // NProgress.set(0.8);
    NProgress.done();
  }

  render() {
    return null;
  }
}

NProgressBar.defaultProps = {
  
};

const InjectNProgressBar = inject()(NProgressBar);

export {
  NProgressBar,
  InjectNProgressBar
};