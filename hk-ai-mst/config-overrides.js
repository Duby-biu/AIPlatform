const {
  injectBabelPlugin
} = require('react-app-rewired');

const rewireLessWithModule = require('react-app-rewire-less-with-modules');
const rewireDecorators = require("react-app-rewire-decorators-legacy");
const rewirerPostcss = require('react-app-rewire-postcss');

module.exports = function override(config, env) {
  // do stuff with the webpack config...
  // 支持antd按需加载
  config = injectBabelPlugin(['import', {
    libraryName: 'antd',
    libraryDirectory: 'es',
    style: true
  }], config);

  // 支持动态加载(代码分割)
  config = injectBabelPlugin('syntax-dynamic-import', config);

  //支持装饰器
  config = rewireDecorators(config, env);

  // 支持less和css modules only support for *.module.css or *.module.less
  // 以及支持antd自定义主题
  // 规定modifyVars只能影响antd的样式,所以在自己写的less文件中用到的全局变量需要在styles/variable.less里面定义
  config = rewireLessWithModule(config, env, {
    modifyVars: {
      '@primary-color': '#4fa1d9',
      '@border-radius-base': '0px'
    }
  });

  // 在生产环境支持cssnano
  config = rewirerPostcss(config, {
    plugins: loader => [
      require('cssnano')({
        preset: 'default',
        // postcss已经有autoprefixer了
        autoprefixer: false,
        "postcss-zindex": false
      })
    ]
  });
  return config;
};