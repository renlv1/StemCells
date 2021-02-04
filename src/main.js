import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import {i18n} from './i18n/config'
import fetch from './api/api'
import * as customFiter from './filter'
import globalMixin from './mixin'
import tab from '@/components/tab'
import loading from '@/components/loading'
import loadMore from '@/components/loadMore'
import './plugins/element.js'
import lang from 'element-ui/lib/locale/lang/en'
import locale from 'element-ui/lib/locale'
import Cube from 'cube-ui'
Vue.use(Cube)
import 'swiper/dist/css/swiper.min.css'
import VueAwesomeSwiper from 'vue-awesome-swiper'
Vue.use(VueAwesomeSwiper)
import appHeader from '@/components/appHeader'
Vue.component('app-header', appHeader)

Vue.component('tab', tab)
Vue.component('loading', loading)
Vue.component('loadMore', loadMore)
Vue.mixin(globalMixin)
import quillEditor from 'vue-quill-editor'

Vue.use(quillEditor)
Vue.component('quillEditor', quillEditor)

Vue.prototype.$toastD = function (text) {
  this.toast = this.$createToast({
    txt: text,
    time: 2000,
    type: 'txt'
  })
  this.toast.show()
}

import BaiduMap from 'vue-baidu-map'

Vue.use(BaiduMap, {
	ak: 'NqYwtHbrPbvKFAorAUdrYcvIwg3f1qAt'
})

Vue.prototype.$fetch = fetch
Vue.prototype.$lang = localStorage.getItem('lang') || 'cn'
Vue.prototype.$api = process.env.VUE_APP_BASE_PATH
Vue.prototype.isPC = window.innerWidth > 1200
Vue.config.productionTip = false

if (localStorage.getItem('lang') === 'en') {
  locale.use(lang)
}

//配置全局过滤器
Object.keys(customFiter).forEach(key => {
  Vue.filter(key, customFiter[key])
})

new Vue({
  i18n,
  router,
  store,
  render: h => h(App)
}).$mount('#app')
