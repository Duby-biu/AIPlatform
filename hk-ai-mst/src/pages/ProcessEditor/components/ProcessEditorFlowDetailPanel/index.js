// 库引入
import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import classNames from 'classnames';
import { DetailPanel, NodePanel, CanvasPanel, EdgePanel } from 'gg-editor';
import { Card } from 'antd';

// 组件引入
import { ProcessEditorNodeDetail } from './components/ProcessEditorNodeDetail';
import { ProcessEditorEdgeDetail } from './components/ProcessEditorEdgeDetail';

// 样式引入
import styles from './style.module.less';

/**
 * 流程编辑可详细信息面板
 */
@observer
class ProcessEditorFlowDetailPanel extends Component {
  render() {
    return (
      <div className={ classNames(styles.processEditorFlowDetailPanel, this.props.className, 'height100') } style={ this.props.style }>
        <DetailPanel className={ classNames('height100') }>
          <NodePanel className={ classNames('height100') }>
            <ProcessEditorNodeDetail processData={this.props.processData}/>
          </NodePanel>
          <EdgePanel className={ classNames('height100') }>
            <ProcessEditorEdgeDetail processData={this.props.processData}/>
          </EdgePanel>
          <CanvasPanel className={ classNames('height100') }>
            <Card className={ classNames('height100') } title="画布属性">
            </Card>
          </CanvasPanel>
        </DetailPanel>
      </div>
    );
  }
}

ProcessEditorFlowDetailPanel.defaultProps = {
};

const InjectProcessEditorFlowDetailPanel = inject(({ someStore = {} }) => ({ someProps: someStore.attribute }))(ProcessEditorFlowDetailPanel);

export {
  ProcessEditorFlowDetailPanel,
  InjectProcessEditorFlowDetailPanel
};