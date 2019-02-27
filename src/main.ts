import Vue from 'vue'
// import App from './App.vue'
import PieChart from './components/PieChart.vue';
import wrap from '@vue/web-component-wrapper';

Vue.config.productionTip = false

const CustomElement = wrap(Vue, PieChart);
window.customElements.define('my-custom-element', CustomElement);



// new Vue({
//   render: h => h(App)
// }).$mount('#app')
