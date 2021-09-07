<template>
  <div class="list-contain">
    <div class="row">
      <div class="block">
        <div class="title">访问客户端</div>
        <div class="chart-item" ref="myChart"></div>
      </div>
    </div>

    <div class="row">
      <div class="block">
        <div class="title">访问趋势</div>
        <div class="chart-item" ref="myChart2"></div>
      </div>
      <div class="block">
        <div class="title">访问频率</div>
        <div class="chart-item" ref="myChart3"></div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import echarts from "echarts";

@Component
export default class Platform extends Vue {
  //图表
  chartColors: string[] = ["#5B8FF9", "#AFE39B", "#33D3EB"];
  myEChart: any;
  myEChartTwo: any;
  myEChartThree: any;

  mounted() {
    this.myEChart = echarts.init(this.$refs.myChart);
    this.myEChartTwo = echarts.init(this.$refs.myChart2);
    this.myEChartThree = echarts.init(this.$refs.myChart3);
    this.renderChart();
    this.renderChartTwo();
    this.renderChartThree();
  }

  renderChart() {
    const options = {
      tooltip: {
        trigger: "item",
        formatter: "{a} <br/>{b} : {c} ({d}%)"
      },
      series: [
        {
          name: "访问来源",
          type: "pie",
          radius: "75%",
          center: ["50%", "50%"],
          data: [
            { value: 67, name: "PC端" },
            { value: 33, name: "移动端" }
          ],
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: "rgba(0, 0, 0, 0.5)"
            }
          },
          label: {
            show: true,
            position: "inside",
            formatter: "{b} : {d}%",
            fontSize: 16
          }
        }
      ],
      color: this.chartColors
    };
    this.myEChart.setOption(options);
  }

  renderChartTwo() {
    const options = {
      tooltip: {
        trigger: "axis"
      },
      legend: {
        data: ["访问人数", "新用户数"]
      },
      grid: {
        left: "3%",
        right: "4%",
        bottom: "3%",
        containLabel: true
      },
      xAxis: {
        type: "category",
        // boundaryGap: false,
        data: ["02.13", "02.14", "02.15", "02.16", "02.17", "02.18", "02.19"]
      },
      yAxis: {
        type: "value"
      },
      series: [
        {
          name: "访问人数",
          type: "line",
          data: [25, 35, 13, 30, 64, 40, 20]
        },
        {
          name: "新用户数",
          type: "line",
          data: [14, 22, 0, 20, 48, 25, 6]
        }
      ],
      color: this.chartColors
    };
    this.myEChartTwo.setOption(options);
  }

  renderChartThree() {
    const options = {
      tooltip: {
        trigger: "axis"
      },
      xAxis: {
        type: "category",
        data: [
          "每天1次及以上",
          "\n每周1-2次",
          "每月1-2次",
          "\n每3个月1-2次",
          "每半年1-2次",
          "\n每年1-2次"
        ],
        axisLabel: { interval: 0 }
      },
      yAxis: {
        type: "value"
      },
      series: [
        {
          data: [13, 25, 51, 10, 8, 5, 3],
          type: "bar"
        }
      ],
      color: this.chartColors
    };
    this.myEChartThree.setOption(options);
  }
}
</script>

<style lang="scss" scoped>
@import "./basic.scss";
.row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 1200px;
  margin: 20px auto;

  .block {
    width: calc((100% - 20px) / 2);

    .title {
      margin-bottom: 15px;
      color: #333333;
      font-size: 18px;
      font-weight: bold;
      text-align: left;
    }

    .chart-item {
      margin: auto;
      width: 500px;
      height: 400px;
    }
  }
}
</style>
