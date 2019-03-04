// 最基础的样式要最先引入
import './styles/app.less';
// 库引入
import React from 'react';
import ReactDOM from 'react-dom';
import {configure} from 'mobx';
import {Provider} from 'mobx-react';
import {store} from './mst/store/index';
import moment from 'moment';
import 'moment/locale/zh-cn';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import { LocaleProvider } from 'antd';
import zhCN from 'antd/lib/locale-provider/zh_CN';

// 日期时间本地化
moment.locale('zh-cn');

// mobx启用严格模式
if(process.env.NODE_ENV === 'development'){
  console.warn('开发模式中,mobx启用严格模式');
  configure({ enforceActions: "always" });
}

ReactDOM.render(<Provider {...store}><LocaleProvider locale={zhCN}><App/></LocaleProvider></Provider>, document.getElementById('root'));
registerServiceWorker();
