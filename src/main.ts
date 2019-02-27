import Vue from 'vue'
// import App from './App.vue'
import Vuex from 'vuex';
import { ThemePlugin } from 'jscatalyst';
import PieChart from './components/PieChart.vue';
import wrap from '@vue/web-component-wrapper';

import 'jscatalyst/dist/jscatalyst.min.css';
const store = new Vuex.Store({
  state: {}
});

// Vue.config.productionTip = false
Vue.use(ThemePlugin, {store, custom: false});

const CustomElement = wrap(Vue, PieChart);
window.customElements.define('my-custom-element', CustomElement);



// new Vue({
//   store,
//   render: h => h(App)
// }).$mount('#app')
