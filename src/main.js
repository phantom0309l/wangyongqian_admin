// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router/index.js'
import pvlog from './lib/pvlog.js'

// 定制element ui
import '../static/css/element/index.css';
import ElementUI from 'element-ui';
// import 'element-ui/lib/theme-chalk/index.css';

import '../static/css/ElementUI-extend.css'
import '../static/css/iconfont.css'
import '../static/css/global.css'

let eventBus = new Vue();
window.eventBus = eventBus;
Vue.use(ElementUI);

import common from './lib/common.js'

router.beforeEach((to, from, next) => {
    pvlog.init(to, from);

    //兼容ios8以下 #后会被截掉的BUG
    let queryString = window.location.search;
    let fcqxurltemp = queryString.substring(1, queryString.length);
    let queryArr = fcqxurltemp.split('&') || [];
    let obj = {};
    queryArr.map(function (one) {
        let arr = one.split('=');
        if (arr.length === 2) {
            obj[arr[0]] = arr[1];
        }
    });

    // 检查页面是否需要登录
    if (to.meta.requireBind === false) {
        next();
    } else {
        let status = common.checkLoginSync();
        if (status === true) {
            next();
        } else {
            next({
                name: 'login',
                params: {
                    'refer_name': to.name,
                    'refer_path': to.path,
                    'refer_query': JSON.stringify(to.query),
                    'refer_params': JSON.stringify(to.params),
                }
            });
        }
    }
});

new Vue({
    router,
    template: '<app/>',
    components: {App}
}).$mount('#app');
