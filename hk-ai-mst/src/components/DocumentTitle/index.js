// 库引入
import { Component } from 'react';
import { inject, observer } from 'mobx-react';
import fp from 'lodash/fp';

/**
 * 用来设置文档的标题的组件
 */
@observer
class DocumentTitle extends Component {
  
  componentDidMount() {
    this.props.setDocumentTitle(this.props.documentTitle);
  }

  render() {
    return null;
  }
}

DocumentTitle.defaultProps = {
  // 文档的标题
  documentTitle: '核格人工智能平台',
  // 设置文档标题的方法(title)=>{}
  setDocumentTitle: (title = "核格人工智能平台") => {
    document.title = title;
  }
};

const InjectDocumentTitle = inject(({ uiStore }) => ({
  setDocumentTitle: fp.get('documentTitle.setTitle', uiStore)
}))(DocumentTitle);

export {
  DocumentTitle,
  InjectDocumentTitle
};