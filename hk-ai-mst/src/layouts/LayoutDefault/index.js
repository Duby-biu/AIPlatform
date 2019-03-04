// 库引入
import React, {Component} from 'react';
import {inject, observer} from 'mobx-react';
import classNames from 'classnames';

// 组件引入
import {NavTop} from '../../components/NavTop';
import {Caption} from '../../components/Caption';
import {Footer} from '../../components/Footer';

// 样式引入
import styles from './style.module.less';

/**
 * 默认的布局,包含默认的header和footer,用户可以定义content,以及向header追加内容
 * @example
 * <LayoutDefault captionTitle="一级标题" captionSubTitle="二级标题" content={JSX} appendToHeader={JSX} />
 */
@observer
class LayoutDefault extends Component {
  render() {
    return (
      <div
        className={classNames(styles.layoutDefault, 'layout', this.props.className)}>
        <header className={styles.layoutDefault_header}>
          <div className="container clearfix">
            <NavTop/>
            <Caption title={this.props.captionTitle} subTitle={this.props.captionSubTitle}/> {this.props.appendToHeader}
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

LayoutDefault.defaultProps = {
  // 一级标题
  captionTitle: undefined,
  // 二级标题
  captionSubTitle: undefined,
  // 主要内容
  content: undefined,
  // 插入到header尾部的内容
  appendToHeader: undefined
};

const InjectLayoutDefault = inject()(LayoutDefault);

export {LayoutDefault, InjectLayoutDefault};