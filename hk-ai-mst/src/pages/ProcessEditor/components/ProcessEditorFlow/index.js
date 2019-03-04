// 库引入
import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import classNames from 'classnames';
import { Flow, withPropsAPI } from 'gg-editor';
import { observable, action } from 'mobx';

// 组件引入
import { ShadowPopover } from '../../../../components/ShadowPopover';

// 样式引入
import styles from './style.module.less';

// 数据操作引入
import { getEditDatas } from '../../../../api/modelManagement/modelConfig';


// 工具引入
import { isEmptyObject } from '../../../../utils/isEmptyObject';

/**
 * 流程编辑器的画布
 */
@withPropsAPI
@observer
class ProcessEditorFlow extends Component {
  constructor(props) {
    super(props);
    // 最外层容器的ref
    this.containerRef = React.createRef();
  }

  // 指示详细信息Popover是否渲染
  @observable shadowPopoverRended = false;

  // 详细信息Popover子元素的宽度
  @observable shadowPopoverChildrenWidth = 100;

  // 详细信息Popover子元素的高度
  @observable shadowPopoverChildrenHeight = 40;

  // 详细信息Popover子元素的位置clientX
  @observable shadowPopoverChildrenClientX = 0;

  // 详细信息Popover子元素的位置clientY
  @observable shadowPopoverChildrenClientY = 0;

  // 一些set方法
  @action setShadowPopoverRended = (rended = false) => {
    this.shadowPopoverRended = rended;
  }

  @action setShadowPopoverChildrenWidth = (width = 100) => {
    this.shadowPopoverChildrenWidth = width;
  }

  @action setShadowPopoverChildrenHeight = (height = 42) => {
    this.shadowPopoverChildrenHeight = height;
  }

  @action setShadowPopoverChildrenClientX = (clientX = 0) => {
    this.shadowPopoverChildrenClientX = clientX;
  }

  @action setShadowPopoverChildrenClientY = (clientY = 0) => {
    this.shadowPopoverChildrenClientY = clientY;
  }

  /**
   * 获取事件对象的大小
   * @param {object} e
   * @return {Object} 宽度和高度
   */
  getItemSize = (e) => {
    if (!e.item) return {};
    console.info('获取事件对象的大小', e.item);
    const bBbox = e.item.getBBox();
    return {
      width: bBbox.width,
      height: bBbox.height
    };
  }


  // 获取事件对象相对于屏幕的位置
  getItemClientPosition = (e) => {
    if (!e.item) return {};
    console.info('获取事件对象相对于屏幕的位置', e.item);
    const bBbox = e.item.getBBox();
    const { minX, minY } = bBbox;
    // 获取容器的offsetLeft和offsetTop....因为grah.getDomPoint不管用才用的这个方法
    const { left, top } = this.containerRef.current.getBoundingClientRect();
    return {
      clientX: minX + left,
      clientY: minY + top
    };
  }


  /**
   * 显示节点的详细信息
   * 添加@action,避免重复render
   */
  @action showNodeDetails = (e) => {
    const { clientX, clientY } = this.getItemClientPosition(e);
    const { width, height } = this.getItemSize(e);
    this.setShadowPopoverChildrenWidth(width);
    this.setShadowPopoverChildrenHeight(height);
    this.setShadowPopoverChildrenClientX(clientX);
    this.setShadowPopoverChildrenClientY(clientY);
    this.setShadowPopoverRended(true);
  }

  // 隐藏节点的详细信息
  @action hideNodeDetails = () => {
    this.setShadowPopoverRended(false);
  }

  // 节点鼠标移入事件
  @action handleNodeMouseEnter = (e) => {
    console.log('onNodeMouseEnter', e);
    this.showNodeDetails(e);
  }

  // 节点开始拖拽事件
  @action handleNodeDragStart = (e) => {
    console.log('onNodeDragStart', e);
    this.hideNodeDetails();
  }

  // 节点结束拖拽事件
  @action handleNodeDragEnd = (e) => {
    // 流程是否改变状态置为改变
    this.props.processData.setHaveChanged(true);
    console.log('onNodeDragEnd', e);
    this.showNodeDetails(e);
  }

  // 节点鼠标移出事件
  @action handleNodeMouseLeave = (e) => {
    console.log('onNodeMouseLeave', e);
    this.hideNodeDetails();
  }
  
  // 点击描点事件
  @action handleAnchorClick = (e) => {
    console.info('点击描点',e);
  }

