<template>
  <div style="height: 1000px; width: 1000px; margin: 0 auto;">
    <div id="propID" style="width:100%; height: 100%" class="piechart-wrapper"> </div>
    {{dataModel}}
    {{colors}}
  </div>
</template>
<script>
import { Component, Vue, Watch, Prop } from 'vue-property-decorator';
import * as d3 from 'd3';
import wrap from '@vue/web-component-wrapper';

@Component({
  props: {
    strdata: String
  }
})
export default class PieChart extends Vue {

  data() {
    return {
      total: 0,
      colors: ['#081A4E', '#092369','#1A649F','#2485B4','#2DA8C9','#5DC1D0','#9AD5CD','#D5E9CB'],
      savedColors: {},
      donutWidth:  0,
    }
  };


  get dataModel() {
    let data = JSON.parse(this.strdata);
    return data.map(item=>{
        return {value: item.y, label: item.x}
    })
  }

  mounted() {
    setTimeout(()=>{this.drawPieChart()}, 3000);
  }

  drawPieChart() {
        if (this.total === 0 && this.dataModel) {
          this.dataModel.forEach(el => {this.total += el['value']})
        }
          let localThis = this;
          d3.selectAll('propID_tooltip').remove()
          // const alt = d3.select(localThis.elem).select('#propID svg');
          const alt = d3.select('#propID svg');
          if (!!alt._groups[0][0]) {
            alt.remove();
          }
          const element2 = d3.select(localThis.$el).select("#propID")._groups[0][0]
        // let selection_string = "#" + this.propID;
        // if ($(selection_string + " svg") != null) {
        //   $(selection_string + " svg").remove();
        // }
        function hex2rgb(hex) {
          return ['0x' + hex[1] + hex[2] | 0, '0x' + hex[3] + hex[4] | 0, '0x' + hex[5] + hex[6] | 0];
        }

        var margin = {top: 0, right: 0, bottom: 0, left: 0},
          width = (element2.clientWidth === 0 ? 500 : element2.clientWidth )- margin.left - margin.right,
          height = ( element2.clientHeight === 0 ? 500 : element2.clientHeight)- margin.top - margin.bottom,
          radius = height > width ?  width / 2 : height / 2;

        var svg = d3.select(element2)
          .append("svg")
          .data([this.dataModel], function(d){
            if (d){
              return d.label
            }
          })
          .attr("width", width)
          .attr("height", height)
          .append("g")
          // sets the center of the piechart to center of container
          .attr("transform", "translate(" + width/2 + "," + height /2 + ")");

        //add tooltip div to the DOM
        var tooltip = d3
          .select("body")
          .append("div")
          .attr("class", `d3_visuals_tooltip ${this.propID}_tooltip`)
          .style("opacity", 0);

        // create function that will be used to draw slices
        var pie = d3.pie()
          .value(function(d){return d.value;});

        // Declare an arc generator function
        let donut = this.donutWidth > 0 ? this.donutWidth : radius
          // if donutWidth prop is present, innerWidth uses that number as a radius; otherwise, innerWidth is 0

        var arc = d3.arc()
          .innerRadius(radius - donut)
          .outerRadius(radius);

        // Select paths, use arc generator to draw
        var arcs = svg.selectAll("g.slice")
          .data(pie)
          .enter()
            .append("g")
            .attr("class", "slice");

        // add tooltip on mouseover of slice
        arcs.on("mouseover", function(d) {
          // calculate the percent of total for the slice
          d3.select(this).selectAll('path').
            attr('fill', function(dt){

                let currentFill = this.attributes.fill.value
             currentFill = hex2rgb(currentFill)
            // if (currentFill.includes('#')){
            // } else {
            //   currentFill = currentFill.slice(0, currentFill.length -2).slice(4).split(', ')
            // }
            let darker = currentFill.map(item=>{
              return parseInt(item) * .75
            })
            return `rgb(${darker[0]}, ${darker[1]}, ${darker[2]})`


            })

          var percent = Math.round(d.data.value / localThis.total * 100)
          tooltip.transition()
            .duration(100)
            .style("opacity", 1);
          tooltip
            .html(
              d.data.label + ': ' + '<b>' + d.data.value + '</b>' + '<br/>' + '<b>' + percent + '</b>' + '% of total'
            )
            .style("left", d3.event.pageX + "px")
            .style("top", d3.event.pageY + "px");

        })
          .on("mouseout", function(d) {
            tooltip.transition()
              .duration(300)
              .style("opacity", 0);

          d3.select(this).selectAll('path').
            attr('fill', function(dt){
              let label = dt.data ? dt.data.label : dt.label
              return localThis.savedColors[label]

            })
          })


        var colors = localThis.colors

        // add colors to each slice
        arcs.append("path")
          .attr("fill", function (d, i) {
            var length = colors.length
            var color;
            if (localThis.savedColors[d.data.label]){
              color = localThis.savedColors[d.data.label]
            } else {
              i >= length ? color = colors[i-length] : color = colors[i];
              localThis.savedColors[d.data.label] = color

            }
            return color;
          })
          .attr("d", arc);

        // This is built in for smaller viewports
        // if the width is less than 800px then the legend won't be added
        // to the SVG the user is still able to hover or click on the pie
        // secion to see the label and value of the section
        // let localThis = this;
        if(width > 800) {
          var legend = svg.selectAll(".legend")
            .data(this.dataModel, function(d){
              return d.label
            })
            .enter()
            .append("g")
            .attr("class", "legend")
            .attr("transform", function(d, i) { return "translate(30," + 25 * i + ")"; });

          legend.append("rect")
            .attr("x", radius + 20)
            .attr("y", -radius + 20)
            .attr("width", 20)
            .attr("height", 20)
            .attr("fill", function (d, i) {
                var length = colors.length
                var color;
              if (localThis.savedColors[d.label]){
                color = localThis.savedColors[d.label]
              } else {
                i >= length ? color = colors[i-length] : color = colors[i];
                localThis.savedColors[d.label] = color

              }
              return color;

            })
            .attr("d", arc);

          legend.append("text")
            .attr("x", radius + 45)
            .attr("y", -radius + 30)
            .attr("dy", ".35em")
            .attr("font-size", 14)
            .style("text-anchor", "start")
            .text(function(d, i) {
              return localThis.dataModel[i].label
            });


            legend.on('mouseover', function(d){
              let local = localThis
              let currentLabel = d.label
              d3.selectAll('g.slice path').data([d], function(dt){
                  return dt.data ? dt.data.label : dt.label
              })
              .attr('fill', function(df){
                if (df.label === currentLabel) {
                  let currentFill = this.attributes.fill.value
                   currentFill = hex2rgb(currentFill)
                  let darker = currentFill.map(item=>{
                    return parseInt(item) * .75
                  })
                  return `rgb(${darker[0]}, ${darker[1]}, ${darker[2]})`
                } else {
                  return
                }
              })
            });


            legend.on('mouseout', function(d){
              let local = localThis
              let currentLabel = d.label
              d3.selectAll('g.slice path').data([d], function(dt){
                  return dt.data ? dt.data.label : dt.label
              })
              .attr('fill', function(df){
                return localThis.savedColors[df.label]
              })
            })
        }
  }
  
  @Watch('strdata', {deep:true})
  onpropchanged(){
    this.drawPieChart();
  }
}

const CustomElement = wrap(Vue, PieChart);
window.customElements.define('jscat-pie-chart-cmon', CustomElement);

</script>
<style>
h2 {
  text-align: center;
}

.d3_visuals_tooltip {
  position: absolute;
  width: auto;
  height: auto;
  font-size: 14px;
  line-height: 1.5;
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  border: solid #333 transparent;
  background: rgba(0, 0, 0, .8);
  pointer-events: none;
}

.axis{

font: 10px sans-serif;
}

.axis path, .axis line{

fill: none;
stroke: #000;
shape-rendering: crispEdges;
}

.small-axis{
font-size: 9px;
}

.dot, .rect{
stroke: #000;
cursor: pointer;
fill: blue;
}

.tick line{
opacity: .2;
stroke-width: 1.8px;
shape-rendering: geometricPrecision;
}
</style>