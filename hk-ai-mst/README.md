# 说明
核格人工智能平台

此项目由 [Create React App](https://github.com/facebookincubator/create-react-app) 搭建，并通过 [react-app-rewired](https://github.com/timarney/react-app-rewired) 来修改 [Create React App](https://github.com/facebookincubator/create-react-app) 的默认配置。

## 预览地址
[https://cuitzhy.gitee.io/react-mst-bootcdn
](https://cuitzhy.gitee.io/react-mst-bootcdn
)

## 支持的浏览器
Edge及以上

## 构建配置
- 通过在package.json里面添加以下内容，来提供对编辑器eslint功能的支持：
```javascript
"eslintConfig": {
    "extends": "react-app",
    "rules": {
      "semi": 1
    }
  }
```
- 通过config-overrides.js文件，添加或者修改 [Create React App](https://github.com/facebookincubator/create-react-app) 的功能：

| 实现的功能 |
| --- |
| 支持antd按需加载 |
| 支持antd自定义主题 |
| 支持代码分割 |
| 支持装饰器 |
| 支持less和css modules |
| 在生产环境支持cssnano |

## 目录结构
```
|-- json-server # Local Mock Data
|-- public # pulic资源
|-- src 
|   |-- api # api
|   |-- components # 组件
|   |-- constants # 常量数据
|   |-- layouts # 通用的页面布局组件
|   |-- mst # 全局状态管理mst相关的相关内容
|   |-- pages # 页面组件
|   |-- styles # 样式
|   |-- utils # 通用的工具方法
|   |-- App.js # App组件
|   |-- index.js # 入口文件
```