import fp from 'lodash/fp';

/**
 * 获取全局唯一的命名空间
 */
export const getUniqueNameSpace = () => fp.uniqueId('nameSpace');