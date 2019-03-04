// 库引入
import React, {Component} from 'react';
import {inject,observer} from 'mobx-react';
import classNames from 'classnames';

// 组件引入
import {NavTop} from '../../components/NavTop';
import {Caption} from '../../components/Caption';
import {Footer} from '../../components/Footer';

// 样式引入
import styles from './style.module.less';

@observer
class LayoutDemo extends Component {
  render() {
    return (
      <div className={classNames(styles.layoutDemo, 'layout', this.props.className)}>
        <header className={styles.layoutDemo_header}>
          <div className="container clearfix">
            <NavTop/>
            <Caption title={this.props.captionTitle} subTitle={this.props.captionSubTitle} />
          </div>
        </header>
        <main>
          {this.props.content}
        </main>
        <Footer/>
      </div>
    );
  }
}

LayoutDemo.defaultProps = {
  captionTitle: undefined,
  captionSubTitle: undefined,
  content: undefined
};

const InjectLayoutDemo = inject()(LayoutDemo);

export {
  LayoutDemo,
  InjectLayoutDemo
};