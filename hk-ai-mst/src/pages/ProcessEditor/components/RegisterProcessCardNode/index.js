// 库引入
import React, { Component } from 'react';
import { RegisterNode } from 'gg-editor';
import fp from 'lodash/fp';
/**
 * RegisterProcessNode
 * 自定义流程节点
 */

class RegisterProcessCardNode extends Component {
  render() {
    console.info('注册节点');
    return (
      <RegisterNode name="process-node" config={ {
        draw(item) {
          const group = item.getGraphicGroup();
          const model = item.getModel();
          const { label,
            color = "rgb(24,144,255)",
            fontSize = 12,
            size = "220*40",
            borderRadius = 4,
            borderLeftColor = "rgb(24,144,255)",
            stateIconUrl = process.env.PUBLIC_URL + '/img/Icon-model-state-success.svg',
            componentIcon =  process.env.PUBLIC_URL + '/img/icon-model-type-default.svg' } = model;
          const [width, height] = size.split('*').map(v => +v);
          const x = -width / 2;
          const y = -height / 2;
          // 文本最长多长
          const maxLableLength = parseInt(width / fontSize, 10);
          // 矩形边框
          const keyShape = group.addShape('rect', {
            attrs: {
              x,
              y,
              width,
              height,
              radius: borderRadius,
              fill: '#fff',
              stroke: '#CED4D9'
            }
          });
          // 左侧色条
          group.addShape('path', {
            attrs: {
              path: [
                ['M', x, y + borderRadius],
                ['L', x, y + height - borderRadius],
                ['A', borderRadius, borderRadius, 0, 0, 0, x + borderRadius, y + height],
                ['L', x + borderRadius, y],
                ['A', borderRadius, borderRadius, 0, 0, 0, x, y + borderRadius]
              ],
              fill: borderLeftColor
            }
          });
          // 类型 logo
          group.addShape('image', {
            attrs: {
              img: componentIcon,
              x: x + 16,
              y: y + (height - 16) / 2,
              width: 20,
              height: 16
            }
          });
          // 状态 logo
          group.addShape('image', {
            attrs: {
              img: stateIconUrl,
              x: x + width - 32,
              y: y + (height - 16) / 2,
              width: 16,
              height: 16
            }
          });
          // 名称文本
          group.addShape('text', {
            attrs: {
              // 截取文本避免超长
              text: fp.truncate({
                length: maxLableLength,
                omission: '…'
              }, label),
              x: x + 52,
              y: y + (height - fontSize) / 2,
              textAlign: 'start',
              textBaseline: 'top',
              fill: 'rgba(0,0,0,0.65)',
              fontSize,
              color
            }
          });
          return keyShape;
        },
        // 设置锚点
        anchor: [
          [0.5, 0], // 上面边的中点
          [0.5, 1] // 下边边的中点
        ]
      } } />
    );
  }
}

RegisterProcessCardNode.defaultProps = {
};

export {
  RegisterProcessCardNode
};