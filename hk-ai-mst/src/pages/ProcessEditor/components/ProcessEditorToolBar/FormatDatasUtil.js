// 格式化流程数据
export const formatDatas = (datas, name, linesInparams, globalParams) => {
  console.info('格式化流程数据，', datas, name, linesInparams, globalParams);
  // 连线参数
  const formatDatas = {
    id: null,
    name: name,
    graph: {
      nodes: {},
      links: {}
    },
    parameters: {
      global: {},
      local: {},
      simplifiedLocal: {}
    }
  };

  // 全局属性
  formatDatas.parameters.global = globalParams;

  // 存在节点
  if (datas.nodes) {
    datas.nodes.map((node) => {
      // 节点本身
      formatDatas.graph.nodes[node.id] = {
        componentid: node.componentId,
        classname: node.componentExecClass,
        componentType: node.componentType,
        type: node.componentExecType,
        label: node.label,
        x: node.x,
        y: node.y,
        // shape: "process-node"  //FIXME:shape通过传值？
      };
      // 节点local参数(全)
      formatDatas.parameters.local[node.id] = {
        inparams: node.componentInParams,
        outparams: node.componentOutParams
      };
      // 节点local参数（简化）
      const simplifiedInparam = [];
      if (node.componentInParams) {
        node.componentInParams.map(inparam => {
          const obj = {
            key: inparam.key,
            value: inparam.value
          };
          simplifiedInparam.push(obj);
        });
      }
      // FIXME: 目前只传了简化的输入参数，后面是否需要简化的输出参数待定
      formatDatas.parameters.simplifiedLocal[node.id] = {
        inparams: simplifiedInparam
      };
      return true;
    });
  }

  // 存在连线
  if (datas.edges) {
    datas.edges.map((link) => {
      // 连线本身
      formatDatas.graph.links[link.id] = {
        from: link.source,
        to: link.target,
        sourceAnchor: link.sourceAnchor,
        targetAnchor: link.targetAnchor
      };
      // 连线local参数
      formatDatas.parameters.local[link.id] = {
        inparams: linesInparams[link.id],
        outparams: link.lineInOutParams
      };
      return true;
    });
  }

  return formatDatas;
};