import Vue from 'vue'
// import App from './App.vue'
import PieChart from './components/PieChart.vue';
import VueCounter from './components/VueCounter.vue';
import wrap from '@vue/web-component-wrapper';

Vue.config.productionTip = false



const CustomElementPie= wrap(Vue, PieChart);
window.customElements.define('my-custom-pie-chart', CustomElementPie);


const CustomElementCount= wrap(Vue, VueCounter);
window.customElements.define('my-custom-counter', CustomElementCount);



// new Vue({
//   render: h => h(App)
// }).$mount('#app')
