// 参考 ：https://adactio.com/journal/5429

import './breakpointDetection.less';

export const SM_LESS = '@sm-';
export const SM_PLUS = '@sm+';
export const MD_PLUS = '@md+';
export const LG_PLUS = '@lg+';
export const XL_PLUS = '@xl+';
export const XXL_PLUS = '@xxl+';

/**
 * 探测css断点
 * @returns {string} body::after的content的值
 */
export const breakpointDetection = () => {
  return window.getComputedStyle(document.body, ':after').getPropertyValue('content');
};