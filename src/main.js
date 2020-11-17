// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import axios from 'axios'
import '../static/icon/iconfont.css'
import 'babel-polyfill'
import VueBus from './vue-bus'
Vue.use(VueBus)

import App from '@/App'
import router from '@/router'
import store from '@/store'

import Common from './common'

require('../node_modules/vux/src/styles/reset.less')
Vue.prototype.common = Common //声明全局common

import {
    LoadingPlugin,
    ToastPlugin,
    AlertPlugin,
    TransferDom,
    Popup,
    Datetime,
    Group,
    PopupRadio,
    PopupPicker,
    Selector,
    Search,
    Confirm,
    XDialog
} from 'vux'
Vue.use(LoadingPlugin)
Vue.use(ToastPlugin)
Vue.use(AlertPlugin)
Vue.directive('transfer-dom', TransferDom)
Vue.component('popup', Popup)
Vue.component('search', Search)
Vue.component('datetime', Datetime)
Vue.component('group', Group)
Vue.component('popup-radio', PopupRadio)
Vue.component('popup-picker', PopupPicker)
Vue.component('selector', Selector)
Vue.component('confirm', Confirm)
Vue.component('x-dialog', XDialog)

Vue.prototype.$axios = axios.create({
    // baseURL: 'http://60.174.207.210:20009/bridge/bridgeService/', //外网
    // baseURL: 'http://10.5.4.115:8000/bridge/bridgeService/',//内网
    baseURL: 'http://10.100.90.71:9010/bridge/bridgeService/',//内网
    baseURL: 'http://172.19.2.72:8086/bridge/bridgeService/',//内网
    // baseURL: '/bridge/bridgeService/',
    timeout: 60000,
});
//设置request拦截器
// var n = 0
// Vue.prototype.$axios.interceptors.request.use((request) => {
// 在这里处理request， 可以对所有请求统一处理请求头等

// n++
// console.log(n)
// console.log(request)
// return request

// })

//设置response拦截器
// Vue.prototype.$axios.interceptors.response.use((response) => {
//     //在这里处理response，这是全局的，对所有使用axios的请求起作用
//     n++
//     console.log(n)
//     console.log(response)
//         return response;

// });


Vue.config.productionTip = false
    /* eslint-disable no-new */
let vue = new Vue({
    el: '#app',
    router,
    store,
    components: { App },
    template: '<App/>'
})

export default vue