<template>
  <div style="height: 500px; width: 500px; margin: 0  auto;">
      <D3PieChart :dataModel="pieData"></D3PieChart>
  </div>
</template>
<script>
import { Component, Vue } from 'vue-property-decorator';
import { D3PieChart } from 'jscatalyst';

@Component({
  components: {
    D3PieChart,
  },
  props: {
      strdata: Array
  }
})
export default class PieChart extends Vue {
    
    get pieData() {
       return JSON.parse(this.strdata);
    }
}
</script>