  // 解析流程数据
  @action parseDatas = (datas) => {
    const formatDatas = {
      edges: [],
      nodes: []
    };
    // 判断formatDatas是否为空
    // 节点不为空
    if (!isEmptyObject(datas.graph.nodes)) {
      const nodes = Object.keys(datas.graph.nodes);
      nodes.map((nodeId) => {
        const { componentid, componentType, classname, type, label, x, y } = datas.graph.nodes[nodeId];
        const nodeItem = {
          color: "rgb(24,144,255)", //FIXME:大小传值？同：形状 颜色
          componentExecClass: classname,
          componentExecType: type,
          componentType: componentType,
          componentIcon: undefined,
          componentId: componentid,
          componentInParams: datas.parameters.local[nodeId].inparams,
          // componentOutParams: "[{key:"batchSize",name:"batchSize",value:"100",type:"input",placeholder:"提示文字"},{key:"truncateLength",name:"truncateLength",value:"100",type:"describe",placeholder:"提示文字"},{key:"truncateLength",name:"truncateLength",value:"100",type:"multiple",data:{url:"",key:"",value:""},placeholder:"提示文字"},{key:"truncateLength",name:"truncateLength",value:"100",type:"combobox",data:{key:value,key2:value2},placeholder:"提示文字"}]"
          id: nodeId,
          label: label,
          shape: "process-node",
          mode: 'mouseEnterFillRed',
          // size: "72*72", //FIXME:大小传值？同：形状 颜色
          type: "node",
          x: x,
          y: y
        };
        formatDatas.nodes.push(nodeItem);
        return true;
      });
    }
    // 连线不为空
    if (!isEmptyObject(datas.graph.links)) {
      const links = Object.keys(datas.graph.links);
      links.map((linkId) => {
        const { from, to, sourceAnchor, targetAnchor } = datas.graph.links[linkId];
        const linkItem = {
          id: linkId,
          source: from,
          target: to,
          sourceAnchor: sourceAnchor,
          targetAnchor: targetAnchor,
          // lineInParams: datas.parameters.local[linkId].inparams,
          // lineInOutParams:
        };
        formatDatas.edges.push(linkItem);
        return true;
      });
    }
    return formatDatas;
  }

  @action initFlowEdit = (id) => {
    const { propsAPI } = this.props;
    const { read, executeCommand } = propsAPI;
    if (id) {
      getEditDatas(id).then(response => {
        const data = response.data;
        console.info(response);
        // 设置流程名称
        this.props.flowTitle.setFlowTitle(data.name);
        // 设置线参数
        const lineKeys = Object.keys(data.content.graph.links);
        lineKeys.forEach((id) => {
          this.props.processData.setLineInparams(id, data.content.parameters.local[id].inparams || []);
        });
        // 设置全局属性
        this.props.processData.setGlobalParams(data.content.parameters.global || []);
        // 先设置全局属性再显示
        this.props.processData.setGlobalVisible(true);

        // 格式化绘图数据
        const formatData = this.parseDatas(data.content);
        read(formatData);
      });
      // 初始化新增画布
    } else {
      // 流程是否改变状态置为改变
      this.props.processData.setHaveChanged(true);
      if (this.props.haveInit) {
        executeCommand('clear');
      }
    }
  }

  @action componentWillMount = () => {
    const id = this.props.processData.processId;
    this.initFlowEdit(id);
  }
  @action shouldComponentUpdate = (nextProps) => {
    return nextProps.processData.processId === null;
  }
  @action componentDidUpdate = () => {
    const id = this.props.processData.processId;
    this.initFlowEdit(id);
  }

  // 禁止某些锚点之间的连接，避免人为构件连接错误
  @action formatAnchorsLinkable = (anchor) => {
    const { propsAPI } = this.props;
    const item = propsAPI.find(propsAPI.save().nodes[0].id);
    console.info('锚点开始-------',item,item.getAllAnchors());
    // propsAPI.find(propsAPI.save().nodes[0].id).isAnchorShow = false;
    
    const nodes = propsAPI.save().nodes;
    const model ={
      // anchorPoints:{
        // linkable: false
        // anchorShow: false
      // },
      // ...nodes[0]
    };
    propsAPI.update(propsAPI.find(nodes[0].id), model);


  }

  render() {
    console.log('render-画布');
    return (
      <div className={classNames(styles.processEditorFlow, 'js-processEditorFlow', this.props.className)} style={this.props.style} ref={this.containerRef}>
        <Flow
          className={classNames(styles.flow, this.props.className)}
          // onNodeMouseEnter={this.handleNodeMouseEnter}
          // onNodeMouseLeave={this.handleNodeMouseLeave}
          // onNodeDragStart={this.handleNodeDragStart}
          // onNodeDragEnd={this.handleNodeDragEnd}
          onNodeClick={(e) => {console.info('点击节点',e);}}
          onAnchorDragStart={this.formatAnchorsLinkable}    
          onAnchorDragEnd={(e,a,b) => {console.info('锚点结束-----',e,a,b);}}
        />
        {this.shadowPopoverRended && <ShadowPopover
          childrenWidth={this.shadowPopoverChildrenWidth}
          childrenHeight={this.shadowPopoverChildrenHeight}
          clientX={this.shadowPopoverChildrenClientX}
          clientY={this.shadowPopoverChildrenClientY} />}
      </div>
    );
  }
}

ProcessEditorFlow.defaultProps = {
};

const InjectProcessEditorFlow = inject(({ someStore = {} }) => ({ someProps: someStore.attribute }))(ProcessEditorFlow);

export {
  ProcessEditorFlow,
  InjectProcessEditorFlow
};