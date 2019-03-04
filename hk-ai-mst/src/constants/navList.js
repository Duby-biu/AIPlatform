export const navList = [{
  key: '/task',
  permissionId: 'task',
  title: '任务管理',
  to: undefined,
  iconType: 'laptop',
  children: [{
    key: '/task/task-management',
    title: '任务管理',
    to: '/task/task-management'
  }]
}, {
  key: '/data-management',
  permissionId: 'data',
  title: '数据管理',
  to: undefined,
  iconType: 'database',
  children: [{
    key: '/data-management/txt',
    title: 'TXT',
    to: undefined,
    children: [{
      key: 'directory',
      title: 'directory',
      to: '/data-management/txt/directory'
    }, {
      key: 'file',
      title: 'file',
      to: '/data-management/txt/file'
    }]
  }, {
    key: '/data-management/xml',
    title: 'XML',
    to: '/data-management/xml'
  }, {
    key: '/data-management/json',
    title: 'JSON',
    to: undefined
  }, {
    key: '/data-management/arff',
    title: 'ARFF',
    to: '/data-management/arff'
  }, {
    key: '/data-management/lib-svm',
    title: 'LibSVM',
    to: '/data-management/lib-svm'
  }]
}, {
  key: '/model',
  permissionId: 'model',
  title: '模型管理',
  to: undefined,
  iconType: 'team',
  children: [{
    key: '/model/model-management',
    permissionId: 'model',
    title: '模型管理',
    to: '/model/model-management',
    iconType: 'team',
  }, {
    key: '/model/model-release',
    title: '模型发布',
    to: '/model/model-release',
    iconType: 'cloud-upload-o'
  }]
}];