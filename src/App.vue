<template>
  <div id="app">
    <PieChart :strdata='dataStuff'></PieChart>
    <button @click="changeData">button</button>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import PieChart from './components/PieChart.vue';

@Component({
  components: {
    PieChart
  },
})
export default class App extends Vue {
  dataStuff = [{"x":"Germany","y":12},{"x":"United States","y":14},{"x":"France","y":19},{"x":"United Kingdom","y":22},{"x":"Spain","y":16},{"x":"Italy","y":11}];  


  randomNumber() {
    return Math.floor(Math.random() * 40000) + 10000;
  }

  changeData() {
    const newData = this.dataStuff.map(item => {
       item.y = this.randomNumber();
       return item;
    });

    this.dataStuff = [...newData];

  }
}
</script>

<style>
/* You can add global styles to this file, and also import other style files */



</style>
