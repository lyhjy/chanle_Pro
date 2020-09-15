/**
 * 在生产环境 代理是无法生效的，所以这里没有生产环境的配置
 * The agent cannot take effect in the production environment
 * so there is no configuration of the production environment
 * For details, please see
 * https://pro.ant.design/docs/deploy
 */
//http://192.168.10.176:8082 李辉 http://192.168.10.93:8082 李豪杰 http://192.168.10.125:8082 陈冉
export default {
  dev: {
    '/chanle/': {
      target: 'http://139.196.161.109:8097',
      changeOrigin: true,
      pathRewrite: {
        '^/chanle/': '',
      },
    },
  },
  test: {
    '/api/': {
      target: 'https://preview.pro.ant.design',
      changeOrigin: true,
      pathRewrite: {
        '^': '',
      },
    },
  },
  pre: {
    '/api/': {
      target: 'your pre url',
      changeOrigin: true,
      pathRewrite: {
        '^': '',
      },
    },
  },
};
