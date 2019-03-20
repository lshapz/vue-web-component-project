<template>
  <div style="height: 30%; width: 30%; margin: 0 auto;">
    <button @click="minusOne">Subtract One</button>
      {{counter}}
    <button @click="addOne">Add One</button>
  </div>
</template>
<script>

import { Component, Vue } from 'vue-property-decorator';
// import wrap from '@vue/web-component-wrapper';

@Component({
})
export default class Counter extends Vue {

  data() {
    return {
      counter: 0
    }
  };

  addOne() {
    return this.counter += 1
  }

 minusOne() {
    return this.counter -= 1
  }

}

// const CustomElement = wrap(Vue, PieChart);
// window.customElements.define('jscat-pie-chart-cmon', CustomElement);

</script>
<style>

</style>