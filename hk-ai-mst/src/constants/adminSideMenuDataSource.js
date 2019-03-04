export const adminSideMenuDataSource = [{
  key: '/index',
  permissionId: '/index',
  title: '主页',
  to: '/index',
  iconType: 'laptop',
  children: undefined
}, {
  key: '/data-management',
  permissionId: '/data-management',
  title: '数据管理',
  to: '/data-management',
  iconType: 'laptop',
  children: undefined
}, {
  key: '/task-management',
  permissionId: '/task-management',
  title: '任务管理',
  to: '/task-management',
  iconType: 'laptop',
  children: undefined
}, {
  key: '/model-management',
  permissionId: '/model-management',
  title: '模型管理',
  to: '/model-management',
  iconType: 'deployment-unit',
  children: [{
    key: '/model-management/config',
    permissionId: '/model-management/config',
    title: '模型配置',
    to: '/model-management/config',
    iconType: 'laptop',
    children: undefined
  },{
    key: '/model-management/train',
    permissionId: '/model-management/train',
    title: '模型训练',
    to: '/model-management/train',
    iconType: 'laptop',
    children: undefined
  }, {
    key: '/model-management/verification',
    permissionId: '/model-management/verification',
    title: '模型验证',
    to: '/model-management/verification',
    iconType: 'laptop',
    children: undefined
  }, {
    key: '/model-management/release',
    permissionId: '/model-management/release',
    title: '模型发布',
    to: '/model-management/release',
    iconType: 'laptop',
    children: undefined
  }]
}, {
  key: '/system-management',
  permissionId: '/system-management',
  title: '系统管理',
  to: '/system-management',
  iconType: 'dashboard',
  children: [{
    key: '/system-management/component',
    permissionId: '/system-management/component',
    title: '构件管理',
    to: '/system-management/component',
    iconType: 'laptop',
    children: undefined
  }, {
    key: '/system-management/icon',
    permissionId: '/system-management/icon',
    title: '图标管理',
    to: '/system-management/icon',
    iconType: 'info-circle',
    children: undefined
  }]
}];