/**
 * 参考https://reacttraining.com/react-router/web/guides/scroll-restoration
 */
// 库引入
import {Component} from 'react';
import {observer} from 'mobx-react';
import {withRouter} from 'react-router-dom';

@withRouter
@observer
class ScrollToTop extends Component {
  componentDidUpdate(prevProps) {
    // this.props.location is mutable
    if (this.props.location !== prevProps.location) {
      window.scrollTo(0, 0);
    }
  }
  render() {
    return this.props.children || null;
  }
}

export {
  ScrollToTop
};