// 库引入
import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { computed, action } from 'mobx';
import classNames from 'classnames';
import { ReactCytoscape } from 'react-cytoscape';
import {
  Card as AntDCard
} from 'antd';

// 样式引入
import styles from './style.module.less';


// 图形样式
const grapStyle = [{
  selector: 'node',
  css: {
    'shape': 'data(faveShape)',
    'width': '100',
    'height': '50',
    'content': 'data(name)',
    'text-valign': 'center',
    'text-outline-width': 2,
    'text-outline-color': 'data(faveColor)',
    'background-color': 'data(faveColor)',
    'color': '#fff',
    'text-wrap': 'wrap',
    'font-size': '17px'
  }
}, {
  selector: 'edge',
  css: {
    'curve-style': 'bezier',
    'opacity': 0.666,
    'width': 'mapData(strength, 70, 100, 2, 6)',
    'target-arrow-shape': 'triangle',
    'source-arrow-shape': 'circle',
    'line-color': 'data(faveColor)',
    'source-arrow-color': 'data(faveColor)',
    'target-arrow-color': 'data(faveColor)'
  }
}, {
  selector: ':selected',
  css: {
    'border-width': 3,
    'border-color': '#333'
  }
}, {
  selector: 'edge.questionable',
  css: {
    'line-style': 'dotted',
    'target-arrow-shape': 'diamond'
  }
}, {
  selector: '.faded',
  css: {
    'opacity': 0.25,
    'text-opacity': 0
  }
}];

@observer
class LayersCard extends Component {
  // 边和节点
  @computed get getElements() {
    const data = this.props.graphData;
    const vertexNames = data["vertexNames"];

    // 没数据
    if (typeof vertexNames === 'undefined') return;

    const vertexInfos = data["vertexInfo"];
    const vertexInputs = data["vertexInputs"];
    const vertexTypes = data["vertexTypes"];
    const vertexCount = vertexNames.length;
    const layerStyles = {
      "Activation": ["#CD6155", "rectangle"],
      "AutoEncoder": ["#641E16", "rectangle"],
      "BaseOutput": ["#AF7AC5", "rectangle"],
      "BasePretrainNetwork": ["#512E5F", "rectangle"],
      "BaseRecurrent": ["#5499C7", "rectangle"],
      "BatchNormalization": ["#154360", "rectangle"],
      "Convolution": ["#1B2631", "rectangle"],
      "Dense": ["#EB984E", "rectangle"],
      "Embedding": ["#F4D03F", "rectangle"],
      "FeedForward": ["#7D6608", "rectangle"],
      "GravesBidirectionalLSTM": ["#1ABC9C", "rectangle"],
      "GravesLSTM": ["#6E2C00", "rectangle"],
      "Input": ["#145A32", "vee"],
      "InputTypeUtil": ["#5D6D7E", "rectangle"],
      "LocalResponseNormalization": ["#52BE80", "rectangle"],
      "Output": ["#922B21", "ellipse"],
      "RBM": ["#48C9B0", "rectangle"],
      "RnnOutput": ["#0E6251", "rectangle"],
      "Subsampling": ["#4D5656", "rectangle"],
      "L2Vertex": ["#78281F", "triangle"],
      "LayerVertex": ["#4A235A", "triangle"],
      "MergeVertex": ["#1B4F72", "triangle"],
      "PreprocessorVertex": ["#0B5345", "triangle"],
      "StackVertex": ["#186A3B", "triangle"],
      "SubsetVertex": ["#7E5109", "triangle"],
      "UnstackVertex": ["#6E2C00", "triangle"],
      "DuplicateToTimeSeriesVertex": ["#424949", "triangle"],
      "LastTimeStepVertex": ["#17202A", "triangle"]
    };
    const nodes = [];
    const edges = [];
    for (let i = 0; i < vertexCount; i++) {
      // 节点
      let layerColor = "#000000";
      let layerShape = "octagon";
      if (Object.keys(layerStyles).indexOf(vertexTypes[i]) > 0) {
        layerColor = layerStyles[vertexTypes[i]][0];
        layerShape = layerStyles[vertexTypes[i]][1];
      }
      const obj = {
        id: i,
        name: vertexTypes[i] + '\n(' + vertexNames[i] + ')',
        faveColor: layerColor,
        faveShape: layerShape,
      };
      nodes.push({ data: obj });

      // 边
      const inputsToCurrent = vertexInputs[i];
      for (let j = 0; j < inputsToCurrent.length; j++) {
        const e = {
          source: inputsToCurrent[j],
          target: i,
          faveColor: '#A9A9A9',
          strength: 100
        };
        edges.push({ data: e });
      }
    }

    const elementsToRender = {
      nodes: nodes,
      edges: edges
    };
    return elementsToRender;
  }
  // 图形样式
  @action getStyle = (data) => {
    if (!data) return;
    return [{
      selector: 'node',
      css: {
        'shape': 'data(faveShape)',
        'width': '100',
        'height': '50',
        'content': 'data(name)',
        'text-valign': 'center',
        'text-outline-width': 2,
        'text-outline-color': 'data(faveColor)',
        'background-color': 'data(faveColor)',
        'color': '#fff',
        'text-wrap': 'wrap',
        'font-size': '17px'
      }
    }, {
      selector: 'edge',
      css: {
        'curve-style': 'bezier',
        'opacity': 0.666,
        'width': 'mapData(strength, 70, 100, 2, 6)',
        'target-arrow-shape': 'triangle',
        'source-arrow-shape': 'circle',
        'line-color': 'data(faveColor)',
        'source-arrow-color': 'data(faveColor)',
        'target-arrow-color': 'data(faveColor)'
      }
    }, {
      selector: ':selected',
      css: {
        'border-width': 3,
        'border-color': '#333'
      }
    }, {
      selector: 'edge.questionable',
      css: {
        'line-style': 'dotted',
        'target-arrow-shape': 'diamond'
      }
    }, {
      selector: '.faded',
      css: {
        'opacity': 0.25,
        'text-opacity': 0
      }
    }];
  }

  @action cy = (cy) => {
    const _this = this;
    cy.on('click', 'node', function (event) {
      var node = event.target;
      console.info('clicked ', node.id());
      _this.props.setLayerId(node.id());
    });
  }
  render() {
    console.info('render-层菜单');
    return (
      <div className={classNames(styles.layersCard, this.props.className)} style={this.props.style}>
        <AntDCard style={{height: '100%'}}>
          <ReactCytoscape containerID="cy"
            elements={this.getElements}
            cyRef={this.cy}
            style={this.getStyle(this.getElements)}
            cytoscapeOptions={{
              zoom: 1.0,                  // 图表的初始缩放级别
              minZoom: 0.6,               // 图表缩放级别的最小界限
              maxZoom: 2.5,               // 图表缩放级别的最大界限
              wheelSensitivity: 0.1,      // 缩放时更改滚轮灵敏度
              autounselectify: false,     // 是否不可选择
            }}
            layout={{ name: 'dagre', padding: 10 }} />
        </AntDCard>
      </div>
    );
  }
}

LayersCard.defaultProps = {
};

const InjectLayers = inject(({ someStore = {} }) => ({ someProps: someStore.attribute }))(LayersCard);

export {
  LayersCard,
  InjectLayers
};