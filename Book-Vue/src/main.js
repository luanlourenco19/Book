import Vue from 'vue'
import Vuex from 'vuex'
import App from './App.vue'
import router from './router'
import store from './store'
import iView from 'iview'
import Http from './components/Configurator/Http'
import EventBus from './plugins/event-bus.js'

// Mascaras Paulo
//https://vuejs-tips.github.io/vue-the-mask/
//Declarado Global
import VueTheMask from 'vue-the-mask'
Vue.use(VueTheMask)

import 'iview/dist/styles/iview.css'
import '@/assets/css/estilo.css'

import locale from 'iview/dist/locale/pt-BR'

Vue.use(Vuex)
Vue.use(iView, { locale })
Vue.use(EventBus)

Vue.config.productionTip = false

Vue.prototype.Base = Http

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
