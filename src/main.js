// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import './assets/styles/common.css'
// 处理axios的三个问题
import axios from 'axios'
// 问题1
axios.defaults.baseURL = 'http://localhost:8888/api/private/v1/'
// 问题2
// Vue.prototype.$axios = axios // 以后组组件内 this.$axios
Vue.prototype.$axios = axios
// 问题3 : 请求拦截器
axios.interceptors.request.use(
  function (config) {
    config.headers.Authorization = localStorage.getItem('token')

    return config
  },
  function (error) {
    // Do something with request error
    return Promise.reject(error)
  }
)

Vue.config.productionTip = false
Vue.use(ElementUI)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
